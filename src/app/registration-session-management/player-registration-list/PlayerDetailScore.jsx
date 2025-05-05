"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { format } from "date-fns"
import { Loader2 } from "lucide-react"
import { useToasts } from "@/hooks/providers/ToastProvider"
import tryOutApi from "@/api/tryOutScore"
import { ca } from "date-fns/locale"

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
            console.log("Summary Data: ", summaryResponse.data.data)

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
    // const groupScoresByCategory = (scores) => {
    //     if (!scores) return {}

    //     const categories = {
    //         "Kỹ năng bóng rổ": [],
    //         "Thể lực": [],
    //         "Đấu tập": [],
    //     }

    //     // Map scores to categories based on their codes or names
    //     scores.forEach((score) => {
    //         if (["Dribble", "Passing", "Shooting", "Finishing", "BasketballSkill"].includes(score.measurementScaleCode)) {
    //             categories["Kỹ năng bóng rổ"].push(score)
    //         } else if (
    //             [
    //                 "HexagonTest",
    //                 "StandingBroadJump",
    //                 "VerticalJump",
    //                 "StandingVerticalJump",
    //                 "RunningVerticalJump",
    //                 "AgilityTest",
    //                 "Sprint",
    //                 "PushUp",
    //                 "PlankTest",
    //                 "StandardPlank",
    //                 "SidePlank",
    //                 "RightSidePlank",
    //                 "LeftSidePlank",
    //                 "PhysicalFitness",
    //             ].includes(score.measurementScaleCode)
    //         ) {
    //             categories["Thể lực"].push(score)
    //         } else if (
    //             ["Scrimmage", "Attitude", "Leadership", "Skills", "ScrimmagePhysicalFitness", "BasketballIQ"].includes(
    //                 score.measurementScaleCode,
    //             )
    //         ) {
    //             categories["Đấu tập"].push(score)
    //         }
    //     })

    //     return categories
    // }

    const groupScoresByCategory = (scores) => {
        if (!scores) return {}

        const categories = {
            "Kỹ năng bóng rổ": {
                "Finishing": [],
                "Shooting": [],
                "Passing": [],
                "Dribble": [],
                "Scrimmage": [],
            },
            "Thể lực": {
                "VerticalJump": [],
                "PlankTest": {
                    "PlankTest": [], // This is a placeholder for the PlankTest category
                    "StandardPlank": [],
                    "SidePlank": [],
                },
                "PushUp": [],
                "HexagonTest": [],
                "StandingBroadJump": [],
                "AgilityTest": [],
                "Sprint": [],
            },
        }

        const scrimmageChildren = ["Attitude", "Leadership", "Skills", "ScrimmagePhysicalFitness", "BasketballIQ"]
        const verticalJumpChildren = ["StandingVerticalJump", "RunningVerticalJump"]

        scores.forEach((score) => {
            const code = score.measurementScaleCode

            // Basketball Skill
            if (["Scrimmage", "Finishing", "Shooting", "Passing", "Dribble"].includes(code)) {
                categories["Kỹ năng bóng rổ"][code].push(score)
            } else if (scrimmageChildren.includes(code)) {
                categories["Kỹ năng bóng rổ"]["Scrimmage"].push(score)
            }

            // Vertical Jump
            else if (verticalJumpChildren.includes(code) || code === "VerticalJump") {
                categories["Thể lực"]["VerticalJump"].push(score)
            }
            else if (code === "PlankTest") {
                categories["Thể lực"]["PlankTest"]["PlankTest"].push(score)
            }
            // PlankTest
            else if (code === "StandardPlank") {
                categories["Thể lực"]["PlankTest"]["StandardPlank"].push(score)
            } else if (code === "SidePlank") {
                categories["Thể lực"]["PlankTest"]["SidePlank"].push(score)
            } else if (code === "RightSidePlank") {
                categories["Thể lực"]["PlankTest"]["SidePlank"].push(score)
            } else if (code === "LeftSidePlank") {
                categories["Thể lực"]["PlankTest"]["SidePlank"].push(score)
            }

            // Others in Physical Fitness
            else if (["PushUp", "HexagonTest", "StandingBroadJump", "AgilityTest", "Sprint"].includes(code)) {
                categories["Thể lực"][code].push(score)
            }
        })

        return categories
    }

    const formatDate = (dateString) => {
        if (!dateString) return "-"
        try {
            return format(new Date(dateString), "dd/MM/yyyy")
        } catch (e) {
            return dateString
        }
    }

    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return "-"
        try {
            return format(new Date(dateTimeString), "dd/MM/yyyy HH:mm")
        } catch (e) {
            return dateTimeString
        }
    }

    // const renderSummaryTab = () => {
    //     if (!summaryData) return null

    //     const groupedScores = groupScoresByCategory(summaryData.scoreList)
    //     console.log(groupedScores);

    //     return (
    //         <div className="space-y-6">
    //             <div className="bg-gray-50 p-4 rounded-lg">
    //                 <h3 className="text-lg font-medium mb-2">Thông tin cầu thủ</h3>
    //                 <div className="grid grid-cols-2 gap-4">
    //                     <div>
    //                         <p>
    //                             <span className="font-medium">Họ và tên:</span> {summaryData.fullName}
    //                         </p>
    //                         <p>
    //                             <span className="font-medium">Số báo danh:</span> {summaryData.candidateNumber}
    //                         </p>
    //                         <p>
    //                             <span className="font-medium">Giới tính:</span> {summaryData.gender ? "Nam" : "Nữ"}
    //                         </p>
    //                     </div>
    //                     <div>
    //                         <p>
    //                             <span className="font-medium">Ngày sinh:</span> {formatDate(summaryData.dateOfBirth)}
    //                         </p>
    //                         <p>
    //                             <span className="font-medium">Điểm trung bình kỹ năng:</span>{" "}
    //                             {summaryData.averageBasketballSkill?.toFixed(2) || "N/A"}
    //                         </p>
    //                         <p>
    //                             <span className="font-medium">Điểm trung bình thể lực:</span>{" "}
    //                             {summaryData.averagePhysicalFitness?.toFixed(2) || "N/A"}
    //                         </p>
    //                     </div>
    //                 </div>
    //                 <div className="mt-2">
    //                     <p className="text-lg font-bold">Điểm trung bình tổng: {summaryData.overallAverage?.toFixed(2) || "N/A"}</p>
    //                 </div>
    //             </div>

    //             {Object.entries(groupedScores).map(
    //                 ([category, scores]) =>
    //                     scores.length > 0 && (
    //                         <div key={category} className="border rounded-lg overflow-hidden">
    //                             <div className="bg-gray-100 px-4 py-2 font-medium">{category}</div>

    //                             {/* <Table>
    //                                 <TableHeader>
    //                                     <TableRow>
    //                                         <TableHead>Tiêu chí</TableHead>
    //                                         <TableHead className="text-right">Điểm</TableHead>
    //                                         <TableHead className="text-right">Điểm trung bình</TableHead>
    //                                     </TableRow>
    //                                 </TableHeader>
    //                                 <TableBody>
    //                                     {scores.map((score) => (
    //                                         <TableRow key={score.measurementScaleCode} className={score.score !== score.averageScore ? "italic text-white bg-slate-400" : ""}>
    //                                             <TableCell>{score.measurementName}</TableCell>
    //                                             <TableCell className="text-right">{score.score  || '-'}</TableCell>
    //                                             <TableCell className="text-right">{score.averageScore?.toFixed(1)}</TableCell>
    //                                         </TableRow>
    //                                     ))}
    //                                 </TableBody>
    //                             </Table> */}

    //                             {Array.isArray(scores) ? (
    //                                 <Table>
    //                                     <TableHeader>
    //                                         <TableRow>
    //                                             <TableHead>Tiêu chí</TableHead>
    //                                             <TableHead className="text-right">Điểm</TableHead>
    //                                             <TableHead className="text-right">Điểm trung bình</TableHead>
    //                                         </TableRow>
    //                                     </TableHeader>
    //                                     <TableBody>
    //                                         {scores.map((score) => (
    //                                             <TableRow
    //                                                 key={score.measurementScaleCode}
    //                                                 className={score.score !== score.averageScore ? "italic text-white bg-slate-400" : ""}
    //                                             >
    //                                                 <TableCell>{score.measurementName}</TableCell>
    //                                                 <TableCell className="text-right">{score.score || '-'}</TableCell>
    //                                                 <TableCell className="text-right">{score.averageScore?.toFixed(1)}</TableCell>
    //                                             </TableRow>
    //                                         ))}
    //                                     </TableBody>
    //                                 </Table>
    //                             ) : (
    //                                 Object.entries(scores).map(([subCategory, subScores]) => (
    //                                     <div key={subCategory}>
    //                                         <div className="bg-gray-200 px-4 py-1 font-semibold">{subCategory}</div>
    //                                         <Table>
    //                                             <TableHeader>
    //                                                 <TableRow>
    //                                                     <TableHead>Tiêu chí</TableHead>
    //                                                     <TableHead className="text-right">Điểm</TableHead>
    //                                                     <TableHead className="text-right">Điểm trung bình</TableHead>
    //                                                 </TableRow>
    //                                             </TableHeader>
    //                                             <TableBody>
    //                                                 {subScores.map((score) => (
    //                                                     <TableRow
    //                                                         key={score.measurementScaleCode}
    //                                                         className={score.score !== score.averageScore ? "italic text-white bg-slate-400" : ""}
    //                                                     >
    //                                                         <TableCell>{score.measurementName}</TableCell>
    //                                                         <TableCell className="text-right">{score.score || '-'}</TableCell>
    //                                                         <TableCell className="text-right">{score.averageScore?.toFixed(1)}</TableCell>
    //                                                     </TableRow>
    //                                                 ))}
    //                                             </TableBody>
    //                                         </Table>
    //                                     </div>
    //                                 ))
    //                             )}

    //                         </div>
    //                     ),
    //             )}
    //         </div>
    //     )
    // }

    // const renderSummaryTab = () => {
    //     if (!summaryData) return null

    //     const groupedScores = groupScoresByCategory(summaryData.scoreList)
    //     console.log("Grouped Scores: ", groupedScores);

    //     return (
    //         <div className="space-y-6">
    //             {/* Thông tin cầu thủ */}
    //             <div className="bg-gray-50 p-4 rounded-lg">
    //                 <h3 className="text-lg font-medium mb-2">Thông tin cầu thủ</h3>
    //                 <div className="grid grid-cols-2 gap-4">
    //                     <div>
    //                         <p><span className="font-medium">Họ và tên:</span> {summaryData.fullName}</p>
    //                         <p><span className="font-medium">Số báo danh:</span> {summaryData.candidateNumber}</p>
    //                         <p><span className="font-medium">Giới tính:</span> {summaryData.gender ? "Nam" : "Nữ"}</p>
    //                     </div>
    //                     <div>
    //                         <p><span className="font-medium">Ngày sinh:</span> {formatDate(summaryData.dateOfBirth)}</p>
    //                         <p><span className="font-medium">Điểm trung bình kỹ năng:</span> {summaryData.averageBasketballSkill?.toFixed(2) || "N/A"}</p>
    //                         <p><span className="font-medium">Điểm trung bình thể lực:</span> {summaryData.averagePhysicalFitness?.toFixed(2) || "N/A"}</p>
    //                     </div>
    //                 </div>
    //                 <div className="mt-2">
    //                     <p className="text-lg font-bold">Điểm trung bình tổng: {summaryData.overallAverage?.toFixed(2) || "N/A"}</p>
    //                 </div>
    //             </div>

    //             {/* Hiển thị bảng phân cấp */}
    //             {Object.entries(groupedScores).map(([category, items]) => (
    //                 <div key={category} className="border rounded-lg overflow-hidden">
    //                     <div className="bg-gray-100 px-4 py-2 font-medium">{category}</div>
    //                     <Table>
    //                         <TableHeader>
    //                             <TableRow>
    //                                 <TableHead>Tiêu chí</TableHead>
    //                                 <TableHead className="text-right">Điểm</TableHead>
    //                                 <TableHead className="text-right">Điểm trung bình</TableHead>
    //                             </TableRow>
    //                         </TableHeader>
    //                         {Object.entries(items).map(([subGroup, value]) => {
    //                             if (subGroup === "PlankTest") {
    //                                 return (
    //                                     <TableBody key={subGroup}>
    //                                         {/* StandardPlank */}
    //                                         {value.StandardPlank.map((score, index) => (
    //                                             <TableRow
    //                                                 key={score.measurementScaleCode}
    //                                                 className={`${index !== 0 ? "bg-blue-100" : ""} ${score.score !== score.averageScore ? " text-white bg-blue-200" : ""}`}
    //                                             >
    //                                                 <TableCell>{score.measurementName}</TableCell>
    //                                                 <TableCell className="text-right">{score.score || '-'}</TableCell>
    //                                                 <TableCell className="text-right">{score.averageScore?.toFixed(1)}</TableCell>
    //                                             </TableRow>
    //                                         ))}

    //                                         {/* SidePlank */}
    //                                         {value.SidePlank.map((score, index) => (
    //                                             <TableRow
    //                                                 key={score.measurementScaleCode}
    //                                                 className={`${index !== 0 ? "italic bg-blue-100" : "text-white bg-blue-300 "} ${score.score !== score.averageScore ? "text-white bg-blue-300" : ""}`}
    //                                             >
    //                                                 <TableCell>{score.measurementName}</TableCell>
    //                                                 <TableCell className="text-right">{score.score || '-'}</TableCell>
    //                                                 <TableCell className="text-right">{score.averageScore?.toFixed(1)}</TableCell>
    //                                             </TableRow>
    //                                         ))}
    //                                     </TableBody>
    //                                 )
    //                             }

    //                             // Nhóm thường
    //                             return Array.isArray(value) && value.length > 0 ? (
    //                                 <TableBody key={subGroup}>
    //                                     {value.map((score, index) => (
    //                                         <TableRow
    //                                             key={score.measurementScaleCode}
    //                                             className={`${index === 0 ? "bg-blue-200 border font-semibold" : ""} `}
    //                                         >
    //                                             <TableCell>{score.measurementName}</TableCell>
    //                                             <TableCell className="text-right">{score.score || '-'}</TableCell>
    //                                             <TableCell className="text-right">{score.averageScore?.toFixed(1)}</TableCell>
    //                                         </TableRow>
    //                                     ))}
    //                                 </TableBody>
    //                             ) : null
    //                         })}
    //                     </Table>

    //                 </div>
    //             ))}
    //         </div>
    //     )
    // }

    const renderSummaryTab = () => {
        if (!summaryData) return null

        const groupedScores = groupScoresByCategory(summaryData.scoreList)
        console.log("Grouped Scores: ", groupedScores)

        return (
            <div className="space-y-6">
                {/* Thông tin cầu thủ */}
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-medium mb-3 text-slate-800">Thông tin cầu thủ</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="mb-2">
                                <span className="font-medium text-slate-700">Họ và tên:</span> {summaryData.fullName}
                            </p>
                            <p className="mb-2">
                                <span className="font-medium text-slate-700">Số báo danh:</span> {summaryData.candidateNumber}
                            </p>
                            <p className="mb-2">
                                <span className="font-medium text-slate-700">Giới tính:</span> {summaryData.gender ? "Nam" : "Nữ"}
                            </p>
                        </div>
                        <div>
                            <p className="mb-2">
                                <span className="font-medium text-slate-700">Ngày sinh:</span> {formatDate(summaryData.dateOfBirth)}
                            </p>
                            <p className="mb-2">
                                <span className="font-medium text-slate-700">Điểm trung bình kỹ năng:</span>{" "}
                                {summaryData.averageBasketballSkill?.toFixed(2) || "N/A"}
                            </p>
                            <p className="mb-2">
                                <span className="font-medium text-slate-700">Điểm trung bình thể lực:</span>{" "}
                                {summaryData.averagePhysicalFitness?.toFixed(2) || "N/A"}
                            </p>
                        </div>
                    </div>
                    <div className="mt-3 p-2 bg-slate-100 rounded-md">
                        <p className="text-lg font-bold text-slate-800">
                            Điểm trung bình tổng:{" "}
                            <span className="text-emerald-600">{summaryData.overallAverage?.toFixed(2) || "N/A"}</span>
                        </p>
                    </div>
                </div>

                {/* Hiển thị bảng phân cấp */}
                {Object.entries(groupedScores).map(([category, items]) => (
                    <div key={category} className="border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                        <div className="bg-slate-700 px-4 py-3 font-medium text-white">{category}</div>
                        <Table>
                            <TableHeader className="bg-slate-100">
                                <TableRow>
                                    <TableHead className="font-semibold">Tiêu chí</TableHead>
                                    <TableHead className="text-right font-semibold">Điểm</TableHead>
                                    <TableHead className="text-right font-semibold">Điểm trung bình</TableHead>
                                </TableRow>
                            </TableHeader>
                            {Object.entries(items).map(([subGroup, value]) => {
                                if (subGroup === "PlankTest") {
                                    return (
                                        <TableBody key={subGroup}>
                                            {value.PlankTest.map((score, index) => (
                                                <TableRow
                                                    key={score.measurementScaleCode}
                                                    className={`${index === 0 ? "bg-emerald-200 font-medium" : "bg-slate-50"}  transition-colors`}
                                                >
                                                    <TableCell className={`${index !== 0 ? 'pl-10' : ""}`}>{score.measurementName}</TableCell>
                                                    <TableCell className="text-right">{score.score || "-"}</TableCell>
                                                    <TableCell className="text-right">{score.averageScore?.toFixed(2)}</TableCell>
                                                </TableRow>
                                            ))}
                                            {/* StandardPlank */}
                                            {value.StandardPlank.map((score, index) => (
                                                <TableRow
                                                    key={score.measurementScaleCode}
                                                    className={`${index === 0 ? "bg-emerald-100 font-medium" : "bg-slate-50"}  transition-colors`}
                                                >
                                                    <TableCell className={`${index === 0 ? 'pl-10' : "pl-20"}`}>{score.measurementName}</TableCell>
                                                    <TableCell className="text-right">{score.score || "-"}</TableCell>
                                                    <TableCell className="text-right">{score.averageScore?.toFixed(2)}</TableCell>
                                                </TableRow>
                                            ))}

                                            {/* SidePlank */}
                                            {value.SidePlank.map((score, index) => (
                                                <TableRow
                                                    key={score.measurementScaleCode}
                                                    className={`${index === 0 ? "bg-emerald-100 font-medium" : "bg-slate-50"}  transition-colors`}
                                                >
                                                    <TableCell className={`${index === 0 ? 'pl-10' : "pl-20"}`}>{score.measurementName}</TableCell>
                                                    <TableCell className="text-right">{score.score || "-"}</TableCell>
                                                    <TableCell className="text-right">{score.averageScore?.toFixed(2)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    )
                                }

                                // Nhóm thường
                                return Array.isArray(value) && value.length > 0 ? (
                                    <TableBody key={subGroup}>
                                        {value.map((score, index) => (
                                            <TableRow
                                                key={score.measurementScaleCode}
                                                className={`${index === 0 ? "bg-emerald-200 font-medium" : "bg-slate-100"
                                                    }  transition-colors`}
                                            >
                                                <TableCell className={`${index !== 0 ? 'pl-10' : ""}`}>{score.measurementName}</TableCell>
                                                <TableCell className="text-right">{score.score || "-"}</TableCell>
                                                <TableCell className="text-right">{score.averageScore?.toFixed(2)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                ) : null
                            })}
                        </Table>
                    </div>
                ))}
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
                                        <TableCell>{score.scoredBy}</TableCell>
                                        <TableCell>{formatDateTime(score.updatedAt)}</TableCell>
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
