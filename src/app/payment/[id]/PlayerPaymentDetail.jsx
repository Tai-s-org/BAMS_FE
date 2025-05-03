"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/Dialog"
import { Separator } from "@/components/ui/Seperator"
import { Badge } from "@/components/ui/Badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/Radio-group"
import { Label } from "@/components/ui/Label"
import Link from "next/link"
import { ArrowLeft, FileText, DollarSign, QrCode, CheckCircle, AlertTriangle, Wallet, BanknoteIcon, Calendar, Clock } from "lucide-react"
import paymentApi from "@/api/payment"
import teamFundApi from "@/api/teamFund"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/Table"

export default function PaymentDetail({ id }) {
    const [payment, setPayment] = useState()
    const [showQR, setShowQR] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState()
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("qr")
    const [paymentItems, setPaymentItems] = useState([]);
    const [qrCode, setqrCode] = useState()
    const [remainingTime, setRemainingTime] = useState(600); // 10 phút = 600 giây


    const fetchPaymentDetails = async () => {
        try {
            const response = await paymentApi.getPaymentDetail(id);
            console.log("Payment details:", response.data)
            setPayment(response.data.data)
            setPaymentItems(response.data.data.paymentItems)
        } catch (error) {
            console.error("Error fetching payment details:", error)
        }
    }

    useEffect(() => {
        const fetchPaymentMethod = async () => {
            try {
                const response = await teamFundApi.getManagerPaymentMethod(id)
                console.log("Payment method:", response.data)
                setPaymentMethod(response.data.data)
            } catch (error) {
                console.error("Error fetching payment method:", error)
            }
        }

        fetchPaymentMethod()
        fetchPaymentDetails()
    }, [id])

    const handlePay = () => {
        if (selectedPaymentMethod === "qr") {
            const isAutoPayment = paymentMethod.paymentMethod === 1;

            const generateQR = async () => {
                console.log("id: ", id);

                try {
                    const response = await teamFundApi.generateQR({
                        "paymentId": id
                    });
                    console.log("QR Generated:", response.data.data);
                    setqrCode(response.data.data.qrCode)
                    setShowQR(true);

                    if (isAutoPayment && showQR) {

                        // Polling every 5s to check payment status
                        const intervalId = setInterval(async () => {
                            try {
                                const statusResponse = await paymentApi.getPaymentDetail(id);
                                const updatedStatus = statusResponse.data.data.status;
                                console.log("Checking payment status:", updatedStatus);

                                if (updatedStatus === 1) {
                                    clearInterval(intervalId);
                                    clearTimeout(timeoutId);
                                    payment.status = 1
                                    setShowQR(false);
                                }
                            } catch (error) {
                                console.error("Error checking payment status:", error);
                            }
                        }, 5000);

                        // Stop polling after 10 minutes
                        const timeoutId = setTimeout(() => {
                            clearInterval(intervalId);
                            setShowQR(false);
                            console.log("QR code timeout after 10 minutes");
                        }, 10 * 60 * 1000);
                    }
                } catch (error) {
                    console.error("Error generating QR:", error);
                }
            };

            generateQR();
        }
        else {
            // For other methods (e.g., cash)
            const updatePaymentStatus = async () => {
                try {
                    const response = await teamFundApi.updatePaymentStatus({
                        "paymentId": id,
                        "status": 3
                    })
                    fetchPaymentDetails()
                } catch (err) {

                }
            }

            updatePaymentStatus();
        }
    };


    const handleQrPay = async () => {
        try {
            const response = await teamFundApi.updatePaymentStatus({
                "paymentId": id,
                "status": 3
            })
            fetchPaymentDetails()
        } catch (err) {

        }
        setShowQR(false)
    }
    const totalAmount = paymentItems.reduce((sum, item) => sum + item.amount, 0)

    function formatTienVN(number) {
        return number != null ? number.toLocaleString('vi-VN') : "";
    }

    //count time
    useEffect(() => {
        let interval

        if (showQR && paymentMethod?.paymentMethod === 1) {
            setRemainingTime(600); // reset lại 10 phút mỗi khi mở QR

            interval = setInterval(() => {
                setRemainingTime(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [showQR, paymentMethod]);


    return (
        <div className="container mx-auto py-6">
            <div className="flex items-center mb-6">
                <Link href="/payment">
                    <Button variant="ghost" size="sm" className="gap-1 hover:bg-[#F4F4F5]">
                        <ArrowLeft className="h-4 w-4" /> Quay lại
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold ml-4">Thanh toán #{payment?.paymentId}</h1>
                {payment?.status === 1 && <Badge className="ml-4 bg-green-500">Đã thanh toán</Badge>}
                {payment?.status === 0 && <Badge className="ml-4 bg-yellow-500">Chưa thanh toán</Badge>}
                {payment?.status === 2 && <Badge className="ml-4 bg-red-500">Quá hạn</Badge>}
                {payment?.status === 3 && <Badge className="ml-4 bg-green-500">Đã thanh toán (Chờ xác nhận)</Badge>}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                {payment?.teamName} - {payment?.teamFundDescription}
                            </CardTitle>
                            <CardDescription>Phần chi phí của đội bạn</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-medium mb-2">Ghi chú</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {payment?.note}
                                    </p>
                                </div>

                                <Separator />
                                <div>
                                    <h3 className="font-medium mb-2">Danh mục thanh toán</h3>
                                    <div className="rounded-lg border overflow-hidden">
                                        <Table>
                                            <TableHeader className="bg-slate-50">
                                                <TableRow className="text-sm font-medium">
                                                    <TableHead className="w-4/12">Danh mục</TableHead>
                                                    <TableHead className="w-2/12 text-right">Giá tiền</TableHead>
                                                    <TableHead className="w-1/12"></TableHead>
                                                    <TableHead className="w-5/12">Ghi chú</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {paymentItems.map((item) => (
                                                    <TableRow key={item.paymentItemId} className="text-sm hover:bg-slate-50">
                                                        <TableCell className="font-medium">{item.paidItemName}</TableCell>
                                                        <TableCell className="text-right font-medium">{formatTienVN(item.amount)} VNĐ</TableCell>
                                                        <TableCell></TableCell>
                                                        <TableCell className="text-muted-foreground">{item.note || "-"}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                            <TableFooter>
                                                <TableRow className="text-sm font-medium bg-slate-50">
                                                    <TableCell className="font-bold">Tổng</TableCell>
                                                    <TableCell className="text-right font-bold">
                                                        {formatTienVN(payment?.totalAmount)} VNĐ
                                                    </TableCell>
                                                    <TableCell></TableCell>
                                                    <TableCell></TableCell>
                                                </TableRow>
                                            </TableFooter>
                                        </Table>
                                    </div>
                                </div>

                                {(payment?.status == 0 || payment?.status == 2) && (
                                    <>
                                        <Separator />
                                        <div>
                                            <h3 className="font-medium mb-2">Phương thức thanh toán</h3>
                                            <RadioGroup
                                                value={selectedPaymentMethod}
                                                onValueChange={setSelectedPaymentMethod}
                                                className="space-y-3"
                                            >
                                                {paymentMethod?.paymentMethod === 1 ?
                                                    (
                                                        <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50 cursor-pointer">
                                                            <RadioGroupItem value="qr" id="qr" />
                                                            <Label htmlFor="qr" className="flex items-center gap-2 cursor-pointer">
                                                                <div className="bg-green-100 p-2 rounded-full">
                                                                    <QrCode className="h-5 w-5 text-green-600" />
                                                                </div>
                                                                <div>
                                                                    <div className="font-medium">Thanh toán bằng mã QR tự động</div>
                                                                    <div className="text-sm text-muted-foreground">Quét bằng ứng dụng thanh toán của bạn</div>
                                                                </div>
                                                            </Label>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50 cursor-pointer">
                                                            <RadioGroupItem value="qr" id="qr" />
                                                            <Label htmlFor="qr" className="flex items-center gap-2 cursor-pointer">
                                                                <div className="bg-blue-100 p-2 rounded-full">
                                                                    <QrCode className="h-5 w-5 text-blue-600" />
                                                                </div>
                                                                <div>
                                                                    <div className="font-medium">Thanh toán bằng mã QR thủ công</div>
                                                                    <div className="text-sm text-muted-foreground">Quét bằng ứng dụng thanh toán của bạn và chờ quản lí duyệt</div>
                                                                </div>
                                                            </Label>
                                                        </div>
                                                    )}
                                                <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50 cursor-pointer">
                                                    <RadioGroupItem value="cash" id="cash" />
                                                    <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer">
                                                        <div className="bg-amber-100 p-2 rounded-full">
                                                            <BanknoteIcon className="h-5 w-5 text-amber-600" />
                                                        </div>
                                                        <div>
                                                            <div className="font-medium">Tiền mặt</div>
                                                            <div className="text-sm text-muted-foreground">Thanh toán trực tiếp bằng tiền mặt</div>
                                                        </div>
                                                    </Label>
                                                </div>
                                            </RadioGroup>
                                        </div>
                                    </>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                            {payment?.status === 2 && (
                                <div className="flex items-center text-red-500 gap-1">
                                    <AlertTriangle className="h-4 w-4" />
                                    <span>Thời hạn thanh toán đã hết hạn</span>
                                </div>
                            )}
                            {(payment?.status === 0 || payment?.status === 2) && (
                                <>
                                    {selectedPaymentMethod === "qr" ? (
                                        <Button onClick={handlePay} className="gap-1 bg-green-600 hover:bg-green-700">
                                            <Wallet className="h-4 w-4" /> Thanh toán ngay
                                        </Button>
                                    ) : (
                                        <div className="flex items-center text-yellow-500 gap-1">
                                            <CheckCircle className="h-4 w-4" />
                                            <span>Vui lòng thanh toán qua quản lý của đội</span>
                                        </div>
                                    )}

                                </>
                            )}
                            {payment?.status === 3 && (
                                <div className="flex items-center text-yellow-500 gap-1">
                                    <CheckCircle className="h-4 w-4" />
                                    <span>Đang chờ xác nhận của người quản lý</span>
                                </div>
                            )}
                        </CardFooter>
                    </Card>
                </div>

                <div>
                    {/* <Card>
                        <CardHeader>
                            <CardTitle>Trạng thái thanh toán</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <BanknoteIcon className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">Tổng số tiền: {formatTienVN(payment?.totalAmount)} VNĐ</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {payment?.status === 1 ? (
                                        <>
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                            <span className="text-sm">Trạng thái: Đã thanh toán</span>
                                        </>
                                    ) : payment?.status === 2 ? (
                                        <>
                                            <AlertTriangle className="h-4 w-4 text-red-500" />
                                            <span className="text-sm">Tình trạng: Quá hạn</span>
                                        </>
                                    ) : payment?.status === 0 ? (
                                        <>
                                            <FileText className="h-4 w-4 text-yellow-500" />
                                            <span className="text-sm">Trạng thái: Chưa thanh toán</span>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                            <span className="text-sm">Trạng thái: Đã thanh toán (Đang chờ xác nhận)</span>
                                        </>
                                    )}
                                </div>

                                {(payment?.status === 1 || payment?.status === 3) && (
                                    <>
                                        <Separator />
                                        <div>
                                            <h3 className="text-sm font-medium mb-2">Thông tin thanh toán</h3>
                                            <div className="space-y-2 text-sm">
                                                <div className="grid grid-cols-2">
                                                    <div className="text-muted-foreground">Ngày thanh toán:</div>
                                                    <div>{ }</div>
                                                </div>
                                                <div className="grid grid-cols-2">
                                                    <div className="text-muted-foreground">Phương thức thanh toán:</div>
                                                    <div>
                                                        {selectedPaymentMethod === "qr"
                                                            ? "Mã QR"
                                                            : selectedPaymentMethod === "card"
                                                                ? "Thẻ tín dụng/ghi nợ"
                                                                : "Tiền mặt"}
                                                    </div>
                                                </div>
                                                {selectedPaymentMethod !== "cash" && (
                                                    <div className="grid grid-cols-2">
                                                        <div className="text-muted-foreground">Mã giao dịch:</div>
                                                        <div>TXN-2025-04-16-123</div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {payment?.status === 2 && (
                                    <>
                                        <Separator />
                                        <div className="p-3 bg-red-50 rounded-md border border-red-200">
                                            <h3 className="text-sm font-medium text-red-700 mb-1">Payment Overdue</h3>
                                            <p className="text-xs text-red-600">
                                                This payment is past its due date. Please contact your team manager for assistance.
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card> */}

                    <Card className="shadow-sm">
                        <CardHeader className="bg-slate-50 border-b">
                            <CardTitle>Trạng thái thanh toán</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-md border">
                                    <div className="bg-green-100 p-2 rounded-full">
                                        <DollarSign className="h-4 w-4 text-green-600" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium">Tổng số tiền</div>
                                        <div className="text-lg font-bold">{formatTienVN(payment?.totalAmount)} VNĐ</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 rounded-md border">
                                    {payment?.status === 1 ? (
                                        <>
                                            <div className="bg-green-100 p-2 rounded-full">
                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium">Trạng thái</div>
                                                <div className="text-green-600 font-medium">Đã thanh toán</div>
                                            </div>
                                        </>
                                    ) : payment?.status === 2 ? (
                                        <>
                                            <div className="bg-red-100 p-2 rounded-full">
                                                <AlertTriangle className="h-4 w-4 text-red-600" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium">Trạng thái</div>
                                                <div className="text-red-600 font-medium">Quá hạn</div>
                                            </div>
                                        </>
                                    ) : payment?.status === 0 ? (
                                        <>
                                            <div className="bg-yellow-100 p-2 rounded-full">
                                                <Clock className="h-4 w-4 text-yellow-600" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium">Trạng thái</div>
                                                <div className="text-yellow-600 font-medium">Chưa thanh toán</div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="bg-blue-100 p-2 rounded-full">
                                                <CheckCircle className="h-4 w-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium">Trạng thái</div>
                                                <div className="text-blue-600 font-medium">Đã thanh toán (Đang chờ xác nhận)</div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="flex items-center gap-3 p-3 rounded-md border">
                                    <div className="bg-slate-100 p-2 rounded-full">
                                        <Calendar className="h-4 w-4 text-slate-600" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium">Hạn thanh toán</div>
                                        <div className="font-medium">{new Date(payment?.dueDate).toLocaleDateString("vi-VN")}</div>
                                    </div>
                                </div>

                                {(payment?.status === 1 || payment?.status === 3) && (
                                    <>
                                        <Separator />
                                        <div>
                                            <h3 className="text-sm font-medium mb-3 text-slate-800">Thông tin thanh toán</h3>
                                            <div className="space-y-3 text-sm">
                                                <div className="grid grid-cols-2 p-2 bg-slate-50 rounded-md">
                                                    <div className="text-muted-foreground">Ngày thanh toán:</div>
                                                    <div className="font-medium">
                                                        {payment.paymentDate ? new Date(payment?.paidDate).toLocaleDateString("vi-VN") : "-"}
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 p-2 bg-slate-50 rounded-md">
                                                    <div className="text-muted-foreground">Phương thức thanh toán:</div>
                                                    <div className="font-medium flex items-center gap-1">
                                                        {selectedPaymentMethod === "qr" ? (
                                                            <>
                                                                <QrCode className="h-3 w-3" /> Mã QR
                                                            </>
                                                        ) : (
                                                            <>
                                                                <BanknoteIcon className="h-3 w-3" /> Tiền mặt
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                {selectedPaymentMethod !== "cash" && (
                                                    <div className="grid grid-cols-2 p-2 bg-slate-50 rounded-md">
                                                        <div className="text-muted-foreground">Mã giao dịch:</div>
                                                        <div className="font-medium">TXN-2025-04-28-123</div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {payment?.status === 2 && (
                                    <>
                                        <Separator />
                                        <div className="p-4 bg-red-50 rounded-md border border-red-200">
                                            <div className="flex items-center gap-2 mb-2">
                                                <AlertTriangle className="h-4 w-4 text-red-600" />
                                                <h3 className="text-sm font-medium text-red-700">Thanh toán quá hạn</h3>
                                            </div>
                                            <p className="text-xs text-red-600">
                                                Khoản thanh toán này đã quá hạn. Vui lòng liên hệ với người quản lý đội của bạn để được hỗ trợ.
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* QR Code Dialog */}
            <Dialog open={showQR} onOpenChange={setShowQR}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Mã QR thanh toán</DialogTitle>
                        <DialogDescription>Quét mã QR này bằng ứng dụng thanh toán của bạn để hoàn tất thanh toán.</DialogDescription>
                    </DialogHeader>
                    {paymentMethod?.paymentMethod === 1 && (
                        <p className="text-sm text-red-500 mb-2">
                            Thời gian còn lại: {Math.floor(remainingTime / 60)}:{String(remainingTime % 60).padStart(2, '0')}
                        </p>
                    )}
                    <div className="flex flex-col items-center justify-center py-4">
                        <div className="border border-gray-200 p-4 rounded-lg mb-4">
                            <div className="w-64 h-64 bg-gray-100 flex items-center justify-center">
                                {qrCode ? (
                                    <img src={qrCode} alt="QR Code" />
                                ) : null}
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">Số tiền: {formatTienVN(payment?.totalAmount)} VNĐ</p>
                        {/* <p className="text-sm text-muted-foreground">Reference: TEAM-ALPHA-{isOverdue ? "EQUIP" : "MAR"}-2025</p> */}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowQR(false)}>
                            Hủy
                        </Button>
                        {paymentMethod?.paymentMethod === 0 && (
                            <Button onClick={handleQrPay}>Đã thanh toán</Button>
                        )}

                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
