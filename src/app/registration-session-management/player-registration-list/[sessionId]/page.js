// "use client"

// import { useEffect, useState } from "react"
// import { useParams, useRouter } from "next/navigation"
// import { Button } from "@/components/ui/Button"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
// import { Input } from "@/components/ui/Input"
// import { Badge } from "@/components/ui/Badge"
// import { ArrowLeft, Download, ExternalLink, Search } from "lucide-react"
// import { useToasts } from "@/hooks/providers/ToastProvider"
// import tryOutApi from "@/api/tryOutScore"

// export default function AllScoresPage() {
//     const { sessionId } = useParams()
//     const [scores, setScores] = useState([])
//     const [filteredScores, setFilteredScores] = useState([])
//     const [searchTerm, setSearchTerm] = useState("")
//     const { addToast } = useToasts()
//     const router = useRouter()
//     const [loading, setLoading] = useState(true)

//     // Group scores by category for column headers
//     const getBasketballSkills = () => {
//         return ["Dribble", "Passing", "Shooting", "Finishing", "Scrimmage"]
//     }

//     const getScrimmageScores = () => {
//         return ["Attitude", "Leadership", "Skills", "ScrimmagePhysicalFitness", "BasketballIQ"]
//     }

//     const getPhysicalFitnessScores = () => {
//         return ["HexagonTest", "StandingBroadJump", "VerticalJump", "AgilityTest", "Sprint", "PushUp", "PlankTest"]
//     }

//     // Get score by code from player data
//     const getScoreByCode = (player, code) => {
//         const score = player.scoreList?.find((s) => s.measurementScaleCode === code)
//         return score ? score.averageScore : 0
//     }

//     // Get score name by code
//     const getScoreNameByCode = (code) => {
//         const scoreNames = {
//             Dribble: "Dẫn bóng",
//             Passing: "Chuyền bóng",
//             Shooting: "Ném rổ",
//             Finishing: "Kết thúc rổ",
//             Scrimmage: "Đấu tập",
//             Attitude: "Thái độ (TĐ)",
//             Leadership: "Lãnh đạo",
//             Skills: "Kỹ năng (KN)",
//             ScrimmagePhysicalFitness: "Thể lực (TL)",
//             BasketballIQ: "Tư duy (IQ)",
//             HexagonTest: "Hexagon Test",
//             StandingBroadJump: "Bật xa tại chỗ",
//             VerticalJump: "Bật cao",
//             AgilityTest: "Nhanh nhẹn",
//             Sprint: "Chạy nước rút",
//             PushUp: "Chống đẩy",
//             PlankTest: "Plank",
//         }
//         return scoreNames[code] || code
//     }

//     useEffect(() => {
//         const fetchScores = async () => {
//             try {
//                 setLoading(true)
//                 const res = await tryOutApi.getAllPlayerScoreByReport(sessionId)

//                 // For demo purposes, use the sample data
//                 setTimeout(() => {
//                     setScores(res.data.data)
//                     setFilteredScores(res.data.data)
//                     setLoading(false)
//                 }, 500) // Simulate API delay
//             } catch (error) {
//                 addToast({
//                     message: "Lỗi khi tải dữ liệu điểm số",
//                     type: "error",
//                 })
//                 setLoading(false)
//             }
//         }

//         fetchScores()
//     }, [sessionId, addToast])

//     useEffect(() => {
//         if (searchTerm.trim() === "") {
//             setFilteredScores(scores)
//         } else {
//             const filtered = scores.filter((player) => player.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
//             setFilteredScores(filtered)
//         }
//     }, [searchTerm, scores])

//     const exportToCSV = async () => {
//         try {
//             const response = await tryOutApi.exportPlayerScore(sessionId)
//             console.log(response.data);

//         } catch (error) {
//             addToast({
//                 message: "Lỗi khi xuất dữ liệu",
//                 type: "error",
//             })
//         }
//     }

