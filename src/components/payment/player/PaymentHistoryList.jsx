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
            title: "February 2025 Expenses",
            amount: 362.5,
            date: "March 15, 2025",
            status: "paid",
        },
        {
            id: "p002",
            team: "Team Alpha",
            title: "January 2025 Expenses",
            amount: 337.5,
            date: "February 12, 2025",
            status: "paid",
        },
        {
            id: "p003",
            team: "Team Alpha",
            title: "December 2024 Expenses",
            amount: 325,
            date: "January 10, 2025",
            status: "paid",
        },
        {
            id: "p004",
            team: "Team Alpha",
            title: "November 2024 Expenses",
            amount: 300,
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
                            <div className="text-sm text-muted-foreground">Paid on {payment.date}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className="font-medium">${payment.amount}</div>
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                                Paid
                            </Badge>
                        </div>
                        <Link href={`/player/payment/${payment.id}`}>
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
