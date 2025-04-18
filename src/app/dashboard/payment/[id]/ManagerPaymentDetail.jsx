"use client"
import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { Separator } from "@/components/ui/Seperator"
import { Badge } from "@/components/ui/Badge"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/Dialog"
import Link from "next/link"
import { ArrowLeft, FileText, DollarSign, Users, Clock, Plus, Pencil, Save, Trash2 } from "lucide-react"
import { DatePicker } from "@/components/ui/DatePicker"


export default function ManagerReportDetail({ id }) {
    // For demo purposes, we'll determine if the report is approved based on the ID
    // In a real app, this would come from your database
    const isApproved = id === "120" || id === "117"
    const isPending = id === "123"

    // Initial expense items
    const initialExpenseItems = [
        {
            id: 1,
            name: "Mua dụng cụ tập mới",
            amount: isPending ? "800000" : isApproved && id === "120000" ? "750000" : "700000",
            date: "2025-04-16 23:21:04.000"
        },
        {
            id: 2,
            name: "Đi tập huấn",
            amount: isPending ? "350000" : isApproved && id === "120000" ? "300000" : "300000",
            date: "2025-04-16 23:21:04.000"
        },
        {
            id: 3,
            name: "Phí đăng kí thi đấu",
            amount: isPending ? "450000" : isApproved && id === "120000" ? "400000" : "350000",
            date: "2025-04-16 23:21:04.000"
        },
    ]

    const [expenseItems, setExpenseItems] = useState(initialExpenseItems)
    const [updatedItems, setUpdatedItems] = useState([])
    const [newItems, setNewItems] = useState([])
    const [showSaveDialog, setShowSaveDialog] = useState(false)
    const [isSaved, setIsSaved] = useState(false)

    // Function to toggle edit mode for an item
    const toggleEditMode = (id) => {
        setExpenseItems(expenseItems.map((item) => (item.id === id ? { ...item, isEditing: !item.isEditing } : item)))
    }

    // Function to update an item
    const updateItem = (id, field, value) => {
        setExpenseItems(expenseItems.map((item) => (item.id === id ? { ...item, [field]: value } : item)))

        // Add to updatedItems if not already there
        if (!updatedItems.some((item) => item.id === id) && !newItems.some((item) => item.id === id)) {
            const itemToUpdate = expenseItems.find((item) => item.id === id)
            if (itemToUpdate && !itemToUpdate.isNew) {
                setUpdatedItems([...updatedItems, { ...itemToUpdate, [field]: value }])
            }
        } else if (updatedItems.some((item) => item.id === id)) {
            setUpdatedItems(updatedItems.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
        }
    }

    const updateNewItem = (id, field, value) => {
        setNewItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
        );
    };

    // Function to add a new item
    const addNewItem = () => {
        const newId = Math.max(...expenseItems.map((item) => item.id), 0) + 1
        const newItem = {
            id: newId,
            name: "",
            amount: "",
            isEditing: true,
            isNew: true,
        }
        setExpenseItems([...expenseItems, newItem])
        setNewItems([...newItems, newItem])
    }

    // Function to remove an item
    const removeItem = (id) => {
        const itemToRemove = expenseItems.find((item) => item.id === id)

        if (itemToRemove?.isNew) {
            // If it's a new item, remove from newItems
            setNewItems(newItems.filter((item) => item.id !== id))
        } else {
            // If it's an existing item, add to updatedItems with a flag to delete
            // In a real app, you might handle deletion differently
            itemToRemove && setUpdatedItems([...updatedItems, { ...itemToRemove, isDeleted: true }]);
        }

        // Remove from UI
        setExpenseItems(expenseItems.filter((item) => item.id !== id))
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })
    }

    // Function to save changes
    const saveChanges = () => {
        const item = expenseItems.filter((item) => item.isNew)
        // In a real app, you would call your APIs here
        console.log("Updated items to send to API:", updatedItems)
        console.log("New items to send to API:", item)
        console.log("all:", expenseItems);


        setIsSaved(true)
        setShowSaveDialog(false)

        // Reset tracking arrays after save
        setUpdatedItems([])
        setNewItems([])

        // Turn off editing mode for all items
        setExpenseItems(expenseItems.map((item) => ({ ...item, isEditing: false })))
    }

    // Calculate total
    const calculateTotal = () => {
        return expenseItems.reduce((total, item) => {
            return total + (Number.parseFloat(item.amount) || 0)
        }, 0)
    }

    return (
        <div className="container mx-auto py-6">
            <div className="flex items-center mb-6">
                <Link href="/dashboard/payment">
                    <Button variant="ghost" size="sm" className="gap-1">
                        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold ml-4">Expense Report #{id}</h1>
                {isApproved && <Badge className="ml-4 bg-green-500">Approved</Badge>}
                {isPending && <Badge className="ml-4 bg-yellow-500">Pending</Badge>}
                {isSaved && <Badge className="ml-4 bg-blue-500">Changes Saved</Badge>}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader className="flex flex-row items-start justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    {isPending
                                        ? "March 2025 Expenses"
                                        : isApproved && id === "120"
                                            ? "February 2025 Expenses"
                                            : "January 2025 Expenses"}
                                </CardTitle>
                                <CardDescription>
                                    Phải hoàn tất vào ngày {" "}
                                    {isPending
                                        ? "April 10, 2025"
                                        : isApproved && id === "120"
                                            ? "March 5, 2025"
                                            : "February 8, 2025"}
                                </CardDescription>
                            </div>
                            {!isApproved && (
                                <Button onClick={() => setShowSaveDialog(true)} className="gap-1">
                                    <Save className="h-4 w-4" /> Lưu thay đổi
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-medium mb-2">Mô tả</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Đóng quỹ đội tháng 3 2025 cho team 1. Chi phí bao gồm dụng cụ tập luyện, phí đăng ký thi đấu và chi phí đi tập huấn.
                                    </p>
                                </div>

                                <Separator />

                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-medium">Danh mục chi tiêu</h3>
                                        {!isApproved && (
                                            <Button variant="outline" size="sm" onClick={addNewItem} className="gap-1">
                                                <Plus className="h-4 w-4" /> Thêm danh mục
                                            </Button>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        {expenseItems.map((item) => (
                                            <div key={item.id} className="border rounded-md p-4">
                                                {item.isEditing ? (
                                                    <div className="space-y-4">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div className="space-y-2">
                                                                <Label htmlFor={`item-name-${item.id}`}>Danh mục</Label>
                                                                <Input
                                                                    id={`item-name-${item.id}`}
                                                                    value={item.name}
                                                                    onChange={(e) => updateItem(item.id, "name", e.target.value)
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div className="space-y-2">
                                                                <Label htmlFor={`item-amount-${item.id}`}>Số tiền (VND)</Label>
                                                                <Input
                                                                    id={`item-amount-${item.id}`}
                                                                    type="number"
                                                                    value={item.amount}
                                                                    onChange={(e) => updateItem(item.id, "amount", e.target.value)
                                                                    }
                                                                    placeholder="0.00"
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label htmlFor={`item-category-${item.id}`}>Danh mục</Label>
                                                                <DatePicker
                                                                    value={formatDate(item.date)}
                                                                    onChange={(date) => updateItem(item.id, "date", date)}
                                                                    placeholder={"Chọn ngày"}
                                                                />
                                                            </div>
                                                            <div className="flex items-end gap-2">
                                                                <Button variant="outline" onClick={() => toggleEditMode(item.id)} className="gap-1">
                                                                    Hoàn tất
                                                                </Button>

                                                            </div>
                                                        </div>

                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                                                        <div className="space-y-1">
                                                            <div className="font-medium">{item.name}</div>
                                                            <div className="text-sm text-muted-foreground capitalize">{item.category}</div>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <div className="font-medium">{formatDate(item.date)}</div>
                                                        </div>
                                                        <div className="flex items-center gap-4 mt-2 md:mt-0">
                                                            <div className="text-lg font-medium">{item.amount} VND</div>
                                                            {!isApproved && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => toggleEditMode(item.id)}
                                                                    className="gap-1"
                                                                >
                                                                    <Pencil className="h-4 w-4" />
                                                                </Button>

                                                            )}
                                                            <Button variant="destructive" onClick={() => removeItem(item.id)} className="gap-1">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )
                                                }

                                            </div>
                                        ))}

                                        <div className="flex justify-end mt-4">
                                            <div className="text-lg font-medium">Tổng: {calculateTotal().toFixed(2)} VND</div>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div>
                                    <h3 className="font-medium mb-2">Số thành viên hiện tại (4)</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Mỗi thành viên sẽ đóng {(calculateTotal() / 4).toFixed(2)} VND sau khi được duyệt.
                                    </p>
                                </div>

                                <Separator />

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
                                    {/* <DollarSign className="h-4 w-4 text-muted-foreground" /> */}
                                    <span className="text-sm">Tổng: {calculateTotal().toFixed(2)} VND</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">
                                        {isPending
                                            ? "Submitted: April 10, 2025"
                                            : isApproved && id === "120"
                                                ? "Được duyệt: March 7, 2025"
                                                : "Được duyệt:  10/2/2025"}
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
                                                {id === "120" ? (
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
                                                {id === "120" ? (
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
                                                <span>Hoàn tất:</span>
                                                <span>10/4/2025</span>
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

            <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Save Changes</DialogTitle>
                        <DialogDescription>Are you sure you want to save these changes to the expense report?</DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="font-medium">Summary of Changes:</p>
                        {updatedItems.length > 0 && <p>{updatedItems.length} item(s) updated</p>}
                        {newItems.filter((item) => expenseItems.some((e) => e.id === item.id)).length > 0 && (
                            <p>{newItems.filter((item) => expenseItems.some((e) => e.id === item.id)).length} new item(s) added</p>
                        )}
                        <p className="mt-2">New Total: ${calculateTotal().toFixed(2)}</p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={saveChanges}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