//     const goBack = () => {
//         router.push("/registration-session-management/player-registration-list")
//     }

//     const goToDetailedView = () => {
//         router.push(`/scores/${sessionId}/detailed`)
//     }

//     return (
//         <div className="mx-auto py-8">
//             <Button variant="outline" onClick={goBack} className="mb-4">
//                 <ArrowLeft className="mr-2 h-4 w-4" />
//                 Quay lại
//             </Button>

//             <Card className="shadow-md">
//                 <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
//                     <div>
//                         <CardTitle className="text-2xl font-bold">Bảng điểm tổng hợp</CardTitle>
//                         <CardDescription>Điểm đánh giá của tất cả cầu thủ tham gia kiểm tra</CardDescription>
//                     </div>
//                     <div className="flex space-x-2">
//                         <Button
//                             onClick={goToDetailedView}
//                             variant="outline"
//                             className="border-[#bd2427] text-[#bd2427] hover:bg-[#bd2427] hover:text-white"
//                         >
//                             <ExternalLink className="mr-2 h-4 w-4" />
//                             Xem theo tab
//                         </Button>
//                         <Button onClick={exportToCSV} className="bg-[#bd2427] hover:bg-[#a01e21]">
//                             <Download className="mr-2 h-4 w-4" />
//                             Xuất CSV
//                         </Button>
//                     </div>
//                 </CardHeader>
//                 <CardContent>
//                     <div className="flex items-center mb-4">
//                         <div className="relative flex-1 max-w-sm">
//                             <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//                             <Input
//                                 type="text"
//                                 placeholder="Tìm kiếm theo tên..."
//                                 className="pl-8"
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                             />
//                         </div>
//                     </div>

//                     {loading ? (
//                         <div className="flex justify-center items-center py-12">
//                             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#bd2427]"></div>
//                         </div>
//                     ) : (
//                         <div className="rounded-md border overflow-hidden">
//                             <div
//                                 className="overflow-x-auto"
//                                 style={{
//                                     maxWidth: "100%",
//                                     overflowX: "auto",
//                                     maxHeight: "70vh" /* Set a max height for vertical scrolling */,
//                                     position: "relative",
//                                 }}
//                             >
//                                 <Table>
//                                     <TableHeader className="bg-slate-50 sticky top-0 z-10">
//                                         <TableRow>
//                                             {/* Fixed columns */}
//                                             <TableHead className="font-semibold sticky left-0 bg-slate-50 z-20 min-w-[80px] whitespace-nowrap">
//                                                 SBD
//                                             </TableHead>
//                                             <TableHead className="font-semibold sticky left-[80px] bg-slate-50 z-20 min-w-[200px] whitespace-nowrap">
//                                                 Họ và tên
//                                             </TableHead>
//                                             <TableHead className="font-semibold text-center sticky left-[280px] bg-slate-50 z-20 min-w-[100px] whitespace-nowrap">
//                                                 Giới tính
//                                             </TableHead>
//                                             <TableHead className="font-semibold sticky left-[380px] bg-slate-50 z-20 min-w-[120px] whitespace-nowrap">
//                                                 Ngày sinh
//                                             </TableHead>

//                                             {/* Basketball Skills */}
//                                             <TableHead
//                                                 className="font-semibold text-center bg-green-50"
//                                                 colSpan={getBasketballSkills().length}
//                                             >
//                                                 Kỹ năng bóng rổ
//                                             </TableHead>

//                                             {/* Scrimmage Scores */}
//                                             <TableHead className="font-semibold text-center bg-blue-50" colSpan={getScrimmageScores().length}>
//                                                 Đấu tập
//                                             </TableHead>

//                                             {/* Physical Fitness */}
//                                             <TableHead
//                                                 className="font-semibold text-center bg-yellow-50"
//                                                 colSpan={getPhysicalFitnessScores().length}
//                                             >
//                                                 Thể lực
//                                             </TableHead>

