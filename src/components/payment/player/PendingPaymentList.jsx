"use client"

import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import { FileText, ArrowRight, AlertTriangle, Key } from "lucide-react"

export function PendingPaymentsList({ pendingPayments }) {
    // const pendingPayments = [
    //     {
    //         id: "p101",
    //         team: "Team Alpha",
    //         title: "Đóng quỹ Tháng 3 2025",
    //         amount: 400000,
    //         dueDate: "April 25, 2025",
    //         status: "Chưa thanh toán",
    //         isOverdue: false,
    //     },
    //     {
    //         id: "p102",
    //         team: "Team Alpha",
    //         title: "Phí phạt",
    //         amount: 350000,
    //         dueDate: "April 10, 2025",
    //         status: "Chưa thanh toán",
    //         isOverdue: true,
    //     },
    // ]

    function formatTienVN(number) {
        return number != null ? number.toLocaleString('vi-VN') : "";
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })
    }

    return (
        (pendingPayments?.length > 0) ? (
            <div className="space-y-4">
                {pendingPayments.map((payment, index) => (
                    <div key={payment.paymentId || index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${payment.isOverdue ? "bg-red-100" : "bg-gray-100"}`}>
                                {payment.isOverdue ? (
                                    <AlertTriangle className="h-5 w-5 text-red-500" />
                                ) : (
                                    <FileText className="h-5 w-5 text-gray-500" />
                                )}
                            </div>
                            <div>
                                <div className="font-medium">
                                    {payment.teamName} - {payment.title}
                                </div>
                                <div className={`text-sm ${payment.isOverdue ? "text-red-500" : "text-muted-foreground"}`}>
                                    {payment.isOverdue ? "Hết hạn từ " : "Hạn đóng "}
                                    {formatDate(payment.dueDate)}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <div className="font-medium">{formatTienVN(payment.totalAmount)} VNĐ</div>
                                <Badge variant="outline" className={payment.isOverdue ? "bg-red-50 text-red-700" : "bg-yellow-50"}>
                                    {payment.isOverdue ? "Hết hạn" : "Chưa thanh toán"}
                                </Badge>
                            </div>
                            <Link href={`/dashboard/payment/${payment.paymentId}`}>
                                <Button variant="ghost" size="icon">
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div>Hiện không có </div>
        )
    )
}
