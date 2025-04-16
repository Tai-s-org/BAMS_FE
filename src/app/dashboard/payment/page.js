"use client"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon, Eye, Filter, ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { DatePicker } from "@/components/ui/DatePicker"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/Dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"

import { PaymentDetails } from "@/components/payment/PaymentDetail"
import { Label } from "@/components/ui/Label"

// Mock data for demonstration
const mockPayments = [
    {
        id: "1",
        date: "2023-04-15",
        amount: 500000,
        description: "Đóng quỹ đội",
        status: "completed",
        paymentMethod: "Bank Transfer",
        recipient: "Nguyen Van A",
    },
    {
        id: "2",
        date: "2023-03-15",
        amount: 500000,
        description: "Đóng quỹ đội",
        status: "completed",
        paymentMethod: "Bank Transfer",
        recipient: "Nguyen Van A",
    },
    {
        id: "3",
        date: "2023-02-15",
        amount: 500000,
        description: "Đóng quỹ đội",
        status: "completed",
        paymentMethod: "Bank Transfer",
        recipient: "Nguyen Van A",
    },
    {
        id: "4",
        date: "2023-01-15",
        amount: 500000,
        description: "Đóng quỹ đội",
        status: "completed",
        paymentMethod: "Bank Transfer",
        recipient: "Nguyen Van A",
    },
    {
        id: "5",
        date: "2022-12-15",
        amount: 500000,
        description: "Đóng quỹ đội",
        status: "completed",
        paymentMethod: "Bank Transfer",
        recipient: "Nguyen Van A",
    },
]

export default function UserPaymentHistory() {
    const [date, setDate] = useState(new Date())
    const [period, setPeriod] = useState("1")
    const [page, setPage] = useState(1)
    const [selectedPayment, setSelectedPayment] = useState(null)
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)

    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalPages, setTotalPages] = useState(1)

    const itemsPerPage = 4
    const startIndex = (page - 1) * itemsPerPage
    const displayedPayments = mockPayments.slice(startIndex, startIndex + itemsPerPage)

    const handleViewDetails = (payment) => {
        setSelectedPayment(payment)
        setIsDetailsOpen(true)
    }

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    // Handle page size change
    const handlePageSizeChange = (event) => {
        setPageSize(Number.parseInt(event.target.value))
        setCurrentPage(1) // Reset to first page when changing page size
    }

    return (
        <div className="container mx-auto py-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Lịch sử thanh toán của tôi</h1>
                <div className="flex items-center gap-4">
                    {/* <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-[240px] justify-start">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "dd/MM/yyyy") : "Chọn ngày kết thúc"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                            <DatePicker
                                value={date}
                                onChange={setDate}
                            />
                        </PopoverContent>
                    </Popover> */}
                    <DatePicker
                        value={date}
                        onChange={setDate}
                    />
                    <Select value={period} onValueChange={setPeriod}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Chọn khoảng thời gian" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">1 tháng</SelectItem>
                            <SelectItem value="3">3 tháng</SelectItem>
                            <SelectItem value="6">6 tháng</SelectItem>
                            <SelectItem value="12">1 năm</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon" className="w-[120px]">
                        <Filter className="h-4 w-4" />
                        <Label>Lọc</Label>
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Thanh toán</CardTitle>
                    <CardDescription>Danh sách các giao dịch thanh toán của bạn.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Ngày</TableHead>
                                <TableHead>Mô tả</TableHead>
                                <TableHead>Số tiền</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead>Phương thức</TableHead>
                                <TableHead className="text-right">Chi tiết</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {displayedPayments.map((payment) => (
                                <TableRow key={payment.id}>
                                    <TableCell>{format(new Date(payment.date), "dd/MM/yyyy")}</TableCell>
                                    <TableCell>{payment.description}</TableCell>
                                    <TableCell>
                                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(payment.amount)}
                                    </TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                                            {payment.status === "completed" ? "Hoàn thành" : "Đang xử lý"}
                                        </span>
                                    </TableCell>
                                    <TableCell>{payment.paymentMethod}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleViewDetails(payment)}>
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Pagination Controls */}
                    {totalPages >= 0 && (
                        <div className="flex flex-col md:flex-row justify-between items-center mt-8 gap-4 bg-white p-4 rounded-lg shadow-sm">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">Hiển thị</span>
                                <select
                                    value={pageSize}
                                    onChange={handlePageSizeChange}
                                    className="w-20 p-1 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#BD2427] focus:border-transparent"
                                >
                                    {[5, 10, 15, 20, 50].map((size) => (
                                        <option key={size} value={size}>
                                            {size}
                                        </option>
                                    ))}
                                </select>
                                <span className="text-sm text-gray-500">mục trên mỗi trang</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="h-8 w-8 p-0"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>

                                <div className="flex items-center gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <Button
                                            key={page}
                                            variant={currentPage === page ? "default" : "outline"}
                                            size="icon"
                                            onClick={() => handlePageChange(page)}
                                            className={`h-8 w-8 p-0 ${currentPage === page ? "bg-[#BD2427] hover:bg-[#A61F22]" : ""}`}
                                        >
                                            {page}
                                        </Button>
                                    ))}
                                </div>

                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="h-8 w-8 p-0"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Chi tiết thanh toán</DialogTitle>
                        <DialogDescription>Thông tin chi tiết về giao dịch thanh toán.</DialogDescription>
                    </DialogHeader>
                    {selectedPayment && <PaymentDetails payment={selectedPayment} />}
                </DialogContent>
            </Dialog>
        </div>
    )
}
