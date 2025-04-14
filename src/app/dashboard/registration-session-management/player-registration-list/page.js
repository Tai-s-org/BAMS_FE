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
//import { RegistrationDetailsModal } from "./ManagerRegistrationDetailModal"
import registerApi from "@/api/register"
import { useToasts } from "@/hooks/providers/ToastProvider"
import { DatePicker } from "@/components/ui/DatePicker"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { PendingTab } from "./PendingTabs"
import { CheckInTab } from "./CheckinTabs"
import { ScoringTab } from "./ScoringTabs"
import { ApprovalTab } from "./ApproveTabs"
import { CompletedTab } from "./CompletedTabs"


export default function PlayerRegistrationPage() {

    const [players, setPlayers] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [dateFilter, setDateFilter] = useState()
    const [selectedItem, setSelectedItem] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalPages, setTotalPages] = useState(1)

    const { addToast } = useToasts();
    const memberRegistrationSessionId = localStorage.getItem("memberRegistrationSessionId")
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
            if (memberRegistrationSessionId) {
                const response = await registerApi.getAllPlayerByRegistrationID(memberRegistrationSessionId, filters);
                console.log(response)
                setPlayers(response.data.data);
            }
        } catch (error) {
            addToast({ message: error.response.data.message, type: "error" });
            setPlayers([])
        }
    }

    useEffect(() => {
        fetchData();
    }, [searchTerm, statusFilter, dateFilter, currentPage, pageSize])

    const pendingPlayers = players?.filter((player) => player.status === "Pending")
    const tryoutPlayers = players?.filter((player) => player.status === "Called")
    const checkedInPlayers = players?.filter((player) => player.status === "Checked-in")
    const scoredPlayers = players?.filter((player) => player.status === "Scored")
    const completedPlayers = players?.filter((player) => player.status === "Approved" || player.status === "Rejected")

    const handleStatusChange = async () => {
        await fetchData()
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">Quản lý đăng ký cầu thủ</h1>

            <Tabs defaultValue="pending" className="w-full">
                <TabsList className="grid grid-cols-5 mb-8 p-1 bg-white border-2 border-gray-200 rounded-lg">
                    <TabsTrigger
                        value="pending"
                        className="data-[state=active]:bg-[#bd2427] data-[state=active]:text-white font-medium border border-gray-200 rounded-md py-2"
                    >
                        Chờ xử lý ({pendingPlayers?.length})
                    </TabsTrigger>
                    <TabsTrigger
                        value="tryout"
                        className="data-[state=active]:bg-[#bd2427] data-[state=active]:text-white font-medium border border-gray-200 rounded-md py-2"
                    >
                        Gọi kiểm tra kĩ năng ({tryoutPlayers?.length})
                    </TabsTrigger>
                    <TabsTrigger
                        value="scoring"
                        className="data-[state=active]:bg-[#bd2427] data-[state=active]:text-white font-medium border border-gray-200 rounded-md py-2"
                    >
                        Chấm điểm ({checkedInPlayers?.length})
                    </TabsTrigger>
                    <TabsTrigger
                        value="approval"
                        className="data-[state=active]:bg-[#bd2427] data-[state=active]:text-white font-medium border border-gray-200 rounded-md py-2"
                    >
                        Phê duyệt ({scoredPlayers?.length})
                    </TabsTrigger>
                    <TabsTrigger
                        value="completed"
                        className="data-[state=active]:bg-[#bd2427] data-[state=active]:text-white font-medium border border-gray-200 rounded-md py-2"
                    >
                        Hoàn thành ({completedPlayers?.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="pending">
                    <PendingTab players={pendingPlayers} onStatusChange={handleStatusChange} />
                </TabsContent>

                <TabsContent value="tryout">
                    <CheckInTab players={tryoutPlayers} onStatusChange={handleStatusChange} />
                </TabsContent>

                <TabsContent value="scoring">
                    <ScoringTab players={checkedInPlayers} onStatusChange={handleStatusChange} />
                </TabsContent>

                <TabsContent value="approval">
                    <ApprovalTab players={scoredPlayers} onStatusChange={handleStatusChange} />
                </TabsContent>

                <TabsContent value="completed">
                    <CompletedTab players={completedPlayers} />
                </TabsContent>
            </Tabs>
        </div>
    )
}

