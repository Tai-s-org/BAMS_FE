"use client";

import { useState } from "react";
import ForgotPasswordForm from "../form/ForgotPasswordForm";
import { Button } from "../ui/Button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import authApi from "@/api/auth";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false); // Thêm state loading để chặn spam request

    const handleSubmit = async (event) => {
        event.preventDefault(); // Chặn hành vi mặc định của form
        if (!email.trim()) {
            //addToast({ message: "Vui lòng nhập email", type: "error" });
            return;
        }
    
        setLoading(true);
        try {
            const response = await authApi.forgotPassword({ email });
            //addToast({ message: response.message || "Vui lòng kiểm tra email của bạn", type: "success" });
        } catch (error) {
            //addToast({ message: error.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại", type: "error" });
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg w-full h-screen">
            <Button
                variant="outline"
                className="border border-gray-300 text-gray-700 hover:bg-gray-100 transition-all duration-300"
                asChild
            >
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Trang chủ
                </Link>
            </Button>
            <ForgotPasswordForm email={email} setEmail={setEmail} handleSubmit={handleSubmit} loading={loading} />
        </div>
    );
}
