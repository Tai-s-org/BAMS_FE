import React, { createContext, useContext, useState, useCallback, useMemo, useEffect, forwardRef } from 'react';
import useIsMobile from '@/hooks/useIsMobile';  // Giả sử bạn có một hook kiểm tra thiết bị di động
import { TooltipProvider } from '@/components/ui/Tooltip';  // Giả sử bạn đang sử dụng CoreUI

const SIDEBAR_COOKIE_NAME = "sidebar:state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "3rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

// Tạo SidebarContext để chia sẻ trạng thái Sidebar
const SidebarContext = createContext(null);

// Hook sử dụng SidebarContext
function useSidebar() {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebar must be used within a SidebarProvider.');
    }
    return context;
}

// SidebarProvider component
const SidebarProvider = forwardRef(({
    defaultOpen = true,
    open: openProp,
    onOpenChange: setOpenProp,
    className,
    style,
    children,
    ...props
}, ref) => {
    const isMobile = useIsMobile();  // Kiểm tra thiết bị di động
    const [openMobile, setOpenMobile] = useState(false);  // Trạng thái sidebar cho mobile

    const [_open, _setOpen] = useState(defaultOpen);  // Quản lý trạng thái mở sidebar
    const open = openProp ?? _open;  // Nếu có prop `open` thì dùng, nếu không thì dùng state nội bộ
    const setOpen = useCallback(
        (value) => {
            const openState = typeof value === 'function' ? value(open) : value;

            // Nếu có prop `onOpenChange` thì gọi nó, nếu không thì cập nhật state nội bộ
            if (setOpenProp) {
                setOpenProp(openState);
            } else {
                _setOpen(openState);
            }

            // Thiết lập cookie để lưu trữ trạng thái sidebar
            document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
        },
        [setOpenProp, open]
    );

    const toggleSidebar = useCallback(() => {
        return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
    }, [isMobile, setOpen, setOpenMobile]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            // Nghe sự kiện phím tắt để toggle sidebar
            if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                toggleSidebar();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [toggleSidebar]);

    const state = open ? 'expanded' : 'collapsed';

    const contextValue = useMemo(() => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar
    }), [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]);

    return (
        <SidebarContext.Provider value={contextValue}>
            <TooltipProvider delayDuration={0}>
                <div
                    style={{
                        '--sidebar-width': SIDEBAR_WIDTH,
                        '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
                        ...style,
                    }}
                    className={`group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar ${className}`}
                    ref={ref}
                    {...props}
                >
                    {children}
                </div>
            </TooltipProvider>
        </SidebarContext.Provider>
    );
});

export { SidebarProvider, useSidebar };
