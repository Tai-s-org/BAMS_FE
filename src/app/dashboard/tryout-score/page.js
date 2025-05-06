// "use client"

// import { useEffect, useState } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
// import { ChevronDown, ChevronRight, ArrowRight, Loader2 } from "lucide-react"
// import React from "react"
// import tryOutApi from "@/api/tryOutScore"


// export default function MeasurementScalesPage() {
//     const [scales, setScales] = useState([])
//     const [loading, setLoading] = useState(true)
//     const [error, setError] = useState(null)
//     const [activePath, setActivePath] = useState([])

//     useEffect(() => {
//         const fetchScales = async () => {
//             try {
//                 setLoading(true)

//                 const response = await tryOutApi.getMeasurementScale();
//                 console.log(response);
//                 setScales(response.data.data)

//                 if (!response.ok) {
//                     throw new Error(`API error: ${response.status}`)
//                 }

//                 const sortedScales = response.data.data.sort((a, b) => a.sortOrder - b.sortOrder)
//                 setScales(sortedScales)

//                 // Set initial active path if available
//                 if (sortedScales.length > 0) {
//                     const initialPath = [sortedScales[0].measurementScaleCode]

//                     // If there are subscales, add the first one to the path
//                     if (sortedScales[0].subScales && sortedScales[0].subScales.length > 0) {
//                         const sortedSubScales = [...sortedScales[0].subScales].sort((a, b) => a.sortOrder - b.sortOrder)
//                         initialPath.push(sortedSubScales[0].measurementScaleCode)

//                         // If there are sub-subscales, add the first one to the path
//                         if (sortedSubScales[0].subScales && sortedSubScales[0].subScales.length > 0) {
//                             const sortedSubSubScales = [...sortedSubScales[0].subScales].sort((a, b) => a.sortOrder - b.sortOrder)
//                             initialPath.push(sortedSubSubScales[0].measurementScaleCode)
//                         }
//                     }

//                     setActivePath(initialPath)
//                 }
//             } catch (err) {
//                 setError(err instanceof Error ? err.message : "An unknown error occurred")
//             } finally {
//                 setLoading(false)
//             }
//         }

//         fetchScales()
//     }, [])

//     // Find a scale by its path
//     const findScaleByPath = (path) => {
//         if (!path.length) return null

//         let currentScale = scales.find((scale) => scale.measurementScaleCode === path[0])

//         if (!currentScale) return null

//         // Navigate through the path
//         for (let i = 1; i < path.length; i++) {
//             const nextScale = currentScale.subScales.find((sub) => sub.measurementScaleCode === path[i])

//             if (!nextScale) return currentScale
//             currentScale = nextScale
//         }

//         return currentScale
//     }

//     // Get the currently selected scale
//     const getSelectedScale = () => {
//         return findScaleByPath(activePath)
//     }

//     // Convert HTML string to safe JSX
//     const createMarkup = (htmlString) => {
//         return { __html: htmlString || "" }
//     }

//     // Recursive component to render nested navigation
//     const ScaleNavItem = ({
//         scale,
//         path = [],
//         level = 0,
//     }) => {
//         const currentPath = [...path, scale.measurementScaleCode]
//         const isActive = activePath.length > level && activePath[level] === scale.measurementScaleCode
//         const hasSubScales = scale.subScales && scale.subScales.length > 0

//         return (
//             <div key={scale.measurementScaleCode}>
//                 <button
//                     className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center ${isActive ? "bg-[#bd2427]/10 text-[#bd2427]" : "hover:bg-gray-50"
//                         }`}
//                     style={{ paddingLeft: `${level * 0.5 + 0.75}rem` }}
//                     onClick={() => {
//                         // Create a new path up to this level
//                         const newPath = [...activePath.slice(0, level), scale.measurementScaleCode]

//                         // If this scale has subscales, add the first subscale to the path
//                         if (hasSubScales) {
//                             const sortedSubScales = [...scale.subScales].sort((a, b) => a.sortOrder - b.sortOrder)
//                             newPath.push(sortedSubScales[0].measurementScaleCode)
//                         }

//                         setActivePath(newPath)
//                     }}
//                 >
//                     {isActive ? (
//                         <ChevronDown className={`h-4 w-4 mr-2 ${level === 0 ? "text-[#bd2427]" : "text-gray-500"}`} />
//                     ) : (
//                         <ChevronRight className="h-4 w-4 mr-2 text-gray-500" />
//                     )}
//                     {scale.measurementName}
//                 </button>

