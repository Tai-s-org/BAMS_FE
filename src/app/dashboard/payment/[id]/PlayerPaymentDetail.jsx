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
import { ArrowLeft, FileText, DollarSign, QrCode, CheckCircle, Upload, AlertTriangle, CreditCard, Wallet, BanknoteIcon, } from "lucide-react"
import paymentApi from "@/api/payment"

export default function PaymentDetail({ id }) {
    const [payment, setPayment] = useState()
    const [isPaid, setIsPaid] = useState(false)
    const [showQR, setShowQR] = useState(false)
    const [showUpload, setShowUpload] = useState(false)
    const [receiptImage, setReceiptImage] = useState(null)
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("qr")
    const [paymentItems, setPaymentItems] = useState([]);
    
    useEffect(() => {
        // Fetch payment details from the server using the ID
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

        fetchPaymentDetails()
    }, [id])

    // For demo purposes, determine if payment is overdue based on ID
    const isOverdue = id === "p102"

    // Payment items list with name, amount, and note
    // const paymentItems = [
    //     {
    //         id: 1,
    //         name: "Equipment Fee",
    //         amount: 200000,
    //         note: "New team equipment purchase",
    //     },
    //     {
    //         id: 2,
    //         name: "Training Fee",
    //         amount: 87000,
    //         note: "Monthly training sessions",
    //     },
    //     {
    //         id: 3,
    //         name: "Facility Rental",
    //         amount: 100000,
    //         note: "Practice facility rental",
    //     },
    //     {
    //         id: 4,
    //         name: "Tournament Registration",
    //         amount: 50000,
    //         note: "Upcoming tournament registration fee",
    //     },
    // ]


    const handlePay = () => {
        if (selectedPaymentMethod === "qr") {
            setShowQR(true)
        } else {
            // For cash or other methods, mark as paid immediately
            setIsPaid(true)
        }
    }

    const handleQrPay = () => {
        setIsPaid(true)
        setShowQR(false)
    }

    const handleUploadReceipt = () => {
        // Simulate receipt upload
        setReceiptImage("/placeholder.svg?height=300&width=200")
        setShowUpload(false)
    }

    const totalAmount = paymentItems.reduce((sum, item) => sum + item.amount, 0)

    function formatTienVN(number) {
        return number != null ? number.toLocaleString('vi-VN') : "";
    }

    return (
        <div className="container mx-auto py-6">
            <div className="flex items-center mb-6">
                <Link href="/dashboard/payment">
                    <Button variant="ghost" size="sm" className="gap-1">
                        <ArrowLeft className="h-4 w-4" /> Quay lại trang thống kê
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold ml-4">Thanh toán #{payment?.paymentId}</h1>
                {payment?.status === 1 && <Badge className="ml-4 bg-green-500">Đã thanh toán</Badge>}
                {payment?.status === 0 && <Badge className="ml-4 bg-yellow-500">Chưa thanh toán</Badge>}
                {payment?.status === 2 && <Badge className="ml-4 bg-red-500">Quá hạn</Badge>}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                {payment?.teamName} - teamfund: {payment?.teamFundId}
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
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-12 text-sm font-medium">
                                            <div className="col-span-4">Danh mục</div>
                                            <div className="col-span-2 text-right">Giá tiền</div>
                                            <div className="col-span-1"></div>
                                            <div className="col-span-5">Ghi chú</div>
                                        </div>

                                        <Separator />

                                        {paymentItems.map((item) => (
                                            <div key={item.paymentItemId} className="grid grid-cols-12 text-sm">
                                                <div className="col-span-4">{item.paidItemName}</div>
                                                <div className="col-span-2 text-right">{formatTienVN(item.amount)} VNĐ</div>
                                                <div className="col-span-1"></div>
                                                <div className="col-span-5 text-muted-foreground">{item.note}</div>
                                            </div>
                                        ))}

                                        <Separator />

                                        <div className="grid grid-cols-12 text-sm font-medium">
                                            <div className="col-span-4 font-bold">Tổng</div>
                                            <div className="col-span-2 text-right font-bold">{formatTienVN(payment?.totalAmount)} VNĐ</div>
                                            <div className="col-span-5"></div>
                                        </div>
                                    </div>
                                </div>

                                {!isPaid && !isOverdue && (
                                    <>
                                        <Separator />
                                        <div>
                                            <h3 className="font-medium mb-2">Phương thức thanh toán</h3>
                                            <RadioGroup
                                                value={selectedPaymentMethod}
                                                onValueChange={setSelectedPaymentMethod}
                                                className="space-y-3"
                                            >
                                                {/* <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50 cursor-pointer">
                                                    <RadioGroupItem value="qr" id="qr" />
                                                    <Label htmlFor="qr" className="flex items-center gap-2 cursor-pointer">
                                                        <QrCode className="h-5 w-5" />
                                                        <div>
                                                            <div className="font-medium">Thanh toán bằng mã QR tự động</div>
                                                            <div className="text-sm text-muted-foreground">Quét bằng ứng dụng thanh toán của bạn</div>
                                                        </div>
                                                    </Label>
                                                </div> */}

                                                <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50 cursor-pointer">
                                                    <RadioGroupItem value="card" id="card" />
                                                    <Label htmlFor="qr" className="flex items-center gap-2 cursor-pointer">
                                                        <QrCode className="h-5 w-5" />
                                                        <div>
                                                            <div className="font-medium">Thanh toán bằng mã QR thủ công</div>
                                                            <div className="text-sm text-muted-foreground">Quét bằng ứng dụng thanh toán của bạn và chờ quản lí duyệt</div>
                                                        </div>
                                                    </Label>
                                                </div>

                                                <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50 cursor-pointer">
                                                    <RadioGroupItem value="cash" id="cash" />
                                                    <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer">
                                                        <BanknoteIcon className="h-5 w-5" />
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

                                {receiptImage && (
                                    <>
                                        <Separator />
                                        <div>
                                            <h3 className="font-medium mb-2">Hóa đơn thanh toán</h3>
                                            <div className="border rounded-md p-2 max-w-xs">
                                                <img src={receiptImage || "/placeholder.svg"} alt="Payment receipt" className="w-full" />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                            {!isPaid && !isOverdue && (
                                <>
                                    <Button onClick={() => setShowUpload(true)} variant="outline" className="gap-1">
                                        <Upload className="h-4 w-4" /> Tải lên biên lai thanh toán
                                    </Button>
                                    <Button onClick={handlePay} className="gap-1">
                                        <Wallet className="h-4 w-4" /> Thanh toán ngay
                                    </Button>
                                </>
                            )}
                            {!isPaid && isOverdue && (
                                <div className="flex items-center text-red-500 gap-1">
                                    <AlertTriangle className="h-4 w-4" />
                                    <span>Thời hạn thanh toán đã hết hạn</span>
                                </div>
                            )}
                            {isPaid && !receiptImage && (
                                <Button onClick={() => setShowUpload(true)} variant="outline" className="gap-1">
                                    <Upload className="h-4 w-4" /> Tải lên biên lai thanh toán
                                </Button>
                            )}
                            {isPaid && (
                                <div className="flex items-center text-yellow-500 gap-1">
                                    <CheckCircle className="h-4 w-4" />
                                    <span>Đang chờ xác nhận của người quản lý</span>
                                </div>
                            )}
                        </CardFooter>
                    </Card>
                </div>

                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Trạng thái thanh toán</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">Tổng số tiền: {formatTienVN(payment?.totalAmount)} VNĐ</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {payment?.status === 1 ? (
                                        <>
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                            <span className="text-sm">Trạng thái: Đã thanh toán (Đang chờ xác nhận)</span>
                                        </>
                                    ) : payment?.status === 2 ? (
                                        <>
                                            <AlertTriangle className="h-4 w-4 text-red-500" />
                                            <span className="text-sm">Tình trạng: Quá hạn</span>
                                        </>
                                    ) : (
                                        <>
                                            <FileText className="h-4 w-4 text-yellow-500" />
                                            <span className="text-sm">Trạng thái: Chưa thanh toán</span>
                                        </>
                                    )}
                                </div>

                                {isPaid && (
                                    <>
                                        <Separator />
                                        <div>
                                            <h3 className="text-sm font-medium mb-2">Thông tin thanh toán</h3>
                                            <div className="space-y-2 text-sm">
                                                <div className="grid grid-cols-2">
                                                    <div className="text-muted-foreground">Ngày thanh toán:</div>
                                                    <div>April 16, 2025</div>
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

                                {isOverdue && (
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
                    <div className="flex flex-col items-center justify-center py-4">
                        <div className="border border-gray-200 p-4 rounded-lg mb-4">
                            <div className="w-64 h-64 bg-gray-100 flex items-center justify-center">
                                <QrCode className="w-40 h-40 text-gray-800" />
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">Số tiền: {formatTienVN(payment?.totalAmount)} VNĐ</p>
                        {/* <p className="text-sm text-muted-foreground">Reference: TEAM-ALPHA-{isOverdue ? "EQUIP" : "MAR"}-2025</p> */}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowQR(false)}>
                            Hủy
                        </Button>
                        <Button onClick={handleQrPay}>Đã thanh toán</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Upload Receipt Dialog */}
            <Dialog open={showUpload} onOpenChange={setShowUpload}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tải lên biên lai thanh toán</DialogTitle>
                        <DialogDescription>Tải lên ảnh biên lai thanh toán của bạn làm bằng chứng thanh toán.</DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col items-center justify-center py-4">
                        <div className="border border-dashed border-gray-300 rounded-lg p-8 w-full text-center">
                            <Upload className="h-8 w-8 mx-auto mb-4 text-gray-400" />
                            <p className="text-sm text-gray-500 mb-2">Kéo và thả hình ảnh biên lai của bạn vào đây</p>
                            <p className="text-xs text-gray-400 mb-4">Định dạng được hỗ trợ: JPG, PNG, PDF (Tối đa 5MB)</p>
                            <Button size="sm">Duyệt tập tin</Button>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowUpload(false)}>
                            Hủy
                        </Button>
                        <Button onClick={handleUploadReceipt}>Tải lên biên lai thanh toán</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
