"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/Dialog"
import { Button } from "@/components/ui/Button"
import { Label } from "@/components/ui/Label"
import { Input } from "@/components/ui/Input"
import { DatePicker } from "@/components/ui/DatePicker"
import registerApi from "@/api/register"
import { useToasts } from "@/hooks/providers/ToastProvider"

export function TryoutModal({ open, onClose, selectedCount, selectedPlayers }) {
    const [date, setDate] = useState(null)
    const [time, setTime] = useState("")
    const [location, setLocation] = useState("")
    const { addToast } = useToasts();

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!date || !time || !location) return

        const [hours, minutes] = time.split(":")
        const dateTime = new Date(date)
        dateTime.setHours(parseInt(hours))
        dateTime.setMinutes(parseInt(minutes))
        const isoString = dateTime.toISOString()

        try {
            // Gửi dữ liệu buổi thử việc
            const response = await registerApi.callPlayerTryOut({
                playerRegistIds: selectedPlayers,
                location,
                tryOutDateTime: isoString
            })
            if (response.data.status === "Success") {
                addToast({
                    message: response.data.message || "Cầu thủ đã được mời thử việc thành công",
                    type: "success",
                })
            } else {
                addToast({
                    message: response.data.message || "Có lỗi xảy ra khi mời thử việc",
                    type: "error",
                })
            }

            console.log(response.data);
            onClose() // đóng dialog sau khi xử lý xong
            setTimeout(() => {
                window.location.reload() // reload trang sau một chút delay
            }, 500)

        } catch (error) {
            addToast({
                message: error.response?.data?.message || "Có lỗi xảy ra khi mời thử việc",
                type: "error",
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Mời tham gia buổi thử việc</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="players" className="text-right">
                                Cầu thủ
                            </Label>
                            <div className="col-span-3">
                                <span className="font-medium">{selectedCount} cầu thủ đã chọn</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="date" className="text-right">
                                Ngày
                            </Label>
                            <div className="col-span-3">
                                <DatePicker
                                    value={date}
                                    onChange={setDate}
                                    placeholder="Chọn ngày"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="time" className="text-right">
                                Giờ
                            </Label>
                            <div className="col-span-3 relative">
                                <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="location" className="text-right">
                                Địa điểm
                            </Label>
                            <Input
                                id="location"
                                className="col-span-3"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Hủy
                        </Button>
                        <Button type="submit" disabled={!date || !time || !location}>
                            Xác nhận
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
