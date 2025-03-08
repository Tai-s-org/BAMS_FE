"use client";

import { Github, HelpCircle, Search } from "lucide-react";
import SidebarTrigger from "@/components/ui/sidebar/SidebarTrigger";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { UserDropdown } from "./UserDropdown";
import { NotificationDropdown } from "./NotificationDropdown";

export default function HeaderDashboard() {
    const user = {
        name: "Donald D. White",
        email: "supporting@gmail.com",
        image: "/placeholder.svg?height=40&width=40",
    };

    return (
        <header className="flex h-16 items-center justify-between border-b border-border/10 bg-gradient-to-r from-gray-900 via-red-900 to-gray-900 px-4 shadow-lg">
            <div className="flex items-center gap-4">
                <SidebarTrigger className="text-gray-200 hover:bg-[#bd2427]/20 hover:text-white" />
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                        placeholder="Search..."
                        className="w-[300px] border-white/10 bg-white/10 pl-10 text-white placeholder:text-gray-400 focus-visible:border-white/20 focus-visible:ring-[#bd2427]"
                    />
                </div>
            </div>
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="text-gray-200 hover:bg-[#bd2427]/20 hover:text-white">
                    <span className="sr-only">Help</span>
                    <HelpCircle className="h-5 w-5" />
                </Button>
                <NotificationDropdown/>
                <Button variant="ghost" size="icon" className="text-gray-200 hover:bg-[#bd2427]/20 hover:text-white">
                    <span className="sr-only">GitHub</span>
                    <Github className="h-5 w-5" />
                </Button>
                <UserDropdown user={user} />
            </div>
        </header>
    );
}
