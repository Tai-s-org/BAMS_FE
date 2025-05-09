"use client";
import { usePathname } from "next/navigation";
import { FileText, Grid, Home, LayoutDashboard } from "lucide-react";
import { FaCalendarAlt } from "react-icons/fa";
import { AiFillSchedule } from "react-icons/ai";
import { TbPlayBasketball } from "react-icons/tb";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar/Sidebar";
import SidebarRail from "@/components/ui/sidebar/SidebarRail";
import Link from "next/link";

export default function CoachSidebar() {
    const pathname = usePathname(); // Lấy đường dẫn hiện tại


    const menuItems = [
        { title: "Trang chủ", icon: LayoutDashboard, url: "/team-dashboard" },
        { title: "Trận đấu", icon: TbPlayBasketball, url: "/matches" },
        { title: "Thời khóa biểu", icon: FaCalendarAlt, url: "/schedules" },
        { title: "Danh sách lịch chờ", icon: AiFillSchedule, url: "/confirm-schedule" },

        { title: "Đơn đăng kí", icon: FileText, url: "/registration-session-management" },
    ];

    return (
        <Sidebar className="border-r border-sidebar-border bg-[#1F2937]">
            <SidebarHeader className="border-b border-sidebar-border pb-4">
                <div className="flex items-center gap-2 px-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-[#bd2427] text-white">
                        <Grid className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-semibold text-white">Yên Hòa Storm </span>
                        <span className="text-xs text-gray-400">Huấn luyện viên</span>
                    </div>
                </div>
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