//                 {/* Render subscales if this item is active */}
//                 {isActive && hasSubScales && (
//                     <div className={`ml-${level + 2} mt-1 space-y-1 border-l-2 border-gray-100 pl-2`}>
//                         {scale.subScales
//                             .sort((a, b) => a.sortOrder - b.sortOrder)
//                             .map((subScale) => (
//                                 <ScaleNavItem
//                                     key={subScale.measurementScaleCode}
//                                     scale={subScale}
//                                     path={currentPath}
//                                     level={level + 1}
//                                 />
//                             ))}
//                     </div>
//                 )}
//             </div>
//         )
//     }

//     // Generate breadcrumb path for display
//     const getBreadcrumbPath = () => {
//         const result = []
//         let currentScales = scales

//         for (let i = 0; i < activePath.length; i++) {
//             const code = activePath[i]
//             const scale = currentScales.find((s) => s.measurementScaleCode === code)

//             if (scale) {
//                 result.push({ code: scale.measurementScaleCode, name: scale.measurementName })
//                 currentScales = scale.subScales
//             } else {
//                 break
//             }
//         }

//         return result
//     }

//     if (loading) {
//         return (
//             <div className="container mx-auto py-12 flex justify-center items-center min-h-[50vh]">
//                 <div className="flex flex-col items-center gap-4">
//                     <Loader2 className="h-8 w-8 animate-spin text-[#bd2427]" />
//                     <p className="text-lg">Đang tải dữ liệu...</p>
//                 </div>
//             </div>
//         )
//     }

//     const selectedScale = getSelectedScale()
//     const breadcrumbPath = getBreadcrumbPath()

//     return (
//         <div className="container mx-auto py-6">
//             <h1 className="text-3xl font-bold mb-6 text-center text-[#bd2427]">Thang đo đánh giá kỹ năng và thể lực</h1>

//             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//                 {/* Sidebar Navigation */}
//                 <div className="md:col-span-1">
//                     <Card className="sticky top-6">
//                         <CardHeader className="bg-gray-50 pb-3">
//                             <CardTitle className="text-lg font-bold text-[#bd2427]">Danh mục đánh giá</CardTitle>
//                         </CardHeader>
//                         <CardContent className="p-0">
//                             <div className="p-3 space-y-1">
//                                 {scales.map((scale) => (
//                                     <ScaleNavItem key={scale.measurementScaleCode} scale={scale} />
//                                 ))}
//                             </div>
//                         </CardContent>
//                     </Card>
//                 </div>

//                 {/* Main Content */}
//                 <div className="md:col-span-3">
//                     {selectedScale ? (
//                         <Card className="border-t-4 border-t-[#bd2427]">
//                             <CardHeader className="bg-gray-50 pb-4">
//                                 <div className="flex items-center text-sm text-gray-500 mb-1 flex-wrap">
//                                     {breadcrumbPath.map((item, index) => (
//                                         <React.Fragment key={item.code}>
//                                             {index > 0 && <ArrowRight className="h-3 w-3 mx-1" />}
//                                             <span>{item.name}</span>
//                                         </React.Fragment>
//                                     ))}
//                                 </div>
//                                 <CardTitle className="text-2xl font-bold text-[#bd2427]">
//                                     {selectedScale.measurementName}
//                                     <span className="text-sm text-gray-500 ml-2">({selectedScale.measurementScaleCode})</span>
//                                 </CardTitle>
//                             </CardHeader>

//                             <CardContent className="p-6">
//                                 <div className="space-y-6">
//                                     {/* Nội dung */}
//                                     {selectedScale.content && (
//                                         <div>
//                                             <h3 className="text-lg font-semibold mb-2">Nội dung</h3>
//                                             <div className="prose max-w-none" dangerouslySetInnerHTML={createMarkup(selectedScale.content)} />
//                                         </div>
//                                     )}

//                                     {/* Mô tả */}
//                                     {selectedScale.description && (
//                                         <div>
//                                             <h3 className="text-lg font-semibold mb-2">Mô tả</h3>
//                                             <div
//                                                 className="prose max-w-none"
//                                                 dangerouslySetInnerHTML={createMarkup(selectedScale.description)}
//                                             />
//                                         </div>
//                                     )}

