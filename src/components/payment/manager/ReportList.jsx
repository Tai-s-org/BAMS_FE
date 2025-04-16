"use client"

import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { FileText, ArrowRight } from "lucide-react"

export function ReportsList() {
    const reports = [
        {
            id: "123",
            title: "March 2025 Expenses",
            amount: 1600,
            date: "April 10, 2025",
            status: "pending",
        },
        {
            id: "120",
            title: "February 2025 Expenses",
            amount: 1450,
            date: "March 5, 2025",
            status: "approved",
        },
        {
            id: "117",
            title: "January 2025 Expenses",
            amount: 1350,
            date: "February 8, 2025",
            status: "approved",
        },
    ]

    return (
        <div className="space-y-4">
            {reports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-full">
                            <FileText className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                            <div className="font-medium">{report.title}</div>
                            <div className="text-sm text-muted-foreground">Submitted on {report.date}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className="font-medium">${report.amount}</div>
                            <Badge
                                variant="outline"
                                className={report.status === "approved" ? "bg-green-50 text-green-700" : "bg-yellow-50"}
                            >
                                {report.status === "approved" ? "Approved" : "Pending"}
                            </Badge>
                        </div>
                        <Button variant="ghost" size="icon">
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    )
}
