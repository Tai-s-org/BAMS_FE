"use client"

import { Card, CardContent } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Textarea } from "@/components/ui/Textarea"
import { CalendarRange, FileText, Shield, Users } from "lucide-react"
import { formatDate } from "@/utils/format"

export default function CoachInformation({ roleInformation, isEditing, formData, handleInputChange }) {
    return (
        <Card className="md:col-span-12 border-none shadow-md">
            <div className="bg-[#bd2427] py-4 px-6 rounded-t-lg">
                <h2 className="text-xl font-semibold text-white flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Thông tin huấn luyện viên
                </h2>
            </div>
            <CardContent className="p-6">
                {!isEditing ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex items-center gap-3 sm:col-span-2">
                            <FileText className="h-5 w-5 text-red-600" />
                            <div>
                                <p className="text-sm text-gray-500">Tiểu sử</p>
                                <p className="font-medium text-gray-900">{roleInformation.bio}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <CalendarRange className="h-5 w-5 text-rose-600" />
                            <div>
                                <p className="text-sm text-gray-500">Ngày bắt đầu hợp đồng</p>
                                <p className="font-medium text-gray-900">{formatDate(roleInformation.contractStartDate)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <CalendarRange className="h-5 w-5 text-red-800" />
                            <div>
                                <p className="text-sm text-gray-500">Ngày kết thúc hợp đồng</p>
                                <p className="font-medium text-gray-900">{formatDate(roleInformation.contractEndDate)}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="teamId" className="text-gray-700 flex items-center">
                                <Users className="h-4 w-4 mr-2 text-red-700" />
                                ID Đội
                            </Label>
                            <Input
                                id="teamId"
                                name="roleInformation.teamId"
                                value={formData.roleInformation.teamId}
                                onChange={handleInputChange}
                                className="border-gray-300 focus:border-red-700 focus:ring-red-700"
                            />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="bio" className="text-gray-700 flex items-center">
                                <FileText className="h-4 w-4 mr-2 text-red-600" />
                                Tiểu sử
                            </Label>
                            <Textarea
                                id="bio"
                                name="roleInformation.bio"
                                value={formData.roleInformation.bio}
                                onChange={handleInputChange}
                                className="border-gray-300 focus:border-red-600 focus:ring-red-600"
                                rows={3}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contractStartDate" className="text-gray-700 flex items-center">
                                <CalendarRange className="h-4 w-4 mr-2 text-rose-600" />
                                Ngày bắt đầu hợp đồng
                            </Label>
                            <Input
                                id="contractStartDate"
                                name="roleInformation.contractStartDate"
                                type="date"
                                value={formData.roleInformation.contractStartDate}
                                onChange={handleInputChange}
                                className="border-gray-300 focus:border-rose-600 focus:ring-rose-600"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contractEndDate" className="text-gray-700 flex items-center">
                                <CalendarRange className="h-4 w-4 mr-2 text-red-800" />
                                Ngày kết thúc hợp đồng
                            </Label>
                            <Input
                                id="contractEndDate"
                                name="roleInformation.contractEndDate"
                                type="date"
                                value={formData.roleInformation.contractEndDate}
                                onChange={handleInputChange}
                                className="border-gray-300 focus:border-red-800 focus:ring-red-800"
                            />
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

