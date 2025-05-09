"use client";
import { usePathname } from "next/navigation";
import { BarChart3, CreditCard, FileText, Grid, Home, LayoutDashboard, Settings, Users, Code, Database, History } from "lucide-react";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { GiWhistle, GiBasketballJersey } from "react-icons/gi"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar/Sidebar";
import { RiGroup2Fill } from "react-icons/ri";
import SidebarRail from "@/components/ui/sidebar/SidebarRail";
import Link from "next/link";

export default function PresidentSidebar() {
    const pathname = usePathname(); // Lấy đường dẫn hiện tại

    const menuItems = [
        { title: "Đội bóng", icon: RiGroup2Fill, url: "/team-management" },
        { title: "Thanh toán", icon: CreditCard, url: "/payment" },
        { title: "Huấn luyện viên", icon: GiWhistle, url: "/coach-management" },
        { title: "Quản lý", icon: Users, url: "/manager-management" },
        { title: "Quản lý thông tin đội", icon: HiOutlineClipboardDocumentList, url: "/document-management" },
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
                        <span className="text-lg font-semibold text-white">Yên Hòa Storm</span>
                        <span className="text-xs text-gray-400">Chủ tịch</span>
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
