"use client";
import { useAuth } from "@/hooks/context/AuthContext";
import ManagerSidebar from "./dashboard/ManagerSidebar";
import PlayerSidebar from "./dashboard/PlayerSidebar";
import PresidentSidebar from "./dashboard/PresidentSidebar";
import CoachSidebar from "./dashboard/CoachSidebar";
import HeaderDashboard from "./dashboard/HeaderDashboard";
import { SidebarProvider } from "@/hooks/context/SidebarContext";
import SidebarInset from "../ui/sidebar/SidebarInset";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ParentSidebar from "./dashboard/ParentSidebar";

const DashboardLayout = ({ children }) => {
    const { user, userInfo } = useAuth();
    const router = useRouter();
    
    useEffect(() => {
        if (user?.roleCode != "President" && userInfo?.roleInformation?.teamId === null) {
            router.push('/check-login');
            return;
        }       
    }, [userInfo]);

    return (
        user ? (
            <SidebarProvider>
                <div className="flex h-screen w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                    {user.roleCode == "President" && <PresidentSidebar />}
                    {user.roleCode == "Manager" && userInfo?.roleInformation?.teamId && <ManagerSidebar />}
                    {user.roleCode == "Player" && userInfo?.roleInformation?.teamId && <PlayerSidebar />}
                    {user.roleCode == "Coach" && userInfo?.roleInformation?.teamId && <CoachSidebar />}
                    {user.roleCode == "Parent" && <ParentSidebar />}
                    <SidebarInset className="flex flex-col">
                        <HeaderDashboard />
                        <main className="flex-1 overflow-auto p-4">{children}</main>
                    </SidebarInset>
                </div>
            </SidebarProvider>
        ) : null
    );
}


export default DashboardLayout;
