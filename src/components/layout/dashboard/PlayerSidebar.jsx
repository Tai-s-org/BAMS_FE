"use client";
import { usePathname } from "next/navigation";
import { BarChart3, CreditCard, FileText, Grid, Home, LayoutDashboard, Package, Settings, Users, Code, Database, History } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar/Sidebar";
import SidebarRail from "@/components/ui/sidebar/SidebarRail";
import Link from "next/link";
import { TbPlayBasketball } from "react-icons/tb";

export default function PlayerSidebar() {
    const pathname = usePathname(); // Lấy đường dẫn hiện tại

    const mainMenuItems = [
        {
            title: "Trang chủ",
            icon: Home,
            url: "/dashboard",
        },
    ];

    const menuItems = [
        { title: "Trang chủ", icon: LayoutDashboard, url: "/team-dashboard" },
        { title: "Thanh toán", icon: CreditCard, url: "/dashboard/payment" },
        { title: "Trận đấu", icon: TbPlayBasketball, url: "/matches" },
        { title: "Lịch tập luyện", icon: BarChart3, url: "/schedules" }
    ];

    return (
        <Sidebar className="border-r border-sidebar-border bg-[#1F2937]">
            <SidebarHeader className="border-b border-sidebar-border pb-4">
                <div className="flex items-center gap-2 px-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-[#bd2427] text-white">
                        <Grid className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-semibold text-white">Yên Hòa Storm</span>
                        <span className="text-xs text-gray-400">Cầu thủ</span>
                    </div>
                </div>
                <SidebarMenu>
                    {mainMenuItems.map((item) => {
                        const isActive = pathname === item.url;
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
