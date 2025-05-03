"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Textarea } from "@/components/ui/Textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Dialog,DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/Dialog"
import { Separator } from "@/components/ui/Seperator"
import Link from "next/link"
import { ArrowLeft, Plus, Trash2, Upload, FileText } from "lucide-react"

export default function CreateReport() {
    const [expenseItems, setExpenseItems] = useState([{ id: 1, name: "", category: "", amount: "" }])
    const [isSubmitted, setIsSubmitted] = useState(false)

    const addExpenseItem = () => {
        const newId = expenseItems.length > 0 ? Math.max(...expenseItems.map((item) => item.id)) + 1 : 1
        setExpenseItems([...expenseItems, { id: newId, name: "", category: "", amount: "" }])
    }

    const removeExpenseItem = (id) => {
        if (expenseItems.length > 1) {
            setExpenseItems(expenseItems.filter((item) => item.id !== id))
        }
    }

    const updateExpenseItem = (id, field, value) => {
        setExpenseItems(expenseItems.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
    }

    const calculateTotal = () => {
        return expenseItems.reduce((total, item) => {
            const amount = Number.parseFloat(item.amount) || 0
            return total + amount
        }, 0)
    }

    const handleSubmit = () => {
        setIsSubmitted(true)
    }

    return (
        <div className="container mx-auto py-6">
            <div className="flex items-center mb-6">
                <Link href="/manager/dashboard">
                    <Button variant="ghost" size="sm" className="gap-1">
                        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold ml-4">Create Expense Report</h1>
            </div>

            {isSubmitted ? (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-green-500 flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Report Submitted Successfully
                        </CardTitle>
                        <CardDescription>
                            Your expense report has been submitted and is pending approval from the president.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <p>Report ID: #REP-2025-04-16</p>
                            <p>Total Amount: ${calculateTotal().toFixed(2)}</p>
                            <p>Submitted on: April 16, 2025</p>
                            <p>Status: Pending Approval</p>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Link href="/manager/dashboard">
                            <Button>Return to Dashboard</Button>
                        </Link>
                    </CardFooter>
                </Card>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>New Expense Report</CardTitle>
                        <CardDescription>Create a new expense report for your team</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Report Title</Label>
                                    <Input id="title" placeholder="e.g., April 2025 Team Expenses" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="month">Month</Label>
                                    <Select>
                                        <SelectTrigger id="month">
                                            <SelectValue placeholder="Select month" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="january">January</SelectItem>
                                            <SelectItem value="february">February</SelectItem>
                                            <SelectItem value="march">March</SelectItem>
                                            <SelectItem value="april">April</SelectItem>
                                            <SelectItem value="may">May</SelectItem>
                                            <SelectItem value="june">June</SelectItem>
                                            <SelectItem value="july">July</SelectItem>
                                            <SelectItem value="august">August</SelectItem>
                                            <SelectItem value="september">September</SelectItem>
                                            <SelectItem value="october">October</SelectItem>
                                            <SelectItem value="november">November</SelectItem>
                                            <SelectItem value="december">December</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" placeholder="Provide a brief description of the expenses" />
                            </div>

                            <Separator />

                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-medium">Expense Items</h3>
                                    <Button variant="outline" size="sm" onClick={addExpenseItem} className="gap-1">
                                        <Plus className="h-4 w-4" /> Add Item
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    {expenseItems.map((item, index) => (
                                        <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                                            <div className="md:col-span-5 space-y-2">
                                                <Label htmlFor={`item-name-${item.id}`}>Danh mục chi tiêu</Label>
                                                <Input
                                                    id={`item-name-${item.id}`}
                                                    placeholder="e.g., Equipment"
                                                    value={item.name}
                                                    onChange={(e) => updateExpenseItem(item.id, "name", e.target.value)}
                                                />
                                            </div>

                                            {/* <div className="md:col-span-3 space-y-2">
                                                <Label htmlFor={`item-category-${item.id}`}>Category</Label>
                                                <Select
                                                    value={item.category}
                                                    onValueChange={(value) => updateExpenseItem(item.id, "category", value)}
                                                >
                                                    <SelectTrigger id={`item-category-${item.id}`}>
                                                        <SelectValue placeholder="Category" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="equipment">Equipment</SelectItem>
                                                        <SelectItem value="training">Training</SelectItem>
                                                        <SelectItem value="travel">Travel</SelectItem>
                                                        <SelectItem value="food">Food</SelectItem>
                                                        <SelectItem value="other">Other</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div> */}

                                            <div className="md:col-span-5 space-y-2">
                                                <Label htmlFor={`item-amount-${item.id}`}>Số tiền (VND)</Label>
                                                <Input
                                                    id={`item-amount-${item.id}`}
                                                    type="number"
                                                    placeholder="0.00"
                                                    value={item.amount}
                                                    onChange={(e) => updateExpenseItem(item.id, "amount", e.target.value)}
                                                />
                                            </div>

                                            <div className="md:col-span-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeExpenseItem(item.id)}
                                                    disabled={expenseItems.length === 1}
                                                >
                                                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-end mt-4">
                                    <div className="text-lg font-medium">Total: ${calculateTotal().toFixed(2)}</div>
                                </div>
                            </div>

                            <Separator />

                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline">Save as Draft</Button>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button>Submit Report</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Submit Expense Report</DialogTitle>
                                    <DialogDescription>
                                        Are you sure you want to submit this expense report? Once submitted, it will be sent to the
                                        president for approval.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="py-4">
                                    <p className="font-medium">Report Summary:</p>
                                    <p>Total Amount: ${calculateTotal().toFixed(2)}</p>
                                    <p>Per Team Member: ${(calculateTotal() / 4).toFixed(2)} (4 members)</p>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => { }}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleSubmit}>Confirm Submission</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </CardFooter>
                </Card>
            )}
        </div>
    )
}
