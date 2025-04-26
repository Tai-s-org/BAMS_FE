"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/Dialog"
import { Separator } from "@/components/ui/Seperator"
import { Badge } from "@/components/ui/Badge"
import { Textarea } from "@/components/ui/Textarea"
import Link from "next/link"
import { ArrowLeft, CheckCircle, FileText, DollarSign, Users, Coins } from "lucide-react"
import teamFundApi from "@/api/teamFund"

export default function PresidentReportDetail({ id }) {
    const [isApproved, setIsApproved] = useState(false)
    const [isRejected, setIsRejected] = useState(false)
    const [comment, setComment] = useState("")
    const [teamFund, setTeamFund] = useState();
    const [expenseItems, setExpenseItems] = useState([])

    const fetchExpenseItems = async () => {
        try {
            const response = await teamFundApi.listExpenditure(id);
            console.log("Fetched expense items:", response.data);

            setExpenseItems(response.data.data.items)

            const teamFundResponse = await teamFundApi.teamFundById(id);
            console.log("Fetched teamFund:", teamFundResponse.data.data);
            setTeamFund(teamFundResponse.data.data[0])
        } catch (error) {
            console.error("Error fetching expense items:", error)
        }
    }

    useEffect(() => {
        fetchExpenseItems();
    }, [id])

    const handleApprove = async (id) => {
        try {
            const response = await teamFundApi.approveTeamFund({
                "teamFundId": id,
            })
            fetchExpenseItems()
        } catch (err) {

        }
        setIsApproved(true)
        setIsRejected(false)
    }

    const handleReject = () => {
        setIsRejected(true)
        setIsApproved(false)
    }

    function formatTienVN(number) {
        return number != null ? number.toLocaleString('vi-VN') : "";
    }

    return (
        <div className="container mx-auto py-6">
            <div className="flex items-center mb-6">
                <Link href="/dashboard/payment">
                    <Button variant="ghost" size="sm" className="gap-1">
                        <ArrowLeft className="h-4 w-4" /> Quay trở lại thống kê
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold ml-4">Báo cáo quỹ đội #{id}</h1>
                {teamFund?.status === 1 && <Badge className="ml-4 bg-green-500">Đã duyệt</Badge>}
                {teamFund?.status === 0 && <Badge className="ml-4 bg-yellow-500">Chưa duyệt</Badge>}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                {teamFund?.teamName} - {teamFund?.description}
                            </CardTitle>
                            <CardDescription>Hoàn thành bởi quản lý Hoàng Trung Hiếu vào ngày {teamFund?.endDate}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-medium mb-2">Mô tả</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Báo cáo chi phí hàng tháng cho {teamFund?.teamName} bao gồm chi phí thiết bị, đào tạo và đi lại.
                                    </p>
                                </div>

                                <Separator />

                                <div>
                                    <h3 className="font-medium mb-2">Danh mục chi tiêu</h3>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-12 text-sm">
                                            <div className="font-medium col-span-4">Danh mục</div>
                                            <div className="font-medium text-right col-span-3">Số tiền</div>
                                            <div className="col-span-1"></div>
                                            <div className="font-medium">Ngày </div>
                                        </div>

                                        <Separator />

                                        {expenseItems.map((item, index) => (
                                            <div key={index}>
                                                <div className="grid grid-cols-12 text-sm">
                                                    <div className="col-span-4">{item.name}</div>
                                                    <div className="text-right col-span-3">{formatTienVN(item.amount)} VNĐ</div>
                                                    <div className="col-span-1"></div>
                                                    <div className="font-medium">{item.payoutDate} </div>
                                                </div>
                                                <Separator />
                                            </div>
                                        ))}

                                        <div className="grid grid-cols-12 text-sm font-medium">
                                            <div className="col-span-4">Tổng</div>
                                            <div className="text-right col-span-3">
                                                {formatTienVN(parseInt(teamFund?.totalExpenditure))} VNĐ
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <Separator />

                                {/* <div>
                                    <h3 className="font-medium mb-2">Team Members (4)</h3>
                                    <p className="text-sm text-muted-foreground">Each member will be charged $400 after approval.</p>
                                </div> */}

                                <Separator />
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <div className="space-x-2">
                                {teamFund?.status === 0 && (
                                    <>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="destructive">Từ chối</Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Từ chối báo cáo chi phí</DialogTitle>
                                                    <DialogDescription>
                                                        Bạn có chắc chắn muốn từ chối báo cáo chi phí này không?
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <DialogFooter>
                                                    <Button variant="outline" onClick={() => { }}>
                                                        Hủy
                                                    </Button>
                                                    <Button variant="destructive" onClick={handleReject}>
                                                        Xác nhận
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>

                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button>Phê duyệt</Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Phê duyệt báo cáo chi phí</DialogTitle>
                                                    <DialogDescription>
                                                        Bạn có chắc chắn muốn chấp thuận báo cáo chi phí này không?
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <DialogFooter>
                                                    <Button variant="outline" onClick={() => { }}>
                                                        Hủy
                                                    </Button>
                                                    <Button onClick={() => handleApprove(teamFund.teamFundId)}>Xác nhận</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </>
                                )}

                                {(teamFund?.status === 1) && (
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setIsApproved(false)
                                            setIsRejected(false)
                                            setComment("")
                                        }}
                                    >
                                        Đặt lại trạng thái
                                    </Button>
                                )}
                            </div>
                        </CardFooter>
                    </Card>
                </div>

                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Thông tin báo cáo</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{teamFund?.teamName}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Coins className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{formatTienVN(parseInt(teamFund?.totalExpenditure))} VNĐ</span>
                                </div>
                                {teamFund?.status === 1 ? (
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span className="text-sm">Trạng thái: Đã duyệt</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-yellow-500" />
                                        <span className="text-sm">Trạng thái: Chưa duyệt</span>
                                    </div>
                                )}


                                <Separator />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
