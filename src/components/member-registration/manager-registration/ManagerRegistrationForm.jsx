"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Textarea } from "@/components/ui/Textarea"
import registerApi from "@/api/register"
import { useToasts } from "@/hooks/providers/ToastProvider"
import { useRouter } from "next/navigation"
import { Dialog } from "@/components/ui/Dialog"
import { TextEditor } from "@/components/ui/TextEditor"

export default function ManagerRegistrationForm({ isOpen, onClose, email, sessionId, data }) {
    const { addToast } = useToasts()
    const router = useRouter()
    const [registrationSessionId, setRegistrationSessionId] = useState("")
    const [formData, setFormData] = useState({
        fullName: "",
        generationAndSchoolName: "",
        phoneNumber: "",
        email: "", // để set sau khi load localStorage
        facebookProfileUrl: "",
        knowledgeAboutAcademy: "",
        reasonToChooseUs: "",
        knowledgeAboutAmanager: "",
        experienceAsAmanager: "",
        strength: "",
        weaknessAndItSolution: "",
    })

    // Load localStorage và gán vào formData
    useEffect(() => {
        if (data) {
            // Nếu có data => set vào form luôn
            setFormData((prev) => ({
                ...prev,
                ...data,
                email: email || "", // vẫn ưu tiên email từ props
                memberRegistrationSessionId: sessionId || "",
            }))
        } else {
            // Nếu không có data => chỉ set email và session
            setFormData((prev) => ({
                ...prev,
                email: email || "",
                memberRegistrationSessionId: sessionId || "",
            }))
        }
        setRegistrationSessionId(sessionId || "")
    }, [data, email, sessionId])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    }

    const handleDescriptionChange = (name, content) => {
        setFormData((prev) => ({
            ...prev,
            [name]: content,
        }))
    }

    const handleSubmit = async (e) => {
        if (registrationSessionId) {
            e.preventDefault()
            try {
                const response = data
                    ? await registerApi.updateManagerForm({
                        ...formData,
                        memberRegistrationSessionId: registrationSessionId,
                    })
                    : await registerApi.managerRegister({
                        ...formData,
                        memberRegistrationSessionId: registrationSessionId,
                    })
                addToast({ message: response.data.message, type: "success" })
                setTimeout(() => {
                    router.push("/");
                }, 1500);
            } catch (error) {
                if (error.response.data?.message === null) {
                    Object.entries(error.response.data?.errors).forEach(([key, value]) => {
                        const msg = String(`${key}: ${value}`).split(":")[1]?.trim();
                        addToast({ message: value, type: "error" });
                    });
                } else {
                    addToast({ message: error.response.data?.message, type: "error" });
                }
            }
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
                                <Label htmlFor="fullName">Họ và Tên<span className="text-red-600">*</span></Label>
                                <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="generationAndSchoolName">Khóa và Tên Trường<span className="text-red-600">*</span></Label>
                                <Input
                                    id="generationAndSchoolName"
                                    name="generationAndSchoolName"
                                    value={formData.generationAndSchoolName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="phoneNumber">Số Điện Thoại<span className="text-red-600">*</span></Label>
                                <Input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" value={email} onChange={handleChange} disabled />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="facebookProfileUrl">URL Facebook</Label>
                            <Input
                                id="facebookProfileUrl"
                                name="facebookProfileUrl"
                                value={formData.facebookProfileUrl}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Academy Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium border-b pb-2" style={{ color: "#bd2427" }}>
                            Thông Tin Về Học Viện
                        </h3>

                        <div className="space-y-2">
                            <Label htmlFor="knowledgeAboutAcademy">Bạn biết về học viện của chúng tôi như thế nào?</Label>
                            <TextEditor
                                content={formData.knowledgeAboutAcademy}
                                onChange={(content) => handleDescriptionChange("knowledgeAboutAcademy", content)}
                                placeholder="Bạn biết về học viện của chúng tôi như thế nào?"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="reasonToChooseUs">Tại sao bạn chọn chúng tôi?</Label>
                            <TextEditor
                                content={formData.reasonToChooseUs}
                                onChange={(content) => handleDescriptionChange("reasonToChooseUs", content)}
                                placeholder="Tại sao bạn chọn chúng tôi?"
                            />
                        </div>
                    </div>

                    {/* Manager Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium border-b pb-2" style={{ color: "#bd2427" }}>
                            Kinh Nghiệm Quản Lý
                        </h3>

                        <div className="space-y-2">
                            <Label htmlFor="knowledgeAboutAmanager">Kiến thức về việc làm quản lý<span className="text-red-600">*</span></Label>
                            <TextEditor
                                content={formData.knowledgeAboutAmanager}
                                onChange={(content) => handleDescriptionChange("knowledgeAboutAmanager", content)}
                                placeholder="Kiến thức về việc làm quản lý"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="experienceAsAmanager">Kinh nghiệm làm quản lý<span className="text-red-600">*</span></Label>
                            <TextEditor
                                content={formData.experienceAsAmanager}
                                onChange={(content) => handleDescriptionChange("experienceAsAmanager", content)}
                                placeholder="Kinh nghiệm làm quản lý"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="strength">Điểm mạnh<span className="text-red-600">*</span></Label>
                            <TextEditor
                                content={formData.strength}
                                onChange={(content) => handleDescriptionChange("strength", content)}
                                placeholder="Điểm mạnh"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="weaknessAndItSolution">Điểm yếu và giải pháp<span className="text-red-600">*</span></Label>
                            <TextEditor
                                content={formData.weaknessAndItSolution}
                                onChange={(content) => handleDescriptionChange("weaknessAndItSolution", content)}
                                placeholder="Điểm yếu và giải pháp"
                                required
                            />
                        </div>
                    </div>
                    {data ? (
                        <Button type="submit" className="w-full bg-[#bd2427] hover:bg-[#a01e21]">
                            Cập nhật đơn đăng kí
                        </Button>
                    ) : (
                        <Button type="submit" className="w-full bg-[#bd2427] hover:bg-[#a01e21]">
                            Gửi Đăng Ký
                        </Button>
                    )}
                </form>
            </div>
        </Dialog>
    )
}
