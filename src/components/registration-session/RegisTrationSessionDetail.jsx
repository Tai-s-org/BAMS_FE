"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Clock, Users, Briefcase, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/Dialog"
import { Separator } from "@/components/ui/Seperator"
import { useToasts } from "@/hooks/providers/ToastProvider"
import Link from "next/link"
import registrationSessionApi from "@/api/registrationSession"


export default function RegistrationSessionDetail({ id }) {
    const router = useRouter()
    const [session, setSession] = useState();
    const [loading, setLoading] = useState(true)
    const { addToast } = useToasts();
    localStorage.setItem("registrationSessionId", id);

    useEffect(() => {
        const fetchSessionDetails = async () => {
            try {
                const response = await registrationSessionApi.getRegistrationSessionById(id);

                // Mock data for demonstration
                const RegistrationSession = {
                    "id": id,
                    "registrationName": "TUYỂN QUÂN THÁNG 5 NĂM 2025",
                    "startDate": "2025-03-05T23:59:59",
                    "endDate": "2025-06-05T23:59:59",
                    "isAllowPlayerRecruit": true,
                    "isAllowManagerRecruit": true,
                    "isEnable": true,
                    "createdAt": "2025-02-15T00:00:00",
                    "updatedAt": null,
                    "description":
                        "Đợt tuyển quân mới nhất dành cho các cầu thủ và quản lý muốn tham gia vào đội bóng. Chúng tôi đang tìm kiếm những người có đam mê với bóng đá và mong muốn phát triển kỹ năng trong môi trường chuyên nghiệp.",
                };

                setSession(response.data)
            } catch (error) {
                addToast({ message: error.response.data.message, type: "error" });
            }
        }

        fetchSessionDetails();
    }, [id])

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })
    };

    console.log(session);


    const isActive = () => {
        if (!session) return false
        const now = new Date()
        const startDate = new Date(session.startDate)
        const endDate = new Date(session.endDate)
        return session.isEnable && now >= startDate && now <= endDate
    }

    const handlePlayerRegister = () => {
        router.push("/auth/register")
        localStorage.setItem("registraionRoleCode", "player");
    }

    const handleManagerRegister = () => {
        router.push("/auth/register")
        localStorage.setItem("registraionRoleCode", "manager");
    }

    if (!session) {
        return (
            <div className="max-w-4xl mx-auto py-12 px-4">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy đợt tuyển quân</h1>
                    <p className="text-gray-600 mb-6">Đợt tuyển quân này không tồn tại hoặc đã bị xóa.</p>
                    <Button onClick={() => router.push("/registration-management")} variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Quay lại danh sách
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <Button onClick={() => router.back()} variant="ghost" className="mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại danh sách
            </Button>

            <Card className="overflow-hidden border-0 shadow-md">
                <div className="bg-[#BD2427] p-6 text-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold mb-2">{session.registrationName}</h1>
                            <div className="flex items-center text-sm">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span>
                                    {formatDate(session.startDate)} - {formatDate(session.endDate)}
                                </span>
                            </div>
                        </div>
                        <Badge
                            className={`${isActive() ? "bg-green-500" : "bg-gray-500"} hover:${isActive() ? "bg-green-600" : "bg-gray-600"}`}
                        >
                            {isActive() ? "Đang diễn ra" : "Không hoạt động"}
                        </Badge>
                    </div>
                </div>

                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <h2 className="text-lg font-semibold mb-3">Thông tin đợt tuyển quân</h2>
                            <ul className="space-y-3">
                                <li className="flex items-start">
                                    <Calendar className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                                    <div>
                                        <p className="font-medium">Thời gian bắt đầu</p>
                                        <p className="text-gray-600">{formatDate(session.startDate)}</p>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <Clock className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                                    <div>
                                        <p className="font-medium">Thời gian kết thúc</p>
                                        <p className="text-gray-600">{formatDate(session.endDate)}</p>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <Users className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                                    <div>
                                        <p className="font-medium">Tuyển cầu thủ</p>
                                        <p className="text-gray-600">
                                            {session.isAllowPlayerRecruit ? (
                                                <span className="flex items-center text-green-600">
                                                    <CheckCircle className="h-4 w-4 mr-1" /> Có
                                                </span>
                                            ) : (
                                                <span className="flex items-center text-red-600">
                                                    <XCircle className="h-4 w-4 mr-1" /> Không
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <Briefcase className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                                    <div>
                                        <p className="font-medium">Tuyển quản lý</p>
                                        <p className="text-gray-600">
                                            {session.isAllowManagerRecruit ? (
                                                <span className="flex items-center text-green-600">
                                                    <CheckCircle className="h-4 w-4 mr-1" /> Có
                                                </span>
                                            ) : (
                                                <span className="flex items-center text-red-600">
                                                    <XCircle className="h-4 w-4 mr-1" /> Không
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold mb-3">Mô tả</h2>
                            <p className="text-gray-700">{session.description || "Không có mô tả cho đợt tuyển quân này."}</p>
                        </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Đăng ký tham gia</h2>
                        <p className="text-gray-600">Chọn vai trò bạn muốn đăng ký tham gia:</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <Button
                                onClick={handlePlayerRegister}
                                disabled={!isActive() || !session.isAllowPlayerRecruit}
                                className="h-auto py-4 bg-[#BD2427] hover:bg-[#9a1e1f]"
                            >
                                <Users className="mr-2 h-5 w-5" />
                                Đăng ký làm cầu thủ
                            </Button>
                            <Button
                                onClick={handleManagerRegister}
                                disabled={!isActive() || !session.isAllowManagerRecruit}
                                variant="outline"
                                className="h-auto py-4 border-[#BD2427] text-[#BD2427] hover:bg-[#fef2f2]"
                            >
                                <Briefcase className="mr-2 h-5 w-5" />
                                Đăng ký làm quản lý
                            </Button>
                        </div>

                        {!isActive() && (
                            <p className="text-amber-600 text-sm italic">Đợt tuyển quân này hiện không hoạt động hoặc đã kết thúc.</p>
                        )}
                    </div>
                </CardContent>
            </Card>

        </div>
    )
}

