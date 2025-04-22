"use client";

import Link from "next/link";
import { ArrowLeft, Mail, ShoppingBasket as Basketball, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import Image from "next/image";

export default function ForgotPasswordForm({ email, setEmail, handleSubmit }) {
    console.log(email);
    
    return (
        <div className="min-h-screen-full flex items-center justify-center p-4">
            <Card className="w-full max-w-md overflow-hidden shadow-xl relative bg-white border-0 mt-20 mb-20">
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#BD2427]"></div>

                <CardHeader className="space-y-2 text-center pb-2">
                    <div className="mx-auto bg-[#BD2427] w-20 h-20 rounded-full flex items-center justify-center mb-2 shadow-lg relative">
                        <Image src={'/assets/logo/logo.png'} width={'100'} height={'100'} alt="logo" />
                    </div>
                    <CardTitle className="text-3xl font-bold text-[#BD2427] tracking-wider">YÊN HÒA STORM</CardTitle>
                    <CardDescription className="text-gray-600">Nhập email của bạn, chúng tôi sẽ gửi cho bạn đường dẫn đổi mật khẩu mới</CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="relative">
                                <Label
                                    htmlFor="email"
                                    className="absolute -top-3 left-2 px-2 bg-[#BD2427] text-white text-xs font-bold uppercase rounded-sm transform -skew-x-6"
                                >
                                    Email
                                </Label>
                                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="your.email@example.com"
                                    className="pl-10 bg-gray-50 border-gray-300 text-gray-900 focus:border-[#BD2427] focus:ring-[#BD2427] pt-4"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-[#BD2427] hover:bg-[#a01c1f] text-white font-bold py-2 px-4 rounded-md transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                            GỬI YÊU CẦU ĐẶT LẠI MẬT KHẨU
                        </Button>
                    </CardContent>
                </form>

                <CardFooter className="flex flex-col space-y-4 pt-0">
                    <div className="flex justify-end w-full">
                        <Button variant="ghost" className="text-[#BD2427] hover:text-red-600 hover:bg-red-50" asChild>
                            <Link href="/login">Quay lại đăng nhập</Link>
                        </Button>
                    </div>
                </CardFooter>

                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#BD2427]"></div>
            </Card>
        </div>
    );
}
