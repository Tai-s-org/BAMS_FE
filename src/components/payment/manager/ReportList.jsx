"use client"

import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { FileText, ArrowRight } from "lucide-react"
import Link from "next/link"

export function ReportsList({ reports }) {



    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })
    }

    function formatTienVN(number) {
        return number != null ? number.toLocaleString('vi-VN') : "";
    }

    // const reports = [
    //     {
    //         id: "123",
    //         title: "March 2025 Expenses",
    //         amount: 1600000,
    //         date: "April 10, 2025",
    //         status: "pending",
    //     },
    //     {
    //         id: "120",
    //         title: "February 2025 Expenses",
    //         amount: 1450000,
    //         date: "March 5, 2025",
    //         status: "approved",
    //     },
    //     {
    //         id: "117",
    //         title: "January 2025 Expenses",
    //         amount: 1350000,
    //         date: "February 8, 2025",
    //         status: "approved",
    //     },
    // ]

    return (
        <div className="space-y-4">
            {reports.map((report) => (
                <div key={report.teamFundId} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-full">
                            <FileText className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                            <div className="font-medium">{report.description}</div>
                            <div className="text-sm text-muted-foreground">Hoàn thành vào ngày {report.endDate}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className="font-medium">{formatTienVN(parseInt(report.totalExpenditure,10))} VNĐ</div>
                            <Badge
                                variant="outline"
                                className={report.status === 1 ? "bg-green-50 text-green-700" : "bg-yellow-50"}
                            >
                                {report.status === 1 ? "Đã duyệt" : "Chưa duyệt"}
                            </Badge>
                        </div>
                        <Link href={`/dashboard/payment/${report.teamFundId}`} className="text-blue-500 hover:underline">
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
