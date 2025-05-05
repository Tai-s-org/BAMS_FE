"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { format } from "date-fns"
import { ConfirmationDialog } from "./ConfirmDialog"
import { useToasts } from "@/hooks/providers/ToastProvider"
import registerApi from "@/api/register"
import { Badge } from "@/components/ui/Badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { CalendarDays, Clock, Mail, MapPin, Phone, User, UserCheck } from 'lucide-react'

export function CheckInTab({ players, onStatusChange }) {
    const [selectedPlayer, setSelectedPlayer] = useState(null)
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const { addToast } = useToasts()

    const handleCheckIn = (player) => {
        setSelectedPlayer(player)
        setIsConfirmOpen(true)
    }
    console.log(players, "players");

    const confirmCheckIn = async () => {
        try {
            // Call API to update player status to CheckedIn
            const response = await registerApi.updatePlayerFormById(selectedPlayer.playerRegistrationId, "Checked-in")
            console.log(response.data);


            addToast({
                message: response.data.message,
                type: "success",
            })
            setIsConfirmOpen(false)
            onStatusChange()
        } catch (error) {
        }
    }

    // return (
    //     <div>
    //         <div className="border rounded-md overflow-hidden">
    //             <Table>
    //                 <TableHeader>
    //                     <TableRow>
    //                         <TableHead>Họ và tên</TableHead>
    //                         <TableHead>Email</TableHead>
    //                         <TableHead>Số điện thoại</TableHead>
    //                         <TableHead>Số báo danh</TableHead>
    //                         <TableHead>Ngày đánh giá</TableHead>
    //                         <TableHead>Giờ</TableHead>
    //                         <TableHead>Địa điểm</TableHead>
    //                         <TableHead>Thao tác</TableHead>
    //                     </TableRow>
    //                 </TableHeader>
    //                 <TableBody>
    //                     {players.length > 0 ? (
    //                         players.map((player) => (
    //                             <TableRow key={player.playerRegistrationId}>
    //                                 <TableCell>{player.fullName}</TableCell>
    //                                 <TableCell>{player.email}</TableCell>
    //                                 <TableCell>{player.phoneNumber}</TableCell>
    //                                 <TableCell>{player.candidateNumber}</TableCell>
    //                                 <TableCell>
    //                                     {player.submitedDate ? format(new Date(player.submitedDate), "dd/MM/yyyy") : "N/A"}
    //                                 </TableCell>
    //                                 <TableCell>{player.submitedDate?.time || "N/A"}</TableCell>
    //                                 <TableCell>{player.tryoutDetails?.location || "N/A"}</TableCell>
    //                                 <TableCell>
    //                                     <Button onClick={() => handleCheckIn(player)}>Điểm danh</Button>
    //                                 </TableCell>
    //                             </TableRow>
    //                         ))
    //                     ) : (
    //                         <TableRow>
    //                             <TableCell colSpan={7} className="text-center py-4">
    //                                 Không có cầu thủ nào đang chờ điểm danh
    //                             </TableCell>
    //                         </TableRow>
    //                     )}
    //                 </TableBody>
    //             </Table>
    //         </div>

    //         <ConfirmationDialog
    //             open={isConfirmOpen}
    //             onClose={() => setIsConfirmOpen(false)}
    //             onConfirm={confirmCheckIn}
    //             title="Xác nhận điểm danh"
    //             description={`Bạn có chắc chắn muốn điểm danh cho cầu thủ ${selectedPlayer?.fullName || ""}?`}
    //             onStatusChange={onStatusChange}
    //         />
    //     </div>
    // )
    return (
        <Card className="border border-gray-200 shadow-sm rounded-lg overflow-hidden">
            <CardHeader className="bg-white pb-4 border-b border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                        <CardTitle className="text-xl font-bold text-gray-800">Điểm danh cầu thủ</CardTitle>
                        <CardDescription className="text-gray-500 mt-1">
                            Xác nhận cầu thủ đã có mặt tại buổi kiểm tra kỹ năng
                        </CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 px-3 py-1 font-medium">
                        <UserCheck className="w-4 h-4 mr-1" />
                        {players.length} cầu thủ chờ điểm danh
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-gray-50">
                            <TableRow className="border-b border-gray-200">
                                <TableHead className="font-semibold text-gray-700 py-3">Họ và tên</TableHead>
                                <TableHead className="font-semibold text-gray-700 py-3">Email</TableHead>
                                <TableHead className="font-semibold text-gray-700 py-3">Số điện thoại</TableHead>
                                <TableHead className="font-semibold text-gray-700 py-3 text-center">Số báo danh</TableHead>
                                <TableHead className="font-semibold text-gray-700 py-3">Ngày đánh giá</TableHead>
                                <TableHead className="font-semibold text-gray-700 py-3">Giờ</TableHead>
                                <TableHead className="font-semibold text-gray-700 py-3">Địa điểm</TableHead>
                                <TableHead className="font-semibold text-gray-700 py-3 text-center">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {players.length > 0 ? (
                                players.map((player) => (
                                    <TableRow
                                        key={player.playerRegistrationId}
                                        className="hover:bg-gray-50 transition-colors border-b border-gray-100"
                                    >
                                        <TableCell className="py-3 font-medium text-gray-900 min-w-[180px] ">
                                            <div className="flex items-center">
                                                <User className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                                                {player.fullName}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-3 text-gray-600">
                                            <div className="flex items-center">
                                                <Mail className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                                                {player.email}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-3 text-gray-600">
                                            <div className="flex items-center">
                                                <Phone className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                                                {player.phoneNumber}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-3 text-center">
                                            <Badge variant="outline" className="bg-gray-100 text-gray-800 font-medium">
                                                {player.candidateNumber || "N/A"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="py-3 text-gray-600">
                                            <div className="flex items-center">
                                                <CalendarDays className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                                                {player.submitedDate
                                                    ? format(new Date(player?.tryOutDate), "dd/MM/yyyy")
                                                    : "-"}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-3 text-gray-600">
                                            <div className="flex items-center">
                                                <Clock className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                                                {player.tryOutDate
                                                    ? new Date(player.tryOutDate).toLocaleTimeString('vi-VN', {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        hour12: false
                                                    })
                                                    : "-"}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-3 text-gray-600">
                                            <div className="flex items-center">
                                                <MapPin className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                                                {player.tryOutLocation || "-"}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-3 text-center">
                                            <Button
                                                onClick={() => handleCheckIn(player)}
                                                className="bg-[#bd2427] hover:bg-[#a01e21] text-white font-medium px-4 py-2 rounded-md transition-colors flex items-center justify-center gap-2"
                                            >
                                                <UserCheck className="w-4 h-4" />
                                                Điểm danh
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-12 text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <UserCheck className="w-12 h-12 text-gray-300 mb-3" />
                                            <p className="font-medium">Không có cầu thủ nào đang chờ điểm danh</p>
                                            <p className="text-sm text-gray-400 mt-1">Các cầu thủ sẽ xuất hiện ở đây sau khi được gọi kiểm tra</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>

            <ConfirmationDialog
                open={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmCheckIn}
                title="Xác nhận điểm danh"
                description={`Bạn có chắc chắn muốn điểm danh cho cầu thủ ${selectedPlayer?.fullName || ""}?`}
            />
        </Card>
    )
}

