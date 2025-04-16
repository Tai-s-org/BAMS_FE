"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,} from "@/components/ui/Dialog"
import { Separator } from "@/components/ui/Seperator"
import { Badge } from "@/components/ui/Badge"
import { Textarea } from "@/components/ui/Textarea"
import Link from "next/link"
import { ArrowLeft, CheckCircle, FileText, DollarSign, Users } from "lucide-react"

export default function PresidentReportDetail({ id }) {
    const [isApproved, setIsApproved] = useState(false)
    const [isRejected, setIsRejected] = useState(false)
    const [comment, setComment] = useState("")

    const handleApprove = () => {
        setIsApproved(true)
        setIsRejected(false)
    }

    const handleReject = () => {
        setIsRejected(true)
        setIsApproved(false)
    }

    return (
        <div className="container mx-auto py-6">
            <div className="flex items-center mb-6">
                <Link href="/president/dashboard">
                    <Button variant="ghost" size="sm" className="gap-1">
                        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold ml-4">Expense Report #{id}</h1>
                {isApproved && <Badge className="ml-4 bg-green-500">Approved</Badge>}
                {isRejected && <Badge className="ml-4 bg-red-500">Rejected</Badge>}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Team Alpha Expense Report - March 2025
                            </CardTitle>
                            <CardDescription>Submitted by John Manager on April 10, 2025</CardDescription>
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
                                            <div className="text-right">$800</div>
                                        </div>

                                        <Separator />

                                        <div className="grid grid-cols-3 text-sm">
                                            <div>Training Session</div>
                                            <div>Training</div>
                                            <div className="text-right">$350</div>
                                        </div>

                                        <Separator />

                                        <div className="grid grid-cols-3 text-sm">
                                            <div>Travel Expenses</div>
                                            <div>Travel</div>
                                            <div className="text-right">$450</div>
                                        </div>

                                        <Separator />

                                        <div className="grid grid-cols-3 text-sm font-medium">
                                            <div className="col-span-2">Total</div>
                                            <div className="text-right">$1,600</div>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div>
                                    <h3 className="font-medium mb-2">Team Members (4)</h3>
                                    <p className="text-sm text-muted-foreground">Each member will be charged $400 after approval.</p>
                                </div>

                                <Separator />

                                <div>
                                    <h3 className="font-medium mb-2">Attachments</h3>
                                    <div className="text-sm text-blue-500 underline">receipt-march-2025.pdf</div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium">President Comment</h3>
                                <Textarea
                                    placeholder="Add your comment here..."
                                    className="w-80"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    disabled={isApproved || isRejected}
                                />
                            </div>
                            <div className="space-x-2">
                                {!isApproved && !isRejected && (
                                    <>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="destructive">Reject</Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Reject Expense Report</DialogTitle>
                                                    <DialogDescription>
                                                        Are you sure you want to reject this expense report? This action cannot be undone.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <DialogFooter>
                                                    <Button variant="outline" onClick={() => { }}>
                                                        Cancel
                                                    </Button>
                                                    <Button variant="destructive" onClick={handleReject}>
                                                        Confirm Rejection
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>

                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button>Approve</Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Approve Expense Report</DialogTitle>
                                                    <DialogDescription>
                                                        Are you sure you want to approve this expense report? This will charge each team member
                                                        $400.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <DialogFooter>
                                                    <Button variant="outline" onClick={() => { }}>
                                                        Cancel
                                                    </Button>
                                                    <Button onClick={handleApprove}>Confirm Approval</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </>
                                )}

                                {(isApproved || isRejected) && (
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setIsApproved(false)
                                            setIsRejected(false)
                                            setComment("")
                                        }}
                                    >
                                        Reset Status
                                    </Button>
                                )}
                            </div>
                        </CardFooter>
                    </Card>
                </div>

                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Team Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">Team Alpha</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">Monthly Budget: $2,000</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <span className="text-sm">Previous Report: Approved</span>
                                </div>

                                <Separator />

                                <div>
                                    <h3 className="text-sm font-medium mb-2">Team Members</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li>Alex Player</li>
                                        <li>Sam Player</li>
                                        <li>Taylor Player</li>
                                        <li>Jordan Player</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
