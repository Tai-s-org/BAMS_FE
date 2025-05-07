"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/Dialog"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Separator } from "@/components/ui/Seperator"
import { Badge } from "@/components/ui/Badge"
import { Textarea } from "@/components/ui/Textarea"
import Link from "next/link"
import { ArrowLeft, CheckCircle, FileText, Users, BanknoteIcon, XCircle, Calendar, Clock } from "lucide-react"
import teamFundApi from "@/api/teamFund"
import { useToasts } from "@/hooks/providers/ToastProvider"
import { Label } from "@/components/ui/Label"

export default function PresidentReportDetail({ id }) {
    const [isApproved, setIsApproved] = useState(false)
    const [isRejected, setIsRejected] = useState(false)
    const [comment, setComment] = useState("")
    const [teamFund, setTeamFund] = useState();
    const [expenseItems, setExpenseItems] = useState([])
    const { addToast } = useToasts()

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
        console.log(id);
        try {
            const response = await teamFundApi.approveTeamFund({
                "teamFundId": id,
            })
            console.log(response);
            fetchExpenseItems()
            addToast({ message: response.data.message, type: "success" })
        } catch (err) {
            addToast({ message: err?.response.data.message, type: "error" })
            console.error("Error approving team fund:", err)
        }
        // setIsApproved(true)
        // setIsRejected(false)
    }

    const handleReject = async (id, note) => {
        console.log("id: ", id, note);
        try {
            const response = await teamFundApi.rejectTeamFund({
                "teamFundId": id,
                "reasonReject": note
            })
            console.log(response);
            addToast({ message: response.data.message, type: "success" })
            fetchExpenseItems()
        } catch (err) {
            addToast({ message: err?.response.data.message, type: "error" })
            console.error("Error approving team fund:", err)
        }
    }

    function formatTienVN(number) {
        return number != null ? number.toLocaleString('vi-VN') : "";
    }

    const formatDate = (dateString) => {
        if (!dateString) return "-"
        const date = new Date(dateString)
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })
    }

    return (
        <div className="container mx-auto py-6">
            <div className="flex items-center mb-6">
                <Link href="/payment">
                    <Button variant="ghost" size="sm" className="gap-1 hover:bg-[#F4F4F5]">
                        <ArrowLeft className="h-4 w-4" /> Quay trở lại thống kê
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold ml-4">Báo cáo quỹ đội #{id}</h1>
                {teamFund?.status === 1 && <Badge className="ml-4 bg-green-500 text-white">Đã duyệt</Badge>}
                {teamFund?.status === 0 && <Badge className="ml-4 bg-yellow-500 text-white">Chưa duyệt</Badge>}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                {teamFund?.teamName} - {teamFund?.description}
                            </CardTitle>
                            <CardDescription>Hoàn thành bởi quản lý <span className="font-bold">{teamFund?.managerName}</span> vào ngày {formatDate(teamFund?.endDate)}</CardDescription>
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
                                    <div className="rounded-lg border overflow-hidden">
                                        <Table>
                                            <TableHeader className="bg-slate-50">
                                                <TableRow>
                                                    <TableHead className="w-5/12">Danh mục</TableHead>
                                                    <TableHead className="w-3/12 text-right">Số tiền</TableHead>
                                                    <TableHead className="w-4/12">Ngày chi tiêu</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {expenseItems.map((item, index) => (
                                                    <TableRow key={index} className="hover:bg-slate-50">
                                                        <TableCell className="font-medium">{item.name}</TableCell>
                                                        <TableCell className="text-right font-medium">{formatTienVN(item.amount)} VNĐ</TableCell>
                                                        <TableCell>{formatDate(item?.payoutDate)}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                            <TableFooter>
                                                <TableRow className="bg-slate-50">
                                                    <TableCell className="font-bold">Tổng</TableCell>
                                                    <TableCell className="text-right font-bold">
                                                        {formatTienVN(Number.parseInt(teamFund?.totalExpenditure))} VNĐ
                                                    </TableCell>
                                                    <TableCell></TableCell>
                                                </TableRow>
                                            </TableFooter>
                                        </Table>
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
                                                <Button variant="destructive" className="gap-1">
                                                    <XCircle className="h-4 w-4" /> Từ chối
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-md">
                                                <DialogHeader>
                                                    <DialogTitle>Từ chối báo cáo chi phí</DialogTitle>
                                                    <DialogDescription>
                                                        Bạn có chắc chắn muốn từ chối báo cáo chi phí này không?
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="py-4">
                                                    <Label htmlFor="comment" className="text-sm font-medium mb-2 block">
                                                        Lý do từ chối (tùy chọn)
                                                    </Label>
                                                    <Textarea
                                                        id="comment"
                                                        value={comment}
                                                        onChange={(e) => setComment(e.target.value)}
                                                        placeholder="Nhập lý do từ chối báo cáo này..."
                                                        className="w-full min-h-[100px]"
                                                    />
                                                </div>
                                                <DialogFooter>
                                                    <Button variant="outline" onClick={() => { }}>
                                                        Hủy
                                                    </Button>
                                                    <Button variant="destructive" onClick={() => handleReject(teamFund.teamFundId, comment)}>
                                                        Xác nhận từ chối
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>

                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button className="gap-1 bg-green-600 hover:bg-green-700">
                                                    <CheckCircle className="h-4 w-4" /> Phê duyệt
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-md">
                                                <DialogHeader>
                                                    <DialogTitle>Phê duyệt báo cáo chi phí</DialogTitle>
                                                    <DialogDescription>
                                                        Bạn có chắc chắn muốn chấp thuận báo cáo chi phí này không?
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="py-4">
                                                    <div className="bg-slate-50 p-3 rounded-md border mb-4">
                                                        <p className="text-sm font-medium mb-1">Tổng chi phí</p>
                                                        <p className="text-lg font-bold text-green-600">
                                                            {formatTienVN(Number.parseInt(teamFund?.totalExpenditure))} VNĐ
                                                        </p>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">
                                                        Khi phê duyệt, tất cả thành viên trong đội sẽ nhận được thông báo thanh toán.
                                                    </p>
                                                </div>
                                                <DialogFooter>
                                                    <Button variant="outline" onClick={() => { }}>
                                                        Hủy
                                                    </Button>
                                                    <Button
                                                        className="bg-green-600 hover:bg-green-700"
                                                        onClick={() => handleApprove(teamFund.teamFundId)}
                                                    >
                                                        Xác nhận phê duyệt
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </>
                                )}
                            </div>
                        </CardFooter>
                    </Card>
                </div>

                <div>
                    {/* <Card>
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
                    </Card> */}
                    <Card className="shadow-sm">
                        <CardHeader className="bg-slate-50 border-b">
                            <CardTitle>Thông tin báo cáo</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-md border">
                                    <div className="bg-blue-100 p-2 rounded-full">
                                        <Users className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium">Đội</div>
                                        <div className="font-medium">{teamFund?.teamName}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-md border">
                                    <div className="bg-green-100 p-2 rounded-full">
                                        <BanknoteIcon className="h-4 w-4 text-green-600" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium">Tổng chi phí</div>
                                        <div className="text-lg font-bold">
                                            {formatTienVN(Number.parseInt(teamFund?.totalExpenditure))} VNĐ
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 rounded-md border">
                                    <div className="bg-slate-100 p-2 rounded-full">
                                        <Calendar className="h-4 w-4 text-slate-600" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium">Ngày hoàn thành</div>
                                        <div className="font-medium">{formatDate(teamFund?.endDate)}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 rounded-md border">
                                    {teamFund?.status === 1 ? (
                                        <>
                                            <div className="bg-green-100 p-2 rounded-full">
                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium">Trạng thái</div>
                                                <div className="text-green-600 font-medium">Đã duyệt</div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="bg-yellow-100 p-2 rounded-full">
                                                <Clock className="h-4 w-4 text-yellow-600" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium">Trạng thái</div>
                                                <div className="text-yellow-600 font-medium">Chưa duyệt</div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <Separator />

                                {teamFund?.status === 1 && (
                                    <div className="bg-green-50 border border-green-200 p-4 rounded-md">
                                        <div className="flex items-center gap-2 mb-2">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                            <h3 className="text-sm font-medium text-green-700">Đã phê duyệt</h3>
                                        </div>
                                        <p className="text-sm text-green-600">
                                            Tất cả các khoản chi phí đều hợp lệ và nằm trong ngân sách. Báo cáo đã được phê duyệt.
                                        </p>
                                    </div>
                                )}

                                {teamFund?.status === 0 && (
                                    <div className="p-4 bg-yellow-50 rounded-md border border-yellow-200">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Clock className="h-4 w-4 text-yellow-600" />
                                            <h3 className="text-sm font-medium text-yellow-700">Đang chờ phê duyệt</h3>
                                        </div>
                                        <p className="text-xs text-yellow-600">
                                            Báo cáo này đang chờ bạn phê duyệt. Sau khi phê duyệt, các thành viên trong đội sẽ nhận được thông
                                            báo thanh toán.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