//                                             {/* Summary Scores */}
//                                             <TableHead className="font-semibold text-center bg-red-50" colSpan={3}>
//                                                 Tổng hợp
//                                             </TableHead>
//                                         </TableRow>

//                                         <TableRow>
//                                             {/* Fixed columns */}
//                                             <TableHead className="font-semibold sticky left-0 bg-slate-50 z-20"></TableHead>
//                                             <TableHead className="font-semibold sticky left-[80px] bg-slate-50 z-20"></TableHead>
//                                             <TableHead className="font-semibold text-center sticky left-[280px] bg-slate-50 z-20"></TableHead>
//                                             <TableHead className="font-semibold sticky left-[380px] bg-slate-50 z-20"></TableHead>

//                                             {/* Basketball Skills */}
//                                             {getBasketballSkills().map((code) => (
//                                                 <TableHead
//                                                     key={`header-${code}`}
//                                                     className="font-semibold text-center bg-green-50 min-w-[100px] whitespace-nowrap"
//                                                 >
//                                                     {getScoreNameByCode(code)}
//                                                 </TableHead>
//                                             ))}

//                                             {/* Scrimmage Scores */}
//                                             {getScrimmageScores().map((code) => (
//                                                 <TableHead
//                                                     key={`header-${code}`}
//                                                     className="font-semibold text-center bg-blue-50 min-w-[100px] whitespace-nowrap"
//                                                 >
//                                                     {getScoreNameByCode(code)}
//                                                 </TableHead>
//                                             ))}

//                                             {/* Physical Fitness */}
//                                             {getPhysicalFitnessScores().map((code) => (
//                                                 <TableHead
//                                                     key={`header-${code}`}
//                                                     className="font-semibold text-center bg-yellow-50 min-w-[100px] whitespace-nowrap"
//                                                 >
//                                                     {getScoreNameByCode(code)}
//                                                 </TableHead>
//                                             ))}

//                                             {/* Summary Scores */}
//                                             <TableHead className="font-semibold text-center bg-red-50 min-w-[100px] whitespace-nowrap">
//                                                 Kỹ thuật
//                                             </TableHead>
//                                             <TableHead className="font-semibold text-center bg-red-50 min-w-[100px] whitespace-nowrap">
//                                                 Thể lực
//                                             </TableHead>
//                                             <TableHead className="font-semibold text-center bg-red-50 min-w-[100px] whitespace-nowrap">
//                                                 Trung bình
//                                             </TableHead>
//                                         </TableRow>
//                                     </TableHeader>
//                                     <TableBody>
//                                         {filteredScores.length > 0 ? (
//                                             filteredScores.map((player) => (
//                                                 <TableRow key={player.playerRegistrationId} className="hover:bg-slate-50">
//                                                     {/* Fixed columns */}
//                                                     <TableCell className="sticky left-0 bg-white z-10 min-w-[80px] whitespace-nowrap">
//                                                         {player.candidateNumber}
//                                                     </TableCell>
//                                                     <TableCell className="font-medium sticky left-[80px] bg-white z-10 min-w-[200px] whitespace-nowrap">
//                                                         {player.fullName}
//                                                     </TableCell>
//                                                     <TableCell className="text-center sticky left-[280px] bg-white z-10 min-w-[100px] whitespace-nowrap">
//                                                         <Badge
//                                                             variant="outline"
//                                                             className={
//                                                                 player.gender ? "border-blue-500 text-blue-700" : "border-pink-500 text-pink-700"
//                                                             }
//                                                         >
//                                                             {player.gender ? "Nam" : "Nữ"}
//                                                         </Badge>
//                                                     </TableCell>
//                                                     <TableCell className="sticky left-[380px] bg-white z-10 min-w-[120px] whitespace-nowrap">
//                                                         {new Date(player.dateOfBirth).toLocaleDateString("vi-VN")}
//                                                     </TableCell>

