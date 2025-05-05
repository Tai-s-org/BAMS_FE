"use client";

import LoginComponent from "@/components/auth/LoginComponent";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/context/AuthContext";
import { House } from "lucide-react";
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
        <div className="justify-center items-center min-h-screen">
            <div className="pt-5 pl-5">
                <Button
                    variant="outline"
                    className="border border-gray-300 text-gray-700 hover:bg-gray-100 transition-all duration-300"
                    asChild
                >
                    <Link href="/">
                        <House className="mr-2 h-4 w-4" />
                        Trang chủ
                    </Link>
                </Button>
            </div>

            <LoginComponent />
        </div>
    );
}
