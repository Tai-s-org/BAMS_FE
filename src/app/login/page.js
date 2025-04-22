"use client";

import LoginComponent from "@/components/auth/LoginComponent";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/context/AuthContext";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push("/check-login"); // Redirect to check-login page if user is already logged in
        }
    }, [user]);

    return (
        <div className="flex justify-center items-center min-h-screen">
            
            <LoginComponent />
        </div>
    );
}
