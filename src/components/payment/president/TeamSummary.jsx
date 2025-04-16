"use client"

import { Badge } from "@/components/ui/Badge"
import { Progress } from "@/components/ui/Progress"
import { Users } from "lucide-react"

export function TeamSummary() {
    const teams = [
        {
            id: "team1",
            name: "Team Alpha",
            members: 4,
            paymentRate: 75,
            totalExpenses: 1600,
        },
        {
            id: "team2",
            name: "Team Beta",
            members: 4,
            paymentRate: 100,
            totalExpenses: 1200,
        },
        {
            id: "team3",
            name: "Team Gamma",
            members: 3,
            paymentRate: 33,
            totalExpenses: 950,
        },
        {
            id: "team4",
            name: "Team Delta",
            members: 4,
            paymentRate: 100,
            totalExpenses: 1300,
        },
        {
            id: "team5",
            name: "Team Epsilon",
            members: 3,
            paymentRate: 67,
            totalExpenses: 900,
        },
    ]

    return (
        <div className="space-y-4">
            {teams.map((team) => (
                <div key={team.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground text-[#94949B]" />
                            <span className="font-semibold">{team.name}</span>
                        </div>
                        <Badge variant="outline">{team.members} members</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span>Payment Rate</span>
                        <span>{team.paymentRate}%</span>
                    </div>
                    <Progress value={team.paymentRate} className="h-2" />
                    <div className="text-sm text-muted-foreground text-[#94949B]">Total Expenses: ${team.totalExpenses}</div>
                </div>
            ))}
        </div>
    )
}
