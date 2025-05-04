// "use client"

// import { useEffect, useState } from "react"
// import { Button } from "@/components/ui/Button"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
// import { ConfirmationDialog } from "./ConfirmDialog"
// import { useToasts } from "@/hooks/providers/ToastProvider"
// import registerApi from "@/api/register"
// import { Eye } from "lucide-react"
// import { PlayerScoreDetailsModal } from "./PlayerDetailScore"
// import tryOutApi from "@/api/tryOutScore"

// export function ApprovalTab({ players, onStatusChange, sessionId }) {
//     const [selectedPlayer, setSelectedPlayer] = useState(null)
//     const [action, setAction] = useState(null)
//     const [isConfirmOpen, setIsConfirmOpen] = useState(false)
//     const { addToast } = useToasts()
//     const [isScoreDetailsOpen, setIsScoreDetailsOpen] = useState(false)
//     const [selectedPlayerId, setSelectedPlayerId] = useState(null)
//     const [playerScores, setPlayerScores] = useState({});

//     const handleAction = (player, actionType) => {
//         setSelectedPlayer(player)
//         setAction(actionType)
//         setIsConfirmOpen(true)
//     }

//     const confirmAction = async () => {
//         if (!selectedPlayer || !action) return;

//         try {
//             if (action === "approve") {
//                 await registerApi.approvePlayer(selectedPlayer.playerRegistrationId);
//             } else if (action === "reject") {
//                 await registerApi.rejectPlayer(selectedPlayer.playerRegistrationId);
//             }

//             addToast({
//                 message: `Cầu thủ đã được ${action === "approve" ? "chấp nhận" : "từ chối"} thành công`,
//                 type: "success",
//             })

//             setIsConfirmOpen(false)
//             onStatusChange()
//         } catch (error) {
//             addToast({
//                 message: error.response?.data?.message || `Lỗi khi ${action === "approve" ? "chấp nhận" : "từ chối"} cầu thủ`,
//                 type: "error",
//             })
//         }
//     }


//     const handleViewScoreDetails = (playerId) => {
//         setSelectedPlayerId(playerId)
//         setIsScoreDetailsOpen(true)
//     }

//     useEffect(() => {
//         const fetchAllScores = async () => {
//             try {
//                 console.log("sessionId", sessionId);
//                 const res = await tryOutApi.getAllPlayerScoreByReport(sessionId);
//                 const allScores = res.data.data; // Mảng các điểm số của tất cả cầu thủ

//                 // Tạo map nhanh từ API trả về
//                 const scoreMap = {};
//                 for (const s of allScores) {
//                     scoreMap[s.playerRegistrationId] = s;
//                 }

//                 // Lọc ra chỉ những cầu thủ có trong danh sách `players`
//                 const filteredScores = {};
//                 for (const p of players) {
//                     if (scoreMap[p.playerRegistrationId]) {
//                         filteredScores[p.playerRegistrationId] = scoreMap[p.playerRegistrationId];
//                     }
//                 }

//                 setPlayerScores(filteredScores);
//             } catch (error) {
//                 console.error("Lỗi khi tải điểm số:", error);
//                 setPlayerScores({});
//             }
//         };

//         if (players.length && sessionId) {
//             fetchAllScores();
//         }
//     }, [players, sessionId]);



