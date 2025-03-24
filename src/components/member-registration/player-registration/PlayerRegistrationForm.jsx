"use client"

import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "@/utils/format"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { Calendar } from "@/components/ui/Calendar"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
//import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/Textarea"
//import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"

export default function PlayerRegistrationForm() {
    const [date, setDate] = useState(null)

    const handleSubmit = (e) => {
        e.preventDefault()
        // Handle player form submission
        console.log("Player form submitted")
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6" style={{ color: "#bd2427" }}>
                Đăng Ký Cầu Thủ
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium border-b pb-2" style={{ color: "#bd2427" }}>
                        Thông Tin Cá Nhân
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Họ và Tên</Label>
                            <Input id="fullName" name="fullName" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="generationAndSchoolName">Khóa và Tên Trường</Label>
                            <Input id="generationAndSchoolName" name="generationAndSchoolName" required />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber">Số Điện Thoại</Label>
                            <Input id="phoneNumber" name="phoneNumber" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" required />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Giới Tính</Label>
                            {/* <RadioGroup defaultValue="male" className="flex space-x-4">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="male" id="male" />
                                    <Label htmlFor="male">Nam</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="female" id="female" />
                                    <Label htmlFor="female">Nữ</Label>
                                </div>
                            </RadioGroup> */}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dateOfBirth">Ngày Sinh</Label>
                            {/* <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(date, "PPP") : "Chọn ngày"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                                </PopoverContent>
                            </Popover> */}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="height">Chiều Cao (cm)</Label>
                            <Input id="height" name="height" type="number" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="weight">Cân Nặng (kg)</Label>
                            <Input id="weight" name="weight" type="number" required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="facebookProfileURL">URL Facebook</Label>
                        <Input id="facebookProfileURL" name="facebookProfileURL" />
                    </div>
                </div>

                {/* Academy Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium border-b pb-2" style={{ color: "#bd2427" }}>
                        Thông Tin Về Học Viện
                    </h3>

                    <div className="space-y-2">
                        <Label htmlFor="knowledgeAboutAcademy">Bạn biết về học viện của chúng tôi như thế nào?</Label>
                        <Textarea id="knowledgeAboutAcademy" name="knowledgeAboutAcademy" required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="reasonToChooseUs">Tại sao bạn chọn chúng tôi?</Label>
                        <Textarea id="reasonToChooseUs" name="reasonToChooseUs" required />
                    </div>
                </div>

                {/* Football Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium border-b pb-2" style={{ color: "#bd2427" }}>
                        Thông Tin Bóng Đá
                    </h3>

                    <div className="space-y-2">
                        <Label htmlFor="position">Vị Trí</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn vị trí" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="goalkeeper">Thủ môn</SelectItem>
                                <SelectItem value="defender">Hậu vệ</SelectItem>
                                <SelectItem value="midfielder">Tiền vệ</SelectItem>
                                <SelectItem value="forward">Tiền đạo</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="experience">Kinh Nghiệm</Label>
                        <Textarea id="experience" name="experience" required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="achievement">Thành Tích</Label>
                        <Textarea id="achievement" name="achievement" />
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
                            <Input id="parentName" name="parentName" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="parentPhoneNumber">Số Điện Thoại Phụ Huynh</Label>
                            <Input id="parentPhoneNumber" name="parentPhoneNumber" required />
                        </div>
                    </div>
                </div>

                <Button type="submit" className="w-full bg-[#bd2427] hover:bg-[#a01e21]">
                    Gửi Đăng Ký
                </Button>
            </form>
        </div>
    )
}
