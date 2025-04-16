import { format } from "date-fns"
import { Check, Copy } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { Label } from "@/components/ui/Label"
import { Separator } from "@/components/ui/Seperator"

export function PaymentDetails({ payment }) {
    return (
        <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Mã giao dịch</Label>
                    <div className="flex items-center gap-2">
                        <span className="text-sm">{payment.id}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Copy className="h-3 w-3" />
                        </Button>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Ngày</Label>
                    <span className="text-sm">{format(new Date(payment.date), "dd/MM/yyyy")}</span>
                </div>

                <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Số tiền</Label>
                    <span className="text-sm font-medium">
                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(payment.amount)}
                    </span>
                </div>
            </div>

            <Separator />

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Mô tả</Label>
                    <span className="text-sm">{payment.description}</span>
                </div>

                <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Trạng thái</Label>
                    <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{payment.status === "completed" ? "Hoàn thành" : "Đang xử lý"}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Phương thức</Label>
                    <span className="text-sm">{payment.paymentMethod}</span>
                </div>

                <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Người nhận</Label>
                    <span className="text-sm">{payment.recipient}</span>
                </div>
            </div>

            <Separator />

            <div className="rounded-lg bg-muted p-3">
                <div className="text-xs text-muted-foreground">
                    Nếu bạn có bất kỳ câu hỏi nào về giao dịch này, vui lòng liên hệ với quản trị viên hệ thống.
                </div>
            </div>
        </div>
    )
}