//     return (
//         <div>
//             <div className="border rounded-md overflow-hidden">
//                 <Table>
//                     <TableHeader>
//                         <TableRow>
//                             <TableHead>Họ và tên</TableHead>
//                             <TableHead>Email</TableHead>
//                             <TableHead>Điểm trung bình</TableHead>
//                             <TableHead>Kỹ thuật</TableHead>
//                             <TableHead>Thể lực</TableHead>
//                             <TableHead>Thao tác</TableHead>
//                         </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                         {players.length > 0 ? (
//                             players.map((player) => (
//                                 <TableRow key={player.playerRegistrationId}>
//                                     <TableCell>{player.fullName}</TableCell>
//                                     <TableCell>{player.email}</TableCell>
//                                     {/* <TableCell className="font-medium">
//                                         {player.scores?.total ? player.scores.total.toFixed(2) : "N/A"}
//                                         {viewScore(player.playerRegistrationId, "overallAverage")}
//                                     </TableCell> */}
//                                     <TableCell className="font-medium">
//                                         {playerScores[player.playerRegistrationId]?.overallAverage?.toFixed(2) || "N/A"}
//                                     </TableCell>
//                                     <TableCell>{playerScores[player.playerRegistrationId]?.averageBasketballSkill?.toFixed(2) || "N/A"}</TableCell>
//                                     <TableCell>{playerScores[player.playerRegistrationId]?.averagePhysicalFitness?.toFixed(2) || "N/A"}</TableCell>
//                                     <TableCell>
//                                         <div className="flex space-x-2">
//                                             <Button
//                                                 size="icon"
//                                                 variant="outline"
//                                                 onClick={() => handleViewScoreDetails(player.playerRegistrationId)}
//                                                 title="Xem chi tiết điểm"
//                                             >
//                                                 <Eye className="h-4 w-4" />
//                                             </Button>
//                                             <Button
//                                                 onClick={() => handleAction(player, "approve")}
//                                                 className="bg-green-600 hover:bg-green-700"
//                                             >
//                                                 Chấp nhận
//                                             </Button>
//                                             <Button
//                                                 variant="destructive"
//                                                 onClick={() => handleAction(player, "reject")}
//                                             >
//                                                 Từ chối
//                                             </Button>
//                                         </div>
//                                     </TableCell>
//                                 </TableRow>
//                             ))
//                         ) : (
//                             <TableRow>
//                                 <TableCell colSpan={8} className="text-center py-4">
//                                     Không có cầu thủ nào đang chờ phê duyệt
//                                 </TableCell>
//                             </TableRow>
//                         )}
//                     </TableBody>
//                 </Table>
//             </div>

//             <ConfirmationDialog
//                 open={isConfirmOpen}
//                 onClose={() => setIsConfirmOpen(false)}
//                 onConfirm={confirmAction}
//                 title={`Xác nhận ${action === "approve" ? "chấp nhận" : "từ chối"}`}
//                 description={`Bạn có chắc chắn muốn ${action === "approve" ? "chấp nhận" : "từ chối"} cầu thủ ${selectedPlayer?.fullName || ""}?`}
//             />

//             <PlayerScoreDetailsModal
//                 open={isScoreDetailsOpen}
//                 onClose={() => setIsScoreDetailsOpen(false)}
//                 playerId={selectedPlayerId}
//             />
//         </div>
//     )
// }

"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/Button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { ConfirmationDialog } from "./ConfirmDialog"
import { useToasts } from "@/hooks/providers/ToastProvider"
import { BarChart3, Check, Eye, X } from "lucide-react"
import { PlayerScoreDetailsModal } from "./PlayerDetailScore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { useRouter } from "next/navigation"
import tryOutApi from "@/api/tryOutScore"
import registerApi from "@/api/register"

