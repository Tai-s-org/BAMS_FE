"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Badge } from "@/components/ui/Badge"

export function TeamMembersList() {
    // This now shows the current month's payment status by default
    const teamMembers = [
        {
            id: "member1",
            name: "Alex Player",
            role: "Player",
            paymentStatus: "paid",
            paymentDate: "April 5, 2025",
        },
        {
            id: "member2",
            name: "Sam Player",
            role: "Player",
            paymentStatus: "paid",
            paymentDate: "April 8, 2025",
        },
        {
            id: "member3",
            name: "Taylor Player",
            role: "Player",
            paymentStatus: "pending",
            paymentDate: null,
        },
        {
            id: "member4",
            name: "Jordan Player",
            role: "Player",
            paymentStatus: "pending",
            paymentDate: null,
        },
    ]

    return (
        <div className="space-y-4">
            <div className="text-sm text-muted-foreground mb-2">April 2025 Payment Status</div>
            {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-2">
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src="/placeholder.svg" />
                            <AvatarFallback>
                                {member.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-xs text-muted-foreground">
                                {member.paymentStatus === "paid" ? `Paid on ${member.paymentDate}` : "Not paid yet"}
                            </div>
                        </div>
                    </div>
                    <Badge
                        variant="outline"
                        className={member.paymentStatus === "paid" ? "bg-green-50 text-green-700" : "bg-yellow-50"}
                    >
                        {member.paymentStatus === "paid" ? "Paid" : "Pending"}
                    </Badge>
                </div>
            ))}
        </div>
    )
}
