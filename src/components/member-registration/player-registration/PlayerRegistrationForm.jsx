"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/Radio-group"
import { Textarea } from "@/components/ui/Textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { DatePicker } from "@/components/ui/DatePicker"
import registerApi from "@/api/register"
import { useRouter } from "next/navigation"
import { useToasts } from "@/hooks/providers/ToastProvider"
import { TextEditor } from "@/components/ui/TextEditor"

export default function PlayerRegistrationForm({ email, sessionId, data }) {
    const [date, setDate] = useState(null)
    const router = useRouter();
    const [registrationSessionId, setRegistrationSessionId] = useState("");
    const { addToast } = useToasts();


    const [formData, setFormData] = useState({
        fullName: "",
        generationAndSchoolName: "",
        phoneNumber: "",
        email: "",
        gender: true,
        dateOfBirth: date,
        height: "",
        weight: "",
        facebookProfileUrl: "",
        knowledgeAboutAcademy: "",
        reasonToChooseUs: "",
        position: "",
        experience: "",
        achievement: "",
        parentName: "",
        parentPhoneNumber: "",
        parentEmail: "",
        relationshipWithParent: "",
        parentCitizenId: "",
    })
    //const registrationSessionId = localStorage.getItem("registrationSessionId");
    useEffect(() => {
        if (data) {
            // Nếu có data => set vào form luôn
            setFormData(prev => ({
                ...prev,
                ...data,
                email: email || "", // vẫn ưu tiên email từ props
                memberRegistrationSessionId: sessionId || "",
                dateOfBirth: date ? date.toISOString().split('T')[0] : null,
            }));
        } else {
            // Nếu không có data => chỉ set email và session
            setFormData(prev => ({
                ...prev,
                email: email || "",
                memberRegistrationSessionId: sessionId || "",
                dateOfBirth: date ? date.toISOString().split('T')[0] : null,
            }));
        }
        setRegistrationSessionId(sessionId || "");
    }, [data, email, sessionId, date]);

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
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
            console.log(formData, " memberRegistrationSessionId:", registrationSessionId,);

            try {
                const response = (data ? await registerApi.updatePlayerForm({
                    ...formData,
                    "memberRegistrationSessionId": registrationSessionId,
                }) : await registerApi.playerRegister({
                    ...formData,
                    "memberRegistrationSessionId": registrationSessionId,
                }))
                addToast({ message: response.data.message, type: "success" });
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
                            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} disabled />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Giới Tính</Label>
                            <RadioGroup defaultValue={true} className="flex space-x-4" onChange={handleChange}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value={true} id="male" />
                                    <Label htmlFor="male">Nam</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value={false} id="female" />
                                    <Label htmlFor="female">Nữ</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        <div className="space-y-2">
                            <Label>Ngày sinh</Label>
                            <DatePicker
                                value={date}
                                onChange={setDate}
                                placeholder="Chọn ngày"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="height">Chiều Cao (cm)</Label>
                            <Input id="height" name="height" type="number" value={formData.height} onChange={handleChange} required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="weight">Cân Nặng (kg)</Label>
                            <Input id="weight" name="weight" type="number" value={formData.weight} onChange={handleChange} required />
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
                        <TextEditor
                            content={formData.knowledgeAboutAcademy}
                            onChange={(content) => handleDescriptionChange("knowledgeAboutAcademy", content)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="reasonToChooseUs">Tại sao bạn chọn chúng tôi?</Label>
                        <Textarea id="reasonToChooseUs" name="reasonToChooseUs" value={formData.reasonToChooseUs} onChange={handleChange} required />
                        <TextEditor
                            content={formData.reasonToChooseUs}
                            onChange={(content) => handleDescriptionChange("reasonToChooseUs", content)}
                        />
                    </div>
                </div>

                {/* Football Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium border-b pb-2" style={{ color: "#bd2427" }}>
                        Thông Tin Bóng Rổ
                    </h3>

                    <div className="space-y-2">
                        <Label htmlFor="position">Vị Trí</Label>
                        <Select onValueChange={(value) => setFormData({ ...formData, position: value })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn vị trí" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PG">Hậu vệ dẫn bóng (PG)</SelectItem>
                                <SelectItem value="SG">Hậu vệ ghi điểm (SG)</SelectItem>
                                <SelectItem value="SF">Tiền phong phụ (SF)</SelectItem>
                                <SelectItem value="PF">Tiền phong chính (PF)</SelectItem>
                                <SelectItem value="C">Trung phong (C)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="experience">Kinh Nghiệm</Label>
                        <Textarea id="experience" name="experience" value={formData.experience} onChange={handleChange} required />
                        <TextEditor
                            content={formData.experience}
                            onChange={(content) => handleDescriptionChange("experience", content)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="achievement">Thành Tích</Label>
                        <Textarea id="achievement" name="achievement" value={formData.achievement} onChange={handleChange} />
                        <TextEditor
                            content={formData.achievement}
                            onChange={(content) => handleDescriptionChange("achievement", content)}
                        />
                    </div>
                </div>

                {/* Parent Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium border-b pb-2" style={{ color: "#bd2427" }}>
                        Thông Tin Phụ Huynh
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="parentName">Tên Phụ Huynh</Label>
                            <Input id="parentName" name="parentName" value={formData.parentName} onChange={handleChange} required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="parentPhoneNumber">Số Điện Thoại Phụ Huynh</Label>
                            <Input id="parentPhoneNumber" name="parentPhoneNumber" value={formData.parentPhoneNumber} onChange={handleChange} required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="parentEmail">Email Phụ Huynh</Label>
                            <Input id="parentEmail" name="parentEmail" value={formData.parentEmail} onChange={handleChange} required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="parentCitizenId">Căn cước công dân Phụ Huynh</Label>
                            <Input id="parentCitizenId" name="parentCitizenId" value={formData.parentCitizenId} onChange={handleChange} required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="relationshipWithParent">Mối quan hệ với Phụ Huynh</Label>
                            <Input id="relationshipWithParent" name="relationshipWithParent" value={formData.relationshipWithParent} onChange={handleChange} required />
                        </div>
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
    )
}
