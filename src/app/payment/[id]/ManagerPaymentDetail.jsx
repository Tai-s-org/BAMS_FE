"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { Separator } from "@/components/ui/Seperator"
import { Badge } from "@/components/ui/Badge"
import { Input } from "@/components/ui/Input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/Dialog"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import Link from "next/link"
import { ArrowLeft, FileText, Users, Clock, Plus, Pencil, Save, Trash2, Check, CheckCircle, BanknoteIcon, Calendar, Eye, LogIn, } from "lucide-react"
import { DatePicker } from "@/components/ui/DatePicker"
import teamFundApi from "@/api/teamFund"
import ExpenditureDetail from "@/components/payment/manager/expenditure-detail/ExpenditureDetailDialog"
import AddPlayersExDialog from "@/components/payment/manager/expenditure-detail/AddPlayersExDialog"
import playerApi from "@/api/player"
import { useToasts } from "@/hooks/providers/ToastProvider"
import { useAuth } from "@/hooks/context/AuthContext"
import { differenceInDays, parseISO } from "date-fns"

export default function ManagerReportDetail({ id }) {
    // For demo purposes, we'll determine if the report is approved based on the ID
    // In a real app, this would come from your database
    const isApproved = id === "120" || id === "117"
    const isPending = id === "123"
    const [idCounter, setIdCounter] = useState(1)

    const [expenseItems, setExpenseItems] = useState([])
    const [updatedItems, setUpdatedItems] = useState([])
    const [teamFund, setTeamFund] = useState()
    const [newItems, setNewItems] = useState([])
    const [showSaveDialog, setShowSaveDialog] = useState(false)
    const [isSaved, setIsSaved] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [expenditure, setExpenditure] = useState()
    const [playerDialogOpen, setPlayerDialogOpen] = useState(false)
    const [currentItemId, setCurrentItemId] = useState(null)
    const [availablePlayers, setAvailablePlayers] = useState([])
    const { addToast } = useToasts();
    const { userInfo } = useAuth();

    const fetchExpenseItems = async () => {
        try {
            const teamFundResponse = await teamFundApi.teamFundById(id)
            console.log("Fetched teamFund:", teamFundResponse.data.data)
            setTeamFund(teamFundResponse.data.data[0])
            console.log(teamFundResponse.data.data[0])

            const response = await teamFundApi.listExpenditure(id)
            console.log("Fetched expense items:", response.data)
            setExpenseItems(response?.data?.data?.items || [])

            //Fetch available players

        } catch (error) {
            console.error("Error fetching expense items:", error)
        }
    }

    const fetchPlayers = async (date) => {
        try {
            const TeamId = userInfo?.roleInformation.teamId
            const d = new Date(date);
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');

            const localDate = `${yyyy}-${mm}-${dd}T23:59:59`;
            console.log(localDate);

            const playersResponse = await teamFundApi.listPlayerByTeamId(TeamId, localDate);
            console.log(playersResponse.data);

            setAvailablePlayers(playersResponse?.data.data || [])
        } catch (error) {
            console.error("Error fetching players:", error)
        }
    }

    useEffect(() => {
        fetchExpenseItems()
    }, [id])

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
        // Cập nhật newItems
        setNewItems((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)))

        // Đồng bộ với expenseItems
        setExpenseItems((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
    }

    // Function to add a new item
    const addNewItem = () => {
        const newItem = {
            id: `temp-${idCounter}`,
            name: "", // Khởi tạo giá trị rỗng
            amount: "", // Khởi tạo giá trị rỗng
            payoutDate: null, // Khởi tạo giá trị null
            isEditing: true,
            isNew: true,
            playerExpenditures: [],
            allowToEditPlayer: true
        }
        setExpenseItems([...expenseItems, newItem])
        setNewItems([...newItems, newItem])
        setIdCounter(idCounter + 1)
    }

    const handleRemoveExpenditure = async (id) => {
        try {
            const response = await teamFundApi.deleteExpenditure(id)
            fetchExpenseItems();
            addToast({ message: response.data.message, type: "success" })
        } catch (error) {

        }
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
            itemToRemove && setUpdatedItems([...updatedItems, { ...itemToRemove, isDeleted: true }])
        }

        // Remove from UI
        setExpenseItems(expenseItems.filter((item) => item.id !== id))
    }

    const formatDate = (dateString) => {
        if (!dateString) return ""
        const date = new Date(dateString)
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })
    }

    function convertLocalDateToUTCDateOnly(date) {
        return new Date(Date.UTC(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
        ));
    }

    function isAtLeastThreeDaysLater(dateStr) {
        if (dateStr) {
            const xDate = parseISO(dateStr); // chuyển chuỗi sang đối tượng Date
            const today = new Date();
            return differenceInDays(today, xDate) <= 3;
        }
        else return true
    }


    // Function to save changes
    const saveChanges = async () => {
        // In a real app, you would call your APIs here

        const newArray = newItems.map(item => ({
            ...item,
            payoutDate: convertLocalDateToUTCDateOnly(new Date(item.payoutDate)).toISOString().split('T')[0],
            userIds: item.playerExpenditures.map(pe => pe.userId)
        }))

        const newUpdateArray = updatedItems.map(item => ({
            ...item,
            payoutDate: convertLocalDateToUTCDateOnly(new Date(item.payoutDate)).toISOString().split('T')[0],
            userIds: item.playerExpenditures.map(pe => pe.userId)
        }))



        try {
            if (newUpdateArray.length > 0) {
                console.log("Updated items to send to API:", newUpdateArray)

                const response = await teamFundApi.updateExpenditure(id, newUpdateArray)
                console.log("update: ", response.data)
                addToast({ message: response.data.message, type: "success" })
            }
            if (newArray.length > 0) {

                console.log("New items to send to API:", newArray, ", ", newItems)
                const response = await teamFundApi.addExpenditure(id, newArray)
                console.log("new: ", response.data)
                addToast({ message: response.data.message, type: "success" })
            }
        } catch (err) {
            console.log(err)
            addToast({ message: err?.response?.data?.message, type: "error" })
            console.error("Error saving changes:", err)
        }
        fetchExpenseItems()
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
            return total + Number.parseInt(item.amount || 0, 10)
        }, 0)
    }

    function formatTienVN(number) {
        return number != null ? number.toLocaleString("vi-VN") : ""
    }

    const handleViewExpenditure = (expenditure) => {
        setExpenditure(expenditure)
        setModalOpen(true)
    }

    // Open player selection dialog
    const openPlayerDialog = (itemId, date) => {
        fetchPlayers(date);
        setCurrentItemId(itemId)
        setPlayerDialogOpen(true)
    }

    // Handle player selection confirmation
    const handlePlayerSelectionConfirm = (selectedPlayerIds) => {
        if (!currentItemId) return

        // Find the selected players from the available players
        const selectedPlayers = availablePlayers.filter((player) => selectedPlayerIds.includes(player.userId))

        // Update the item with selected players
        const updatedExpenseItems = expenseItems.map((item) => {
            if (item.id === currentItemId) {
                return {
                    ...item,
                    playerExpenditures: selectedPlayers,
                }
            }
            return item
        })

        setExpenseItems(updatedExpenseItems)

        // Update in newItems or updatedItems as appropriate
        const itemToUpdate = expenseItems.find((item) => item.id === currentItemId)

        if (itemToUpdate?.isNew) {
            setNewItems(
                newItems.map((item) => (item.id === currentItemId ? { ...item, playerExpenditures: selectedPlayers } : item)),
            )
        } else if (itemToUpdate) {
            // Check if item is already in updatedItems
            if (updatedItems.some((item) => item.id === currentItemId)) {
                setUpdatedItems(
                    updatedItems.map((item) =>
                        item.id === currentItemId ? { ...item, playerExpenditures: selectedPlayers } : item,
                    ),
                )
            } else {
                setUpdatedItems([...updatedItems, { ...itemToUpdate, playerExpenditures: selectedPlayers }])
            }
        }

        setPlayerDialogOpen(false)
        setCurrentItemId(null)
    }

    // Get player count text
    const getPlayerCountText = (item) => {
        if (!item.playerExpenditures || item.playerExpenditures.length === 0) {
            return "0 người"
        }

        if (item.playerExpenditures.length === availablePlayers.length) {
            return "Tất cả"
        }

        return `${item.playerExpenditures.length} người`
    }

    return (
        <div className="container mx-auto py-6">
            <div className="flex items-center mb-6">
                <Link href="/payment">
                    <Button variant="ghost" size="sm" className="gap-1 hover:bg-[#F4F4F5]">
                        <ArrowLeft className="h-4 w-4" /> Quay lại
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold ml-4">Báo cáo quỹ đội #{id}</h1>
                {teamFund?.status === 1 && <Badge className="ml-4 bg-green-500 text-white">Đã duyệt</Badge>}
                {teamFund?.status === 0 && <Badge className="ml-4 bg-yellow-500 text-white">Chưa duyệt</Badge>}
                {isSaved && <Badge className="ml-4 bg-blue-500 text-white">Đã lưu thay đổi</Badge>}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader className="flex flex-row items-start justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    {teamFund?.description}
                                </CardTitle>
                                <CardDescription>Phải hoàn tất vào ngày {formatDate(teamFund?.endDate)}</CardDescription>
                            </div>
                            {(teamFund?.status === 0 || (teamFund?.status === 1 && isAtLeastThreeDaysLater(teamFund?.approveAt))) && (
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
                                        {teamFund?.description} cho đội {teamFund?.teamName}. Chi phí bao gồm dụng cụ tập luyện, phí đăng ký thi đấu và chi
                                        phí sinh hoạt.
                                    </p>
                                </div>

                                <Separator />

                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-medium">Danh mục chi tiêu</h3>
                                        {teamFund?.status === 0 && (
                                            <Button variant="outline" size="sm" onClick={addNewItem} className="gap-1 hover:bg-[#F4F4F5]">
                                                <Plus className="h-4 w-4" /> Thêm danh mục
                                            </Button>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <div className="rounded-lg border overflow-hidden">
                                            <Table>
                                                <TableHeader className="bg-slate-50">
                                                    <TableRow>
                                                        <TableHead className="w-4/12">Danh mục</TableHead>
                                                        <TableHead className="w-3/12 text-center">Số tiền</TableHead>
                                                        <TableHead className="w-2/12">Ngày chi tiêu</TableHead>
                                                        <TableHead className="w-2/12">Áp dụng cho</TableHead>
                                                        <TableHead className="w-2/12 text-center">Thao tác</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {expenseItems.map((item) => (
                                                        <TableRow key={item.id} className="hover:bg-slate-50">
                                                            {item.isEditing ? (
                                                                <>
                                                                    <TableCell>
                                                                        <Input
                                                                            id={`item-name-${item.id}`}
                                                                            value={item.name || ""}
                                                                            onChange={(e) =>
                                                                                item.isNew
                                                                                    ? updateNewItem(item.id, "name", e.target.value)
                                                                                    : updateItem(item.id, "name", e.target.value)
                                                                            }
                                                                            className="w-full"
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell className="text-right">
                                                                        <Input
                                                                            id={`item-amount-${item.id}`}
                                                                            type="number" value={item.amount || ""}
                                                                            onChange={(e) =>
                                                                                item.isNew
                                                                                    ? updateNewItem(item.id, "amount", e.target.value)
                                                                                    : updateItem(item.id, "amount", e.target.value)}
                                                                            placeholder="0"
                                                                            className="w-full text-right"
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <DatePicker
                                                                            value={item.payoutDate ? new Date(item.payoutDate) : null}
                                                                            onChange={(date) =>
                                                                                item.isNew
                                                                                    ? updateNewItem(item.id, "payoutDate", date)
                                                                                    : updateItem(item.id, "payoutDate", date)
                                                                            }
                                                                            placeholder="Chọn ngày" />
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            onClick={() => openPlayerDialog(item.id, item.payoutDate)}
                                                                            className={`flex items-center gap-1 ${!item.playerExpenditures || item.playerExpenditures.length === 0 ? "border-red-300 text-red-600" : ""}`}
                                                                            disabled={item.payoutDate === null}
                                                                        >
                                                                            <Users className="h-4 w-4" />
                                                                            {getPlayerCountText(item)}
                                                                        </Button>
                                                                    </TableCell>
                                                                    <TableCell className="text-right">
                                                                        <div className="flex justify-end gap-1">
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                onClick={() => toggleEditMode(item.id)}
                                                                                disabled={!item.playerExpenditures || item.playerExpenditures.length === 0 || item.name === "" || item.amount === "" || item.payoutDate === null}
                                                                                className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                                                                            >
                                                                                <Check className="h-4 w-4" />
                                                                            </Button>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                onClick={() => removeItem(item.id)}
                                                                                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                                            >
                                                                                <Trash2 className="h-4 w-4" />
                                                                            </Button>
                                                                        </div>
                                                                    </TableCell>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <TableCell className="font-medium pr-0">{item.name}</TableCell>
                                                                    <TableCell className="text-right font-medium">
                                                                        {formatTienVN(item.amount)} VNĐ
                                                                    </TableCell>
                                                                    <TableCell>{formatDate(item.payoutDate)}</TableCell>
                                                                    <TableCell>
                                                                        <Badge variant="outline" className="flex items-center gap-1">
                                                                            <Users className="h-3 w-3" />
                                                                            {item?.allowToEditPlayer === false ? "Tất cả" : getPlayerCountText(item)}
                                                                        </Badge>
                                                                    </TableCell>
                                                                    <TableCell className="text-right">
                                                                        {!isApproved && (
                                                                            <div className="flex justify-end gap-1">
                                                                                {(item?.allowToEditPlayer === true && (teamFund?.status === 0 || (teamFund?.status === 1 && isAtLeastThreeDaysLater(teamFund?.approveAt)))) && (
                                                                                    <Button
                                                                                        variant="ghost"
                                                                                        size="icon"
                                                                                        onClick={() => toggleEditMode(item.id)}
                                                                                        className="h-8 w-8 text-slate-600 hover:text-slate-700 hover:bg-slate-100"
                                                                                    >
                                                                                        <Pencil className="h-4 w-4" />
                                                                                    </Button>
                                                                                )}
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="icon"
                                                                                    onClick={() => handleViewExpenditure(item)}
                                                                                    className="h-8 w-8 text-slate-600 hover:text-slate-700 hover:bg-slate-100"
                                                                                >
                                                                                    <Eye className="h-4 w-4" />
                                                                                </Button>
                                                                                {(item?.allowToEditPlayer === true && (teamFund?.status === 0 || (teamFund?.status === 1 && isAtLeastThreeDaysLater(teamFund?.approveAt)))) && (
                                                                                    <Button
                                                                                        variant="ghost"
                                                                                        size="icon"
                                                                                        onClick={() => handleRemoveExpenditure(item.id)}
                                                                                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                                                    >
                                                                                        <Trash2 className="h-4 w-4" />
                                                                                    </Button>
                                                                                )}

                                                                            </div>
                                                                        )}
                                                                    </TableCell>
                                                                </>
                                                            )}
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                                <TableFooter>
                                                    <TableRow className="bg-slate-50">
                                                        <TableCell className="font-bold">Tổng</TableCell>
                                                        <TableCell className="text-right font-bold">{formatTienVN(calculateTotal())} VNĐ</TableCell>
                                                        <TableCell></TableCell>
                                                        <TableCell></TableCell>
                                                        <TableCell></TableCell>
                                                    </TableRow>
                                                </TableFooter>
                                            </Table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2 bg-slate-50 border-t p-4">
                            {teamFund?.status === 0 ? (
                                <div className="flex items-center text-yellow-500 gap-1">
                                    <Clock className="h-4 w-4" />
                                    <span>Đang chờ chủ tịch phê duyệt</span>
                                </div>
                            ) : (
                                teamFund?.status === 1 && (
                                    <div className="flex items-center text-green-500 gap-1">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        <span>Đã duyệt</span>
                                    </div>
                                )
                            )}
                        </CardFooter>
                    </Card>
                </div>

                <div>
                    <Card className="shadow-sm">
                        <CardHeader className="bg-slate-50 border-b">
                            <CardTitle>Trạng thái báo cáo</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-md border">
                                    <div className="bg-blue-100 p-2 rounded-full">
                                        <Users className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium">Đội</div>
                                        <div className="font-medium">{teamFund?.teamName}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-md border">
                                    <div className="bg-green-100 p-2 rounded-full">
                                        <BanknoteIcon className="h-4 w-4 text-green-600" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium">Tổng chi phí</div>
                                        <div className="text-lg font-bold">{formatTienVN(calculateTotal())} VNĐ</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 rounded-md border">
                                    <div className="bg-slate-100 p-2 rounded-full">
                                        <Calendar className="h-4 w-4 text-slate-600" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium">Ngày hoàn thành</div>
                                        <div className="font-medium">{formatDate(teamFund?.endDate)}</div>
                                    </div>
                                </div>
                                {teamFund?.status === 1 && (
                                    <div className="flex items-center gap-3 p-3 rounded-md border">
                                        <div className="bg-green-100 p-2 rounded-full">
                                            <Clock className="h-4 w-4 text-green-600" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium">Được duyệt ngày</div>
                                            <div className="font-medium text-green-600">{formatDate(teamFund?.approveAt) || "-"}</div>
                                        </div>
                                    </div>
                                )}

                                <Separator />

                                {teamFund?.status === 0 && (
                                    <div>
                                        <h3 className="text-sm font-medium mb-3 text-slate-800">Thời gian phê duyệt</h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="grid grid-cols-2 p-2 bg-slate-50 rounded-md">
                                                <div className="text-muted-foreground">Hoàn tất:</div>
                                                <div className="font-medium">{formatDate(teamFund?.endDate)}</div>
                                            </div>
                                            <div className="grid grid-cols-2 p-2 bg-slate-50 rounded-md">
                                                <div className="text-muted-foreground">Dự kiến duyệt:</div>
                                                <div className="font-medium">
                                                    {formatDate(new Date(new Date(teamFund?.endDate).getTime() + 10 * 24 * 60 * 60 * 1000))}
                                                </div>
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
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Lưu thay đổi</DialogTitle>
                        <DialogDescription>Bạn có chắc chắn muốn lưu những thay đổi này cho báo cáo chi phí?</DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="font-medium">Tóm tắt thay đổi:</p>
                        {updatedItems.length > 0 && <p>{updatedItems.length} mục đã cập nhật</p>}
                        {newItems.filter((item) => expenseItems.some((e) => e.id === item.id)).length > 0 && (
                            <p>{newItems.filter((item) => expenseItems.some((e) => e.id === item.id)).length} mục mới đã thêm</p>
                        )}
                        <p className="mt-2">Tổng mới: {formatTienVN(calculateTotal())} VNĐ</p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                            Hủy
                        </Button>
                        <Button onClick={saveChanges} className="bg-green-600 hover:bg-green-700">
                            Lưu thay đổi
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <ExpenditureDetail open={modalOpen} onClose={() => setModalOpen(false)} expenditure={expenditure} />

            <AddPlayersExDialog
                isOpen={playerDialogOpen}
                onClose={() => setPlayerDialogOpen(false)}
                onConfirm={handlePlayerSelectionConfirm}
                availablePlayers={availablePlayers}
                selectedPlayerIds={
                    currentItemId
                        ? (expenseItems.find((item) => item.id === currentItemId)?.playerExpenditures || []).map((p) => p.userId)
                        : []
                }
            />
        </div>
    )
}
