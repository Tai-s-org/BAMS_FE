"use client"

import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import { FileText, ArrowRight, AlertTriangle } from "lucide-react"

export function PendingPaymentsList() {
    const pendingPayments = [
        {
            id: "p101",
            team: "Team Alpha",
            title: "March 2025 Expenses",
            amount: 400,
            dueDate: "April 25, 2025",
            status: "pending",
            isOverdue: false,
        },
        {
            id: "p102",
            team: "Team Alpha",
            title: "Equipment Upgrade",
            amount: 350,
            dueDate: "April 10, 2025",
            status: "pending",
            isOverdue: true,
        },
    ]

    return (
        <div className="space-y-4">
            {pendingPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
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
                                {payment.team} - {payment.title}
                            </div>
                            <div className={`text-sm ${payment.isOverdue ? "text-red-500" : "text-muted-foreground"}`}>
                                {payment.isOverdue ? "Overdue since " : "Due by "}
                                {payment.dueDate}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className="font-medium">${payment.amount}</div>
                            <Badge variant="outline" className={payment.isOverdue ? "bg-red-50 text-red-700" : "bg-yellow-50"}>
                                {payment.isOverdue ? "Overdue" : "Pending"}
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
