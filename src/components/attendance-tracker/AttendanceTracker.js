"use client"

import { useState, useEffect } from "react"
import { Calendar, ChevronLeft, ChevronRight, Filter, User } from "lucide-react"
import { format, addMonths, subMonths, startOfMonth, endOfMonth } from "date-fns"
import { vi } from "date-fns/locale"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/Select"
import { useAuth } from "@/hooks/context/AuthContext"
import parentApi from "@/api/parent"
import attendanceApi from "@/api/attendance"

export default function AttendanceTracker() {
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [selectedChild, setSelectedChild] = useState(null)
    const [statusFilter, setStatusFilter] = useState("all")
    const [mockChildren, setMockChildren] = useState([])
    const [filteredAttendance, setFilteredAttendance] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const { user } = useAuth()

    const startDate = startOfMonth(currentMonth)
    const endDate = endOfMonth(currentMonth)



    useEffect(() => {
        if (selectedChild)
        fetchAttendanceData()
    }, [currentMonth, selectedChild, statusFilter])

    useEffect(() => {
        fetchChild()
    }, [])

    const fetchChild = async () => {
        try {
            if(user?.roleCode == "Parent") {
                const response = await parentApi.getChildList(user?.userId);
                setMockChildren(response?.data.data);
                setSelectedChild(response?.data.data[0]?.userId);
            }
        } catch (error) {
            console.error("Error fetching child:", error)
        }
    }

    const fetchAttendanceData = async () => {
        setIsLoading(true)
        try {
            const data = {
                userId: selectedChild,
                startDate: format(startDate, "yyyy-MM-dd"),
                endDate: format(endDate, "yyyy-MM-dd"),
            }
            const response = await attendanceApi.getUserSummaryAttendance(data)
            if (response?.data.data.length === 0) {
                setFilteredAttendance([])
            }
            const filteredAttendances = response?.data.data.filter((record) => {
                if (record.userId !== selectedChild) return false
                if (statusFilter !== "all" && record.status !== parseInt(statusFilter)) return false
                return true
            })
            setFilteredAttendance(filteredAttendances)
            setIsLoading(false)
        } catch (error) {
            console.error("Error fetching attendance data:", error)
            setIsLoading(false)
        }
    }

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))

    const getStatusLabel = (status) => {
        switch (status) {
            case 1:
                return "Có mặt"
            case 0:
                return "Vắng mặt"
            default:
                return "Không xác định"
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 1:
                return "bg-green-100 text-green-800"
            case 0:
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-[#BD2427] text-white shadow-md">
                <div className="container mx-auto px-4 py-6">
                    <h1 className="text-2xl md:text-3xl font-bold flex items-center">
                        <Calendar className="mr-2" />
                        Theo dõi điểm danh
                    </h1>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                {/* Filters */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        {/* Month Selector */}
                        <div className="flex items-center">
                            <button onClick={prevMonth} className="p-2 rounded-full hover:bg-gray-100" aria-label="Tháng trước">
                                <ChevronLeft className="h-5 w-5 text-gray-600" />
                            </button>
                            <h2 className="text-xl font-semibold mx-4">{format(currentMonth, "MMMM yyyy", { locale: vi })}</h2>
                            <button onClick={nextMonth} className="p-2 rounded-full hover:bg-gray-100" aria-label="Tháng sau">
                                <ChevronRight className="h-5 w-5 text-gray-600" />
                            </button>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex items-center">
                                <User className="mr-2 h-5 w-5 text-[#BD2427]" />
                                {selectedChild && <Select className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#BD2427] focus:border-transparent"
                                    value={selectedChild}
                                    onValueChange={(value) => setSelectedChild(value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn con" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {mockChildren.map((child) => (
                                            <SelectItem key={child.userId} value={child.userId}>
                                                {child.fullname}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>}
                            </div>

                            <div className="flex items-center">
                                <Filter className="mr-2 h-5 w-5 text-[#BD2427]" />
                                <Select className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#BD2427] focus:border-transparent"
                                    value={statusFilter}
                                    onValueChange={(value) => setStatusFilter(value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Tất cả trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tất cả trạng thái</SelectItem>
                                        <SelectItem value="1">Có mặt</SelectItem>
                                        <SelectItem value="0">Vắng mặt</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Attendance Table */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#BD2427]"></div>
                        </div>
                    ) : filteredAttendance.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Ngày
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Học viên
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Trạng thái
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Ghi chú
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredAttendance.map((record) => (
                                        <tr key={record.attendanceId} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {/* In a real app, you would format the date from the trainingSessionId or another field */}
                                                {format(new Date(), "dd/MM/yyyy")}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {mockChildren.find((child) => child.userId === record.userId)?.name || record.userId}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(record.status)}`}
                                                >
                                                    {getStatusLabel(record.status)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.note || "-"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-center p-4">
                            <h3 className="text-xl font-medium text-gray-600 mb-1">Không có buổi tập nào trong tháng này</h3>
                            <p className="text-gray-500 max-w-md">
                                Hãy thử chọn một tháng khác hoặc điều chỉnh bộ lọc để xem kết quả.
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}