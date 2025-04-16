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

export default function PresidentPayment() {
    return (
        <div className="container mx-auto py-6">
            <div className="flex items-center mb-6">
                <Link href="/">
                    <Button variant="ghost" size="sm" className="gap-1">
                        <ArrowLeft className="h-4 w-4" /> Back
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold ml-4">President Dashboard</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Teams</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">5</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">3</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$2,450</div>
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Tabs defaultValue="pending">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                            <TabsList>
                                <TabsTrigger value="pending">Pending Reports</TabsTrigger>
                                <TabsTrigger value="approved">Approved Reports</TabsTrigger>
                                <TabsTrigger value="history">Payment History</TabsTrigger>
                            </TabsList>

                            <div className="flex flex-wrap gap-2 items-center">
                                <Filter className="h-4 w-4 text-muted-foreground" />
                                <Select defaultValue="all-teams">
                                    <SelectTrigger className="w-[140px]">
                                        <SelectValue placeholder="Select team" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all-teams">All Teams</SelectItem>
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
                                        <SelectItem value="april-2025">April 2025</SelectItem>
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
                                    <CardTitle>Pending Expense Reports</CardTitle>
                                    <CardDescription className="text-[#94949B]">Review and approve team expense reports</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <PendingReportsList />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="approved">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Approved Expense Reports</CardTitle>
                                    <CardDescription className="text-[#94949B]">Recently approved team expense reports</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ApprovedReportsList />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="history">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Payment History</CardTitle>
                                    <CardDescription className="text-[#94949B]">Track all team payment activities</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <PaymentHistoryList />
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Team Summary</CardTitle>
                            <CardDescription className="text-[#94949B]">Overview of all teams</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <TeamSummary />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
