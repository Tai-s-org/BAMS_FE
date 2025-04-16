import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { ReportsList } from "@/components/payment/manager/ReportList"
import { TeamMembersList } from "@/components/payment/manager/TeamMemberList"
import { PaymentStatusList } from "@/components/payment/manager/PaymentStatusList"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import Link from "next/link"
import { ArrowLeft, Plus, Filter } from "lucide-react"

export default function ManagerPayment() {
    return (
        <div className="container mx-auto py-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <Link href="/">
                        <Button variant="ghost" size="sm" className="gap-1">
                            <ArrowLeft className="h-4 w-4" /> Back
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold ml-4">Manager Dashboard</h1>
                </div>
                <Link href="/manager/create-report">
                    <Button className="gap-1">
                        <Plus className="h-4 w-4" /> Create New Report
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">4</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Payment Rate</CardTitle>
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
                            <TabsList>
                                <TabsTrigger value="reports">Expense Reports</TabsTrigger>
                                <TabsTrigger value="payments">Payment Status</TabsTrigger>
                            </TabsList>

                            <div className="flex gap-2 items-center">
                                <Filter className="h-4 w-4 text-muted-foreground" />
                                <Select defaultValue="april-2025">
                                    <SelectTrigger className="w-[180px]">
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

                        <TabsContent value="reports">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Expense Reports</CardTitle>
                                    <CardDescription>View and manage your team's expense reports</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ReportsList />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="payments">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Payment Status</CardTitle>
                                    <CardDescription>Track your team members' payment status</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <PaymentStatusList />
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                <div>
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
                </div>
            </div>
        </div>
    )
}
