"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Badge } from "@/components/ui/Badge"
import { Progress } from "@/components/ui/Progress"

export function PaymentStatusList(payments) {
    const paymentStatus = [
        {
            id: "report1",
            title: "March 2025 Expenses",
            amount: 1600000,
            perMember: 400000,
            paidMembers: 2,
            totalMembers: 4,
            members: [
                { name: "Hoàng Trung Hiếu", status: "paid" },
                { name: "Tuấn Anh", status: "paid" },
                { name: "Stephen Curly", status: "pending" },
                { name: "Man United", status: "pending" },
            ],
        },
        {
            id: "report2",
            title: "February 2025 Expenses",
            amount: 1450000,
            perMember: 362000,
            paidMembers: 4,
            totalMembers: 4,
            members: [
                { name: "Hoàng Trung Hiếu", status: "paid" },
                { name: "Tuấn Anh", status: "paid" },
                { name: "Stephen Curly", status: "paid" },
                { name: "Man United", status: "paid" },
            ],
        },
    ]

    return (
        <div className="space-y-6">
            {paymentStatus.map((report) => (
                <div key={report.id} className="space-y-4">
                    <div>
                        <h3 className="font-medium">{report.title}</h3>
                        <div className="flex items-center justify-between text-sm text-muted-foreground mt-1">
                            <span>Tổng: {report.amount} VND</span>
                            <span>Môi thành viên: {report.perMember} VND</span>
                        </div>
                        <div className="flex items-center justify-between text-sm mt-2">
                            <span>Tiến trình thanh toán</span>
                            <span>
                                {report.paidMembers}/{report.totalMembers} thành viên đã thanh toán
                            </span>
                        </div>
                        <Progress value={(report.paidMembers / report.totalMembers) * 100} className="h-2 mt-1" />
                    </div>

                    <div className="space-y-2">
                        {report.members.map((member, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                        <AvatarImage src="/placeholder.svg" />
                                        <AvatarFallback>
                                            {member.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm">{member.name}</span>
                                </div>
                                <Badge
                                    variant="outline"
                                    className={member.status === "paid" ? "bg-green-50 text-green-700" : "bg-yellow-50"}
                                >
                                    {member.status === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}
