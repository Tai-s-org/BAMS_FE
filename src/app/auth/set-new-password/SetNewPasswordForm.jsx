"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import authApi from "@/api/auth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Image from "next/image";
import { useToasts } from "@/hooks/providers/ToastProvider";

export default function SetNewPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token"); // Lấy token từ URL
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [request, setRequest] = useState(false);
    const { addToast } = useToasts();
    const router = useRouter();

    useEffect(() => {
        const validateToken = async () => {
            if (!token) return; // Kiểm tra nếu không có token

            try {
                const validateResponse = await authApi.validateForgotPassword({ token });
                setRequest(true);
                addToast({ message: validateResponse.data.message, type: "success" });
            } catch (err) {
                console.error("Error validating token:", err);
                addToast({ message: "Token không hợp lệ hoặc đã hết hạn!", type: "error" });
            }
        };

        validateToken();
    }, [token, addToast]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Mật khẩu không khớp!");
            return;
        }

        if (!request) {
            alert("Token không hợp lệ, vui lòng thử lại!");
            return;
        }

        try {
            const response = await authApi.SetNewPassword({
                forgotPasswordToken: token,
                newPassword: password,
                confirmNewPassword: confirmPassword
            });

            addToast({ message: response.data.message, type: "success" });
            router.push('/');
        } catch (error) {
            console.error("Lỗi:", error);
            addToast({ message: "Có lỗi xảy ra, vui lòng thử lại!", type: "error" });
        }
    };

    return (
        <div className="h-full flex items-center justify-center bg-gray-100 p-4">
            <Card className="w-full max-w-md overflow-hidden shadow-xl relative bg-white border-0">
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#BD2427]"></div>

                <CardHeader className="space-y-2 text-center pb-2">
                    <div className="mx-auto bg-[#BD2427] w-20 h-20 rounded-full flex items-center justify-center mb-2 shadow-lg relative">
                        <Image src={'/assets/logo/logo.png'} width={100} height={100} alt="logo" />
                    </div>
                    <CardTitle className="text-3xl font-bold text-[#BD2427] tracking-wider">
                        YÊN HÒA STORM
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-4">Đặt lại mật khẩu</h2>
                        <Input
                            type="password"
                            placeholder="Mật khẩu mới"
                            className="border p-2 w-full mb-2"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Input
                            type="password"
                            placeholder="Nhập lại mật khẩu"
                            className="border p-2 w-full mb-4"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <Button type="submit" className="bg-red-600 text-white py-2 px-4 rounded">
                            Xác nhận
                        </Button>
                    </form>
                </CardContent>

                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#BD2427]"></div>
            </Card>
        </div>
    );
}
