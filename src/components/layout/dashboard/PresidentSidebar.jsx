"use client";
import { usePathname } from "next/navigation";
import { BarChart3, CreditCard, FileText, Grid, Home, LayoutDashboard, Package, Settings, Users, Code, Database, History } from "lucide-react";
import { GiWhistle, GiBasketballJersey } from "react-icons/gi"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar/Sidebar";
import { RiGroup2Fill } from "react-icons/ri";
import SidebarRail from "@/components/ui/sidebar/SidebarRail";
import Link from "next/link";

export default function PresidentSidebar() {
    const pathname = usePathname(); // Lấy đường dẫn hiện tại

    const mainMenuItems = [
        {
            title: "Home",
            icon: Home,
            url: "/dashboard",
        },
    ];

    const menuItems = [
        { title: "Accounts", icon: LayoutDashboard, url: "/dashboard/accounts" },
        { title: "Đội bóng", icon: RiGroup2Fill, url: "/team-management" },
        { title: "Payments", icon: CreditCard, url: "/payments" },
        { title: "Balances", icon: BarChart3, url: "/balances" },
        { title: "Huấn luyện viên", icon: GiWhistle, url: "/dashboard/coach-management" },
        { title: "Cầu thủ", icon: GiBasketballJersey, url: "/dashboard/coach-management" },
        { title: "Quản lý", icon: Users, url: "/dashboard/manager-management" },
        { title: "Products", icon: Package, url: "/products" },
        { title: "Đơn đăng kí", icon: FileText, url: "registration-session-management" },
    ];

    const generalItems = [
        { title: "Developers", icon: Code, url: "/developers" },
        { title: "View Test Data", icon: Database, url: "/test-data" },
        { title: "Settings", icon: Settings, url: "/settings", highlight: true },
    ];

    const updatesItems = [{ title: "Changelog", icon: History, url: "/changelog" }];

    return (
        <Sidebar className="border-r border-sidebar-border bg-[#1F2937]">
            <SidebarHeader className="border-b border-sidebar-border pb-4">
                <div className="flex items-center gap-2 px-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-[#bd2427] text-white">
                        <Grid className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-semibold text-white">Yên Hòa Storm</span>
                        <span className="text-xs text-gray-400">Chủ tịch</span>
                    </div>
                </div>
                <SidebarMenu>
                    {mainMenuItems.map((item) => {
                        const isActive = pathname.includes(item.url);
                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    className={`hover:bg-[#bd2427]/30 ${isActive ? "bg-[#bd2427] text-white" : "text-white"
                                        }`}
                                >
                                    <a href={item.url} className="flex items-center gap-2">
                                        <item.icon className="h-5 w-5" />
                                        <span>{item.title}</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs font-semibold text-gray-400">Main Menu</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => {
                                const isActive = pathname === item.url;
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            className={`hover:bg-[#bd2427]/30 ${isActive ? "bg-[#bd2427] text-white" : "text-white"
                                                }`}
                                        >
                                            <Link href={item.url} className="flex items-center gap-2">
                                                <item.icon className="h-5 w-5" />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    );
}
