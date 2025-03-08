"use client";

import * as React from "react";
import { Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";

const notifications = [
    {
        id: 1,
        avatar: "/placeholder.svg?height=32&width=32&text=AC",
        username: "Alex Chilton",
        action: "clapped for",
        target: "Really Awesome Article Name!",
        time: "11 hrs ago",
    },
    {
        id: 2,
        avatar: "/placeholder.svg?height=32&width=32&text=AC",
        username: "Alex Chilton",
        action: "started following you",
        others: 1,
        time: "11 hrs ago",
    },
    {
        id: 3,
        avatar: "/placeholder.svg?height=32&width=32&text=PW",
        username: "Paul Westerberg",
        action: "started following you",
        time: "yesterday",
    },
    {
        id: 4,
        avatar: "/placeholder.svg?height=32&width=32&text=TS",
        username: "Tommy Stinson",
        action: "clapped for",
        target: "Really Awesome Article Name!",
        others: 1,
        time: "yesterday",
    },
];

export function NotificationDropdown() {
    const [unreadCount, setUnreadCount] = React.useState(2);
    const [open, setOpen] = React.useState(false);
    const popupRef = React.useRef(null);
    const buttonRef = React.useRef(null);

    // Close when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            // Check if click is outside both the dropdown and the avatar button
            if (
                popupRef.current &&
                !popupRef.current.contains(event.target) &&
                !buttonRef.current.contains(event.target)
            ) {
                setOpen(false); // Close the dropdown
            }
        };

        // Add event listener when dropdown is open
        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            // Cleanup when dropdown is closed
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside); // Cleanup
        };
    }, [open]);

    return (
        <div className="relative">
            <Button
                variant="ghost"
                size="icon"
                className="relative text-gray-200 hover:bg-[#bd2427]/20 hover:text-white"
                onClick={() => setOpen((prev) => !prev)} // Toggle chỉ khi click vào bell
                ref={buttonRef} // Add ref to the button
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-[#bd2427] text-xs font-medium text-white">
                        {unreadCount}
                    </span>
                )}
            </Button>

            {open && (
                <div
                    ref={popupRef}
                    className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-gray-300 bg-white p-2 shadow-2xl"
                    style={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
                >
                    <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-t-lg">
                        <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                    </div>
                    <div className="my-1 h-px bg-gray-200" />
                    <div className="max-h-[400px] overflow-y-auto">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className="flex cursor-pointer items-start gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-gray-100"
                            >
                                <Avatar className="h-10 w-10 shrink-0 border-2 border-[#bd2427]/20">
                                    <AvatarImage src={notification.avatar} />
                                    <AvatarFallback className="bg-[#bd2427] text-white">
                                        {notification.username
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col gap-0.5">
                                    <p className="text-sm text-gray-800">
                                        <span className="font-semibold text-gray-900">{notification.username}</span>
                                        {notification.others && <span className="text-gray-600"> + {notification.others} other</span>}
                                        <span className="text-gray-600"> {notification.action}</span>
                                        {notification.target && <span className="font-medium text-gray-900"> {notification.target}</span>}
                                    </p>
                                    <span className="text-xs font-medium text-gray-500">{notification.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
