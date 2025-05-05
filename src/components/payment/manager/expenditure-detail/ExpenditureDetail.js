"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { format } from "date-fns"
import DeleteConfirmationExpenditureDialog from "./DeleteConfirmEx"
import AddPlayersExDialog from "./AddPlayerEx"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog"
import playerApi from "@/api/player"
import { useAuth } from "@/hooks/context/AuthContext"

export default function ExpenditureDetail({ open, onClose, expenditure }) {
    const [revenue, setRevenue] = useState(null)
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isAddPlayersDialogOpen, setIsAddPlayersDialogOpen] = useState(false)
    const [playerToDelete, setPlayerToDelete] = useState(null)
    const [allPlayers, setAllPlayers] = useState([])
    const { userInfo } = useAuth();

    useEffect(() => {
        if (open) {
            setLoading(true)
            if (expenditure) {
                setRevenue(expenditure)
                fetchPlayers()
                setLoading(false)
            }
        }
    }, [open, expenditure])

    // Filter players by search term
    const filteredPlayers =
        revenue?.playerExpenditures.filter((player) => player.fullname.toLowerCase().includes(searchTerm.toLowerCase())) ||
        []

    const availablePlayers = allPlayers.filter(
        (player) => !revenue?.playerExpenditures.some((p) => p.userId === player.userId),
    )

    // Handle delete player
    const handleDeletePlayer = (player) => {
        setPlayerToDelete(player)
        setIsDeleteDialogOpen(true)
    }

    const fetchPlayers = async () => {
        try {
            const data = {
                TeamId: userInfo?.roleInformation.teamId
            }
            const response = await playerApi.getAllPlayerWithTeam(data);
            setAllPlayers(response?.data?.data.items);
        } catch (error) {
            console.log(error)
        }
    }

    // Confirm delete player
    const confirmDeletePlayer = async () => {
        if (playerToDelete && revenue) {
            try {
                // TODO: Call api, waiting for backend
            } catch (error) {
                console.log(error)
            }
            const updatedExpenditures = revenue.playerExpenditures.filter((player) => player.userId !== playerToDelete.userId)

            setRevenue({
                ...revenue,
                playerExpenditures: updatedExpenditures,
            })

            setIsDeleteDialogOpen(false)
            setPlayerToDelete(null)
        }
    }

    // Handle add players
    const handleAddPlayers = async (selectedPlayerIds) => {
        try {
                // TODO: Call api, waiting for backend
        } catch (error) {
            console.log(error)
        }

        if (revenue) {
            const playersToAdd = allPlayers
                .filter((player) => selectedPlayerIds.includes(player.userId))
                .map((player) => ({
                    userId: player.userId,
                    fullname: player.fullname,
                }))

            setRevenue({
                ...revenue,
                playerExpenditures: [...revenue.playerExpenditures, ...playersToAdd],
            })

            setIsAddPlayersDialogOpen(false)
        }
    }

    // Calculate amount per person
    const amountPerPerson =
        revenue?.playerExpenditures?.length > 0 ? Math.round(revenue.amount / revenue.playerExpenditures.length) : 0

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center">
                        <Button variant="ghost" size="icon" onClick={onClose} className="mr-2">
                            <X className="h-5 w-5" />
                        </Button>
                        <span>Chi tiết khoản thu</span>
                    </DialogTitle>
                </DialogHeader>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="w-8 h-8 border-4 border-[#BD2427] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : !revenue ? (
                    <div className="flex flex-col items-center justify-center h-64">
                        <h1 className="text-2xl font-bold text-gray-800">Không tìm thấy khoản thu</h1>
                    </div>
                ) : (
                    <>
                        {/* Thông tin khoản thu */}
                        <Card className="mb-8 border-t-4 border-t-[#BD2427]">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold">{revenue.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Tổng số tiền</p>
                                        <p className="text-lg font-semibold">{revenue.amount.toLocaleString("vi-VN")} VNĐ</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Ngày tạo</p>
                                        <p className="text-lg">{format(new Date(revenue.payoutDate), "dd/MM/yyyy")}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Ngày cần đóng</p>
                                        <p className="text-lg">{format(new Date(revenue.date), "dd/MM/yyyy")}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Số người cần đóng</p>
                                        <p className="text-lg">{revenue.playerExpenditures.length} người</p>
                                    </div>
                                    {revenue.playerExpenditures.length > 0 && (
                                        <div>
                                            <p className="text-sm text-gray-500">Số tiền mỗi người</p>
                                            <p className="text-lg font-semibold text-[#BD2427]">
                                                {amountPerPerson.toLocaleString("vi-VN")} VNĐ
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Danh sách người cần đóng tiền */}
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold">Danh sách người cần đóng tiền</h2>
                            <Button onClick={() => setIsAddPlayersDialogOpen(true)} className="bg-[#BD2427] hover:bg-[#9a1e21]">
                                <Plus className="h-4 w-4 mr-2" /> Thêm người
                            </Button>
                        </div>

                        {/* Tìm kiếm */}
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <Input
                                placeholder="Tìm kiếm theo tên..."
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Danh sách */}
                        <Card>
                            <CardContent className="p-0">
                                {filteredPlayers.length > 0 ? (
                                    <ul className="divide-y">
                                        {filteredPlayers.map((player) => (
                                            <li key={player.userId} className="flex items-center justify-between p-4">
                                                <div>
                                                    <p className="font-medium">{player.fullname}</p>
                                                    <p className="text-sm text-gray-500">{amountPerPerson.toLocaleString("vi-VN")} VNĐ</p>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDeletePlayer(player)}
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </Button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="p-8 text-center">
                                        <p className="text-gray-500">Chưa có người nào trong khoản thu này</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Dialog xác nhận xóa */}
                        <DeleteConfirmationExpenditureDialog
                            isOpen={isDeleteDialogOpen}
                            onClose={() => setIsDeleteDialogOpen(false)}
                            onConfirm={confirmDeletePlayer}
                            playerName={playerToDelete?.fullname || ""}
                        />

                        {/* Dialog thêm người */}
                        <AddPlayersExDialog
                            isOpen={isAddPlayersDialogOpen}
                            onClose={() => setIsAddPlayersDialogOpen(false)}
                            onConfirm={handleAddPlayers}
                            availablePlayers={availablePlayers}
                        />
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}