//                                     {/* Thời gian */}
//                                     {selectedScale.duration && (
//                                         <div>
//                                             <h3 className="text-lg font-semibold mb-2">Thời gian</h3>
//                                             <div
//                                                 className="prose max-w-none"
//                                                 dangerouslySetInnerHTML={createMarkup(selectedScale.duration)}
//                                             />
//                                         </div>
//                                     )}

//                                     {/* Địa điểm */}
//                                     {selectedScale.location && (
//                                         <div>
//                                             <h3 className="text-lg font-semibold mb-2">Địa điểm</h3>
//                                             <div
//                                                 className="prose max-w-none"
//                                                 dangerouslySetInnerHTML={createMarkup(selectedScale.location)}
//                                             />
//                                         </div>
//                                     )}

//                                     {/* Thiết bị */}
//                                     {selectedScale.equipment && (
//                                         <div>
//                                             <h3 className="text-lg font-semibold mb-2">Thiết bị</h3>
//                                             <div
//                                                 className="prose max-w-none"
//                                                 dangerouslySetInnerHTML={createMarkup(selectedScale.equipment)}
//                                             />
//                                         </div>
//                                     )}

//                                     {/* Thang đo đánh giá */}
//                                     {selectedScale.measurementScale && (
//                                         <div>
//                                             <h3 className="text-lg font-semibold mb-2">Thang đo đánh giá</h3>
//                                             <div
//                                                 className="prose max-w-none"
//                                                 dangerouslySetInnerHTML={createMarkup(selectedScale.measurementScale)}
//                                             />
//                                         </div>
//                                     )}

//                                     {/* Tiêu chí đánh giá */}
//                                     {selectedScale.scoreCriteria && selectedScale.scoreCriteria.length > 0 && (
//                                         <div>
//                                             <h3 className="text-lg font-semibold mb-2 text-[#bd2427]">Tiêu chí đánh giá</h3>
//                                             <div className="overflow-x-auto">
//                                                 <Table>
//                                                     <TableHeader className="bg-gray-100">
//                                                         <TableRow>
//                                                             <TableHead className="font-bold">Tiêu chí</TableHead>
//                                                             <TableHead className="font-bold">Đơn vị</TableHead>
//                                                             <TableHead className="font-bold">Giới tính</TableHead>
//                                                             <TableHead className="font-bold">Mức độ</TableHead>
//                                                             {selectedScale.scoreCriteria.some((criteria) =>
//                                                                 criteria.scoreLevels.some(
//                                                                     (level) => level.minValue !== null || level.maxValue !== null,
//                                                                 ),
//                                                             ) && <TableHead className="font-bold">Giá trị</TableHead>}
//                                                         </TableRow>
//                                                     </TableHeader>
//                                                     <TableBody>
//                                                         {selectedScale.scoreCriteria.map((criteria) => (
//                                                             <React.Fragment key={criteria.scoreCriteriaId}>
//                                                                 {criteria.scoreLevels.map((level, levelIndex) => (
//                                                                     <TableRow key={`${criteria.scoreCriteriaId}-${levelIndex}`}>
//                                                                         {levelIndex === 0 && (
//                                                                             <>
//                                                                                 <TableCell rowSpan={criteria.scoreLevels.length} className="font-medium">
//                                                                                     {criteria.criteriaName}
//                                                                                 </TableCell>
//                                                                                 <TableCell rowSpan={criteria.scoreLevels.length}>{criteria.unit}</TableCell>
//                                                                                 <TableCell rowSpan={criteria.scoreLevels.length}>
//                                                                                     {criteria.gender ? "Nam" : "Nữ"}
//                                                                                 </TableCell>
//                                                                             </>
//                                                                         )}
//                                                                         <TableCell className="border-l">{level.scoreLevel}</TableCell>
//                                                                         {(level.minValue !== null || level.maxValue !== null) && (
//                                                                             <TableCell>
//                                                                                 {level.minValue === null && level.maxValue !== null && (
//                                                                                     <>&lt; {level.maxValue}</>
//                                                                                 )}
//                                                                                 {level.minValue !== null && level.maxValue === null && (
//                                                                                     <>&gt; {level.minValue}</>
//                                                                                 )}
//                                                                                 {level.minValue !== null && level.maxValue !== null && (
//                                                                                     <>
//                                                                                         {level.minValue} - {level.maxValue}
//                                                                                     </>
//                                                                                 )}
//                                                                             </TableCell>
//                                                                         )}
//                                                                     </TableRow>
//                                                                 ))}
//                                                             </React.Fragment>
//                                                         ))}
//                                                     </TableBody>
//                                                 </Table>
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>
//                             </CardContent>
//                         </Card>
//                     ) : (
//                         <Card>
//                             <CardContent className="p-12 text-center">
//                                 <p className="text-lg text-gray-500">Vui lòng chọn một thang đo để xem chi tiết</p>
//                             </CardContent>
//                         </Card>
//                     )}
//                 </div>
//             </div>
//         </div>
//     )
// }

