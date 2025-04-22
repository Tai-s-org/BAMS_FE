// "use client";

// import { useSearchParams } from "next/navigation";
// import { useState } from "react";
// import authApi from "@/api/auth";
// import { Input } from "@/components/ui/Input";
// import { Button } from "@/components/ui/Button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
// import Image from "next/image";

// export default function SetNewPassword() {// Lấy token từ URL
//     const [password, setPassword] = useState("");
//     const [confirmPassword, setConfirmPassword] = useState("");

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const validateResponse = await authApi.validateForgotPassword(token);
//             if (validateResponse.data) {
//                 if (password !== confirmPassword) {
//                     alert("Mật khẩu không khớp!");
//                 }
//                 return;
//             }
//             const response = await authApi.SetNewPassword({
//                 token, password, confirmPassword
//             })
//         } catch (error) {
//             console.error("Lỗi:", error);
//             alert("Có lỗi xảy ra, vui lòng thử lại!");
//         }
//     };

//     return (
//         <div className="h-full flex items-center justify-center p-4">
//             <Card className="w-full max-w-md overflow-hidden shadow-xl relative bg-white border-0">
//                 <div className="absolute top-0 left-0 right-0 h-1 bg-[#BD2427]"></div>

//                 <CardHeader className="space-y-2 text-center pb-2">
//                     <div className="mx-auto bg-[#BD2427] w-20 h-20 rounded-full flex items-center justify-center mb-2 shadow-lg relative">
//                         <Image src={'/assets/logo/logo.png'} width={'100'} height={'100'} alt="logo" />
//                     </div>
//                     <CardTitle className="text-3xl font-bold text-[#BD2427] tracking-wider">YÊN HÒA STORM</CardTitle>
//                 </CardHeader>

//                 <CardContent className="space-y-4">
//                     <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
//                         <h2 className="text-xl font-bold mb-4">Đặt lại mật khẩu</h2>
//                         <Input
//                             type="password"
//                             placeholder="Mật khẩu mới"
//                             className="border p-2 w-full mb-2"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             required
//                         />
//                         <Input
//                             type="password"
//                             placeholder="Nhập lại mật khẩu"
//                             className="border p-2 w-full mb-4"
//                             value={confirmPassword}
//                             onChange={(e) => setConfirmPassword(e.target.value)}
//                             required
//                         />
//                         <Button type="submit" className="bg-red-600 text-white py-2 px-4 rounded">
//                             Xác nhận
//                         </Button>
//                     </form>
//                 </CardContent>

//                 <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#BD2427]"></div>
//             </Card>
//         </div>
//     );
// }
"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import authApi from "@/api/auth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { useToasts } from "@/hooks/providers/ToastProvider";

export default function SetNewPassword() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { addToast } = useToasts();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await authApi.changePassword({
                "oldPassword": oldPassword,
                "newPassword": newPassword,
                "confirmNewPassword": confirmPassword
            });
            addToast({
                message: response.data.message,
                type: "success",
            })
        } catch (error) {
            console.error("Lỗi:", error);
            alert("Có lỗi xảy ra, vui lòng thử lại!");
        }
    };

    return (
        <div className="h-full flex items-center justify-center p-4">
            <Card className="w-full max-w-md overflow-hidden shadow-xl relative bg-white border-0">
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#BD2427]"></div>

                <CardHeader className="space-y-2 text-center pb-2">
                    <div className="mx-auto bg-[#BD2427] w-20 h-20 rounded-full flex items-center justify-center mb-2 shadow-lg relative">
                        <Image src={'/assets/logo/logo.png'} width={100} height={100} alt="logo" />
                    </div>
                    <CardTitle className="text-3xl font-bold text-[#BD2427] tracking-wider">YÊN HÒA STORM</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
                        <h2 className="text-xl font-bold">Đổi mật khẩu</h2>
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Mật khẩu cũ"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                required
                                className="pr-10"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                onClick={() => setShowOldPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                <span className="sr-only">{showOldPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}</span>
                            </Button>
                        </div>

                        {/* Mật khẩu mới */}
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Mật khẩu mới"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                className="pr-10"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                <span className="sr-only">{showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}</span>
                            </Button>
                        </div>

                        {/* Nhập lại mật khẩu */}
                        <div className="relative">
                            <Input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Nhập lại mật khẩu"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="pr-10"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                <span className="sr-only">{showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}</span>
                            </Button>
                        </div>

                        <Button type="submit" className="bg-red-600 text-white py-2 px-4 rounded w-full">
                            Xác nhận
                        </Button>
                    </form>
                </CardContent>

                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#BD2427]"></div>
            </Card>
        </div>
    );
}
