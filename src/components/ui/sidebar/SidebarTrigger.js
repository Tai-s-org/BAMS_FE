import React from 'react';
import { useSidebar } from '@/hooks/context/SidebarContext';  // Đảm bảo import hook useSidebar đúng cách
import { PanelLeft } from "lucide-react"
import { Button } from "@/components/ui/Button"

const SidebarTrigger = ({ className, onClick, ...props }, ref) => {
    const { toggleSidebar } = useSidebar();  // Sử dụng hook useSidebar từ SidebarContext

    return (
        <Button
            ref={ref}
            data-sidebar="trigger"
            variant="ghost"
            size="icon"
            className={`h-7 w-7 ${className}`}  // Các class có thể được truyền từ ngoài
            onClick={(event) => {
                onClick?.(event);  // Kiểm tra xem onClick có tồn tại không và gọi nó
                toggleSidebar();  // Gọi toggleSidebar để mở/đóng sidebar
            }}
            {...props}  // Truyền các props khác cho Button nếu có
        >
            <PanelLeft />
            <span className="sr-only">Toggle Sidebar</span>  {/* Đảm bảo accessibility */}
        </Button>
    );
};

export default SidebarTrigger;
