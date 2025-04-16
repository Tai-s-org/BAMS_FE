"use client"

import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { ArrowRight } from "lucide-react"

export function PaymentHistoryList() {
    const paymentHistory = [
        {
            id: "p001",
            player: "Alex Player",
            team: "Team Alpha",
            amount: 362.5,
            date: "March 15, 2025",
            status: "paid",
        },
        {
            id: "p002",
            player: "Sam Player",
            team: "Team Alpha",
            amount: 362.5,
            date: "March 16, 2025",
            status: "paid",
        },
        {
            id: "p003",
            player: "Taylor Player",
            team: "Team Beta",
            amount: 275,
            date: "March 18, 2025",
            status: "paid",
        },
        {
            id: "p004",
            player: "Jordan Player",
            team: "Team Beta",
            amount: 275,
            date: "March 20, 2025",
            status: "paid",
        },
        {
            id: "p005",
            player: "Casey Player",
            team: "Team Delta",
            amount: 325,
            date: "March 22, 2025",
            status: "paid",
        },
    ]

    return (
        <div className="space-y-4">
            {paymentHistory.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src="/placeholder.svg" />
                            <AvatarFallback>
                                {payment.player
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="font-medium">{payment.player}</div>
                            <div className="text-sm text-muted-foreground">{payment.team}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className="font-medium">${payment.amount}</div>
                            <div className="text-sm text-muted-foreground">{payment.date}</div>
                        </div>
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                            Paid
                        </Badge>
                        <Button variant="ghost" size="icon">
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    )
}
