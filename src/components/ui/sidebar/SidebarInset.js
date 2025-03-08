import React from 'react';

const SidebarInset = React.forwardRef(({ className, ...props }, ref) => {
    return (
        <main
            ref={ref}
            className={`relative flex min-h-svh flex-1 flex-col bg-background
                peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow
                ${className}`}
            {...props}
        />
    );
});

export default SidebarInset;
