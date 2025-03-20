"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Check, Edit3, Shield, Upload, User, Users, X } from "lucide-react"

export default function ProfileHeader({
    user,
    isEditing,
    setIsEditing,
    avatarPreview,
    handleAvatarChange,
    handleSave,
    handleCancel,
}) {
    if (!user) {
        return <div className="text-center text-gray-500">Loading...</div>;
    }

    return (
        <div className="mb-8">
            <div className="bg-gradient-to-r from-red-700 via-red-600 to-rose-600 p-6 rounded-t-lg">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full bg-white p-1 shadow-lg">
                            <Avatar className="w-full h-full">
                                <AvatarImage src={avatarPreview || user.profileImage} alt={user.fullname} />
                                {/* <AvatarFallback className="bg-white text-red-700 text-4xl">
                                    {user?.fullname
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                </AvatarFallback> */}
                            </Avatar>
                            {isEditing && (
                                <label
                                    htmlFor="avatar-upload"
                                    className="absolute bottom-0 right-0 bg-white text-red-700 p-2 rounded-full shadow-lg cursor-pointer hover:bg-gray-100 transition-colors"
                                >
                                    <Upload size={18} />
                                    <input
                                        id="avatar-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleAvatarChange}
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="text-center md:text-left flex-1">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-1">{user.fullname}</h1>
                                <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 mb-2">
                                    <Badge className="bg-white text-red-700 hover:bg-gray-100">
                                        <User className="h-3 w-3 mr-1" />@{user.username}
                                    </Badge>
                                    <Badge className="bg-red-900 text-white hover:bg-red-500">
                                        <Shield className="h-3 w-3 mr-1" />
                                        {user.roleCode}
                                    </Badge>
                                    <Badge className="bg-rose-600 text-white hover:bg-rose-500">
                                        <Users className="h-3 w-3 mr-1" />
                                        {user.teamId}
                                    </Badge>
                                    {user.roleCode === "Player" && (
                                        <Badge className="bg-red-800 text-white hover:bg-red-700">#{user.shirtNumber}</Badge>
                                    )}
                                </div>
                            </div>

                            {!isEditing ? (
                                <Button
                                    onClick={() => setIsEditing(true)}
                                    className="bg-white text-red-700 hover:bg-gray-100 self-center md:self-start"
                                >
                                    <Edit3 className="mr-2 h-4 w-4" />
                                    Chỉnh sửa thông tin
                                </Button>
                            ) : (
                                <div className="flex gap-2 justify-center md:justify-start">
                                    <Button onClick={handleSave} className="bg-white text-red-700 hover:bg-gray-100">
                                        <Check className="mr-2 h-4 w-4" />
                                        Xác nhận
                                    </Button>
                                    <Button
                                        onClick={handleCancel}
                                        variant="outline"
                                        className="bg-transparent text-white border-white hover:bg-white/10"
                                    >
                                        <X className="mr-2 h-4 w-4" />
                                        Hủy
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

