"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { Separator } from "@/components/ui/Seperator"
import { Badge } from "@/components/ui/Badge"
import Link from "next/link"
import { ArrowLeft, FileText, DollarSign, CheckCircle, AlertTriangle, User } from "lucide-react"

export default function ParentPaymentDetail({ id }) {
    // For demo purposes, determine payment details based on ID
    const paymentDetails = {
        p101: {
            child: "Alex",
            team: "Team Alpha",
            title: "March 2025 Expenses",
            amount: 400,
            dueDate: "April 25, 2025",
            status: "pending",
            isOverdue: false,
        },
        p102: {
            child: "Alex",
            team: "Team Alpha",
            title: "Equipment Upgrade",
            amount: 350,
            dueDate: "April 10, 2025",
            status: "pending",
            isOverdue: true,
        },
        p103: {
            child: "Sam",
            team: "Team Beta",
            title: "March 2025 Expenses",
            amount: 300,
            dueDate: "April 28, 2025",
            status: "pending",
            isOverdue: false,
        },
        p104: {
            child: "Sam",
            team: "Team Beta",
            title: "Tournament Fee",
            amount: 100,
            dueDate: "May 5, 2025",
            status: "pending",
            isOverdue: false,
        },
        p001: {
            child: "Alex",
            team: "Team Alpha",
            title: "February 2025 Expenses",
            amount: 362.5,
            date: "March 15, 2025",
            status: "paid",
            isOverdue: false,
        },
        p002: {
            child: "Sam",
            team: "Team Beta",
            title: "February 2025 Expenses",
            amount: 275,
            date: "March 18, 2025",
            status: "paid",
            isOverdue: false,
        },
    }[params.id] || {
        child: "Unknown",
        team: "Unknown Team",
        title: "Unknown Payment",
        amount: 0,
        status: "unknown",
        isOverdue: false,
    }

    const isPaid = paymentDetails.status === "paid"
    const isOverdue = paymentDetails.isOverdue
    const [receiptImage, setReceiptImage] = useState(null)

    return (
        <div className="container mx-auto py-6">
            <div className="flex items-center mb-6">
                <Link href="/parent/dashboard">
                    <Button variant="ghost" size="sm" className="gap-1">
                        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold ml-4">
                    Payment #{id} - {paymentDetails.child}
                </h1>
                {isPaid && <Badge className="ml-4 bg-green-500">Paid</Badge>}
                {!isPaid && !isOverdue && <Badge className="ml-4 bg-yellow-500">Pending</Badge>}
                {isOverdue && <Badge className="ml-4 bg-red-500">Overdue</Badge>}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                {paymentDetails.team} - {paymentDetails.title}
                            </CardTitle>
                            <CardDescription>
                                Payment for {paymentDetails.child} - {paymentDetails.team}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-medium mb-2">Description</h3>
                                    <p className="text-sm text-muted-foreground">
                                        This payment represents {paymentDetails.child}'s share of the {paymentDetails.team}{" "}
                                        {paymentDetails.title.toLowerCase()}.
                                    </p>
                                </div>

                                <Separator />

                                <div>
                                    <h3 className="font-medium mb-2">Payment Details</h3>
                                    <div className="space-y-2">
                                        <div className="grid grid-cols-2 text-sm">
                                            <div className="text-muted-foreground">Child:</div>
                                            <div>{paymentDetails.child}</div>
                                        </div>
                                        <div className="grid grid-cols-2 text-sm">
                                            <div className="text-muted-foreground">Team:</div>
                                            <div>{paymentDetails.team}</div>
                                        </div>
                                        <div className="grid grid-cols-2 text-sm">
                                            <div className="text-muted-foreground">Amount:</div>
                                            <div className="font-medium">${paymentDetails.amount}</div>
                                        </div>
                                        {isPaid ? (
                                            <div className="grid grid-cols-2 text-sm">
                                                <div className="text-muted-foreground">Paid Date:</div>
                                                <div>{paymentDetails.date}</div>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-2 text-sm">
                                                <div className="text-muted-foreground">Due Date:</div>
                                                <div className={isOverdue ? "text-red-500 font-medium" : ""}>
                                                    {paymentDetails.dueDate} {isOverdue && "(Overdue)"}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {receiptImage && (
                                    <>
                                        <Separator />
                                        <div>
                                            <h3 className="font-medium mb-2">Payment Receipt</h3>
                                            <div className="border rounded-md p-2 max-w-xs">
                                                <img src={receiptImage || "/placeholder.svg"} alt="Payment receipt" className="w-full" />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                            {isPaid && (
                                <div className="flex items-center text-green-500 gap-1">
                                    <CheckCircle className="h-4 w-4" />
                                    <span>Payment Completed</span>
                                </div>
                            )}
                            {!isPaid && !isOverdue && (
                                <div className="flex items-center text-yellow-500 gap-1">
                                    <AlertTriangle className="h-4 w-4" />
                                    <span>Payment Pending</span>
                                </div>
                            )}
                            {isOverdue && (
                                <div className="flex items-center text-red-500 gap-1">
                                    <AlertTriangle className="h-4 w-4" />
                                    <span>Payment Overdue</span>
                                </div>
                            )}
                        </CardFooter>
                    </Card>
                </div>

                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Child Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{paymentDetails.child}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">Amount: ${paymentDetails.amount}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {isPaid ? (
                                        <>
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                            <span className="text-sm">Status: Paid</span>
                                        </>
                                    ) : isOverdue ? (
                                        <>
                                            <AlertTriangle className="h-4 w-4 text-red-500" />
                                            <span className="text-sm">Status: Overdue</span>
                                        </>
                                    ) : (
                                        <>
                                            <FileText className="h-4 w-4 text-yellow-500" />
                                            <span className="text-sm">Status: Pending</span>
                                        </>
                                    )}
                                </div>

                                <Separator />

                                <div>
                                    <h3 className="text-sm font-medium mb-2">Contact Information</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="grid grid-cols-2">
                                            <div className="text-muted-foreground">Team Manager:</div>
                                            <div>
                                                {paymentDetails.team === "Team Alpha"
                                                    ? "John Manager"
                                                    : paymentDetails.team === "Team Beta"
                                                        ? "Jane Manager"
                                                        : "Unknown"}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2">
                                            <div className="text-muted-foreground">Email:</div>
                                            <div className="text-blue-600">
                                                {paymentDetails.team === "Team Alpha"
                                                    ? "john@example.com"
                                                    : paymentDetails.team === "Team Beta"
                                                        ? "jane@example.com"
                                                        : "unknown@example.com"}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2">
                                            <div className="text-muted-foreground">Phone:</div>
                                            <div>
                                                {paymentDetails.team === "Team Alpha"
                                                    ? "(555) 123-4567"
                                                    : paymentDetails.team === "Team Beta"
                                                        ? "(555) 987-6543"
                                                        : "N/A"}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {isOverdue && (
                                    <>
                                        <Separator />
                                        <div className="p-3 bg-red-50 rounded-md border border-red-200">
                                            <h3 className="text-sm font-medium text-red-700 mb-1">Payment Overdue</h3>
                                            <p className="text-xs text-red-600">
                                                This payment is past its due date. Please contact the team manager for assistance.
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
