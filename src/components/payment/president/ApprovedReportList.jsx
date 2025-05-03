"use client"

import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import { FileText, ArrowRight } from "lucide-react"

export function ApprovedReportsList({approvedReports}) {
    // const approvedReports = [
    //     {
    //         id: "120",
    //         team: "Team Alpha",
    //         title: "February 2025 Expenses",
    //         amount: 1450000,
    //         date: "March 5, 2025",
    //         approvedDate: "March 7, 2025",
    //         status: "approved",
    //     },
    //     {
    //         id: "121",
    //         team: "Team Beta",
    //         title: "February 2025 Expenses",
    //         amount: 1100000,
    //         date: "March 8, 2025",
    //         approvedDate: "March 10, 2025",
    //         status: "approved",
    //     },
    //     {
    //         id: "122",
    //         team: "Team Delta",
    //         title: "February 2025 Expenses",
    //         amount: 1300000,
    //         date: "March 12, 2025",
    //         approvedDate: "March 14, 2025",
    //         status: "approved",
    //     },
    // ]

    function formatTienVN(number) {
        return number.toLocaleString('vi-VN');
    }

    return (
        <div className="space-y-4">
            {approvedReports.map((report) => (
                <div key={report.teamFundId} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-full">
                            <FileText className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                            <div className="font-medium">
                                {report.teamName} - {report.description}
                            </div>
                            <div className="text-sm text-muted-foreground">Duyệt vào ngày {report.approvedDate}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className="font-medium">{formatTienVN(parseInt(report.totalExpenditure, 10))}</div>
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                                Đã duyệt
                            </Badge>
                        </div>
                        <Link href={`/payment/${report.teamFundId}`}>
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
