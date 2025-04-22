"use client"

import { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label"; 
import Link from "next/link";
import Image from "next/image";

export default function FormLogin({ onSubmit, loading }) {
    const [showPassword, setShowPassword] = useState(false);
    const [usernameOrEmail, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleFormSubmit = (e) => {
        e.preventDefault();
        onSubmit({ usernameOrEmail, password });
    };

    return (
        <div className="min-h-screen-full flex items-center justify-center p-4 h-[650px]">
            <Card className="w-full max-w-md overflow-hidden shadow-xl relative bg-white border-0">
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#BD2427]"></div>

                <CardHeader className="space-y-2 text-center pb-2">
                    <div className="mx-auto bg-[#BD2427] w-20 h-20 rounded-full flex items-center justify-center mb-2 shadow-lg relative">
                        <Image src={'/assets/logo/logo.png'}  width={'100'} height={'100'} alt="logo"/>
                    </div>
                    <CardTitle className="text-3xl font-bold text-[#BD2427] tracking-wider">Đăng nhập</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="usernameOrEmail" className="text-sm font-medium text-gray-700">
                                Email hoặc Tên đăng nhập
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                <Input
                                    id="usernameOrEmail"
                                    type="text"
                                    placeholder="Email hoặc Tên đăng nhập"
                                    value={usernameOrEmail}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="pl-10 bg-gray-50 border-gray-300 text-gray-900 focus:border-[#BD2427] focus:ring-[#BD2427]"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                                    Mật khẩu
                                </Label>
                                <Link href="/forgot-password" className="text-xs text-[#BD2427] hover:text-red-600 font-medium">
                                    Quên mật khẩu?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="********"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="pl-10 bg-gray-50 border-gray-300 text-gray-900 focus:border-[#BD2427] focus:ring-[#BD2427]"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-1 top-1 h-8 w-8 text-gray-400 hover:text-gray-600"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    <span className="sr-only">{showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}</span>
                                </Button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-[#BD2427] hover:bg-[#a01c1f] text-white font-bold py-2 px-4 rounded-md transition-all duration-300 shadow-md hover:shadow-lg"
                            disabled={loading}
                        >
                            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                        </Button>
                    </form>
                </CardContent>

                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#BD2427]"></div>
            </Card>
        </div>
    );
}
