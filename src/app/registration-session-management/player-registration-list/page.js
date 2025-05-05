"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Eye, Search, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Card, CardContent } from "@/components/ui/Card"
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
import { useRouter } from "next/navigation"


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
    const [activeTab, setActiveTab] = useState("pending")
    const [isLoading, setIsLoading] = useState(true)

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
                setIsLoading(false)
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

    const handleTabChange = (value) => {
        setActiveTab(value)
    }

    const router = useRouter();

    // return (
    //     <div className="container mx-auto py-8">
    //         <h1 className="text-2xl font-bold mb-6">Quản lý đăng ký cầu thủ</h1>

    //         <Tabs defaultValue="pending" className="w-full">
    //             <TabsList className="grid grid-cols-5 mb-8 p-1 bg-white border-2 border-gray-200 rounded-lg gap-1">
    //                 <TabsTrigger
    //                     value="pending"
    //                     className="data-[state=active]:bg-[#bd2427] data-[state=active]:text-white font-medium border border-gray-200 rounded-md py-2"
    //                 >
    //                     Chờ xử lý ({pendingPlayers?.length})
    //                 </TabsTrigger>
    //                 <TabsTrigger
    //                     value="tryout"
    //                     className="data-[state=active]:bg-[#bd2427] data-[state=active]:text-white font-medium border border-gray-200 rounded-md py-2"
    //                 >
    //                     Gọi kiểm tra kĩ năng ({tryoutPlayers?.length})
    //                 </TabsTrigger>
    //                 <TabsTrigger
    //                     value="scoring"
    //                     className="data-[state=active]:bg-[#bd2427] data-[state=active]:text-white font-medium border border-gray-200 rounded-md py-2"
    //                 >
    //                     Chấm điểm ({checkedInPlayers?.length})
    //                 </TabsTrigger>
    //                 <TabsTrigger
    //                     value="approval"
    //                     className="data-[state=active]:bg-[#bd2427] data-[state=active]:text-white font-medium border border-gray-200 rounded-md py-2"
    //                 >
    //                     Phê duyệt ({scoredPlayers?.length})
    //                 </TabsTrigger>
    //                 <TabsTrigger
    //                     value="completed"
    //                     className="data-[state=active]:bg-[#bd2427] data-[state=active]:text-white font-medium border border-gray-200 rounded-md py-2"
    //                 >
    //                     Hoàn thành ({completedPlayers?.length})
    //                 </TabsTrigger>
    //             </TabsList>

    //             <TabsContent value="pending">
    //                 <PendingTab players={pendingPlayers} onStatusChange={handleStatusChange} />
    //             </TabsContent>

    //             <TabsContent value="tryout">
    //                 <CheckInTab players={tryoutPlayers} onStatusChange={handleStatusChange} />
    //             </TabsContent>

    //             <TabsContent value="scoring">
    //                 <ScoringTab players={checkedInPlayers} onStatusChange={handleStatusChange} />
    //             </TabsContent>

    //             <TabsContent value="approval">
    //                 <ApprovalTab players={scoredPlayers} onStatusChange={handleStatusChange} sessionId={memberRegistrationSessionId} />
    //             </TabsContent>

    //             <TabsContent value="completed">
    //                 <CompletedTab players={completedPlayers} />
    //             </TabsContent>
    //         </Tabs>
    //     </div>
    // )
    return (
        <div className="container mx-auto py-8 px-4 md:px-6">
            <Button variant="ghost" size="sm" className="gap-1 hover:bg-[#F4F4F5]" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" /> Quay lại
            </Button>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Quản lý đăng ký cầu thủ</h1>
                    <p className="text-gray-500 mt-1">Quản lý và theo dõi quá trình đăng ký của cầu thủ</p>
                </div>
            </div>

            <Card className="shadow-sm border-gray-200">
                <CardContent className="p-0">
                    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                        <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
                            <TabsList className="grid grid-cols-5 gap-2 bg-transparent">
                                <TabsTrigger
                                    value="pending"
                                    className={cn(
                                        "data-[state=active]:bg-[#bd2427] data-[state=active]:text-white font-medium rounded-md py-2 px-3",
                                        "border border-gray-200 bg-white shadow-sm transition-all",
                                        "hover:bg-gray-50 data-[state=active]:hover:bg-[#a01e21]",
                                    )}
                                >
                                    <div className="flex flex-col items-center">
                                        <span>Chờ xử lý</span>
                                        <Badge variant="secondary" className="mt-1 bg-gray-100 text-[#bd2427] ">
                                            {pendingPlayers?.length || 0}
                                        </Badge>
                                    </div>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="tryout"
                                    className={cn(
                                        "data-[state=active]:bg-[#bd2427] data-[state=active]:text-white font-medium rounded-md py-2 px-3",
                                        "border border-gray-200 bg-white shadow-sm transition-all",
                                        "hover:bg-gray-50 data-[state=active]:hover:bg-[#a01e21]",
                                    )}
                                >
                                    <div className="flex flex-col items-center">
                                        <span>Gọi kiểm tra</span>
                                        <Badge variant="secondary" className="mt-1 bg-gray-100 text-[#bd2427]">
                                            {tryoutPlayers?.length || 0}
                                        </Badge>
                                    </div>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="scoring"
                                    className={cn(
                                        "data-[state=active]:bg-[#bd2427] data-[state=active]:text-white font-medium rounded-md py-2 px-3",
                                        "border border-gray-200 bg-white shadow-sm transition-all",
                                        "hover:bg-gray-50 data-[state=active]:hover:bg-[#a01e21]",
                                    )}
                                >
                                    <div className="flex flex-col items-center">
                                        <span>Chấm điểm</span>
                                        <Badge variant="secondary" className="mt-1 bg-gray-100 text-[#bd2427]">
                                            {checkedInPlayers?.length || 0}
                                        </Badge>
                                    </div>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="approval"
                                    className={cn(
                                        "data-[state=active]:bg-[#bd2427] data-[state=active]:text-white font-medium rounded-md py-2 px-3",
                                        "border border-gray-200 bg-white shadow-sm transition-all",
                                        "hover:bg-gray-50 data-[state=active]:hover:bg-[#a01e21]",
                                    )}
                                >
                                    <div className="flex flex-col items-center">
                                        <span>Phê duyệt</span>
                                        <Badge variant="secondary" className="mt-1 bg-gray-100 text-[#bd2427]">
                                            {scoredPlayers?.length || 0}
                                        </Badge>
                                    </div>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="completed"
                                    className={cn(
                                        "data-[state=active]:bg-[#bd2427] data-[state=active]:text-white font-medium rounded-md py-2 px-3",
                                        "border border-gray-200 bg-white shadow-sm transition-all",
                                        "hover:bg-gray-50 data-[state=active]:hover:bg-[#a01e21]",
                                    )}
                                >
                                    <div className="flex flex-col items-center">
                                        <span>Hoàn thành</span>
                                        <Badge variant="secondary" className="mt-1 bg-gray-100 text-[#bd2427]">
                                            {completedPlayers?.length || 0}
                                        </Badge>
                                    </div>
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <div className="p-4">
                            {isLoading ? (
                                <div className="flex justify-center items-center py-20">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#bd2427]"></div>
                                </div>
                            ) : (
                                <>
                                    <TabsContent value="pending" className="mt-0">
                                        <PendingTab players={pendingPlayers} onStatusChange={handleStatusChange} />
                                    </TabsContent>

                                    <TabsContent value="tryout" className="mt-0">
                                        <CheckInTab players={tryoutPlayers} onStatusChange={handleStatusChange} />
                                    </TabsContent>

                                    <TabsContent value="scoring" className="mt-0">
                                        <ScoringTab players={checkedInPlayers} onStatusChange={handleStatusChange} />
                                    </TabsContent>

                                    <TabsContent value="approval" className="mt-0">
                                        <ApprovalTab
                                            players={scoredPlayers}
                                            onStatusChange={handleStatusChange}
                                            sessionId={memberRegistrationSessionId}
                                        />
                                    </TabsContent>

                                    <TabsContent value="completed" className="mt-0">
                                        <CompletedTab players={completedPlayers} />
                                    </TabsContent>
                                </>
                            )}
                        </div>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}

