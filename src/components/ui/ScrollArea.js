"use client";

import { useRef, useEffect } from "react";

const ScrollArea = ({ children, className = "" }) => {
    const scrollRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            console.log("Scrolling..."); // Hoặc thêm logic khác nếu cần
        };

        const element = scrollRef.current;
        if (element) {
            element.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (element) {
                element.removeEventListener("scroll", handleScroll);
            }
        };
    }, []);

    return (
        <div
            ref={scrollRef}
            className={`overflow-auto max-h-[300px] p-2 ${className}`}
        >
            {children}
        </div>
    );
};

export { ScrollArea };