//                                                     {/* Basketball Skills */}
//                                                     {getBasketballSkills().map((code) => (
//                                                         <TableCell
//                                                             key={`${player.playerRegistrationId}-${code}`}
//                                                             className="text-center bg-green-50/30 min-w-[100px] whitespace-nowrap"
//                                                         >
//                                                             <Badge className={`${getScoreColorClass(getScoreByCode(player, code))} font-medium`}>
//                                                                 {getScoreByCode(player, code).toFixed(2)}
//                                                             </Badge>
//                                                         </TableCell>
//                                                     ))}

//                                                     {/* Scrimmage Scores */}
//                                                     {getScrimmageScores().map((code) => (
//                                                         <TableCell
//                                                             key={`${player.playerRegistrationId}-${code}`}
//                                                             className="text-center bg-blue-50/30 min-w-[100px] whitespace-nowrap"
//                                                         >
//                                                             <Badge className={`${getScoreColorClass(getScoreByCode(player, code))} font-medium`}>
//                                                                 {getScoreByCode(player, code).toFixed(2)}
//                                                             </Badge>
//                                                         </TableCell>
//                                                     ))}

//                                                     {/* Physical Fitness */}
//                                                     {getPhysicalFitnessScores().map((code) => (
//                                                         <TableCell
//                                                             key={`${player.playerRegistrationId}-${code}`}
//                                                             className="text-center bg-yellow-50/30 min-w-[100px] whitespace-nowrap"
//                                                         >
//                                                             <Badge className={`${getScoreColorClass(getScoreByCode(player, code))} font-medium`}>
//                                                                 {getScoreByCode(player, code).toFixed(2)}
//                                                             </Badge>
//                                                         </TableCell>
//                                                     ))}

//                                                     {/* Summary Scores */}
//                                                     <TableCell className="text-center bg-red-50/30 min-w-[100px] whitespace-nowrap">
//                                                         <Badge className={`${getScoreColorClass(player.averageBasketballSkill)} font-medium`}>
//                                                             {player.averageBasketballSkill.toFixed(2)}
//                                                         </Badge>
//                                                     </TableCell>
//                                                     <TableCell className="text-center bg-red-50/30 min-w-[100px] whitespace-nowrap">
//                                                         <Badge className={`${getScoreColorClass(player.averagePhysicalFitness)} font-medium`}>
//                                                             {player.averagePhysicalFitness.toFixed(2)}
//                                                         </Badge>
//                                                     </TableCell>
//                                                     <TableCell className="text-center bg-red-50/30 min-w-[100px] whitespace-nowrap">
//                                                         <Badge className={`${getScoreColorClass(player.overallAverage)} font-bold`}>
//                                                             {player.overallAverage.toFixed(2)}
//                                                         </Badge>
//                                                     </TableCell>
//                                                 </TableRow>
//                                             ))
//                                         ) : (
//                                             <TableRow>
//                                                 <TableCell
//                                                     colSpan={
//                                                         getBasketballSkills().length +
//                                                         getScrimmageScores().length +
//                                                         getPhysicalFitnessScores().length +
//                                                         7
//                                                     }
//                                                     className="text-center py-6 text-muted-foreground"
//                                                 >
//                                                     Không tìm thấy dữ liệu điểm số
//                                                 </TableCell>
//                                             </TableRow>
//                                         )}
//                                     </TableBody>
//                                 </Table>
//                                 <div className="text-center text-sm text-muted-foreground py-2 border-t bg-slate-50">
//                                     <span className="hidden md:inline">← Kéo ngang để xem thêm →</span>
//                                     <span className="md:hidden">← Kéo ngang →</span>
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </CardContent>
//             </Card>
//         </div>
//     )
// }

// // Helper function to get color class based on score
// function getScoreColorClass(score) {
//     if (score >= 4) return "bg-green-100 text-green-800 border-green-600"
//     if (score >= 3) return "bg-blue-100 text-blue-800 border-blue-600"
//     if (score >= 2) return "bg-yellow-100 text-yellow-800 border-yellow-600"
//     return "bg-red-100 text-red-800 border-red-600"
// }

