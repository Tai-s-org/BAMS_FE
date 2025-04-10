"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { format } from "date-fns"
import { Loader2 } from "lucide-react"
import { useToasts } from "@/hooks/providers/ToastProvider"
import tryOutApi from "@/api/tryOutScore"

export function PlayerScoreDetailsModal({ open, onClose, playerId }) {
    const [summaryData, setSummaryData] = useState(null)
    const [detailedData, setDetailedData] = useState(null)
    const [loading, setLoading] = useState(true)
    const { addToast } = useToasts()

    useEffect(() => {
        if (open && playerId) {
            fetchPlayerScoreData()
        }
    }, [open, playerId])

    const fetchPlayerScoreData = async () => {
        try {
            setLoading(true)

            // Fetch summary scores
            const summaryResponse = await tryOutApi.getPlayerScoreByReport(playerId)
            setSummaryData(summaryResponse.data.data)

            // Fetch detailed scores
            const detailedResponse = await tryOutApi.getPlayerScore(playerId)
            setDetailedData(detailedResponse.data.data)
        } catch (error) {
            addToast({
                message: error.response?.data?.message || "Failed to fetch player score data",
                type: "error",
            })
        } finally {
            setLoading(false)
        }
    }

    // Group scores by categories for better organization
    const groupScoresByCategory = (scores) => {
        if (!scores) return {}

        const categories = {
            "Kỹ năng bóng rổ": [],
            "Thể lực": [],
            "Đấu tập": [],
        }

        // Map scores to categories based on their codes or names
        scores.forEach((score) => {
            if (["Dribble", "Passing", "Shooting", "Finishing", "BasketballSkill"].includes(score.measurementScaleCode)) {
                categories["Kỹ năng bóng rổ"].push(score)
            } else if (
                [
                    "HexagonTest",
                    "StandingBroadJump",
                    "VerticalJump",
                    "StandingVerticalJump",
                    "RunningVerticalJump",
                    "AgilityTest",
                    "Sprint",
                    "PushUp",
                    "PlankTest",
                    "StandardPlank",
                    "SidePlank",
                    "RightSidePlank",
                    "LeftSidePlank",
                    "PhysicalFitness",
                ].includes(score.measurementScaleCode)
            ) {
                categories["Thể lực"].push(score)
            } else if (
                ["Scrimmage", "Attitude", "Leadership", "Skills", "ScrimmagePhysicalFitness", "BasketballIQ"].includes(
                    score.measurementScaleCode,
                )
            ) {
                categories["Đấu tập"].push(score)
            }
        })

        return categories
    }

    const formatDate = (dateString) => {
        if (!dateString) return "N/A"
        try {
            return format(new Date(dateString), "dd/MM/yyyy")
        } catch (e) {
            return dateString
        }
    }

    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return "N/A"
        try {
            return format(new Date(dateTimeString), "dd/MM/yyyy HH:mm")
        } catch (e) {
            return dateTimeString
        }
    }

    const renderSummaryTab = () => {
        if (!summaryData) return null

        const groupedScores = groupScoresByCategory(summaryData.scoreList)

        return (
            <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Thông tin cầu thủ</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p>
                                <span className="font-medium">Họ và tên:</span> {summaryData.fullName}
                            </p>
                            <p>
                                <span className="font-medium">Số báo danh:</span> {summaryData.candidateNumber}
                            </p>
                            <p>
                                <span className="font-medium">Giới tính:</span> {summaryData.gender ? "Nam" : "Nữ"}
                            </p>
                        </div>
                        <div>
                            <p>
                                <span className="font-medium">Ngày sinh:</span> {formatDate(summaryData.dateOfBirth)}
                            </p>
                            <p>
                                <span className="font-medium">Điểm trung bình kỹ năng:</span>{" "}
                                {summaryData.averageBasketballSkill?.toFixed(2) || "N/A"}
                            </p>
                            <p>
                                <span className="font-medium">Điểm trung bình thể lực:</span>{" "}
                                {summaryData.averagePhysicalFitness?.toFixed(2) || "N/A"}
                            </p>
                        </div>
                    </div>
                    <div className="mt-2">
                        <p className="text-lg font-bold">Điểm trung bình tổng: {summaryData.overallAverage?.toFixed(2) || "N/A"}</p>
                    </div>
                </div>

                {Object.entries(groupedScores).map(
                    ([category, scores]) =>
                        scores.length > 0 && (
                            <div key={category} className="border rounded-lg overflow-hidden">
                                <div className="bg-gray-100 px-4 py-2 font-medium">{category}</div>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Tiêu chí</TableHead>
                                            <TableHead className="text-right">Điểm</TableHead>
                                            <TableHead className="text-right">Điểm trung bình</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {scores.map((score) => (
                                            <TableRow key={score.measurementScaleCode}>
                                                <TableCell>{score.measurementName}</TableCell>
                                                <TableCell className="text-right">{score.score || "N/A"}</TableCell>
                                                <TableCell className="text-right">{score.averageScore?.toFixed(1) || "N/A"}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ),
                )}
            </div>
        )
    }

    const renderDetailedTab = () => {
        if (!detailedData) return null

        return (
            <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Thông tin cầu thủ</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p>
                                <span className="font-medium">Họ và tên:</span> {detailedData.fullName}
                            </p>
                            <p>
                                <span className="font-medium">Số báo danh:</span> {detailedData.candidateNumber}
                            </p>
                        </div>
                        <div>
                            <p>
                                <span className="font-medium">Giới tính:</span> {detailedData.gender ? "Nam" : "Nữ"}
                            </p>
                            <p>
                                <span className="font-medium">Ngày sinh:</span> {formatDate(detailedData.dateOfBirth)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tiêu chí</TableHead>
                                <TableHead>Điểm</TableHead>
                                <TableHead>Người chấm</TableHead>
                                <TableHead>Thời gian</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {detailedData.scores &&
                                detailedData.scores.map((score) => (
                                    <TableRow key={score.tryOutScorecardId}>
                                        <TableCell>{score.measurementName}</TableCell>
                                        <TableCell>{score.score}</TableCell>
                                        <TableCell>ID: {score.scoredBy}</TableCell>
                                        <TableCell>{formatDateTime(score.scoredAt)}</TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        )
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Chi tiết điểm cầu thủ</DialogTitle>
                </DialogHeader>

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-[#bd2427]" />
                    </div>
                ) : (
                    <Tabs defaultValue="summary" className="w-full">
                        <TabsList className="grid grid-cols-2 mb-6 p-1 bg-white border-2 border-gray-200 rounded-lg">
                            <TabsTrigger
                                value="summary"
                                className="data-[state=active]:bg-[#bd2427] data-[state=active]:text-white font-medium border border-gray-200 rounded-md py-2"
                            >
                                Tổng hợp điểm
                            </TabsTrigger>
                            <TabsTrigger
                                value="detailed"
                                className="data-[state=active]:bg-[#bd2427] data-[state=active]:text-white font-medium border border-gray-200 rounded-md py-2"
                            >
                                Chi tiết điểm
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="summary">{renderSummaryTab()}</TabsContent>

                        <TabsContent value="detailed">{renderDetailedTab()}</TabsContent>
                    </Tabs>
                )}
            </DialogContent>
        </Dialog>
    )
}
