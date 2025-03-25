"use client"

import React from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Textarea } from "@/components/ui/Textarea"

export default function ManagerRegistrationForm() {
    const handleSubmit = (e) => {
        e.preventDefault()
        // Handle manager form submission
        console.log("Manager form submitted")
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6" style={{ color: "#bd2427" }}>
                Đăng Ký Quản Lý
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium border-b pb-2" style={{ color: "#bd2427" }}>
                        Thông Tin Cá Nhân
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="manager-fullName">Họ và Tên</Label>
                            <Input id="manager-fullName" name="fullName" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="manager-generationAndSchoolName">Khóa và Tên Trường</Label>
                            <Input id="manager-generationAndSchoolName" name="generationAndSchoolName" required />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="manager-phoneNumber">Số Điện Thoại</Label>
                            <Input id="manager-phoneNumber" name="phoneNumber" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="manager-email">Email</Label>
                            <Input id="manager-email" name="email" type="email" required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="manager-facebookProfileUrl">URL Facebook</Label>
                        <Input id="manager-facebookProfileUrl" name="facebookProfileUrl" />
                    </div>
                </div>

                {/* Academy Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium border-b pb-2" style={{ color: "#bd2427" }}>
                        Thông Tin Về Học Viện
                    </h3>

                    <div className="space-y-2">
                        <Label htmlFor="manager-knowledgeAboutAcademy">Bạn biết về học viện của chúng tôi như thế nào?</Label>
                        <Textarea id="manager-knowledgeAboutAcademy" name="knowledgeAboutAcademy" required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="manager-reasonToChooseUs">Tại sao bạn chọn chúng tôi?</Label>
                        <Textarea id="manager-reasonToChooseUs" name="reasonToChooseUs" required />
                    </div>
                </div>

                {/* Manager Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium border-b pb-2" style={{ color: "#bd2427" }}>
                        Kinh Nghiệm Quản Lý
                    </h3>

                    <div className="space-y-2">
                        <Label htmlFor="knowledgeAboutAmanager">Kiến thức về việc làm quản lý</Label>
                        <Textarea id="knowledgeAboutAmanager" name="knowledgeAboutAmanager" required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="experienceAsAmanager">Kinh nghiệm làm quản lý</Label>
                        <Textarea id="experienceAsAmanager" name="experienceAsAmanager" required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="strength">Điểm mạnh</Label>
                        <Textarea id="strength" name="strength" required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="weaknessAndItSolution">Điểm yếu và giải pháp</Label>
                        <Textarea id="weaknessAndItSolution" name="weaknessAndItSolution" required />
                    </div>
                </div>

                <Button type="submit" className="w-full bg-[#bd2427] hover:bg-[#a01e21]">
                    Gửi Đăng Ký
                </Button>
            </form>
        </div>
    )
}
