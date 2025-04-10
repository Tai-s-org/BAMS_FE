"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/Button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { ConfirmationDialog } from "./ConfirmDialog"
import { useToasts } from "@/hooks/providers/ToastProvider"
import registerApi from "@/api/register"
import { Eye } from "lucide-react"
import { PlayerScoreDetailsModal } from "./PlayerDetailScore"
import tryOutApi from "@/api/tryOutScore"

export function ApprovalTab({ players, onStatusChange }) {
    const [selectedPlayer, setSelectedPlayer] = useState(null)
    const [action, setAction] = useState(null)
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const { addToast } = useToasts()
    const [isScoreDetailsOpen, setIsScoreDetailsOpen] = useState(false)
    const [selectedPlayerId, setSelectedPlayerId] = useState(null)
    const [playerScores, setPlayerScores] = useState({});

    const handleAction = (player, actionType) => {
        setSelectedPlayer(player)
        setAction(actionType)
        setIsConfirmOpen(true)
    }

    const confirmAction = async () => {
        if (!selectedPlayer || !action) return;

        try {
            if (action === "approve") {
                await registerApi.approvePlayer(selectedPlayer.playerRegistrationId);
            } else if (action === "reject") {
                await registerApi.rejectPlayer(selectedPlayer.playerRegistrationId);
            }

            addToast({
                message: `Cầu thủ đã được ${action === "approve" ? "chấp nhận" : "từ chối"} thành công`,
                type: "success",
            })

            setIsConfirmOpen(false)
            onStatusChange()
        } catch (error) {
            addToast({
                message: error.response?.data?.message || `Lỗi khi ${action === "approve" ? "chấp nhận" : "từ chối"} cầu thủ`,
                type: "error",
            })
        }
    }


    const handleViewScoreDetails = (playerId) => {
        setSelectedPlayerId(playerId)
        setIsScoreDetailsOpen(true)
    }

    useEffect(() => {
        const fetchAllScores = async () => {
            const scores = {};
            for (const p of players) {
                try {
                    const res = await tryOutApi.getPlayerScoreByReport(p.playerRegistrationId);
                    console.log(res.data);
                    scores[p.playerRegistrationId] = res.data.data;
                } catch {
                    scores[p.playerRegistrationId] = {};
                }
            }
            setPlayerScores(scores);
        };

        if (players.length) fetchAllScores();
    }, [players]);



    return (
        <div>
            <div className="border rounded-md overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Họ và tên</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Điểm trung bình</TableHead>
                            <TableHead>Kỹ thuật</TableHead>
                            <TableHead>Thể lực</TableHead>
                            <TableHead>Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {players.length > 0 ? (
                            players.map((player) => (
                                <TableRow key={player.playerRegistrationId}>
                                    <TableCell>{player.fullName}</TableCell>
                                    <TableCell>{player.email}</TableCell>
                                    {/* <TableCell className="font-medium">
                                        {player.scores?.total ? player.scores.total.toFixed(2) : "N/A"}
                                        {viewScore(player.playerRegistrationId, "overallAverage")}
                                    </TableCell> */}
                                    <TableCell className="font-medium">
                                        {playerScores[player.playerRegistrationId]?.overallAverage?.toFixed(2) || "N/A"}
                                    </TableCell>
                                    <TableCell>{playerScores[player.playerRegistrationId]?.averageBasketballSkill?.toFixed(2) || "N/A"}</TableCell>
                                    <TableCell>{playerScores[player.playerRegistrationId]?.averagePhysicalFitness?.toFixed(2) || "N/A"}</TableCell>
                                    <TableCell>
                                        <div className="flex space-x-2">
                                            <Button
                                                size="icon"
                                                variant="outline"
                                                onClick={() => handleViewScoreDetails(player.playerRegistrationId)}
                                                title="Xem chi tiết điểm"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                onClick={() => handleAction(player, "approve")}
                                                className="bg-green-600 hover:bg-green-700"
                                            >
                                                Chấp nhận
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                onClick={() => handleAction(player, "reject")}
                                            >
                                                Từ chối
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-4">
                                    Không có cầu thủ nào đang chờ phê duyệt
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <ConfirmationDialog
                open={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmAction}
                title={`Xác nhận ${action === "approve" ? "chấp nhận" : "từ chối"}`}
                description={`Bạn có chắc chắn muốn ${action === "approve" ? "chấp nhận" : "từ chối"} cầu thủ ${selectedPlayer?.fullName || ""}?`}
            />

            <PlayerScoreDetailsModal
                open={isScoreDetailsOpen}
                onClose={() => setIsScoreDetailsOpen(false)}
                playerId={selectedPlayerId}
            />
        </div>
    )
}

