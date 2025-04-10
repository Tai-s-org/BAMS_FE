"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Textarea } from "@/components/ui/Textarea"
import registerApi from "@/api/register"
import { useToasts } from "@/hooks/providers/ToastProvider"
import { useRouter } from "next/navigation"
import { Dialog } from "@/components/ui/Dialog"

export default function ManagerRegistrationForm({ isOpen, onClose }) {
    const { addToast } = useToasts();
    const router = useRouter();
    const storedEmail = localStorage.getItem("userEmail");
    const [formData, setFormData] = useState({
        fullName: "",
        generationAndSchoolName: "",
        phoneNumber: "",
        email: storedEmail,
        facebookProfileUrl: "",
        knowledgeAboutAcademy: "",
        reasonToChooseUs: "",
        knowledgeAboutAmanager: "",
        experienceAsAmanager: "",
        strength: "",
        weaknessAndItSolution: ""
    })
    const registrationSessionId = localStorage.getItem("registrationSessionId");

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        if (registrationSessionId) {
            e.preventDefault()
            console.log(formData, " memberRegistrationSessionId:", registrationSessionId,);
            
            try {
                const response = await registerApi.managerRegister({
                    ...formData,
                    "memberRegistrationSessionId": registrationSessionId,

                })
                console.log(response.data);
                addToast({ message: response.data.message, type: "success" });
            } catch (error) {
                //addToast({ message: response.data.message, type: "error" });
            }
            router.push("/");
        }
    }


    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium border-b pb-2" style={{ color: "#bd2427" }}>
                            Thông Tin Cá Nhân
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Họ và Tên</Label>
                                <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="generationAndSchoolName">Khóa và Tên Trường</Label>
                                <Input id="generationAndSchoolName" name="generationAndSchoolName" value={formData.generationAndSchoolName} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="phoneNumber">Số Điện Thoại</Label>
                                <Input id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" value={storedEmail} onChange={handleChange} disabled />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="facebookProfileUrl">URL Facebook</Label>
                            <Input id="facebookProfileUrl" name="facebookProfileUrl" value={formData.facebookProfileUrl} onChange={handleChange} />
                        </div>
                    </div>

                    {/* Academy Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium border-b pb-2" style={{ color: "#bd2427" }}>
                            Thông Tin Về Học Viện
                        </h3>

                        <div className="space-y-2">
                            <Label htmlFor="knowledgeAboutAcademy">Bạn biết về học viện của chúng tôi như thế nào?</Label>
                            <Textarea id="knowledgeAboutAcademy" name="knowledgeAboutAcademy" value={formData.knowledgeAboutAcademy} onChange={handleChange} required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="reasonToChooseUs">Tại sao bạn chọn chúng tôi?</Label>
                            <Textarea id="reasonToChooseUs" name="reasonToChooseUs" value={formData.reasonToChooseUs} onChange={handleChange} required />
                        </div>
                    </div>

                    {/* Manager Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium border-b pb-2" style={{ color: "#bd2427" }}>
                            Kinh Nghiệm Quản Lý
                        </h3>

                        <div className="space-y-2">
                            <Label htmlFor="knowledgeAboutAmanager">Kiến thức về việc làm quản lý</Label>
                            <Textarea id="knowledgeAboutAmanager" name="knowledgeAboutAmanager" value={formData.knowledgeAboutAmanager} onChange={handleChange} required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="experienceAsAmanager">Kinh nghiệm làm quản lý</Label>
                            <Textarea id="experienceAsAmanager" name="experienceAsAmanager" value={formData.experienceAsAmanager} onChange={handleChange} required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="strength">Điểm mạnh</Label>
                            <Textarea id="strength" name="strength" value={formData.strength} onChange={handleChange} required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="weaknessAndItSolution">Điểm yếu và giải pháp</Label>
                            <Textarea id="weaknessAndItSolution" name="weaknessAndItSolution" value={formData.weaknessAndItSolution} onChange={handleChange} required />
                        </div>
                    </div>

                    <Button type="submit" className="w-full bg-[#bd2427] hover:bg-[#a01e21]">
                        Gửi Đăng Ký
                    </Button>
                </form>
            </div>
        </Dialog>

    )
}
