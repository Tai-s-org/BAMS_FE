"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/Checkbox"
import { Button } from "@/components/ui/Button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { format } from "date-fns"
import { TryoutModal } from "./TryOutModal"
import { ConfirmationDialog } from "./ConfirmDialog"
import { useToasts } from "@/hooks/providers/ToastProvider"
import registerApi from "@/api/register"
import { CalendarDays, Mail, Phone, UserCheck, UserX } from "lucide-react"
import { Badge } from "@/components/ui/Badge"


export function PendingTab({ players, onStatusChange }) {
    const [selectedPlayers, setSelectedPlayers] = useState([])
    const [isTryoutModalOpen, setIsTryoutModalOpen] = useState(false)
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
    const { addToast } = useToasts()

    const handleCheckboxChange = (playerId) => {
        setSelectedPlayers((prev) => {
            if (prev.includes(playerId)) {
                return prev.filter((id) => id !== playerId)
            } else {
                return [...prev, playerId]
            }
        })
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })
    }

    const handleTryoutSubmit = async (data) => {
        try {

            setIsTryoutModalOpen(false)
            setSelectedPlayers([])
            onStatusChange()
        } catch (error) {
            addToast({
                message: error.response?.data?.message || "Failed to update status",
                type: "error",
            })
        }
    }

    const handleRejectConfirm = async () => {
        try {
            // Call API to update players status to Rejected
            await registerApi.updatePlayerFormById(selectedPlayers, "Rejected");

            addToast({
                message: "Cầu thủ đã bị từ chối",
                type: "success",
            })
            setIsRejectModalOpen(false)
            setSelectedPlayers([])
            onStatusChange()
        } catch (error) {
            addToast({
                message: error.response?.data?.message || "Failed to update status",
                type: "error",
            })
        }
    }

    // return (
    //     <div>
    //         <div className="flex justify-between mb-4">
    //             <div>
    //                 <span className="font-medium">Đã chọn: {selectedPlayers.length} cầu thủ</span>
    //             </div>
    //             <div className="space-x-2">
    //                 <Button onClick={() => setIsTryoutModalOpen(true)} disabled={selectedPlayers.length === 0}>
    //                     Gọi kiểm tra kĩ năng
    //                 </Button>
    //                 <Button
    //                     variant="destructive"
    //                     onClick={() => setIsRejectModalOpen(true)}
    //                     disabled={selectedPlayers.length === 0}
    //                 >
    //                     Từ chối
    //                 </Button>
    //             </div>
    //         </div>

    //         <div className="border rounded-md overflow-hidden">
    //             <Table>
    //                 <TableHeader>
    //                     <TableRow>
    //                         <TableHead className="w-12">
    //                             <Checkbox
    //                                 checked={selectedPlayers.length === players?.length && players?.length > 0}
    //                                 onCheckedChange={(checked) => {
    //                                     if (checked) {
    //                                         setSelectedPlayers(players.map((p) => p.playerRegistrationId))
    //                                     } else {
    //                                         setSelectedPlayers([])
    //                                     }
    //                                 }}
    //                             />
    //                         </TableHead>
    //                         <TableHead>Họ và tên</TableHead>
    //                         <TableHead>Email</TableHead>
    //                         <TableHead>Số điện thoại</TableHead>
    //                         <TableHead>Giới tính</TableHead>
    //                         <TableHead>Ngày nộp đơn</TableHead>
    //                     </TableRow>
    //                 </TableHeader>
    //                 <TableBody>
    //                     {players?.length > 0 ? (
    //                         players.map((player) => (
    //                             <TableRow key={player.playerRegistrationId}>
    //                                 <TableCell>
    //                                     <Checkbox
    //                                         checked={selectedPlayers.includes(player.playerRegistrationId)}
    //                                         onCheckedChange={() => handleCheckboxChange(player.playerRegistrationId)}
    //                                     />
    //                                 </TableCell>
    //                                 <TableCell>{player.fullName}</TableCell>
    //                                 <TableCell>{player.email}</TableCell>
    //                                 <TableCell>{player.phoneNumber}</TableCell>
    //                                 <TableCell>{player.gender ? "Nam" : "Nữ"}</TableCell>
    //                                 <TableCell>{formatDate(player.submitedDate)}</TableCell>
    //                             </TableRow>
    //                         ))
    //                     ) : (
    //                         <TableRow>
    //                             <TableCell colSpan={6} className="text-center py-4">
    //                                 Không có cầu thủ nào đang chờ xử lý
    //                             </TableCell>
    //                         </TableRow>
    //                     )}
    //                 </TableBody>
    //             </Table>
    //         </div>

    //         <TryoutModal
    //             open={isTryoutModalOpen}
    //             onClose={() => setIsTryoutModalOpen(false)}
    //             onSubmit={handleTryoutSubmit}
    //             selectedCount={selectedPlayers.length}
    //             selectedPlayers={selectedPlayers}
    //         />

    //         <ConfirmationDialog
    //             open={isRejectModalOpen}
    //             onClose={() => setIsRejectModalOpen(false)}
    //             onConfirm={handleRejectConfirm}
    //             title="Xác nhận từ chối"
    //             description={`Bạn có chắc chắn muốn từ chối ${selectedPlayers.length} cầu thủ đã chọn?`}
    //         />
    //     </div>
    // )
    return (
        <Card className="border-gray-200 shadow-sm">
            <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                        <CardTitle className="text-xl font-bold">Danh sách chờ xử lý</CardTitle>
                        <CardDescription className="mt-1">Quản lý cầu thủ đang chờ được gọi kiểm tra kỹ năng</CardDescription>
                    </div>
                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className="bg-gray-50 text-gray-700 font-medium">
                            Đã chọn: {selectedPlayers.length} cầu thủ
                        </Badge>
                        <Button
                            onClick={() => setIsTryoutModalOpen(true)}
                            disabled={selectedPlayers.length === 0}
                            className="bg-[#bd2427] hover:bg-[#a01e21] flex items-center gap-2"
                        >
                            <UserCheck className="h-4 w-4" />
                            <span>Gọi kiểm tra</span>
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setIsRejectModalOpen(true)}
                            disabled={selectedPlayers.length === 0}
                            className="border-red-500 text-red-500 hover:bg-red-50 flex items-center gap-2"
                        >
                            <UserX className="h-4 w-4" />
                            <span>Từ chối</span>
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border overflow-hidden">
                    <Table>
                        <TableHeader className="bg-gray-50">
                            <TableRow>
                                <TableHead className="w-12">
                                    <Checkbox
                                        checked={selectedPlayers.length === players?.length && players?.length > 0}
                                        onCheckedChange={(checked) => {
                                            if (checked) {
                                                setSelectedPlayers(players.map((p) => p.playerRegistrationId))
                                            } else {
                                                setSelectedPlayers([])
                                            }
                                        }}
                                    />
                                </TableHead>
                                <TableHead className="font-semibold">Họ và tên</TableHead>
                                <TableHead className="font-semibold">Email</TableHead>
                                <TableHead className="font-semibold">Số điện thoại</TableHead>
                                <TableHead className="font-semibold">Giới tính</TableHead>
                                <TableHead className="font-semibold">Ngày nộp đơn</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {players?.length > 0 ? (
                                players.map((player) => (
                                    <TableRow key={player.playerRegistrationId} className="hover:bg-gray-50">
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedPlayers.includes(player.playerRegistrationId)}
                                                onCheckedChange={() => handleCheckboxChange(player.playerRegistrationId)}
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">{player.fullName}</TableCell>
                                        <TableCell className="flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-gray-400" />
                                            {player.email}
                                        </TableCell>
                                        <TableCell className="">
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-4 w-4 text-gray-400" />
                                                {player.phoneNumber}
                                            </div>

                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={player.gender ? "border-blue-500 text-blue-700" : "border-pink-500 text-pink-700"}
                                            >
                                                {player.gender ? "Nam" : "Nữ"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="flex items-center gap-2">
                                            <CalendarDays className="h-4 w-4 text-gray-400" />
                                            {formatDate(player.submitedDate)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <UserCheck className="h-12 w-12 text-gray-300 mb-2" />
                                            <p>Không có cầu thủ nào đang chờ xử lý</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>

            <TryoutModal
                open={isTryoutModalOpen}
                onClose={() => setIsTryoutModalOpen(false)}
                onSubmit={handleTryoutSubmit}
                selectedCount={selectedPlayers.length}
                selectedPlayers={selectedPlayers}
            />

            <ConfirmationDialog
                open={isRejectModalOpen}
                onClose={() => setIsRejectModalOpen(false)}
                onConfirm={handleRejectConfirm}
                title="Xác nhận từ chối"
                description={`Bạn có chắc chắn muốn từ chối ${selectedPlayers.length} cầu thủ đã chọn?`}
            />
        </Card>
    )
}

