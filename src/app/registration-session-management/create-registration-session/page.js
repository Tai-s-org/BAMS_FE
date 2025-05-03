"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Textarea } from "@/components/ui/Textarea"
import { Switch } from "@/components/ui/Switch"
import { CalendarIcon } from "lucide-react"
import { DatePicker } from "@/components/ui/DatePicker"
import { format } from "date-fns"
import { cn } from "@/lib/utils"



export default function NewRegistrationSession() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        registrationName: "",
        description: "",
        startDate: "",
        endDate: "",
        isAllowPlayerRecruit: true,
        isAllowManagerRecruit: true,
    })
    const [startDateOpen, setStartDateOpen] = useState(false)
    const [endDateOpen, setEndDateOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSwitchChange = (name, checked) => {
        setFormData((prev) => ({ ...prev, [name]: checked }))
    }

    const handleStartDateSelect = (date) => {
        if (date) {
            setFormData((prev) => ({ ...prev, startDate: date.toISOString() }))
            setStartDateOpen(false)
        }
    }

    const handleEndDateSelect = (date) => {
        if (date) {
            setFormData((prev) => ({ ...prev, endDate: date.toISOString() }))
            setEndDateOpen(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            // Here you would typically call your API or server action
            console.log("Submitting registration session:", formData)

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000))

            // Redirect to list page after successful creation
            router.push("/registration-session-management")
        } catch (error) {
            console.error("Error creating registration session:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="container mx-auto py-10">
            <Card className="max-w-2xl mx-auto">
                <CardHeader className="bg-[#bd2427] text-white">
                    <CardTitle className="text-2xl">Tạo mới đợt tuyển quân</CardTitle>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6 pt-6">
                        <div className="space-y-2">
                            <Label htmlFor="registrationName">Tên đợt tuyển quân</Label>
                            <Input
                                id="registrationName"
                                name="registrationName"
                                value={formData.registrationName}
                                onChange={handleInputChange}
                                placeholder="Vd: Đợt tuyển quân tháng 10/2023"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Mô tả</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Vd: Đợt tuyển quân này sẽ diễn ra từ ngày 1/10/2023 đến ngày 31/10/2023"
                                rows={4}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <DatePicker
                                    value={formData.startDate}
                                    onChange={(date) => {
                                        setFormData((prev) => ({ ...prev, startDate: date }))
                                        setStartDateOpen(false)
                                    }}
                                    label={<span className="text-red-600">* Ngày bắt đầu phải sau ngày hôm nay</span>}
                                    placeholder="Ngày bắt đầu"
                                    minDate={new Date()}
                                ></DatePicker>
                            </div>

                            <div className="space-y-2">
                                <DatePicker
                                    value={formData.endDate}
                                    onChange={(date) => {
                                        setFormData((prev) => ({ ...prev, endDate: date }))
                                        setEndDateOpen(false)
                                    }}
                                    label={<span className="text-red-600">* Ngày kết thúc phải sau ngày bắt đầu</span>}
                                    placeholder="Ngày kết thúc"
                                    minDate={formData.startDate ? new Date(formData.startDate) : new Date()}
                                ></DatePicker>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="playerRecruit">Tuyển cầu thủ</Label>
                                </div>
                                <Switch
                                    id="playerRecruit"
                                    checked={formData.isAllowPlayerRecruit}
                                    onCheckedChange={(checked) => handleSwitchChange("isAllowPlayerRecruit", checked)}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="managerRecruit">Tuyển quản lí</Label>
                                </div>
                                <Switch
                                    id="managerRecruit"
                                    checked={formData.isAllowManagerRecruit}
                                    onCheckedChange={(checked) => handleSwitchChange("isAllowManagerRecruit", checked)}
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t p-6">
                        <Button variant="outline" onClick={() => router.push("/registration-session-management")} disabled={isSubmitting}>
                            Hủy
                        </Button>
                        <Button type="submit" className="bg-[#bd2427] hover:bg-[#a61f22] text-white" disabled={isSubmitting}>
                            {isSubmitting ? "Creating..." : "Tạo mới"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
