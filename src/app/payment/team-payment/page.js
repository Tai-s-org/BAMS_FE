"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Filter, Eye, FileText, CreditCard, Clock, CheckCircle, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { Badge } from "@/components/ui/Badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/Dialog"
import { useAuth } from "@/hooks/context/AuthContext"
import paymentApi from "@/api/payment"
import teamFundApi from "@/api/teamFund"

export default function ManagerPayments() {
    const [selectedPayment, setSelectedPayment] = useState(null)
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)
    const [showReceiptDialog, setShowReceiptDialog] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const { userInfo } = useAuth()
    const [payments, setPayments] = useState([])
    const teamId = userInfo?.roleInformation.teamId

    const fetchManagerInfo = async () => {
        if (!teamId) return

        setIsLoading(true)
        try {
            const paymentsResponse = await paymentApi.getPaymentHistoryByTeam(teamId)
            setPayments(paymentsResponse.data.data.items || [])
        } catch (error) {
            console.error("Error fetching manager info:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchManagerInfo()
    }, [teamId])

    const pendingPayments = payments.filter((payment) => payment.status === 0 || payment.status === 3)
    const confirmedPayments = payments.filter((payment) => payment.status === 1)
    const overduePayments = payments.filter((payment) => payment.status === 2)

    const handleConfirmPayment = async () => {
        try {
            await teamFundApi.updatePaymentStatus({
                paymentId: selectedPayment.paymentId,
                status: 1,
            })
            await fetchManagerInfo()
        } catch (error) {
            console.error("Error confirming payment:", error)
        }
        setShowConfirmDialog(false)
    }

    const viewReceipt = async (paymentId) => {
        try {
            const response = await paymentApi.getPaymentDetail(paymentId)
            setSelectedPayment(response.data.data)
            setShowReceiptDialog(true)
        } catch (error) {
            console.error("Error fetching receipt:", error)
        }
    }

    const confirmPayment = (payment) => {
        setSelectedPayment(payment)
        setShowConfirmDialog(true)
    }

    function formatTienVN(number) {
        return number != null ? number.toLocaleString("vi-VN") : ""
    }

    const formatDate = (dateString) => {
        if (!dateString) return "N/A"
        const date = new Date(dateString)
        return date.toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        })
    }

    const getStatusBadge = (status) => {
        switch (status) {
            case 1:
                return (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Đã xác nhận
                    </Badge>
                )
            case 3:
                return (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        Đã thanh toán (Chưa xác nhận)
                    </Badge>
                )
            case 2:
                return (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        Quá hạn
                    </Badge>
                )
            default:
                return (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        Chưa thanh toán
                    </Badge>
                )
        }
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case 1:
                return <CheckCircle className="h-5 w-5 text-green-500" />
            case 3:
                return <Clock className="h-5 w-5 text-blue-500" />
            case 2:
                return <AlertTriangle className="h-5 w-5 text-red-500" />
            default:
                return <CreditCard className="h-5 w-5 text-yellow-500" />
        }
    }

    const renderPaymentList = (payments) => (
        <div className="space-y-4">
            {isLoading ? (
                <div className="flex justify-center py-8">
                    <div className="animate-pulse space-y-4 w-full">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-24 bg-gray-100 rounded-lg"></div>
                        ))}
                    </div>
                </div>
            ) : payments.length === 0 ? (
                <div className="text-center py-12 border rounded-lg bg-gray-50">
                    <div className="flex justify-center mb-4">
                        <CreditCard className="h-12 w-12 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-700">Hiện không có thanh toán</h3>
                    <p className="text-sm text-muted-foreground mt-1">Các thanh toán sẽ xuất hiện ở đây khi có</p>
                </div>
            ) : (
                payments.map((payment) => (
                    <Card key={payment.paymentId} className="overflow-hidden hover:shadow-md transition-shadow duration-200">
                        <CardContent className="p-0">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-4">
                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                    <Avatar className="h-10 w-10 border">
                                        <AvatarImage src="/placeholder.svg" />
                                        <AvatarFallback className="bg-primary/10 text-primary">
                                            {payment?.player
                                                ?.split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-medium flex items-center gap-2">
                                            {payment.fullname}
                                            {getStatusIcon(payment.status)}
                                        </div>
                                        <div className="text-sm text-muted-foreground line-clamp-1">{payment.note}</div>
                                        <div className="text-xs text-muted-foreground mt-1">
                                            {payment.status === 1 || payment.status === 3
                                                ? `Đã thanh toán: ${formatDate(payment.paidDate)}`
                                                : payment.status === 0
                                                    ? `Hạn thanh toán: ${formatDate(payment.dueDate)}`
                                                    : `Quá hạn: ${formatDate(payment.dueDate)}`}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                                    <div className="text-right">
                                        <div className="font-medium text-lg">{formatTienVN(payment.totalAmount)} VNĐ</div>
                                        <div className="mt-1">{getStatusBadge(payment.status)}</div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => viewReceipt(payment.paymentId)}
                                            className="h-9 px-3"
                                        >
                                            <Eye className="h-4 w-4 mr-1" />
                                            <span className="hidden sm:inline">Chi tiết</span>
                                        </Button>
                                        {(payment.status === 3 || payment.status === 0) && (
                                            <Button
                                                size="sm"
                                                onClick={() => confirmPayment(payment)}
                                                className="h-9 px-3 bg-green-600 hover:bg-green-700"
                                            >
                                                <CheckCircle className="h-4 w-4 mr-1" />
                                                <span className="hidden sm:inline">Xác nhận</span>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))
            )}
        </div>
    )

    return (
        <div className="container mx-auto py-6 px-4 sm:px-6">
            <div className="flex items-center mb-6">
                <Link href="/payment">
                    <Button variant="ghost" size="sm" className="gap-1 hover:bg-[#F4F4F5]">
                        <ArrowLeft className="h-4 w-4" /> Quay lại
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold ml-4">Thanh toán của đội</h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="bg-white hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-primary" />
                            Tổng số thanh toán
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{payments.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">Tất cả các thanh toán</p>
                    </CardContent>
                </Card>

                <Card className="bg-white hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Clock className="h-4 w-4 text-yellow-500" />
                            Chưa thanh toán/xác nhận
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{pendingPayments.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">Cần xác nhận</p>
                    </CardContent>
                </Card>

                <Card className="bg-white hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            Đã xác nhận
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{confirmedPayments.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">Hoàn thành</p>
                    </CardContent>
                </Card>

                <Card className="bg-white hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                            Quá hạn
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{overduePayments.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">Cần xử lý</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-white shadow-sm">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <CardTitle className="text-xl">Thanh toán của cả đội</CardTitle>
                            <CardDescription>Theo dõi và xác nhận thanh toán từ các thành viên trong đội của bạn</CardDescription>
                        </div>
                        <div className="flex gap-2 items-center w-full sm:w-auto">
                            <Select defaultValue="all">
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <SelectValue placeholder="Lọc theo báo cáo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả</SelectItem>
                                    <SelectItem value="march-2025">Chi phí tháng 3/2025</SelectItem>
                                    <SelectItem value="february-2025">Chi phí tháng 2/2025</SelectItem>
                                    <SelectItem value="equipment">Nâng cấp thiết bị</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="pending" className="w-full">
                        <TabsList className="mb-4 flex">
                            <TabsTrigger value="pending" >
                                <Clock className="h-4 w-4" />
                                <span>Chưa xác nhận</span>
                                <Badge variant="secondary" className="ml-1">
                                    {pendingPayments.length}
                                </Badge>
                            </TabsTrigger>
                            <TabsTrigger value="confirmed" >
                                <CheckCircle className="h-4 w-4" />
                                <span>Đã xác nhận</span>
                                <Badge variant="secondary" className="ml-1">
                                    {confirmedPayments.length}
                                </Badge>
                            </TabsTrigger>
                            <TabsTrigger value="overdue" >
                                <AlertTriangle className="h-4 w-4" />
                                <span>Quá hạn</span>
                                <Badge variant="secondary" className="ml-1">
                                    {overduePayments.length}
                                </Badge>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="pending">{renderPaymentList(pendingPayments)}</TabsContent>
                        <TabsContent value="confirmed">{renderPaymentList(confirmedPayments)}</TabsContent>
                        <TabsContent value="overdue">{renderPaymentList(overduePayments)}</TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            {/* Confirm Payment Dialog */}
            <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            Xác nhận thanh toán
                        </DialogTitle>
                        <DialogDescription>Xác nhận thanh toán này sẽ đánh dấu nó là đã hoàn thành</DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                            <div className="grid grid-cols-2 gap-1">
                                <div className="text-sm text-muted-foreground">Người thanh toán:</div>
                                <div className="text-sm font-medium">{selectedPayment?.fullname}</div>
                            </div>
                            <div className="grid grid-cols-2 gap-1">
                                <div className="text-sm text-muted-foreground">Số tiền:</div>
                                <div className="text-sm font-medium">{formatTienVN(selectedPayment?.totalAmount)} VNĐ</div>
                            </div>
                            <div className="grid grid-cols-2 gap-1">
                                <div className="text-sm text-muted-foreground">Ngày thanh toán:</div>
                                <div className="text-sm font-medium">{formatDate(selectedPayment?.paidDate)}</div>
                            </div>
                            <div className="grid grid-cols-2 gap-1">
                                <div className="text-sm text-muted-foreground">Ghi chú:</div>
                                <div className="text-sm">{selectedPayment?.note || "Không có ghi chú"}</div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="sm:justify-between">
                        <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                            Hủy
                        </Button>
                        <Button onClick={handleConfirmPayment} className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Xác nhận thanh toán
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* View Receipt Dialog */}
            <Dialog open={showReceiptDialog} onOpenChange={setShowReceiptDialog}>
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Chi tiết thanh toán
                        </DialogTitle>
                        <DialogDescription asChild>
                            <div className="flex items-center flex-wrap gap-2">
                                <span>{selectedPayment?.note}</span>
                                {selectedPayment?.status === 1 && <Badge className="bg-green-500">Đã thanh toán</Badge>}
                                {selectedPayment?.status === 0 && <Badge className="bg-yellow-500">Chưa thanh toán</Badge>}
                                {selectedPayment?.status === 2 && <Badge className="bg-red-500">Quá hạn</Badge>}
                                {selectedPayment?.status === 3 && <Badge className="bg-blue-500">Đã thanh toán (Chờ xác nhận)</Badge>}
                            </div>

                        </DialogDescription>
                    </DialogHeader>

                    {/* <ScrollArea className="flex-1 pr-4 -mr-4"> */}<div className="flex-1 overflow-y-auto pr-4 -mr-4">
                        <div className="py-2 space-y-6">
                            {/* Payment Items */}
                            <div>
                                <h3 className="font-medium mb-3 text-lg flex items-center">
                                    <CreditCard className="h-4 w-4 mr-2" />
                                    Danh mục thanh toán
                                </h3>
                                <Card>
                                    <CardContent className="p-0">
                                        <div className="grid grid-cols-12 text-sm font-medium p-3 bg-gray-50 border-b">
                                            <div className="col-span-4">Danh mục</div>
                                            <div className="col-span-2 text-right">Số tiền</div>
                                            <div className="col-span-1"></div>
                                            <div className="col-span-5">Ghi chú</div>
                                        </div>

                                        {selectedPayment?.paymentItems?.map((item) => (
                                            <div key={item.paymentItemId} className="grid grid-cols-12 text-sm p-3 border-b last:border-0">
                                                <div className="col-span-4 font-medium">{item.paidItemName}</div>
                                                <div className="col-span-2 text-right">{formatTienVN(item.amount)} VNĐ</div>
                                                <div className="col-span-1"></div>
                                                <div className="col-span-5 text-muted-foreground">{item.note || "—"}</div>
                                            </div>
                                        ))}

                                        <div className="grid grid-cols-12 text-sm font-medium p-3 bg-gray-50 border-t">
                                            <div className="col-span-4">Tổng</div>
                                            <div className="col-span-2 text-right font-bold">
                                                {formatTienVN(selectedPayment?.totalAmount)} VNĐ
                                            </div>
                                            <div className="col-span-5"></div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Payment Details */}
                            <div>
                                <h3 className="font-medium mb-3 text-lg flex items-center">
                                    <FileText className="h-4 w-4 mr-2" />
                                    Chi tiết thanh toán
                                </h3>
                                <Card>
                                    <CardContent className="p-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-3">
                                                <div>
                                                    <div className="text-sm text-muted-foreground mb-1">Người thanh toán</div>
                                                    <div className="font-medium">{selectedPayment?.fullname}</div>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-muted-foreground mb-1">Đội</div>
                                                    <div className="font-medium">{selectedPayment?.teamName}</div>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-muted-foreground mb-1">Phương thức thanh toán</div>
                                                    <div className="font-medium">
                                                        {selectedPayment?.paymentMethod === 1
                                                            ? "Thanh toán bằng mã QR thủ công"
                                                            : selectedPayment?.paymentMethod === 2
                                                                ? "Thanh toán bằng tiền mặt"
                                                                : "Thanh toán bằng mã QR tự động"}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <div>
                                                    <div className="text-sm text-muted-foreground mb-1">Ngày thanh toán</div>
                                                    <div className="font-medium">{formatDate(selectedPayment?.paidDate)}</div>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-muted-foreground mb-1">Hạn thanh toán</div>
                                                    <div className="font-medium">{formatDate(selectedPayment?.dueDate)}</div>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-muted-foreground mb-1">Số tiền</div>
                                                    <div className="font-medium text-lg">{formatTienVN(selectedPayment?.totalAmount)} VNĐ</div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    {/* </ScrollArea> */} </div>

                    <DialogFooter className="mt-4 pt-4 border-t">
                        <Button variant="outline" onClick={() => setShowReceiptDialog(false)}>
                            Đóng
                        </Button>
                        {(selectedPayment?.status === 3 || selectedPayment?.status === 0) && (
                            <Button
                                onClick={() => {
                                    setShowReceiptDialog(false)
                                    confirmPayment(selectedPayment)
                                }}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Xác nhận thanh toán
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