export function ApprovalTab({ players, onStatusChange, sessionId }) {
    const [selectedPlayer, setSelectedPlayer] = useState(null)
    const [action, setAction] = useState(null)
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const { addToast } = useToasts()
    const [isScoreDetailsOpen, setIsScoreDetailsOpen] = useState(false)
    const [selectedPlayerId, setSelectedPlayerId] = useState(null)
    const [playerScores, setPlayerScores] = useState({})
    const router = useRouter()
    const [loading, setLoading] = useState(true)

    const handleAction = (player, actionType) => {
        setSelectedPlayer(player)
        setAction(actionType)
        setIsConfirmOpen(true)
    }

    const confirmAction = async () => {
        if (!selectedPlayer || !action) return

        try {
            // In a real app, you would use the API
            if (action === "approve") {
                await registerApi.approvePlayer(selectedPlayer.playerRegistrationId)
            } else if (action === "reject") {
                await registerApi.rejectPlayer(selectedPlayer.playerRegistrationId)
            }

            // For demo purposes, just show a toast
            addToast({
                message: `Cầu thủ đã được ${action === "approve" ? "chấp nhận" : "từ chối"} thành công`,
                type: "success",
            })

            setIsConfirmOpen(false)
            onStatusChange()
        } catch (error) {
            if (error.response.data?.message === null) {
                Object.entries(error.response.data?.errors).forEach(([key, value]) => {
                    const msg = String(`${key}: ${value}`).split(":")[1]?.trim();
                    addToast({ message: value, type: "error" });
                });
            } else {
                addToast({ message: error.response.data?.message, type: "error" });
            }
        }
    }

    const handleViewScoreDetails = (playerId) => {
        setSelectedPlayerId(playerId)
        setIsScoreDetailsOpen(true)
    }

    const navigateToAllScores = () => {
        router.push(`/registration-session-management/player-registration-list/${sessionId}`)
    }

    useEffect(() => {
        const fetchAllScores = async () => {
            try {
                setLoading(true)
                // In a real app, you would use the API
                const res = await tryOutApi.getAllPlayerScoreByReport(sessionId);
                const allScores = res.data.data; // Mảng các điểm số của tất cả cầu thủ


                // For demo purposes, use the sample data
                setTimeout(() => {
                    // Create a map from sample data
                    const scoreMap = {}
                    for (const s of allScores) {
                        scoreMap[s.playerRegistrationId] = s
                    }

                    // Filter scores for players in the list
                    const filteredScores = {}
                    for (const p of players) {
                        if (scoreMap[p.playerRegistrationId]) {
                            filteredScores[p.playerRegistrationId] = scoreMap[p.playerRegistrationId]
                        }
                    }

                    setPlayerScores(filteredScores)
                    setLoading(false)
                }, 500) // Simulate API delay
            } catch (error) {
                console.error("Lỗi khi tải điểm số:", error)
                setPlayerScores({})
                setLoading(false)
            }
        }

        if (players.length && sessionId) {
            fetchAllScores()
        }
    }, [players, sessionId])

    return (
        <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <div>
                    <CardTitle className="text-xl font-bold">Danh sách phê duyệt</CardTitle>
                    <CardDescription>Phê duyệt cầu thủ dựa trên điểm đánh giá</CardDescription>
                </div>
                <Button onClick={navigateToAllScores} className="bg-[#bd2427] hover:bg-[#a01e21]">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Xem tất cả điểm
                </Button>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#bd2427]"></div>
                    </div>
                ) : (
                    <div className="rounded-md border overflow-hidden">
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow>
                                    <TableHead className="font-semibold">Họ và tên</TableHead>
                                    <TableHead className="font-semibold">Email</TableHead>
                                    <TableHead className="font-semibold text-center">Điểm trung bình</TableHead>
                                    <TableHead className="font-semibold text-center">Kỹ thuật</TableHead>
                                    <TableHead className="font-semibold text-center">Thể lực</TableHead>
                                    <TableHead className="font-semibold text-center">Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {players.length > 0 ? (
                                    players.map((player) => {
                                        const overallScore = playerScores[player.playerRegistrationId]?.overallAverage || 0
                                        const skillScore = playerScores[player.playerRegistrationId]?.averageBasketballSkill || 0
                                        const fitnessScore = playerScores[player.playerRegistrationId]?.averagePhysicalFitness || 0

                                        return (
                                            <TableRow key={player.playerRegistrationId} className="hover:bg-slate-50">
                                                <TableCell className="font-medium">{player.fullName}</TableCell>
                                                <TableCell>{player.email}</TableCell>
                                                <TableCell className="text-center">
                                                    <Badge className={`${getScoreColorClass(overallScore)} font-medium`}>
                                                        {overallScore.toFixed(2) || "N/A"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant="outline" className={`${getScoreColorClass(skillScore)} font-medium`}>
                                                        {skillScore.toFixed(2) || "N/A"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant="outline" className={`${getScoreColorClass(fitnessScore)} font-medium`}>
                                                        {fitnessScore.toFixed(2) || "N/A"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center justify-center space-x-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleViewScoreDetails(player.playerRegistrationId)}
                                                            title="Xem chi tiết điểm"
                                                            className="h-9 w-9 p-0"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleAction(player, "approve")}
                                                            className="bg-green-600 hover:bg-green-700 h-9 w-9 p-0"
                                                            title="Chấp nhận"
                                                        >
                                                            <Check className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => handleAction(player, "reject")}
                                                            className="h-9 w-9 p-0"
                                                            title="Từ chối"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                                            Không có cầu thủ nào đang chờ phê duyệt
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>

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
        </Card>
    )
}

// Helper function to get color class based on score
function getScoreColorClass(score) {
    if (score >= 4) return "bg-green-100 text-green-800 border-green-600"
    if (score >= 3) return "bg-blue-100 text-blue-800 border-blue-600"
    if (score >= 2) return "bg-yellow-100 text-yellow-800 border-yellow-600"
    return "bg-red-100 text-red-800 border-red-600"
}
