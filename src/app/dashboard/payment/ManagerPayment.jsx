import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { ReportsList } from "@/components/payment/manager/ReportList"
import { TeamMembersList } from "@/components/payment/manager/TeamMemberList"
import { PaymentStatusList } from "@/components/payment/manager/PaymentStatusList"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import Link from "next/link"
import { ArrowLeft, Plus, Filter, Wallet } from "lucide-react"
import { useAuth } from "@/hooks/context/AuthContext"
import { useEffect, useState } from "react"
import teamFundApi from "@/api/teamFund"
import paymentApi from "@/api/payment"

export default function ManagerPayment() {
    const { userInfo } = useAuth();
    const [teamFunds, setTeamFunds] = useState([]);
    const [payments, setPayments] = useState([]);
    //console.log(userInfo?.roleInformation.teamId);
    const teamId = userInfo?.roleInformation.teamId;

    useEffect(() => {
        const fetchManagerInfo = async () => {
            console.log("teamId:", teamId);

            if (!teamId) return; // Guard clause

            try {
                const teamFundResponse = await teamFundApi.teamFundListByTeamId(teamId);
                console.log("Fetched team fund data:", teamFundResponse.data);
                setTeamFunds(teamFundResponse.data.data);

                const paymentsResponse = await paymentApi.getPaymentHistoryByTeam(teamId);
                console.log("Fetched payment data:", paymentsResponse.data);
                setPayments(paymentsResponse.data.data);
            } catch (error) {
                console.error('Error fetching manager info:', error);
            }
        };

        fetchManagerInfo();
    }, [teamId]);

    return (
        <div className="container mx-auto py-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <h1 className="text-2xl font-bold ml-4"></h1>
                </div>
                <Link href="/dashboard/payment/team-payment">
                    <Button className="gap-1">
                        <Wallet className="h-4 w-4" /> Xem các thanh toán của đội
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Số thành viên hiện tại</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">4</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Báo cáo quỹ đội đang chờ</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Tỷ lệ thanh toán thành công</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">75%</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Tabs defaultValue="reports">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                            {/* <TabsList>
                                <TabsTrigger value="reports">Báo cáo thu chi</TabsTrigger>
                                <TabsTrigger value="payments">Trạng thái thanh toán</TabsTrigger>
                            </TabsList> */}

                            <div className="flex gap-2 items-center">
                                <Filter className="h-4 w-4 text-muted-foreground" />
                                <Select defaultValue="april-2025">
                                    <SelectTrigger className="w-[180px]">
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

                        {/* <TabsContent value="reports"> */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Báo cáo thu chi</CardTitle>
                                    <CardDescription>Xem và quản lý báo cáo chi phí của đội</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ReportsList  reports={teamFunds}/>
                                </CardContent>
                            </Card>
                        {/* </TabsContent> */}

                        {/* <TabsContent value="payments">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Trạng thái thanh toán</CardTitle>
                                    <CardDescription>Track your team members' payment status</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <PaymentStatusList payments={payments}/>
                                </CardContent>
                            </Card>
                        </TabsContent> */}
                    </Tabs>
                </div>

                {/* <div>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Team Members</CardTitle>
                                <CardDescription>Current month payment status</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <TeamMembersList />
                        </CardContent>
                    </Card>
                </div> */}
            </div>
        </div>
    )
}
