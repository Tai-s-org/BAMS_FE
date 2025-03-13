"use client"

import { Card, CardContent } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Textarea } from "@/components/ui/Textarea"
import { Calendar, Mail, MapPin, Phone, User } from "lucide-react"
import { formatDate } from "@/utils/format"

export default function PersonalInformation({ user, isEditing, formData, handleInputChange }) {
    return (
        <Card className="md:col-span-8 border-none shadow-md">
            <div className="bg-red-700 py-4 px-6 rounded-t-lg">
                <h2 className="text-xl font-semibold text-white flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Thông tin cá nhân
                </h2>
            </div>
            <CardContent className="p-6">
                {!isEditing ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex items-center gap-3">
                            <User className="h-5 w-5 text-red-700" />
                            <div>
                                <p className="text-sm text-gray-500">Họ và tên</p>
                                <p className="font-medium text-gray-900">{user.fullname}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Mail className="h-5 w-5 text-red-600" />
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm text-gray-500">Email</p>
                                    <a href="/change-email" className="text-xs text-red-600 hover:text-red-800 hover:underline">
                                        (đổi email)
                                    </a>
                                </div>
                                <p className="font-medium text-gray-900">{user.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Phone className="h-5 w-5 text-rose-600" />
                            <div>
                                <p className="text-sm text-gray-500">Số điện thoại</p>
                                <p className="font-medium text-gray-900">{user.phone}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-red-800" />
                            <div>
                                <p className="text-sm text-gray-500">Ngày sinh</p>
                                <p className="font-medium text-gray-900">{user.dateOfBirth}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 sm:col-span-2">
                            <MapPin className="h-5 w-5 text-red-700 mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-500">Địa chỉ</p>
                                <p className="font-medium text-gray-900">{user.address}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="fullname" className="text-gray-700 flex items-center">
                                <User className="h-4 w-4 mr-2 text-red-700" />
                                Họ và tên
                            </Label>
                            <Input
                                id="fullname"
                                name="fullname"
                                value={formData.fullname}
                                onChange={handleInputChange}
                                className="border-gray-300 focus:border-red-700 focus:ring-red-700"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="fullname" className="text-gray-700 flex items-center">
                                <Mail className="h-4 w-4 mr-2 text-red-700" />
                                Email
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="border-gray-300 focus:border-red-700 focus:ring-red-700"
                                disabled
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-gray-700 flex items-center">
                                <Phone className="h-4 w-4 mr-2 text-rose-600" />
                                Số điện thoại
                            </Label>
                            <Input
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="border-gray-300 focus:border-rose-600 focus:ring-rose-600"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dateOfBirth" className="text-gray-700 flex items-center">
                                <Calendar className="h-4 w-4 mr-2 text-red-800" />
                                Ngày sinh
                            </Label>
                            <Input
                                id="dateOfBirth"
                                name="dateOfBirth"
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={handleInputChange}
                                className="border-gray-300 focus:border-red-800 focus:ring-red-800"
                            />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="address" className="text-gray-700 flex items-center">
                                <MapPin className="h-4 w-4 mr-2 text-red-700" />
                                Địa chỉ
                            </Label>
                            <Textarea
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                className="border-gray-300 focus:border-red-700 focus:ring-red-700"
                                rows={3}
                            />
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

