"use client";

import * as React from "react";
import {
    LogOut,
    Settings,
    User,
    CreditCard,
    History,
    Users,
    UserPlus,
    HelpCircle,
    MessageSquare,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";

export function UserDropdown({ user }) {
    const [open, setOpen] = React.useState(false);
    const popupRef = React.useRef(null);
    const buttonRef = React.useRef(null);

    const menuItems = [
        {
            icon: User,
            label: "View Profile",
            shortcut: "⌘ P",
        },
        {
            icon: Settings,
            label: "Settings",
            shortcut: "⌘ ,",
            highlight: true,
        },
        {
            icon: CreditCard,
            label: "Subscription",
            shortcut: "⌘ S",
        },
        {
            icon: History,
            label: "Changelog",
            shortcut: "⌘ H",
        },
        {
            icon: Users,
            label: "Team",
            shortcut: "⌘ T",
        },
        {
            icon: UserPlus,
            label: "Invite Member",
            shortcut: "⌘ I",
        },
        {
            icon: HelpCircle,
            label: "Support",
            shortcut: "⌘ ?",
        },
        {
            icon: MessageSquare,
            label: "Community",
            shortcut: "⌘ C",
        },
        {
            icon: LogOut,
            label: "Sign Out",
            shortcut: "⌘ Q",
        },
    ];

    // Close when clicking outside or clicking the avatar again
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            // Check if click is outside both the dropdown and the avatar button
            if (
                popupRef.current &&
                !popupRef.current.contains(event.target) &&
                !buttonRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };

        if (open) {
            // Add event listener when dropdown is open
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            // Cleanup when dropdown is closed
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open]);

    return (
        <div className="relative">
            <Button
                ref={buttonRef} // Reference the button to ensure it's part of the click check
                variant="ghost"
                className="relative h-10 w-10 rounded-full border-2 border-transparent transition-all hover:border-[#bd2427] data-[state=open]:border-[#bd2427]"
                onClick={() => setOpen((prevState) => !prevState)} // Toggle dropdown
            >
                <Avatar>
                    <AvatarImage src={user.image || "/placeholder.svg?height=40&width=40"} alt={user.name} />
                    <AvatarFallback className="bg-[#bd2427] text-white">
                        {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                    </AvatarFallback>
                </Avatar>
            </Button>

            {open && (
                <div
                    ref={popupRef}
                    className="absolute right-0 top-full z-50 mt-2 w-60 rounded-xl border border-gray-300 bg-white p-2 shadow-2xl"
                    style={{
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-t-lg">
                        <div className="flex items-center gap-2">
                            <Avatar className="h-9 w-9 border-2 border-[#bd2427]/20">
                                <AvatarImage src={user.image || "/placeholder.svg?height=32&width=32"} alt={user.name} />
                                <AvatarFallback className="bg-[#bd2427] text-white text-xs">
                                    {user.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-gray-900">{user.name}</span>
                                <span className="text-xs text-gray-500">{user.email}</span>
                            </div>
                        </div>
                    </div>
                    <div className="my-1 h-px bg-gray-200" />
                    <div className="max-h-[400px] overflow-y-auto">
                        {menuItems.map((item, index) => (
                            <div
                                key={index}
                                className={`flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors ${item.highlight
                                        ? "bg-[#bd2427]/5 text-[#bd2427] hover:bg-[#bd2427]/10"
                                        : "text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon className={`h-4 w-4 ${item.highlight ? "text-[#bd2427]" : "text-gray-500"}`} />
                                    <span className={item.highlight ? "font-medium" : ""}>{item.label}</span>
                                </div>
                                <span className="text-xs font-medium text-gray-400">{item.shortcut}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
