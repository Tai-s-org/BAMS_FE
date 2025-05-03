import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { ChildrenPaymentsList } from "@/components/payment/parent/ChildrenPaymentList"
import { ChildrenSummary } from "@/components/payment/parent/ChildrenSummary"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import Link from "next/link"
import { ArrowLeft, Filter } from "lucide-react"

export default function ParentPayment() {
    return (
        <div className="container mx-auto py-6">
            <div className="flex items-center mb-6">
                <Link href="/">
                    <Button variant="ghost" size="sm" className="gap-1">
                        <ArrowLeft className="h-4 w-4" /> Back
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold ml-4">Parent Dashboard</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Children</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">3</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Due</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$1,150</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Payment Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">67%</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Tabs defaultValue="all">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                            <TabsList>
                                <TabsTrigger value="all">All Children</TabsTrigger>
                                <TabsTrigger value="alex">Alex</TabsTrigger>
                                <TabsTrigger value="sam">Sam</TabsTrigger>
                            </TabsList>

                            <div className="flex flex-wrap gap-2 items-center">
                                <Filter className="h-4 w-4 text-muted-foreground" />
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

                        <TabsContent value="all">
                            <Card>
                                <CardHeader>
                                    <CardTitle>All Children's Payments</CardTitle>
                                    <CardDescription>View payment status for all your children</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ChildrenPaymentsList childFilter="all" />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="alex">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Alex's Payments</CardTitle>
                                    <CardDescription>View payment status for Alex</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ChildrenPaymentsList childFilter="alex" />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="sam">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Sam's Payments</CardTitle>
                                    <CardDescription>View payment status for Sam</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ChildrenPaymentsList childFilter="sam" />
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Children Summary</CardTitle>
                            <CardDescription>Overview of your children's payments</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChildrenSummary />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
