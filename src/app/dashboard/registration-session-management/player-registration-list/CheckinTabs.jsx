"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { format } from "date-fns"
import { ConfirmationDialog } from "./ConfirmDialog"
import { useToasts } from "@/hooks/providers/ToastProvider"
import registerApi from "@/api/register"

export function CheckInTab({ players, onStatusChange }) {
    const [selectedPlayer, setSelectedPlayer] = useState(null)
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const { addToast } = useToasts()

    const handleCheckIn = (player) => {
        setSelectedPlayer(player)
        setIsConfirmOpen(true)
    }

    const confirmCheckIn = async () => {
        try {
            // Call API to update player status to CheckedIn
            const response = await registerApi.updatePlayerFormById(selectedPlayer.playerRegistrationId,"Checked-in")
            console.log(response.data);
            

            addToast({
                message: response.data.message,
                type: "success",
            })
            log
            setIsConfirmOpen(false)
            onStatusChange()
        } catch (error) {
        }
    }

    return (
        <div>
            <div className="border rounded-md overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Họ và tên</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Số điện thoại</TableHead>
                            <TableHead>Số báo danh</TableHead>
                            <TableHead>Ngày đánh giá</TableHead>
                            <TableHead>Giờ</TableHead>
                            <TableHead>Địa điểm</TableHead>
                            <TableHead>Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {players.length > 0 ? (
                            players.map((player) => (
                                <TableRow key={player.playerRegistrationId}>
                                    <TableCell>{player.fullName}</TableCell>
                                    <TableCell>{player.email}</TableCell>
                                    <TableCell>{player.phoneNumber}</TableCell>
                                    <TableCell>{player.candidateNumber}</TableCell>
                                    <TableCell>
                                        {player.submitedDate? format(new Date(player.submitedDate), "dd/MM/yyyy") : "N/A"}
                                    </TableCell>
                                    <TableCell>{player.submitedDate?.time || "N/A"}</TableCell>
                                    <TableCell>{player.tryoutDetails?.location || "N/A"}</TableCell>
                                    <TableCell>
                                        <Button onClick={() => handleCheckIn(player)}>Điểm danh</Button>
                                    </TableCell>
                                </TableRow>
                            )) 
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-4">
                                    Không có cầu thủ nào đang chờ điểm danh
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <ConfirmationDialog
                open={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmCheckIn}
                title="Xác nhận điểm danh"
                description={`Bạn có chắc chắn muốn điểm danh cho cầu thủ ${selectedPlayer?.fullName || ""}?`}
            />
        </div>
    )
}

