"use client"
import { Progress } from "@/components/ui/Progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Separator } from "@/components/ui/Seperator"

export function ChildrenSummary() {
    const children = [
        {
            id: "child1",
            name: "Alex",
            team: "Team Alpha",
            pendingPayments: 2,
            paidPayments: 1,
            totalDue: 750,
            paymentRate: 33,
        },
        {
            id: "child2",
            name: "Sam",
            team: "Team Beta",
            pendingPayments: 2,
            paidPayments: 1,
            totalDue: 400,
            paymentRate: 33,
        },
    ]

    return (
        <div className="space-y-6">
            {children.map((child) => (
                <div key={child.id} className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src="/placeholder.svg" />
                            <AvatarFallback>{child.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="font-medium">{child.name}</div>
                            <div className="text-sm text-muted-foreground">{child.team}</div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="grid grid-cols-2 text-sm">
                            <span className="text-muted-foreground">Pending Payments:</span>
                            <span>{child.pendingPayments}</span>
                        </div>
                        <div className="grid grid-cols-2 text-sm">
                            <span className="text-muted-foreground">Total Due:</span>
                            <span>${child.totalDue}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span>Payment Rate</span>
                            <span>{child.paymentRate}%</span>
                        </div>
                        <Progress value={child.paymentRate} className="h-2" />
                    </div>

                    {children.indexOf(child) < children.length - 1 && <Separator className="my-2" />}
                </div>
            ))}
        </div>
    )
}
