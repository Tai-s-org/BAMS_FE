"use client";
import { BarChart3, CreditCard, FileText, Grid, Home, LayoutDashboard, Package, Settings, Users, Code, Database, History } from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar/Sidebar";
import SidebarRail from "@/components/ui/sidebar/SidebarRail";

export default function ManagerSidebar() {
    const mainMenuItems = [
        {
            title: "Home",
            icon: Home,
            url: "#",
            isActive: true,
        },
    ];

    const menuItems = [
        {
            title: "Accounts",
            icon: LayoutDashboard,
            url: "#",
        },
        {
            title: "Payments",
            icon: CreditCard,
            url: "#",
        },
        {
            title: "Balances",
            icon: BarChart3,
            url: "#",
        },
        {
            title: "Customers",
            icon: Users,
            url: "#",
        },
        {
            title: "Products",
            icon: Package,
            url: "#",
        },
        {
            title: "Reports",
            icon: FileText,
            url: "#",
        },
    ];

    const generalItems = [
        {
            title: "Developers",
            icon: Code,
            url: "#",
        },
        {
            title: "View Test Data",
            icon: Database,
            url: "#",
        },
        {
            title: "Settings",
            icon: Settings,
            url: "#",
            highlight: true,
        },
    ];

    const updatesItems = [
        {
            title: "Changelog",
            icon: History,
            url: "#",
        },
    ];

    return (
        <Sidebar className="border-r border-sidebar-border bg-[#1F2937]">
            <SidebarHeader className="border-b border-sidebar-border pb-4">
                <div className="flex items-center gap-2 px-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-[#bd2427] text-white">
                        <Grid className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-semibold text-white">Acme Co.</span>
                        <span className="text-xs text-gray-400">Palo Alto, CA</span>
                    </div>
                </div>
                <SidebarMenu>
                    {mainMenuItems.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={item.isActive}
                                className="hover:bg-[#bd2427]/30 data-[active=true]:bg-[#bd2427] data-[active=true]:text-white"
                            >
                                <a href={item.url} className="flex items-center gap-2 text-white">
                                    <item.icon className="h-5 w-5 text-white" />
                                    <span className="text-white">{item.title}</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs font-semibold text-gray-400">Main Menu</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild className="hover:bg-[#bd2427]/30 hover:text-white">
                                        <a href={item.url} className="flex items-center gap-2 text-white">
                                            <item.icon className="h-5 w-5 text-white" />
                                            <span className="text-white">{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs font-semibold text-gray-400">General</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {generalItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        className={
                                            item.highlight
                                                ? "text-[#bd2427] hover:bg-[#bd2427]/30 hover:text-white"
                                                : "hover:bg-[#bd2427]/30 hover:text-white"
                                        }
                                    >
                                        <a href={item.url} className="flex items-center gap-2 text-white">
                                            <item.icon className={`h-5 w-5 ${item.highlight ? "text-[#bd2427]" : "text-white"}`} />
                                            <span className="text-white">{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs font-semibold text-gray-400">Updates</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {updatesItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild className="hover:bg-[#bd2427]/30 hover:text-white">
                                        <a href={item.url} className="flex items-center gap-2 text-white">
                                            <item.icon className="h-5 w-5 text-white" />
                                            <span className="text-white">{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    );
}