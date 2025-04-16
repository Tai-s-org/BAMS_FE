"use client"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { Separator } from "@/components/ui/Seperator"
import { Badge } from "@/components/ui/Badge"
import Link from "next/link"
import { ArrowLeft, FileText, DollarSign, Users, Clock } from "lucide-react"


export default function ManagerReportDetail({ params }) {
    // For demo purposes, we'll determine if the report is approved based on the ID
    // In a real app, this would come from your database
    const isApproved = params.id === "120" || params.id === "117"
    const isPending = params.id === "123"

    return (
        <div className="container mx-auto py-6">
            <div className="flex items-center mb-6">
                <Link href="/manager/dashboard">
                    <Button variant="ghost" size="sm" className="gap-1">
                        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold ml-4">Expense Report #{params.id}</h1>
                {isApproved && <Badge className="ml-4 bg-green-500">Approved</Badge>}
                {isPending && <Badge className="ml-4 bg-yellow-500">Pending</Badge>}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                {isPending
                                    ? "March 2025 Expenses"
                                    : isApproved && params.id === "120"
                                        ? "February 2025 Expenses"
                                        : "January 2025 Expenses"}
                            </CardTitle>
                            <CardDescription>
                                Submitted on{" "}
                                {isPending
                                    ? "April 10, 2025"
                                    : isApproved && params.id === "120"
                                        ? "March 5, 2025"
                                        : "February 8, 2025"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-medium mb-2">Description</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Monthly expense report for Team Alpha including equipment, training, and travel expenses.
                                    </p>
                                </div>

                                <Separator />

                                <div>
                                    <h3 className="font-medium mb-2">Expense Items</h3>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-3 text-sm">
                                            <div className="font-medium">Item</div>
                                            <div className="font-medium">Category</div>
                                            <div className="font-medium text-right">Amount</div>
                                        </div>

                                        <Separator />

                                        <div className="grid grid-cols-3 text-sm">
                                            <div>New Equipment</div>
                                            <div>Equipment</div>
                                            <div className="text-right">
                                                ${isPending ? "800" : isApproved && params.id === "120" ? "750" : "700"}
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="grid grid-cols-3 text-sm">
                                            <div>Training Session</div>
                                            <div>Training</div>
                                            <div className="text-right">
                                                ${isPending ? "350" : isApproved && params.id === "120" ? "300" : "300"}
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="grid grid-cols-3 text-sm">
                                            <div>Travel Expenses</div>
                                            <div>Travel</div>
                                            <div className="text-right">
                                                ${isPending ? "450" : isApproved && params.id === "120" ? "400" : "350"}
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="grid grid-cols-3 text-sm font-medium">
                                            <div className="col-span-2">Total</div>
                                            <div className="text-right">
                                                ${isPending ? "1,600" : isApproved && params.id === "120" ? "1,450" : "1,350"}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div>
                                    <h3 className="font-medium mb-2">Team Members (4)</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Each member will be charged $
                                        {isPending ? "400" : isApproved && params.id === "120" ? "362.50" : "337.50"} after approval.
                                    </p>
                                </div>

                                <Separator />

                                <div>
                                    <h3 className="font-medium mb-2">Attachments</h3>
                                    <div className="text-sm text-blue-500 underline">
                                        {isPending
                                            ? "receipt-march-2025.pdf"
                                            : isApproved && params.id === "120"
                                                ? "receipt-february-2025.pdf"
                                                : "receipt-january-2025.pdf"}
                                    </div>
                                </div>

                                {isApproved && (
                                    <>
                                        <Separator />
                                        <div>
                                            <h3 className="font-medium mb-2">President Comment</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Approved. All expenses are valid and within budget.
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end">
                            {isPending ? (
                                <div className="flex items-center text-yellow-500 gap-1">
                                    <Clock className="h-4 w-4" />
                                    <span>Waiting for President Approval</span>
                                </div>
                            ) : (
                                <div className="flex items-center text-green-500 gap-1">
                                    <Badge className="bg-green-500">Approved</Badge>
                                </div>
                            )}
                        </CardFooter>
                    </Card>
                </div>

                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Report Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">Team Alpha</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">
                                        Total: ${isPending ? "1,600" : isApproved && params.id === "120" ? "1,450" : "1,350"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">
                                        {isPending
                                            ? "Submitted: April 10, 2025"
                                            : isApproved && params.id === "120"
                                                ? "Approved: March 7, 2025"
                                                : "Approved: February 10, 2025"}
                                    </span>
                                </div>

                                <Separator />

                                {isApproved && (
                                    <div>
                                        <h3 className="text-sm font-medium mb-2">Payment Status</h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span>Alex Player:</span>
                                                <Badge variant="outline" className="bg-green-50 text-green-700">
                                                    Paid
                                                </Badge>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Sam Player:</span>
                                                <Badge variant="outline" className="bg-green-50 text-green-700">
                                                    Paid
                                                </Badge>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Taylor Player:</span>
                                                {params.id === "120" ? (
                                                    <Badge variant="outline" className="bg-green-50 text-green-700">
                                                        Paid
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="bg-green-50 text-green-700">
                                                        Paid
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Jordan Player:</span>
                                                {params.id === "120" ? (
                                                    <Badge variant="outline" className="bg-green-50 text-green-700">
                                                        Paid
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="bg-green-50 text-green-700">
                                                        Paid
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {isPending && (
                                    <div>
                                        <h3 className="text-sm font-medium mb-2">Approval Timeline</h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span>Submitted:</span>
                                                <span>April 10, 2025</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Expected Approval:</span>
                                                <span>April 17, 2025</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
