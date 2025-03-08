"use client";

import { useState } from "react";
import ForgotPasswordForm from "../form/ForgotPasswordForm";
import { Button } from "../ui/Button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // Xử lý logic gửi email đặt lại mật khẩu ở đây
        console.log("Gửi yêu cầu đặt lại mật khẩu cho email:", email);
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
            <ForgotPasswordForm email={email} setEmail={setEmail} handleSubmit={handleSubmit} />
        </div>
    );
}