"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { ChevronDown, ChevronRight, ArrowRight, Loader2, Search, AlertCircle } from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"
import React from "react"
import tryOutApi from "@/api/tryOutScore"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"

export default function MeasurementScalesPage() {
    const [scales, setScales] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [activePath, setActivePath] = useState([])
    const [searchQuery, setSearchQuery] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [isSearching, setIsSearching] = useState(false)
    const [notFound, setNotFound] = useState(false)
    const [searchedCode, setSearchedCode] = useState("")

    const searchParams = useSearchParams()
    const router = useRouter()

    // Get measurementScaleCode from URL query parameter
    const measurementScaleCodeFromUrl = searchParams.get("measurementScaleCode")

    useEffect(() => {
        const fetchScales = async () => {
            try {
                setLoading(true)
                setNotFound(false)

                const response = await tryOutApi.getMeasurementScale()
                setScales(response.data.data)

                // if (!response.ok) {
                //     throw new Error(`API error: ${response.status}`)
                // }

                const sortedScales = response.data.data.sort((a, b) => a.sortOrder - b.sortOrder)
                setScales(sortedScales)

                // If we have a measurementScaleCode from URL, find and select it
                if (measurementScaleCodeFromUrl) {
                    console.log(`Searching for scale with code: ${measurementScaleCodeFromUrl}`)
                    const found = selectScaleByCode(measurementScaleCodeFromUrl, sortedScales)

                    if (!found) {
                        console.log(`Scale with code ${measurementScaleCodeFromUrl} not found`)
                        setNotFound(true)
                        setSearchedCode(measurementScaleCodeFromUrl)
                    }
                } else if (sortedScales.length > 0 && activePath.length === 0) {
                    // Only set initial active path if we don't already have one
                    const initialPath = [sortedScales[0].measurementScaleCode]

                    // If there are subscales, add the first one to the path
                    if (sortedScales[0].subScales && sortedScales[0].subScales.length > 0) {
                        const sortedSubScales = [...sortedScales[0].subScales].sort((a, b) => a.sortOrder - b.sortOrder)
                        initialPath.push(sortedSubScales[0].measurementScaleCode)

                        // If there are sub-subscales, add the first one to the path
                        if (sortedSubScales[0].subScales && sortedSubScales[0].subScales.length > 0) {
                            const sortedSubSubScales = [...sortedSubScales[0].subScales].sort((a, b) => a.sortOrder - b.sortOrder)
                            initialPath.push(sortedSubSubScales[0].measurementScaleCode)
                        }
                    }

                    setActivePath(initialPath)
                }
            } catch (err) {
                console.error("Error fetching scales:", err)
                setError(err instanceof Error ? err.message : "An unknown error occurred")
            } finally {
                setLoading(false)
            }
        }

        // Always fetch data when the component mounts or when measurementScaleCodeFromUrl changes
        fetchScales()
    }, [measurementScaleCodeFromUrl])

    // Function to find a scale by its code and set the active path
    const selectScaleByCode = (code, scalesData = scales) => {
        if (!code) return false

        console.log(`Attempting to select scale with code: ${code}`)
        console.log(
            `Available scales:`,
            scalesData.map((s) => s.measurementScaleCode),
        )

        // Helper function to search recursively through scales
        const findScalePathRecursive = (scales, targetCode, currentPath = []) => {
            for (const scale of scales) {
                const newPath = [...currentPath, scale.measurementScaleCode]

                // Case-insensitive comparison
                if (scale.measurementScaleCode.toLowerCase() === targetCode.toLowerCase()) {
                    console.log(`Found scale: ${scale.measurementName} (${scale.measurementScaleCode})`)
                    return newPath
                }

                // Check subscales if they exist
                if (scale.subScales && scale.subScales.length > 0) {
                    console.log(`Checking subscales of ${scale.measurementScaleCode}`)
                    const foundInSubScales = findScalePathRecursive(scale.subScales, targetCode, newPath)
                    if (foundInSubScales) return foundInSubScales
                }
            }

            return null
        }

        const path = findScalePathRecursive(scalesData, code)

        if (path) {
            console.log(`Setting active path to:`, path)
            setActivePath(path)
            setNotFound(false)
            return true
        }

        console.log(`No scale found with code: ${code}`)
        return false
    }

    // Handle search
    const handleSearch = () => {
        if (!searchQuery.trim()) return

        setIsSearching(true)
        setNotFound(false)

        // Search for scales that match the query
        const searchRecursive = (scales, results = []) => {
            for (const scale of scales) {
                if (
                    scale.measurementScaleCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    scale.measurementName.toLowerCase().includes(searchQuery.toLowerCase())
                ) {
                    results.push({
                        code: scale.measurementScaleCode,
                        name: scale.measurementName,
                    })
                }

                if (scale.subScales && scale.subScales.length > 0) {
                    searchRecursive(scale.subScales, results)
                }
            }

            return results
        }

        const results = searchRecursive(scales)
        setSearchResults(results)

        // If there's an exact match for the code, select it immediately
        const exactMatch = findExactMatch(scales, searchQuery)

        if (exactMatch) {
            selectScaleByCode(exactMatch.measurementScaleCode)
            // Update URL with the measurement code
            router.push(`?measurementScaleCode=${exactMatch.measurementScaleCode}`)
        } else if (results.length === 1) {
            // If there's only one result, select it
            selectScaleByCode(results[0].code)
            router.push(`?measurementScaleCode=${results[0].code}`)
        } else if (results.length === 0) {
            setNotFound(true)
            setSearchedCode(searchQuery)
        }

        setIsSearching(false)
    }

    // Find an exact match in scales (case insensitive)
    const findExactMatch = (scales, query, found = null) => {
        for (const scale of scales) {
            if (scale.measurementScaleCode.toLowerCase() === query.toLowerCase()) {
                return scale
            }

            if (scale.subScales && scale.subScales.length > 0) {
                const match = findExactMatch(scale.subScales, query)
                if (match) return match
            }
        }

        return found
    }

    // Handle selecting a search result
    const handleSelectSearchResult = (code) => {
        selectScaleByCode(code)
        setSearchResults([])
        setSearchQuery("")
        // Update URL with the measurement code
        router.push(`?measurementScaleCode=${code}`)
    }

    // Find a scale by its path
    const findScaleByPath = (path) => {
        if (!path.length) return null

        let currentScale = scales.find((scale) => scale.measurementScaleCode === path[0])

        if (!currentScale) return null

        // Navigate through the path
        for (let i = 1; i < path.length; i++) {
            if (!currentScale.subScales) return currentScale

            const nextScale = currentScale.subScales.find((sub) => sub.measurementScaleCode === path[i])

            if (!nextScale) return currentScale
            currentScale = nextScale
        }

        return currentScale
    }

    // Get the currently selected scale
    const getSelectedScale = () => {
        return findScaleByPath(activePath)
    }

    // Convert HTML string to safe JSX
    const createMarkup = (htmlString) => {
        return { __html: htmlString || "" }
    }

    // Recursive component to render nested navigation
    const ScaleNavItem = ({ scale, path = [], level = 0 }) => {
        const currentPath = [...path, scale.measurementScaleCode]
        const isActive = activePath.length > level && activePath[level] === scale.measurementScaleCode
        const hasSubScales = scale.subScales && scale.subScales.length > 0

        return (
            <div key={scale.measurementScaleCode}>
                <button
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center ${isActive ? "bg-[#bd2427]/10 text-[#bd2427]" : "hover:bg-gray-50"
                        }`}
                    style={{ paddingLeft: `${level * 0.5 + 0.75}rem` }}
                    onClick={() => {
                        // Create a new path up to this level
                        const newPath = [...activePath.slice(0, level), scale.measurementScaleCode]

                        // If this scale has subscales, add the first subscale to the path
                        if (hasSubScales) {
                            const sortedSubScales = [...scale.subScales].sort((a, b) => a.sortOrder - b.sortOrder)
                            newPath.push(sortedSubScales[0].measurementScaleCode)
                        }

                        setActivePath(newPath)
                        // Don't update URL when navigating through sidebar
                        // router.push(`?measurementScaleCode=${scale.measurementScaleCode}`)
                    }}
                >
                    {isActive ? (
                        <ChevronDown className={`h-4 w-4 mr-2 ${level === 0 ? "text-[#bd2427]" : "text-gray-500"}`} />
                    ) : (
                        <ChevronRight className="h-4 w-4 mr-2 text-gray-500" />
                    )}
                    {scale.measurementName}
                </button>

                {/* Render subscales if this item is active */}
                {isActive && hasSubScales && (
                    <div className={`ml-${level + 2} mt-1 space-y-1 border-l-2 border-gray-100 pl-2`}>
                        {scale.subScales
                            .sort((a, b) => a.sortOrder - b.sortOrder)
                            .map((subScale) => (
                                <ScaleNavItem
                                    key={subScale.measurementScaleCode}
                                    scale={subScale}
                                    path={currentPath}
                                    level={level + 1}
                                />
                            ))}
                    </div>
                )}
            </div>
        )
    }

    // Generate breadcrumb path for display
    const getBreadcrumbPath = () => {
        const result = []
        let currentScales = scales

        for (let i = 0; i < activePath.length; i++) {
            const code = activePath[i]
            const scale = currentScales.find((s) => s.measurementScaleCode === code)

            if (scale) {
                result.push({ code: scale.measurementScaleCode, name: scale.measurementName })
                currentScales = scale.subScales || []
            } else {
                break
            }
        }

        return result
    }

    if (loading) {
        return (
            <div className="container mx-auto py-12 flex justify-center items-center min-h-[50vh]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-[#bd2427]" />
                    <p className="text-lg">Đang tải dữ liệu...</p>
                </div>
            </div>
        )
    }

    const selectedScale = getSelectedScale()
    const breadcrumbPath = getBreadcrumbPath()

    return (
        <div className="container mx-auto py-6">
            <h1 className="text-3xl font-bold mb-6 text-center text-[#bd2427]">Thang đo đánh giá kỹ năng và thể lực</h1>

            {/* Search Bar */}
            {/* <div className="mb-6">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Input
                            type="search"
                            placeholder="Tìm kiếm theo mã hoặc tên thang đo..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleSearch()
                                }
                            }}
                            className="w-full"
                        />
                        {searchResults.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                                {searchResults.map((result) => (
                                    <button
                                        key={result.code}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                                        onClick={() => handleSelectSearchResult(result.code)}
                                    >
                                        <span className="font-medium">{result.name}</span>
                                        <span className="text-sm text-gray-500 ml-2">({result.code})</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <Button onClick={handleSearch} className="bg-[#bd2427] hover:bg-[#a01f21]" disabled={isSearching}>
                        {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                        <span className="ml-2">Tìm kiếm</span>
                    </Button>
                </div>
            </div> */}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Sidebar Navigation */}
                <div className="md:col-span-1">
                    <Card className="sticky top-6">
                        <CardHeader className="bg-gray-50 pb-3">
                            <CardTitle className="text-lg font-bold text-[#bd2427]">Danh mục đánh giá</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="p-3 space-y-1">
                                {scales.map((scale) => (
                                    <ScaleNavItem key={scale.measurementScaleCode} scale={scale} />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="md:col-span-3">
                    {selectedScale ? (
                        <Card className="border-t-4 border-t-[#bd2427]">
                            <CardHeader className="bg-gray-50 pb-4">
                                <div className="flex items-center text-sm text-gray-500 mb-1 flex-wrap">
                                    {breadcrumbPath.map((item, index) => (
                                        <React.Fragment key={item.code}>
                                            {index > 0 && <ArrowRight className="h-3 w-3 mx-1" />}
                                            <span>{item.name}</span>
                                        </React.Fragment>
                                    ))}
                                </div>
                                <CardTitle className="text-2xl font-bold text-[#bd2427]">
                                    {selectedScale.measurementName}
                                    <span className="text-sm text-gray-500 ml-2">({selectedScale.measurementScaleCode})</span>
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="p-6">
                                <div className="space-y-6">
                                    {/* Nội dung */}
                                    {selectedScale.content && (
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">Nội dung</h3>
                                            <div className="prose max-w-none" dangerouslySetInnerHTML={createMarkup(selectedScale.content)} />
                                        </div>
                                    )}

                                    {/* Mô tả */}
                                    {selectedScale.description && (
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">Mô tả</h3>
                                            <div
                                                className="prose max-w-none"
                                                dangerouslySetInnerHTML={createMarkup(selectedScale.description)}
                                            />
                                        </div>
                                    )}

                                    {/* Thời gian */}
                                    {selectedScale.duration && (
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">Thời gian</h3>
                                            <div
                                                className="prose max-w-none"
                                                dangerouslySetInnerHTML={createMarkup(selectedScale.duration)}
                                            />
                                        </div>
                                    )}

                                    {/* Địa điểm */}
                                    {selectedScale.location && (
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">Địa điểm</h3>
                                            <div
                                                className="prose max-w-none"
                                                dangerouslySetInnerHTML={createMarkup(selectedScale.location)}
                                            />
                                        </div>
                                    )}

                                    {/* Thiết bị */}
                                    {selectedScale.equipment && (
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">Thiết bị</h3>
                                            <div
                                                className="prose max-w-none"
                                                dangerouslySetInnerHTML={createMarkup(selectedScale.equipment)}
                                            />
                                        </div>
                                    )}

                                    {/* Thang đo đánh giá */}
                                    {selectedScale.measurementScale && (
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">Thang đo đánh giá</h3>
                                            <div
                                                className="prose max-w-none"
                                                dangerouslySetInnerHTML={createMarkup(selectedScale.measurementScale)}
                                            />
                                        </div>
                                    )}

                                    {/* Tiêu chí đánh giá */}
                                    {selectedScale.scoreCriteria && selectedScale.scoreCriteria.length > 0 && (
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2 text-[#bd2427]">Tiêu chí đánh giá</h3>
                                            <div className="overflow-x-auto">
                                                <Table>
                                                    <TableHeader className="bg-gray-100">
                                                        <TableRow>
                                                            <TableHead className="font-bold">Tiêu chí</TableHead>
                                                            <TableHead className="font-bold">Đơn vị</TableHead>
                                                            <TableHead className="font-bold">Giới tính</TableHead>
                                                            {selectedScale.scoreCriteria.some((criteria) =>
                                                                criteria.scoreLevels.some(
                                                                    (level) => level.minValue !== null || level.maxValue !== null,
                                                                ),
                                                            ) && <TableHead className="font-bold">Giá trị</TableHead>}
                                                            <TableHead className="font-bold">Mức độ</TableHead>
                                                            <TableHead className="font-bold">Thang điểm 5</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {selectedScale.scoreCriteria.map((criteria) => (
                                                            <React.Fragment key={criteria.scoreCriteriaId}>
                                                                {criteria.scoreLevels.map((level, levelIndex) => (
                                                                    <TableRow key={`${criteria.scoreCriteriaId}-${levelIndex}`}>
                                                                        {levelIndex === 0 && (
                                                                            <>
                                                                                <TableCell rowSpan={criteria.scoreLevels.length} className="font-medium">
                                                                                    {criteria.criteriaName}
                                                                                </TableCell>
                                                                                <TableCell rowSpan={criteria.scoreLevels.length}>{criteria.unit}</TableCell>
                                                                                <TableCell rowSpan={criteria.scoreLevels.length}>
                                                                                    {criteria.gender ? "Nam" : "Nữ"}
                                                                                </TableCell>
                                                                            </>
                                                                        )}
                                                                        {(level.minValue !== null || level.maxValue !== null) && (
                                                                            <TableCell className="border-1">
                                                                                {level.minValue === null && level.maxValue !== null && (
                                                                                    <>&lt; {level.maxValue}</>
                                                                                )}
                                                                                {level.minValue !== null && level.maxValue === null && (
                                                                                    <>&gt; {level.minValue}</>
                                                                                )}
                                                                                {level.minValue !== null && level.maxValue !== null && (
                                                                                    <>
                                                                                        {level.minValue} - {level.maxValue}
                                                                                    </>
                                                                                )}
                                                                            </TableCell>
                                                                        )}
                                                                        <TableCell className="border-l">{level.scoreLevel}</TableCell>
                                                                        <TableCell className="border-l">{level.fiveScaleScore}</TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </React.Fragment>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardContent className="p-12 text-center">
                                <p className="text-lg text-gray-500">
                                    {notFound
                                        ? `Không tìm thấy thang đo với mã "${searchedCode}". Vui lòng chọn một thang đo khác.`
                                        : "Vui lòng chọn một thang đo để xem chi tiết"}
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}




