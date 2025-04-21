"use client"

import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import { FileText, ArrowRight } from "lucide-react"

export function PendingReportsList ({pendingReports}) {
    // const pendingReports = [
    //     {
    //         id: "123",
    //         team: "Team Alpha",
    //         title: "March 2025 Expenses",
    //         amount: 1600,
    //         date: "April 10, 2025",
    //         status: "pending",
    //     },
    //     {
    //         id: "124",
    //         team: "Team Beta",
    //         title: "March 2025 Expenses",
    //         amount: 1200,
    //         date: "April 12, 2025",
    //         status: "pending",
    //     },
    //     {
    //         id: "125",
    //         team: "Team Gamma",
    //         title: "March 2025 Expenses",
    //         amount: 950,
    //         date: "April 14, 2025",
    //         status: "pending",
    //     },
    // ]

    return (
        <div className="space-y-4">
            {pendingReports.map((report) => (
                <div key={report.teamFundId} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-full">
                            <FileText className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                            <div className="font-medium">
                                {report.teamName} - {report.description}
                            </div>
                            <div className="text-sm text-[#94949B]">Hoàn thành ngày: {report.endDate}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className="font-medium">{report.amount} VNĐ</div>
                            <Badge variant="outline" className="bg-yellow-50">
                                Chờ xét duyệt
                            </Badge>
                        </div>
                        <Link href={`/dashboard/payment/${report.teamFundId}`}>
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
