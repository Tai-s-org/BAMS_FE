import { Card, CardContent } from "@/components/ui/Card"
import { Building2, Clock, Shield, Users } from "lucide-react"
import { formatDate } from "@/utils/format"

export default function TeamInformation({ user }) {
    return (
        <Card className="md:col-span-4 border-none shadow-md">
            <div className="bg-red-600 py-4 px-6 rounded-t-lg">
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
                            <p className="font-medium text-gray-900">{user.roleCode}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-rose-600" />
                        <div>
                            <p className="text-sm text-gray-500">Đội</p>
                            <p className="font-medium text-gray-900">{user.roleInformation?.teamId}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-red-800" />
                        <div>
                            <p className="text-sm text-gray-500">Ngày tham gia</p>
                            <p className="font-medium text-gray-900">{formatDate(user.createdAt)}</p>
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

