"use client";

import { useAuth } from "@/hooks/context/AuthContext";
import { useRouter } from "next/navigation"; 
import { useEffect } from "react"; 

export default function CheckLogin() {
    const { user } = useAuth();
    const router = useRouter();
    
    useEffect(() => {
        if (!user) return; 
        
        if (user?.roleCode === "President") {
          router.push('/team-management');
        }

        if (
          user?.roleCode === "Player" ||
          user?.roleCode === "Coach" ||
          user?.roleCode === "Manager" ||
          user?.roleCode === "Parent"
        ) {
          router.push('/team-dashboard');
        }
      }, [user, router]);

    return (
        <div className="flex justify-center items-center min-h-screen">
            Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ với quản trị viên để biết thêm thông tin.
        </div>
    );
}