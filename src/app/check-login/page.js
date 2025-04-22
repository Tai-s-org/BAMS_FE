"use client";

import { useAuth } from "@/hooks/context/AuthContext";
import { useToasts } from "@/hooks/providers/ToastProvider";
import { useRouter } from "next/navigation"; 
import { useEffect } from "react"; 

export default function CheckLogin() {
    const { user, userInfo } = useAuth();
    const {addToast} = useToasts();
    const router = useRouter();
    
    useEffect(() => {
        if (!user) {
          addToast({
            type: "error",
            message: "Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.",
          });
          return;
        }

        if (userInfo?.roleInformation?.teamId === null) {
          addToast({
            type: "error",
            message: "Bạn chưa được thêm vào đội nào. Vui lòng liên hệ với quản lý đội để được hỗ trợ.",
          });
          return;
        }       
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
            Đang điều hướng, vui lòng chờ một chút...
        </div>
    );
}