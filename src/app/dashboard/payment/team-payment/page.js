"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { Badge } from "@/components/ui/Badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Separator } from "@/components/ui/Seperator"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/Dialog"
import Link from "next/link"
import { ArrowLeft, Filter, Eye, FileText } from "lucide-react"
import { useAuth } from "@/hooks/context/AuthContext"
import paymentApi from "@/api/payment"
import teamFundApi from "@/api/teamFund"


export default function ManagerPayments() {
    const [selectedPayment, setSelectedPayment] = useState(null)
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)
    const [showReceiptDialog, setShowReceiptDialog] = useState(false)
    const { userInfo } = useAuth();
    const [payments, setPayments] = useState([]);
    const teamId = userInfo?.roleInformation.teamId;

    const fetchManagerInfo = async () => {
        console.log("teamId:", teamId);

        if (!teamId) return; // Guard clause
        try {
            const paymentsResponse = await paymentApi.getPaymentHistoryByTeam(teamId);
            console.log("Fetched payment data:", paymentsResponse.data);
            //if (Array.isArray(paymentsResponse?.data?.data?.items)) {
            setPayments(paymentsResponse.data.data.items);
            //} else {
            // setPayments([])
            //}

        } catch (error) {
            console.error('Error fetching manager info:', error);
        }
    };

    useEffect(() => {
        fetchManagerInfo();
    }, [teamId]);

    const pendingPayments = payments.filter((payment) => payment.status === 0 || payment.status === 3)
    const confirmedPayments = payments?.filter((payment) => payment.status === 1)
    const overduePayments = payments?.filter((payment) => payment.status === 2)

    const handleConfirmPayment = async () => {
            try {
                const response = await teamFundApi.updatePaymentStatus({
                        "paymentId": selectedPayment.paymentId,
                        "status": 1
                })
            } catch (error) {
                console.error('Error confirming payment:', error)
            }
        fetchManagerInfo();
        setShowConfirmDialog(false)
        // For demo purposes, we'll just close the dialog
    }

    const viewReceipt = async (paymentId) => {
        try {
            const response = await paymentApi.getPaymentDetail(paymentId);
            console.log("Fetched receipt data:", response.data);
            setSelectedPayment(response.data.data)
        } catch (error) {
            console.error('Error fetching receipt:', error)
        }

        setShowReceiptDialog(true)
    }

    const confirmPayment = (payment) => {
        setSelectedPayment(payment)
        setShowConfirmDialog(true)
    }

    function formatTienVN(number) {
        return number != null ? number.toLocaleString('vi-VN') : "";
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false // dùng 24h format
        });
    };

    const renderPaymentList = (payments) => (
        <div className="space-y-4">
            {payments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">Hiện không có thanh toán</div>
            ) : (
                payments.map((payment) => (
                    <div key={payment.paymentId} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarImage src="/placeholder.svg" />
                                <AvatarFallback>
                                    {payment?.player
                                        ?.split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="font-medium">Thanh toán {payment.paymentId} bởi {payment.fullname}</div>
                                <div className="text-sm text-muted-foreground">{payment.note}</div>
                                <div className="text-xs text-muted-foreground">
                                    {payment.status === 1 || payment.status === 3
                                        ? `Đã thanh toán: ${formatDate(payment.paidDate)}`
                                        : payment.status === 0
                                            ? `Hạn thanh toán: ${formatDate(payment.dueDate)}`
                                            : `Qua hạn: ${payment.dueDate}`}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <div className="font-medium">{formatTienVN(payment.totalAmount)} VNĐ</div>
                                <Badge
                                    variant="outline"
                                    className={
                                        payment.status === 1
                                            ? "bg-green-50 text-green-700"
                                            : payment.status === 3
                                                ? "bg-blue-50 text-blue-700"
                                                : payment.status === 2
                                                    ? "bg-red-50 text-red-700"
                                                    : "bg-yellow-50"
                                    }
                                >
                                    {payment.status === 1
                                        ? "Đã xác nhận"
                                        : payment.status === 3
                                            ? "Đã thanh toán (Chưa được xác nhận)"
                                            : payment.status === 2
                                                ? "Quá hạn"
                                                : "Chưa thanh toán"}
                                </Badge>
                            </div>
                            <div className="flex gap-2">
                                {(payment.status == 1 || payment.status == 3 ) && (
                                    <Button variant="outline" size="sm" onClick={() => viewReceipt(payment.paymentId)}>
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                )}
                                {(payment.status === 3 || payment.status === 0 )&&  (
                                    <Button size="sm" onClick={() => confirmPayment(payment)}>
                                        Xác nhận
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    )

    return (
        <div className="container mx-auto py-6">
            <div className="flex items-center mb-6">
                <Link href="/manager/dashboard">
                    <Button variant="ghost" size="sm" className="gap-1">
                        <ArrowLeft className="h-4 w-4" /> Quay lại thống kê
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold ml-4">Thanh toán của đội</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Tổng số thanh toán</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{payments.length}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Chưa thanh toán hoặc chưa xác nhận</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingPayments.length}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Đã xác nhận</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{confirmedPayments.length}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Quá hạn</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{overduePayments.length}</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <CardTitle>Thanh toán của cả đội</CardTitle>
                            <CardDescription>Theo dõi và xác nhận thanh toán từ các thành viên trong đội của bạn</CardDescription>
                        </div>
                        <div className="flex gap-2 items-center">
                            <Filter className="h-4 w-4 text-muted-foreground" />
                            <Select defaultValue="all">
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter by report" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả</SelectItem>
                                    <SelectItem value="march-2025">March 2025 Expenses</SelectItem>
                                    <SelectItem value="february-2025">February 2025 Expenses</SelectItem>
                                    <SelectItem value="equipment">Equipment Upgrade</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="pending">
                        <TabsList className="mb-4 flex">
                            <TabsTrigger value="pending">Chưa thanh toán & chưa xác nhận</TabsTrigger>
                            <TabsTrigger value="confirmed">Đã xác nhận</TabsTrigger>
                            <TabsTrigger value="overdue">Quá hạn</TabsTrigger>
                        </TabsList>

                        <TabsContent value="pending">{renderPaymentList(pendingPayments)}</TabsContent>
                        <TabsContent value="confirmed">{renderPaymentList(confirmedPayments)}</TabsContent>
                        <TabsContent value="overdue">{renderPaymentList(overduePayments)}</TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            {/* Confirm Payment Dialog */}
            <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Xác nhận thanh toán</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="space-y-2">
                            <div className="grid grid-cols-2">
                                <div className="font-medium">Player:</div>
                                <div>{selectedPayment?.userId}</div>
                            </div>
                            <div className="grid grid-cols-2">
                                <div className="font-medium">Số tiền:</div>
                                <div>{formatTienVN(selectedPayment?.totalAmount)} VNĐ</div>
                            </div>
                            <div className="grid grid-cols-2">
                                <div className="font-medium">Ngày thanh toán:</div>
                                <div>{formatDate(selectedPayment?.paidDate)}</div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                            Đóng
                        </Button>
                        <Button onClick={handleConfirmPayment}>Xác nhận thanh toán</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* View Receipt Dialog - Enhanced with more details and proper scrolling */}
            <Dialog open={showReceiptDialog} onOpenChange={setShowReceiptDialog}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Chi tiết thanh toán
                        </DialogTitle>
                        <DialogDescription>
                            {selectedPayment?.note} - Đã thanh toán: {formatDate(selectedPayment?.paidDate)}
                        </DialogDescription>
                    </DialogHeader>

                    {/* Make the content area scrollable */}
                    <div className="py-2 space-y-4 overflow-y-auto pr-2">
                        {/* Payment Items */}
                        <div>
                            <h3 className="font-medium mb-2">Danh mục thanh toán</h3>
                            <div className="space-y-2">
                                <div className="grid grid-cols-12 text-sm font-medium">
                                    <div className="col-span-4">Danh mục</div>
                                    <div className="col-span-2 text-right">Số tiền</div>
                                    <div className="col-span-1"></div>
                                    <div className="col-span-5">Note</div>
                                </div>

                                <Separator />

                                {selectedPayment?.paymentItems?.map((item) => (
                                    <div key={item.paymentItemId} className="grid grid-cols-12 text-sm">
                                        <div className="col-span-4">{item.paidItemName}</div>
                                        <div className="col-span-2 text-right">{formatTienVN(item.amount)} VNĐ</div>
                                        <div className="col-span-1"></div>
                                        <div className="col-span-5 text-muted-foreground">{item.note}</div>
                                    </div>
                                ))}

                                <Separator />

                                <div className="grid grid-cols-12 text-sm font-medium">
                                    <div className="col-span-4">Tổng</div>
                                    <div className="col-span-2 text-right">{formatTienVN(selectedPayment?.totalAmount)} VNĐ</div>
                                    <div className="col-span-5"></div>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Payment Details */}
                        <div>
                            <h3 className="font-medium mb-2">Chi tiết thanh toán</h3>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="text-muted-foreground">Người thanh toán:</div>
                                <div>{selectedPayment?.userId}</div>

                                <div className="text-muted-foreground">Đội:</div>
                                <div>{selectedPayment?.teamName}</div>

                                <div className="text-muted-foreground">Phương thức thanh toán:</div>
                                <div>{selectedPayment?.paymentMethod === 1 ? "Thanh toán bằng mã QR thủ công" : selectedPayment?.paymentMethod === 2 ? "Thanh toán bằng tiền mặt" : "Thanh toán bằng mã QR tự động"}</div>

                                <div className="text-muted-foreground">Ngày thanh toán:</div>
                                <div>{formatDate(selectedPayment?.paidDate)}</div>

                                <div className="text-muted-foreground">Số tiền:</div>
                                <div className="font-medium">{formatTienVN(selectedPayment?.totalAmount)} VNĐ</div>
                            </div>
                        </div>

                        <Separator />

                        {/* Receipt Image */}
                        <div>
                            <h3 className="font-medium mb-2">Ảnh biên lai thanh toán</h3>
                            {selectedPayment?.receiptUrl && (
                                <div className="border rounded-md p-2">
                                    <img
                                        src={selectedPayment.receiptUrl || "/placeholder.svg"}
                                        alt="Payment receipt"
                                        className="w-full max-h-[200px] object-contain"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="mt-2 pt-2 border-t">
                        <Button variant="outline" onClick={() => setShowReceiptDialog(false)}>
                            Đóng
                        </Button>
                        {selectedPayment?.status === 3 && (
                            <Button
                                onClick={() => {
                                    setShowReceiptDialog(false)
                                    confirmPayment(selectedPayment)
                                }}
                            >
                                Xác nhận thanh toán
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
