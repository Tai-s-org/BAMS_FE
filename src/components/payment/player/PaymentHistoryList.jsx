"use client"

import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import { FileText, ArrowRight } from "lucide-react"

export function PaymentHistoryList() {
    const paymentHistory = [
        {
            id: "p001",
            team: "Team Alpha",
            title: "Đóng quỹ Tháng 2 2025",
            amount: 362000,
            date: "March 15, 2025",
            status: "paid",
        },
        {
            id: "p002",
            team: "Team Alpha",
            title: "Đóng quý tháng 1 2025",
            amount: 337000,
            date: "February 12, 2025",
            status: "paid",
        },
        {
            id: "p003",
            team: "Team Alpha",
            title: "Đóng quý Tháng 12 2025",
            amount: 325000,
            date: "January 10, 2025",
            status: "paid",
        },
        {
            id: "p004",
            team: "Team Alpha",
            title: "Đóng quý Tháng 11 2024",
            amount: 300000,
            date: "December 8, 2024",
            status: "paid",
        },
    ]

    return (
        <div className="space-y-4">
            {paymentHistory.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-full">
                            <FileText className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                            <div className="font-medium">
                                {payment.team} - {payment.title}
                            </div>
                            <div className="text-sm text-muted-foreground">Đã thanh toán ngày {payment.date}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className="font-medium">{payment.amount} VND</div>
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                                Đã thanh toán
                            </Badge>
                        </div>
                        <Link href={`/dashboard/payment/${payment.id}`}>
                            <Button variant="ghost" size="icon">
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    )
}
