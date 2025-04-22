"use client"

import { Card, CardContent } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Calendar, Ruler, Shield, ShirtIcon as TShirt, User, UserPlus, Users, Weight } from "lucide-react"
import { formatDate } from "@/utils/format"

export default function PlayerInformation({ user, isEditing, formData, handleInputChange }) {
    return (
        <Card className="md:col-span-12 border-none shadow-md">
            <div className="bg-rose-600 py-4 px-6 rounded-t-lg">
                <h2 className="text-xl font-semibold text-white flex items-center">
                    <TShirt className="h-5 w-5 mr-2" />
                    Thông tin cầu thủ
                </h2>
            </div>
            <CardContent className="p-6">
                {!isEditing ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="flex items-center gap-3">
                            <UserPlus className="h-5 w-5 text-red-700" />
                            <div>
                                <p className="text-sm text-gray-500">ID Phụ huynh</p>
                                <p className="font-medium text-gray-900">{user.roleInformation.parentId}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Users className="h-5 w-5 text-red-600" />
                            <div>
                                <p className="text-sm text-gray-500">ID Đội</p>
                                <p className="font-medium text-gray-900">{user.roleInformation.teamId}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <User className="h-5 w-5 text-rose-600" />
                            <div>
                                <p className="text-sm text-gray-500">Quan hệ với phụ huynh</p>
                                <p className="font-medium text-gray-900">{user.roleInformation.relationshipWithParent}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Weight className="h-5 w-5 text-red-800" />
                            <div>
                                <p className="text-sm text-gray-500">Cân nặng</p>
                                <p className="font-medium text-gray-900">{user.roleInformation.weight} kg</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Ruler className="h-5 w-5 text-red-700" />
                            <div>
                                <p className="text-sm text-gray-500">Chiều cao</p>
                                <p className="font-medium text-gray-900">{user.roleInformation.height} cm</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Shield className="h-5 w-5 text-red-600" />
                            <div>
                                <p className="text-sm text-gray-500">Vị trí thi đấu</p>
                                <p className="font-medium text-gray-900">{user.roleInformation.position}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <TShirt className="h-5 w-5 text-rose-600" />
                            <div>
                                <p className="text-sm text-gray-500">Số áo</p>
                                <p className="font-medium text-gray-900">{user.roleInformation.shirtNumber}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-red-800" />
                            <div>
                                <p className="text-sm text-gray-500">Ngày tham gia</p>
                                <p className="font-medium text-gray-900">{formatDate(user.roleInformation.joinDate)}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="parentId" className="text-gray-700 flex items-center">
                                <UserPlus className="h-4 w-4 mr-2 text-red-700" />
                                ID Phụ huynh
                            </Label>
                            <Input
                                id="parentId"
                                name="roleInformation.parentId"
                                value={formData.roleInformation.parentId}
                                onChange={handleInputChange}
                                className="border-gray-300 focus:border-red-700 focus:ring-red-700"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="teamId" className="text-gray-700 flex items-center">
                                <Users className="h-4 w-4 mr-2 text-red-600" />
                                ID Đội
                            </Label>
                            <Input
                                id="teamId"
                                name="roleInformation.teamId"
                                value={formData.roleInformation.teamId}
                                onChange={handleInputChange}
                                className="border-gray-300 focus:border-red-600 focus:ring-red-600"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="relationshipWithParent" className="text-gray-700 flex items-center">
                                <User className="h-4 w-4 mr-2 text-rose-600" />
                                Quan hệ với phụ huynh
                            </Label>
                            <Input
                                id="relationshipWithParent"
                                name="roleInformation.relationshipWithParent"
                                value={formData.roleInformation.relationshipWithParent}
                                onChange={handleInputChange}
                                className="border-gray-300 focus:border-rose-600 focus:ring-rose-600"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="weight" className="text-gray-700 flex items-center">
                                <Weight className="h-4 w-4 mr-2 text-red-800" />
                                Cân nặng (kg)
                            </Label>
                            <Input
                                id="weight"
                                name="roleInformation.weight"
                                type="number"
                                value={formData.roleInformation.weight}
                                onChange={handleInputChange}
                                className="border-gray-300 focus:border-red-800 focus:ring-red-800"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="height" className="text-gray-700 flex items-center">
                                <Ruler className="h-4 w-4 mr-2 text-red-700" />
                                Chiều cao (cm)
                            </Label>
                            <Input
                                id="height"
                                name="roleInformation.height"
                                type="number"
                                value={formData.roleInformation.height}
                                onChange={handleInputChange}
                                className="border-gray-300 focus:border-red-700 focus:ring-red-700"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="position" className="text-gray-700 flex items-center">
                                <Shield className="h-4 w-4 mr-2 text-red-600" />
                                Vị trí thi đấu
                            </Label>
                            <Input
                                id="position"
                                name="roleInformation.position"
                                value={formData.roleInformation.position}
                                onChange={handleInputChange}
                                className="border-gray-300 focus:border-red-600 focus:ring-red-600"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="shirtNumber" className="text-gray-700 flex items-center">
                                <TShirt className="h-4 w-4 mr-2 text-rose-600" />
                                Số áo
                            </Label>
                            <Input
                                id="shirtNumber"
                                name="roleInformation.shirtNumber"
                                type="number"
                                value={formData.roleInformation.shirtNumber}
                                onChange={handleInputChange}
                                className="border-gray-300 focus:border-rose-600 focus:ring-rose-600"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="joinDate" className="text-gray-700 flex items-center">
                                <Calendar className="h-4 w-4 mr-2 text-red-800" />
                                Ngày tham gia
                            </Label>
                            <Input
                                id="joinDate"
                                name="roleInformation.joinDate"
                                type="date"
                                value={formData.roleInformation.joinDate || ""}
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

