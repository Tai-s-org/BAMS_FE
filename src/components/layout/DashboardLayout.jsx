"use client";
import { useAuth } from "@/hooks/context/AuthContext";
import ManagerSidebar from "./dashboard/ManagerSidebar";
import PlayerSidebar from "./dashboard/PlayerSidebar";
import PresidentSidebar from "./dashboard/PresidentSidebar";
import CoachSidebar from "./dashboard/CoachSidebar";
import HeaderDashboard from "./dashboard/HeaderDashboard";
import { SidebarProvider } from "@/hooks/context/SidebarContext";
import SidebarInset from "../ui/sidebar/SidebarInset";

const DashboardLayout = ({ children }) => {
    const { user } = useAuth();

    if (!user) {
        return <p>Loading...</p>; // Hoặc redirect về trang login nếu cần
    }

    return (
        <SidebarProvider>
            <div className="flex h-screen w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                {user.roleCode === "President" && <PresidentSidebar />}
                {user.roleCode === "Manager" && <ManagerSidebar />}
                {user.roleCode === "Player" && <PlayerSidebar />}
                {user.roleCode === "Coach" && <CoachSidebar />}
                <SidebarInset className="flex flex-col">
                    <HeaderDashboard />
                    <main className="flex-1 overflow-auto p-4">{children}</main>
                </SidebarInset>
            </div>
        </SidebarProvider>

    );
};

export default DashboardLayout;
