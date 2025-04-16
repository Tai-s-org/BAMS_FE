"use client"

import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const childFilter = ["all", "alex", "sam"]


export function ChildrenPaymentsList({ childFilter }) {
    const allPayments = [
        // Pending payments
        {
            id: "p101",
            child: "Alex",
            team: "Team Alpha",
            title: "March 2025 Expenses",
            amount: 400,
            dueDate: "April 25, 2025",
            status: "pending",
            isOverdue: false,
        },
        {
            id: "p102",
            child: "Alex",
            team: "Team Alpha",
            title: "Equipment Upgrade",
            amount: 350,
            dueDate: "April 10, 2025",
            status: "pending",
            isOverdue: true,
        },
        {
            id: "p103",
            child: "Sam",
            team: "Team Beta",
            title: "March 2025 Expenses",
            amount: 300,
            dueDate: "April 28, 2025",
            status: "pending",
            isOverdue: false,
        },
        {
            id: "p104",
            child: "Sam",
            team: "Team Beta",
            title: "Tournament Fee",
            amount: 100,
            dueDate: "May 5, 2025",
            status: "pending",
            isOverdue: false,
        },
        // Paid payments
        {
            id: "p001",
            child: "Alex",
            team: "Team Alpha",
            title: "February 2025 Expenses",
            amount: 362.5,
            date: "March 15, 2025",
            status: "paid",
            isOverdue: false,
        },
        {
            id: "p002",
            child: "Sam",
            team: "Team Beta",
            title: "February 2025 Expenses",
            amount: 275,
            date: "March 18, 2025",
            status: "paid",
            isOverdue: false,
        },
    ]

    // Filter payments based on the selected child
    const filteredPayments = allPayments.filter((payment) => {
        if (childFilter === "all") return true
        return payment.child.toLowerCase() === childFilter.toLowerCase()
    })

    return (
        <div className="space-y-4">
            {filteredPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src="/placeholder.svg" />
                            <AvatarFallback>{payment.child[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="font-medium">
                                {payment.child} - {payment.team}
                            </div>
                            <div className="text-sm">{payment.title}</div>
                            <div className={`text-xs ${payment.isOverdue ? "text-red-500" : "text-muted-foreground"}`}>
                                {payment.status === "paid"
                                    ? `Paid on ${payment.date}`
                                    : payment.isOverdue
                                        ? `Overdue since ${payment.dueDate}`
                                        : `Due by ${payment.dueDate}`}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className="font-medium">${payment.amount}</div>
                            {payment.status === "paid" ? (
                                <Badge variant="outline" className="bg-green-50 text-green-700">
                                    Paid
                                </Badge>
                            ) : payment.isOverdue ? (
                                <Badge variant="outline" className="bg-red-50 text-red-700">
                                    Overdue
                                </Badge>
                            ) : (
                                <Badge variant="outline" className="bg-yellow-50">
                                    Pending
                                </Badge>
                            )}
                        </div>
                        <Link href={`/parent/payment/${payment.id}`}>
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
