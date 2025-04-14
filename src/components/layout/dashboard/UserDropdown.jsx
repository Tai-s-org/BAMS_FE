"use client";

import * as React from "react";
import { LogOut, Settings, User, CreditCard, History, Users, UserPlus, HelpCircle, MessageSquare, KeyRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function UserDropdown({ user }) {
    const [open, setOpen] = React.useState(false);
    const popupRef = React.useRef(null);
    const buttonRef = React.useRef(null);
    const { logout } = useAuth();
    const router = useRouter();

    const menuItems = [
        { icon: User, label: "Thông tin cá nhân", href: "/profile" },
        { icon: Settings, label: "Settings", href: "/settings" },
        { icon: KeyRound, label: "Đổi mật khẩu", href: "/auth/change-password" },
        { icon: History, label: "Changelog", href: "/changelog" },
        { icon: Users, label: "Team", href: "/team" },
        { icon: UserPlus, label: "Invite Member", href: "/invite" },
        { icon: HelpCircle, label: "Support", href: "/support" },
        { icon: MessageSquare, label: "Community", href: "/community" },
    ];

    const handleLogout = () => {
        logout();
        router.push("/login"); // Redirect về trang login
    };

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                popupRef.current &&
                !popupRef.current.contains(event.target) &&
                !buttonRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open]);

    return (
        <div className="relative">
            <Button
                ref={buttonRef}
                variant="ghost"
                className="relative h-10 w-10 rounded-full border-2 border-transparent transition-all hover:border-[#bd2427]"
                onClick={() => setOpen((prevState) => !prevState)}
            >
                <Avatar>
                    <AvatarImage src={user.image || "/placeholder.svg?height=40&width=40"} alt={user.name} />
                    <AvatarFallback className="bg-[#bd2427] text-white">
                        {user.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                </Avatar>
            </Button>

            {open && (
                <div
                    ref={popupRef}
                    className="absolute right-0 top-full z-50 mt-2 w-60 rounded-xl border border-gray-300 bg-white p-2 shadow-2xl"
                >
                    <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-t-lg">
                        <div className="flex items-center gap-2">
                            <Avatar className="h-9 w-9 border-2 border-[#bd2427]/20">
                                <AvatarImage src={user.image || "/placeholder.svg?height=32&width=32"} alt={user.name} />
                                <AvatarFallback className="bg-[#bd2427] text-white text-xs">
                                    {user.name.split(" ").map((n) => n[0]).join("")}
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
                            <Link href={item.href} key={index} passHref>
                                <div
                                    className={`flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors ${item.highlight
                                        ? "bg-[#bd2427]/5 text-[#bd2427] hover:bg-[#bd2427]/10"
                                        : "text-gray-700 hover:bg-gray-100"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon className={`h-4 w-4 ${item.highlight ? "text-[#bd2427]" : "text-gray-500"}`} />
                                        <span className={item.highlight ? "font-medium" : ""}>{item.label}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                        <div
                            onClick={handleLogout}
                            className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors text-gray-700 hover:bg-gray-100"
                        >
                            <div className="flex items-center gap-3">
                                <LogOut className="h-4 w-4 text-gray-500" />
                                <span>Đăng xuất</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