"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Badge } from "@/components/ui/Badge"
import { ArrowLeft, Download, ExternalLink, Search } from "lucide-react"
import { useToasts } from "@/hooks/providers/ToastProvider"
import tryOutApi from "@/api/tryOutScore"
import registrationSessionApi from "@/api/registrationSession"

export default function AllScoresPage() {
    const { sessionId } = useParams()
    const [scores, setScores] = useState([])
    const [filteredScores, setFilteredScores] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const { addToast } = useToasts()
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState("summary") // Default to summary view
    const [sessionData, setSessionData] = useState("")

    // Group scores by category for column headers
    const getBasketballSkills = () => {
        return ["Dribble", "Passing", "Shooting", "Finishing", "Scrimmage"]
    }

    const getScrimmageScores = () => {
        return ["Attitude", "Leadership", "Skills", "ScrimmagePhysicalFitness", "BasketballIQ"]
    }

    const getPhysicalFitnessScores = () => {
        return ["HexagonTest", "StandingBroadJump", "VerticalJump", "AgilityTest", "Sprint", "PushUp", "PlankTest"]
    }

    // Get score by code from player data
    const getScoreByCode = (player, code) => {
        const score = player.scoreList?.find((s) => s.measurementScaleCode === code)
        return score ? score.averageScore : 0
    }

    // Get score name by code
    const getScoreNameByCode = (code) => {
        const scoreNames = {
            Dribble: "Dẫn bóng",
            Passing: "Chuyền bóng",
            Shooting: "Ném rổ",
            Finishing: "Kết thúc rổ",
            Scrimmage: "Đấu tập",
            Attitude: "Thái độ (TĐ)",
            Leadership: "Lãnh đạo",
            Skills: "Kỹ năng (KN)",
            ScrimmagePhysicalFitness: "Thể lực (TL)",
            BasketballIQ: "Tư duy (IQ)",
            HexagonTest: "Hexagon Test",
            StandingBroadJump: "Bật xa tại chỗ",
            VerticalJump: "Bật cao",
            AgilityTest: "Nhanh nhẹn",
            Sprint: "Chạy nước rút",
            PushUp: "Chống đẩy",
            PlankTest: "Plank",
        }
        return scoreNames[code] || code
    }

    // Get scores for the selected category
    const getSelectedCategoryScores = () => {
        switch (selectedCategory) {
            case "basketball":
                return getBasketballSkills()
            case "scrimmage":
                return getScrimmageScores()
            case "physical":
                return getPhysicalFitnessScores()
            case "summary":
            default:
                return ["averageBasketballSkill", "averagePhysicalFitness", "overallAverage"]
        }
    }

    // Get display name for summary scores
    const getSummaryScoreName = (code) => {
        const summaryNames = {
            averageBasketballSkill: "Kỹ thuật",
            averagePhysicalFitness: "Thể lực",
            overallAverage: "Trung bình",
        }
        return summaryNames[code] || code
    }

    // Get summary score value
    const getSummaryScore = (player, code) => {
        return player[code] || 0
    }

    useEffect(() => {
        const fetchScores = async () => {
            try {
                setLoading(true)
                const res = await tryOutApi.getAllPlayerScoreByReport(sessionId)
                
                // For demo purposes, use the sample data
                setTimeout(() => {
                    setScores(res.data.data)
                    setFilteredScores(res.data.data)
                    setLoading(false)
                }, 500) // Simulate API delay
            } catch (error) {
                addToast({
                    message: "Lỗi khi tải dữ liệu điểm số",
                    type: "error",
                })
                setLoading(false)
            }
        }

        const fetchSession = async () => {
            try {
                const res = await registrationSessionApi.getRegistrationSessionById(sessionId);
                console.log(res.data);
                setSessionData(res.data)
            } catch (error) {
                console.error("Error fetching session data:", error)
            }
        }

        fetchScores()
        fetchSession()
    }, [sessionId, addToast])

    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredScores(scores)
        } else {
            const filtered = scores.filter((player) => player.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
            setFilteredScores(filtered)
        }
    }, [searchTerm, scores])

    // const exportToCSV = async () => {
    //     try {
    //         const response = await tryOutApi.exportPlayerScore(sessionId)
    //         console.log(response.data);

    //         // Create a blob from the response data
    //         const blob = new Blob([response.data], {
    //             type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    //         })

    //         // Create a URL for the blob
    //         const url = window.URL.createObjectURL(blob)

    //         // Create a temporary anchor element
    //         const a = document.createElement("a")
    //         a.href = url

    //         // Extract filename from content-disposition header if available
    //         let filename = "player-scores.xlsx"
    //         const contentDisposition = response.headers?.["content-disposition"]
    //         if (contentDisposition) {
    //             const filenameMatch = contentDisposition.match(/filename="(.+?)"/)
    //             if (filenameMatch && filenameMatch[1]) {
    //                 filename = filenameMatch[1]
    //             }
    //         }

    //         a.download = filename
    //         document.body.appendChild(a)
    //         a.click()

    //         // Clean up
    //         window.URL.revokeObjectURL(url)
    //         document.body.removeChild(a)

    //         addToast({
    //             message: "Xuất dữ liệu thành công",
    //             type: "success",
    //         })
    //     } catch (error) {
    //         console.error("Export error:", error)
    //         addToast({
    //             message: "Lỗi khi xuất dữ liệu",
    //             type: "error",
    //         })
    //     }
    // }

    const exportToCSV = async () => {
        try {
            const response = await tryOutApi.exportPlayerScore(sessionId)
            console.log(response)

            // Create a blob from the response data
            const blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            })

            // Create a URL for the blob
            const url = window.URL.createObjectURL(blob)

            // Create a temporary anchor element
            const a = document.createElement("a")
            a.href = url

            // Extract filename from content-disposition header if available
            let filename = `BÁO CÁO KẾT QUẢ ĐÁNH GIÁ NĂNG LỰC YHBT ${sessionData?.registrationName.toUpperCase()}.xlsx`
            const contentDisposition = response.headers?.["content-disposition"]
            if (contentDisposition) {
                // Prefer UTF-8 filename* if available
                const utf8FilenameMatch = contentDisposition.match(/filename\*\=UTF-8''(.+)/)
                if (utf8FilenameMatch && utf8FilenameMatch[1]) {
                    filename = decodeURIComponent(utf8FilenameMatch[1])
                } else {
                    const asciiFilenameMatch = contentDisposition.match(/filename="(.+?)"/)
                    if (asciiFilenameMatch && asciiFilenameMatch[1]) {
                        filename = asciiFilenameMatch[1]
                    }
                }
            }

            a.download = filename
            document.body.appendChild(a)
            a.click()

            // Clean up
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)

            addToast({
                message: "Xuất dữ liệu thành công",
                type: "success",
            })
        } catch (error) {
            console.error("Export error:", error)
            addToast({
                message: "Lỗi khi xuất dữ liệu",
                type: "error",
            })
        }
    }



    const goBack = () => {
        router.push("/registration-session-management/player-registration-list")
    }

    const goToDetailedView = () => {
        router.push(`/scores/${sessionId}/detailed`)
    }

    return (
        <div className="mx-auto py-8">
            <Button variant="outline" onClick={goBack} className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại
            </Button>

            <Card className="shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <div>
                        <CardTitle className="text-2xl font-bold">Bảng điểm tổng hợp</CardTitle>
                        <CardDescription>Điểm đánh giá của tất cả cầu thủ tham gia kiểm tra</CardDescription>
                    </div>
                    <div className="flex space-x-2">
                        {/* <Button
                            onClick={goToDetailedView}
                            variant="outline"
                            className="border-[#bd2427] text-[#bd2427] hover:bg-[#bd2427] hover:text-white"
                        >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Xem theo tab
                        </Button> */}
                        <Button onClick={exportToCSV} className="bg-[#bd2427] hover:bg-[#a01e21]">
                            <Download className="mr-2 h-4 w-4" />
                            Xuất Excel
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center mb-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Tìm kiếm theo tên..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 ml-4">
                            <Button
                                variant={selectedCategory === "summary" ? "default" : "outline"}
                                onClick={() => setSelectedCategory("summary")}
                                className={selectedCategory === "summary" ? "bg-[#bd2427] hover:bg-[#a01e21]" : ""}
                            >
                                Tổng hợp
                            </Button>
                            <Button
                                variant={selectedCategory === "basketball" ? "default" : "outline"}
                                onClick={() => setSelectedCategory("basketball")}
                                className={selectedCategory === "basketball" ? "bg-green-600 hover:bg-green-700" : ""}
                            >
                                Kỹ năng bóng rổ
                            </Button>
                            <Button
                                variant={selectedCategory === "scrimmage" ? "default" : "outline"}
                                onClick={() => setSelectedCategory("scrimmage")}
                                className={selectedCategory === "scrimmage" ? "bg-blue-600 hover:bg-blue-700" : ""}
                            >
                                Đấu tập
                            </Button>
                            <Button
                                variant={selectedCategory === "physical" ? "default" : "outline"}
                                onClick={() => setSelectedCategory("physical")}
                                className={selectedCategory === "physical" ? "bg-yellow-600 hover:bg-yellow-700" : ""}
                            >
                                Thể lực
                            </Button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#bd2427]"></div>
                        </div>
                    ) : (
                        <div className="rounded-md border overflow-hidden">
                            <div
                                className="overflow-x-auto"
                                style={{
                                    maxWidth: "100%",
                                    overflowX: "auto",
                                    maxHeight: "70vh" /* Set a max height for vertical scrolling */,
                                    position: "relative",
                                }}
                            >
                                <Table>
                                    <TableHeader className="bg-slate-50 sticky top-0 z-10">
                                        <TableRow>
                                            {/* Fixed columns */}
                                            <TableHead className="font-semibold sticky left-0 bg-slate-50 z-20 w-[30px] whitespace-nowrap">
                                                SBD
                                            </TableHead>
                                            <TableHead className="font-semibold sticky left-[30px] bg-slate-50 z-20 w-[150px] whitespace-nowrap">
                                                Họ và tên
                                            </TableHead>
                                            <TableHead className="font-semibold text-center sticky left-[200px] bg-slate-50 z-20 w-[50px] whitespace-nowrap">
                                                Giới tính
                                            </TableHead>
                                            <TableHead className="font-semibold sticky left-[300px] bg-slate-50 z-20 w-[100px] whitespace-nowrap">
                                                Ngày sinh
                                            </TableHead>

                                            {/* Dynamic category header */}
                                            <TableHead
                                                className={`font-semibold text-center ${selectedCategory === "basketball"
                                                    ? "bg-green-50"
                                                    : selectedCategory === "scrimmage"
                                                        ? "bg-blue-50"
                                                        : selectedCategory === "physical"
                                                            ? "bg-yellow-50"
                                                            : "bg-red-50"
                                                    }`}
                                                colSpan={getSelectedCategoryScores().length}
                                            >
                                                {selectedCategory === "basketball"
                                                    ? "Kỹ năng bóng rổ"
                                                    : selectedCategory === "scrimmage"
                                                        ? "Đấu tập"
                                                        : selectedCategory === "physical"
                                                            ? "Thể lực"
                                                            : "Tổng hợp"}
                                            </TableHead>
                                        </TableRow>

                                        <TableRow>
                                            {/* Fixed columns */}
                                            <TableHead className="font-semibold sticky left-0 bg-slate-50 z-20"></TableHead>
                                            <TableHead className="font-semibold sticky left-[30px] bg-slate-50 z-20"></TableHead>
                                            <TableHead className="font-semibold text-center sticky left-[280px] bg-slate-50 z-20"></TableHead>
                                            <TableHead className="font-semibold sticky left-[300px] bg-slate-50 z-20"></TableHead>

                                            {/* Dynamic category columns */}
                                            {getSelectedCategoryScores().map((code) => (
                                                <TableHead
                                                    key={`header-${code}`}
                                                    className={`font-semibold text-center min-w-[100px] whitespace-nowrap ${selectedCategory === "basketball"
                                                        ? "bg-green-50"
                                                        : selectedCategory === "scrimmage"
                                                            ? "bg-blue-50"
                                                            : selectedCategory === "physical"
                                                                ? "bg-yellow-50"
                                                                : "bg-red-50"
                                                        }`}
                                                >
                                                    {selectedCategory === "summary" ? getSummaryScoreName(code) : getScoreNameByCode(code)}
                                                </TableHead>
                                            ))}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredScores.length > 0 ? (
                                            filteredScores.map((player) => (
                                                <TableRow key={player.playerRegistrationId} className="hover:bg-slate-50">
                                                    {/* Fixed columns */}
                                                    <TableCell className="sticky left-0 bg-white z-10 min-w-[30px] whitespace-nowrap">
                                                        {player.candidateNumber}
                                                    </TableCell>
                                                    <TableCell className="font-medium sticky left-[30px] bg-white z-10 min-w-[150px] whitespace-nowrap">
                                                        {player.fullName}
                                                    </TableCell>
                                                    <TableCell className="text-center sticky left-[200px] bg-white z-10 min-w-[50px] whitespace-nowrap">
                                                        <Badge
                                                            variant="outline"
                                                            className={
                                                                player.gender ? "border-blue-500 text-blue-700" : "border-pink-500 text-pink-700"
                                                            }
                                                        >
                                                            {player.gender ? "Nam" : "Nữ"}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="sticky left-[300px] bg-white z-10 min-w-[100px] whitespace-nowrap">
                                                        {new Date(player.dateOfBirth).toLocaleDateString("vi-VN")}
                                                    </TableCell>

                                                    {/* Dynamic category scores */}
                                                    {getSelectedCategoryScores().map((code) => (
                                                        <TableCell
                                                            key={`${player.playerRegistrationId}-${code}`}
                                                            className={`text-center min-w-[100px] whitespace-nowrap ${selectedCategory === "basketball"
                                                                ? "bg-green-50/30"
                                                                : selectedCategory === "scrimmage"
                                                                    ? "bg-blue-50/30"
                                                                    : selectedCategory === "physical"
                                                                        ? "bg-yellow-50/30"
                                                                        : "bg-red-50/30"
                                                                }`}
                                                        >
                                                            <Badge
                                                                className={`${getScoreColorClass(
                                                                    selectedCategory === "summary"
                                                                        ? getSummaryScore(player, code)
                                                                        : getScoreByCode(player, code),
                                                                )} font-medium ${code === "overallAverage" ? "font-bold" : ""}`}
                                                            >
                                                                {(selectedCategory === "summary"
                                                                    ? getSummaryScore(player, code)
                                                                    : getScoreByCode(player, code)
                                                                ).toFixed(2)}
                                                            </Badge>
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={getSelectedCategoryScores().length + 4}
                                                    className="text-center py-6 text-muted-foreground"
                                                >
                                                    Không tìm thấy dữ liệu điểm số
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

// Helper function to get color class based on score
function getScoreColorClass(score) {
    if (score >= 4) return "bg-green-100 text-green-800 border-green-600"
    if (score >= 3) return "bg-blue-100 text-blue-800 border-blue-600"
    if (score >= 2) return "bg-yellow-100 text-yellow-800 border-yellow-600"
    return "bg-red-100 text-red-800 border-red-600"
}
