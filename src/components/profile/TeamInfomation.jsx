import teamApi from "@/api/team"
import { Card, CardContent } from "@/components/ui/Card"
import { Building2, Clock, Shield, Users } from "lucide-react"
import { useState, useEffect } from "react"

export default function TeamInformation({ user }) {
    const [teamName, setTeamName] = useState("")

    const formatDate = (dateString) => {
        const date = new Date(dateString?.split(" ")[0])
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })
    }

    useEffect(() => {
        const fetchTeamName = async () => {
            try {
                if (user?.roleInformation?.teamId) {
                    const res = await teamApi.teamDetail(user.roleInformation.teamId)
                    console.log(res.data);
                    
                    setTeamName(res?.teamName || "Đội bóng không xác định")
                } else {
                    setTeamName("Không có đội")
                }
            } catch (error) {
                console.error("Lỗi khi lấy thông tin đội:", error)
                setTeamName("Không lấy được tên đội")
            }
        }

        fetchTeamName()
    }, [user?.roleInformation?.teamId])

    return (
        <Card className="md:col-span-4 border-none shadow-md">
            <div className="bg-[#bd2427] py-4 px-6 rounded-t-lg">
                <h2 className="text-xl font-semibold text-white flex items-center">
                    <Building2 className="h-5 w-5 mr-2" />
                    Thông tin đội bóng
                </h2>
            </div>
            <CardContent className="p-6">
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-red-600" />
                        <div>
                            <p className="text-sm text-gray-500">Vai trò</p>
                            <p className="font-medium text-gray-900">{user.roleCode === "Player" ? "Cầu thủ" : user.roleCode === "Manager" ? "Quản lý" : user.roleCode === "President" ? "Chủ tịch" : user.roleCode === "Coach"? "Huấn luyện viên" :"Phụ Huynh"}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-rose-600" />
                        <div>
                            <p className="text-sm text-gray-500">Đội</p>
                            <p className="font-medium text-gray-900">{user?.roleInformation?.teamName}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-red-800" />
                        <div>
                            <p className="text-sm text-gray-500">Ngày tham gia</p>
                            <p className="font-medium text-gray-900">{(user.createdAt) || "N/A"}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-red-700" />
                        <div>
                            <p className="text-sm text-gray-500">Cập nhật lần cuối</p>
                            <p className="font-medium text-gray-900">{formatDate(user.updatedAt)}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

