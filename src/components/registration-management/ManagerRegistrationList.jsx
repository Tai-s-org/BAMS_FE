"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Eye, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Badge } from "@/components/ui/Badge"
import { cn } from "@/lib/utils"
import { RegistrationDetailsModal } from "./ManagerRegistrationDetailModal"
import registerApi from "@/api/register"
import { useToasts } from "@/hooks/providers/ToastProvider"
import { DatePicker } from "../ui/DatePicker"


export default function ManagerRegistrationList() {
    // Mock data for demonstration
    const mockData = {
        items: [
            {
                managerRegistrationId: 5,
                memberRegistrationSessionId: 7,
                fullName: "John Doe",
                generationAndSchoolName: "Generation 5, Harvard University",
                phoneNumber: "8971354203",
                email: "glorylavender@indigobook.com",
                facebookProfileUrl: "https://facebook.com/johndoe",
                knowledgeAboutAcademy: "Through friends and social media",
                reasonToChooseUs: "Great reputation and learning opportunities",
                knowledgeAboutAmanager: "Basic understanding of responsibilities",
                experienceAsAmanager: "2 years as a team leader",
                strength: "Communication and organization",
                weaknessAndItSolution: "Sometimes too detail-oriented, working on seeing the bigger picture",
                status: "Pending",
                submitedDate: "2025-03-18",
            },
            {
                managerRegistrationId: 7,
                memberRegistrationSessionId: 7,
                fullName: "Jane Smith",
                generationAndSchoolName: "Generation 6, MIT",
                phoneNumber: "234567",
                email: "fsafsf@indigobook.com",
                facebookProfileUrl: "https://facebook.com/janesmith",
                knowledgeAboutAcademy: "Through university program",
                reasonToChooseUs: "Excellent mentorship opportunities",
                knowledgeAboutAmanager: "Previous internship experience",
                experienceAsAmanager: "1 year as project coordinator",
                strength: "Problem-solving and teamwork",
                weaknessAndItSolution: "Time management, using scheduling tools to improve",
                status: "Pending",
                submitedDate: "2025-03-19",
            },
        ],
        totalRecords: 2,
        totalPages: 1,
        currentPage: 1,
        pageSize: 10,
    }

    const [data, setData] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [dateFilter, setDateFilter] = useState()
    const [selectedItem, setSelectedItem] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalPages, setTotalPages] = useState(1)

    const { addToast } = useToasts();

    const fetchData = async () => {
        try {
            const filters = {
                Name: searchTerm || undefined,
                StartDate: dateFilter ? format(dateFilter, "yyyy-MM-dd") : undefined,
                IsEnable: true,
                IsDescending: false,
                PageNumber: currentPage,
                PageSize: pageSize,
            }

            const response = await registerApi.getAllManagerRegistration(filters);
            console.log(response.data.items)
            setData(response.data.items);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            //addToast({ message: error.response.data.message, type: "error" });
            setData([])
        }
    }

    useEffect(() => {
        fetchData();
    }, [searchTerm, statusFilter, dateFilter, currentPage, pageSize])

    // Handle approve action
    const handleApprove = (id) => {

    }

    // Handle reject action
    const handleReject = (id) => {

    }

    // Open modal with selected item
    const openDetailsModal = (item) => {
        setSelectedItem(item)
        setIsModalOpen(true)
    }

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    // Handle page size change
    const handlePageSizeChange = (event) => {
        setPageSize(Number.parseInt(event.target.value))
        setCurrentPage(1) // Reset to first page when changing page size
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">Danh sách đăng ký</h1>

            {/* Search and filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm kiếm bởi tên hoặc email"
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                </Select>

                
                <div>
                    <DatePicker
                        value={dateFilter}
                        onChange={setDateFilter}
                        placeholder="Lọc theo ngày"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="border rounded-md overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Họ và tên</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Số điện thoại</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead>Ngày nộp đơn</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data?.length > 0 ? (
                            data?.map((item) => (
                                <TableRow key={item.managerRegistrationId}>
                                    <TableCell>{item.managerRegistrationId}</TableCell>
                                    <TableCell>{item.fullName}</TableCell>
                                    <TableCell>{item.email}</TableCell>
                                    <TableCell>{item.phoneNumber}</TableCell>
                                    <TableCell>
                                        <Badge
                                            className={cn(
                                                item.status === "Approved" && "bg-green-500",
                                                item.status === "Rejected" && "bg-red-500",
                                                item.status === "Pending" && "bg-yellow-500",
                                            )}
                                        >
                                            {item.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{format(new Date(item.submitedDate), "MMM dd, yyyy")}</TableCell>
                                    <TableCell>
                                        <div className="flex space-x-2">
                                            <Button size="icon" variant="outline" onClick={() => openDetailsModal(item)}>
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            {item.status === "Pending" && (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        className="bg-[#bd2427] hover:bg-[#a01f22]"
                                                        onClick={() => handleApprove(item.managerRegistrationId)}
                                                    >
                                                        Duyệt
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="border-[#bd2427] text-[#bd2427] hover:bg-[#bd2427] hover:text-white"
                                                        onClick={() => handleReject(item.managerRegistrationId)}
                                                    >
                                                        Từ chối
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-4">
                                    No registrations found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

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

            {/* Details Modal */}
            {selectedItem && (
                <RegistrationDetailsModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    registration={selectedItem}
                    onApprove={handleApprove}
                    onReject={handleReject}
                />
            )}
        </div>
    )
}

