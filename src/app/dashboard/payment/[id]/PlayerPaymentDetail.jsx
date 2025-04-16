"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/Dialog"
import { Separator } from "@/components/ui/Seperator"
import { Badge } from "@/components/ui/Badge"
import Link from "next/link"
import { ArrowLeft, FileText, DollarSign, QrCode, CheckCircle, Upload, AlertTriangle } from "lucide-react"

export default function PlayerPaymentDetail({ id }) {
    const [isPaid, setIsPaid] = useState(false)
    const [showQR, setShowQR] = useState(false)
    const [showUpload, setShowUpload] = useState(false)
    const [receiptImage, setReceiptImage] = useState(null)

    // For demo purposes, determine if payment is overdue based on ID
    const isOverdue = id === "p102"

    const handlePay = () => {
        setIsPaid(true)
        setShowQR(false)
    }

    const handleUploadReceipt = () => {
        // Simulate receipt upload
        setReceiptImage("/placeholder.svg?height=300&width=200")
        setShowUpload(false)
    }

    return (
        <div className="container mx-auto py-6">
            <div className="flex items-center mb-6">
                <Link href="/player/dashboard">
                    <Button variant="ghost" size="sm" className="gap-1">
                        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold ml-4">Payment #{id}</h1>
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
                                Team Alpha - {isOverdue ? "Equipment Upgrade" : "March 2025 Expenses"}
                            </CardTitle>
                            <CardDescription>Your portion of the team expenses</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-medium mb-2">Description</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {isOverdue
                                            ? "This payment represents your share of the team equipment upgrade costs."
                                            : "This payment represents your share of the team expenses for March 2025, including equipment, training, and travel expenses."}
                                    </p>
                                </div>

                                <Separator />

                                <div>
                                    <h3 className="font-medium mb-2">Payment Details</h3>
                                    <div className="space-y-2">
                                        <div className="grid grid-cols-2 text-sm">
                                            <div className="text-muted-foreground">Total Team Expenses:</div>
                                            <div>${isOverdue ? "1,400" : "1,600"}</div>
                                        </div>
                                        <div className="grid grid-cols-2 text-sm">
                                            <div className="text-muted-foreground">Team Members:</div>
                                            <div>4</div>
                                        </div>
                                        <div className="grid grid-cols-2 text-sm">
                                            <div className="text-muted-foreground">Your Share:</div>
                                            <div className="font-medium">${isOverdue ? "350" : "400"}</div>
                                        </div>
                                        <div className="grid grid-cols-2 text-sm">
                                            <div className="text-muted-foreground">Due Date:</div>
                                            <div className={isOverdue ? "text-red-500 font-medium" : ""}>
                                                {isOverdue ? "April 10, 2025 (Overdue)" : "April 25, 2025"}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div>
                                    <h3 className="font-medium mb-2">Expense Breakdown</h3>
                                    <div className="space-y-2">
                                        {isOverdue ? (
                                            <>
                                                <div className="grid grid-cols-2 text-sm">
                                                    <div className="text-muted-foreground">New Equipment:</div>
                                                    <div>$350 (your share)</div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="grid grid-cols-2 text-sm">
                                                    <div className="text-muted-foreground">Equipment:</div>
                                                    <div>$200 (your share)</div>
                                                </div>
                                                <div className="grid grid-cols-2 text-sm">
                                                    <div className="text-muted-foreground">Training:</div>
                                                    <div>$87.50 (your share)</div>
                                                </div>
                                                <div className="grid grid-cols-2 text-sm">
                                                    <div className="text-muted-foreground">Travel:</div>
                                                    <div>$112.50 (your share)</div>
                                                </div>
                                            </>
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
                            {!isPaid && !isOverdue && (
                                <>
                                    <Button onClick={() => setShowUpload(true)} variant="outline" className="gap-1">
                                        <Upload className="h-4 w-4" /> Upload Receipt
                                    </Button>
                                    <Button onClick={() => setShowQR(true)} className="gap-1">
                                        <QrCode className="h-4 w-4" /> Pay Now
                                    </Button>
                                </>
                            )}
                            {!isPaid && isOverdue && (
                                <div className="flex items-center text-red-500 gap-1">
                                    <AlertTriangle className="h-4 w-4" />
                                    <span>Payment period has expired</span>
                                </div>
                            )}
                            {isPaid && !receiptImage && (
                                <Button onClick={() => setShowUpload(true)} variant="outline" className="gap-1">
                                    <Upload className="h-4 w-4" /> Upload Receipt
                                </Button>
                            )}
                            {isPaid && (
                                <div className="flex items-center text-green-500 gap-1">
                                    <CheckCircle className="h-4 w-4" />
                                    <span>Payment Completed</span>
                                </div>
                            )}
                        </CardFooter>
                    </Card>
                </div>

                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">Amount Due: ${isOverdue ? "350" : "400"}</span>
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

                                {isPaid && (
                                    <>
                                        <Separator />
                                        <div>
                                            <h3 className="text-sm font-medium mb-2">Payment Information</h3>
                                            <div className="space-y-2 text-sm">
                                                <div className="grid grid-cols-2">
                                                    <div className="text-muted-foreground">Payment Date:</div>
                                                    <div>April 16, 2025</div>
                                                </div>
                                                <div className="grid grid-cols-2">
                                                    <div className="text-muted-foreground">Payment Method:</div>
                                                    <div>QR Code</div>
                                                </div>
                                                <div className="grid grid-cols-2">
                                                    <div className="text-muted-foreground">Transaction ID:</div>
                                                    <div>TXN-2025-04-16-123</div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {isOverdue && (
                                    <>
                                        <Separator />
                                        <div className="p-3 bg-red-50 rounded-md border border-red-200">
                                            <h3 className="text-sm font-medium text-red-700 mb-1">Payment Overdue</h3>
                                            <p className="text-xs text-red-600">
                                                This payment is past its due date. Please contact your team manager for assistance.
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Dialog open={showQR} onOpenChange={setShowQR}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Payment QR Code</DialogTitle>
                        <DialogDescription>Scan this QR code with your payment app to complete the payment.</DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col items-center justify-center py-4">
                        <div className="border border-gray-200 p-4 rounded-lg mb-4">
                            <div className="w-64 h-64 bg-gray-100 flex items-center justify-center">
                                <QrCode className="w-40 h-40 text-gray-800" />
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">Amount: ${isOverdue ? "350" : "400"}</p>
                        <p className="text-sm text-muted-foreground">Reference: TEAM-ALPHA-{isOverdue ? "EQUIP" : "MAR"}-2025</p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowQR(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handlePay}>Mark as Paid</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showUpload} onOpenChange={setShowUpload}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Upload Payment Receipt</DialogTitle>
                        <DialogDescription>Upload a photo of your payment receipt as proof of payment.</DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col items-center justify-center py-4">
                        <div className="border border-dashed border-gray-300 rounded-lg p-8 w-full text-center">
                            <Upload className="h-8 w-8 mx-auto mb-4 text-gray-400" />
                            <p className="text-sm text-gray-500 mb-2">Drag and drop your receipt image here</p>
                            <p className="text-xs text-gray-400 mb-4">Supported formats: JPG, PNG, PDF (Max 5MB)</p>
                            <Button size="sm">Browse Files</Button>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowUpload(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleUploadReceipt}>Upload Receipt</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
