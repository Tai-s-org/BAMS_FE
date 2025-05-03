import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { PendingReportsList } from "@/components/payment/president/PendingReportList"
import { ApprovedReportsList } from "@/components/payment/president/ApprovedReportList"
import { PaymentHistoryList } from "@/components/payment/president/PaymentHistoryList"
import { TeamSummary } from "@/components/payment/president/TeamSummary"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import Link from "next/link"
import { ArrowLeft, Filter } from "lucide-react"
import { useEffect, useState } from "react"
import teamFundApi from "@/api/teamFund"

export default function PresidentPayment() {
    const [teamFundList, setTeamFundList] = useState([])


    useEffect(() => {
        const fetchTeamFund = async() => {
            try {
                const response = await teamFundApi.teamFundList();
                console.log(response.data);
                setTeamFundList(response.data.data)
            } catch (error) {
                
            }
        }
        fetchTeamFund()
    }, [])

    function formatTienVN(number) {
        return number != null ? number.toLocaleString('vi-VN') : "";
    }

    const pendingTeamFundList = teamFundList.filter((item) => item.status === 0)
    const aprrovedTeamFundList = teamFundList.filter((item) => item.status === 1)
    const totalAmount = teamFundList.reduce((sum, item) => sum + parseInt(item.totalExpenditure, 10), 0)

    return (
        <div className="container mx-auto py-6">
            <div className="flex items-center mb-6">
                <Link href="/dashboard">
                    <Button variant="ghost" size="sm" className="gap-1">
                        <ArrowLeft className="h-4 w-4" /> Quay lại
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold ml-4">Thống kê thanh toán của câu lạc bộ</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Tổng số đội</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">5</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Báo cáo đang chờ xử lý</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingTeamFundList?.length}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Tổng số tiền</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatTienVN(totalAmount)} VNĐ</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Payment Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">78%</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:col-span-2">
                    <Tabs defaultValue="pending">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                            <TabsList>
                                <TabsTrigger value="pending">Báo cáo đang chờ duyệt</TabsTrigger>
                                <TabsTrigger value="approved">Báo cáo đã duyệt</TabsTrigger>
                                <TabsTrigger value="history">Lịch sử thanh toán</TabsTrigger>
                            </TabsList>

                            <div className="flex flex-wrap gap-2 items-center">
                                <Filter className="h-4 w-4 text-muted-foreground" />
                                <Select defaultValue="all-teams">
                                    <SelectTrigger className="w-[140px]">
                                        <SelectValue placeholder="Select team" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all-teams">Tất cả các đội</SelectItem>
                                        <SelectItem value="team-alpha">Team Alpha</SelectItem>
                                        <SelectItem value="team-beta">Team Beta</SelectItem>
                                        <SelectItem value="team-gamma">Team Gamma</SelectItem>
                                        <SelectItem value="team-delta">Team Delta</SelectItem>
                                        <SelectItem value="team-epsilon">Team Epsilon</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select defaultValue="april-2025">
                                    <SelectTrigger className="w-[140px]">
                                        <SelectValue placeholder="Select month" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="april-2025">Tháng 4 2025</SelectItem>
                                        <SelectItem value="march-2025">March 2025</SelectItem>
                                        <SelectItem value="february-2025">February 2025</SelectItem>
                                        <SelectItem value="january-2025">January 2025</SelectItem>
                                        <SelectItem value="december-2024">December 2024</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <TabsContent value="pending">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Báo cáo quỹ đội chờ xét duyệt</CardTitle>
                                    <CardDescription className="text-[#94949B]">Xem xét và phê duyệt báo cáo chi phí của các đội</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <PendingReportsList  pendingReports={pendingTeamFundList}/>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="approved">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Báo cáo chi phí đã được phê duyệt</CardTitle>
                                    <CardDescription className="text-[#94949B]">Báo cáo chi phí của các đội được phê duyệt gần đây</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ApprovedReportsList approvedReports={aprrovedTeamFundList} />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="history">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Lịch sử thanh toán</CardTitle>
                                    <CardDescription className="text-[#94949B]">Theo dõi tất cả các hoạt động thanh toán của đội</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <PaymentHistoryList />
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Team Summary</CardTitle>
                            <CardDescription className="text-[#94949B]">Overview of all teams</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <TeamSummary />
                        </CardContent>
                    </Card>
                </div> */}
            </div>
        </div>
    )
}
