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
import playerApi from "@/api/player"
import { format, parseISO, startOfMonth, endOfMonth } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function ManagerPayment() {
    const [allPlayers, setAllPlayers] = useState([])
    const { userInfo } = useAuth();
    const [teamFunds, setTeamFunds] = useState([]);
    const [payments, setPayments] = useState([]);
    const [monthOptions, setMonthOptions] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState("");
    //console.log(userInfo?.roleInformation.teamId);
    const teamId = userInfo?.roleInformation.teamId;

    const filter = {
        StartDate: "",
        EndDate: ""
    }

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

        const fetchPlayers = async () => {
            try {
                const data = {
                    TeamId: userInfo?.roleInformation.teamId,
                    PageSize: 100
                }
                console.log(data);
                
                const response = await playerApi.getAllPlayerWithTeam(data);
                
                setAllPlayers(response?.data?.data.items);
            } catch (error) {
                console.log(error)
            }
        }

        fetchPlayers();
        fetchManagerInfo();
    }, [teamId]);

    useEffect(() => {
        if (teamFunds.length > 0) {
            const uniqueMonths = Array.from(
                new Set(teamFunds.map((fund) => format(new Date(fund.endDate), "yyyy-MM")))
            )
            setMonthOptions(uniqueMonths)
            if (uniqueMonths.length > 0) {
                setSelectedMonth(uniqueMonths[0])
            }
        }
    }, [teamFunds]);

    useEffect(() => {
        if (selectedMonth) {
            const [month, year] = selectedMonth.split("-");
            const start = startOfMonth(new Date(`${year}-${month}-01`));
            const end = endOfMonth(start);
            //setFilters({ startDate: start.toISOString(), endDate: end.toISOString() });
        }
    }, [selectedMonth]);

    const pendingTeamFund = teamFunds.filter((teamfund) => teamfund.status === 0)

    return (
        <div className="container mx-auto py-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <h1 className="text-2xl font-bold ml-4"></h1>
                </div>
                <Link href="/payment/team-payment">
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
                        <div className="text-2xl font-bold">{allPlayers.length}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Báo cáo quỹ đội đang chờ</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingTeamFund.length}</div>
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
                                <Select value={selectedMonth} onValueChange={(val) => setSelectedMonth(val)}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Chọn tháng" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {monthOptions.map((monthVal) => (
                                            <SelectItem key={monthVal} value={monthVal}>
                                                Tháng {format(new Date(`${monthVal}-01`), "MM yyyy", { locale: vi })}
                                            </SelectItem>
                                        ))}
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
                                <ReportsList reports={teamFunds} />
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
            </div>
        </div>
    )
}
