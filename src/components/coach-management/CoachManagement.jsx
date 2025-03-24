"use client"

import { useState, useEffect } from "react"
import { Loader2, Plus } from "lucide-react"
import coachApi from "@/api/coach"
import CoachFilter from "@/components/coach-management/CoachFilter"
import CoachList from "@/components/coach-management/CoachList"
import CoachPagination from "@/components/coach-management/CoachPagination"
import CreateCoachModal from "@/components/coach-management/CreateCoachModel"

export default function CoachManagement() {
    // State for filters and pagination
    const [searchUserId, setSearchUserId] = useState("")
    const [teamIdFilter, setTeamIdFilter] = useState("all")
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showCreateModal, setShowCreateModal] = useState(false)

    // Fetch data from API
    const fetchData = async () => {
        setLoading(true)
        setError(null)

        try {
            // Ensure pageSize is at least 10
            const effectivePageSize = Math.max(10, pageSize)

            // Build filters object
            const filters = {
                // Only include filters with values
                ...(searchUserId ? { UserId: searchUserId } : {}),
                ...(teamIdFilter !== "all" ? { TeamId: teamIdFilter } : {}),
                Page: currentPage,
                PageSize: effectivePageSize,
            }

            // Call the API using your service
            //const response = await coachApi.getCoaches(filters)
            //setData(response)
        } catch (err) {
            console.error("Error fetching data:", err)
            setError(err instanceof Error ? err.message : "An unknown error occurred")
        } finally {
            setLoading(false)
        }
    }

    // Fetch data when filters or pagination changes
    useEffect(() => {
        fetchData()
    }, [searchUserId, teamIdFilter, currentPage, pageSize])

    // Handle search change
    const handleSearchChange = (value) => {
        setSearchUserId(value)
        setCurrentPage(1) // Reset to first page when search changes
    }

    // Handle filter change
    const handleFilterChange = (value) => {
        setTeamIdFilter(value)
        setCurrentPage(1) // Reset to first page when filters change
    }

    // Handle page size change
    const handlePageSizeChange = (newSize) => {
        setPageSize(Number(newSize))
        setCurrentPage(1) // Reset to first page when page size changes
    }

    // Handle create coach
    const handleCreateCoach = async (coachData) => {
        // try {
        //     await coachApi.createCoach(coachData)
        //     setShowCreateModal(false)
        //     fetchData() // Refresh the list after creating a coach
        // } catch (err) {
        //     console.error("Error creating coach:", err)
        //     alert("Failed to create coach. Please try again.")
        // }
    }

    // Extract unique team IDs for the filter dropdown
    const uniqueTeamIds = data?.data.items
        ? Array.from(new Set(data.data.items.map((item) => item.teamId).filter(Boolean)))
        : []

    return (
        <div className="container mx-auto py-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Header */}
                <div className="bg-[#bd2427] text-white px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Coach List</h1>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="px-4 py-2 bg-white text-[#bd2427] rounded-md hover:bg-gray-100 transition-colors flex items-center"
                    >
                        <Plus className="mr-2 h-5 w-5" />
                        Create Coach
                    </button>
                </div>

                <div className="p-6">
                    {/* Filters Component */}
                    <CoachFilter
                        searchUserId={searchUserId}
                        teamIdFilter={teamIdFilter}
                        uniqueTeamIds={uniqueTeamIds}
                        onSearchChange={handleSearchChange}
                        onFilterChange={handleFilterChange}
                    />

                    {/* Error state */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                            <p>Error: {error}</p>
                            <button
                                onClick={fetchData}
                                className="mt-2 px-3 py-1 text-sm border border-red-300 rounded hover:bg-red-100 transition-colors"
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {/* Loading state */}
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-[#bd2427]" />
                            <span className="ml-2 text-lg">Loading...</span>
                        </div>
                    ) : (
                        <>
                            {/* Table Component */}
                            <CoachList coaches={data?.data.items || []} />

                            {/* Pagination Component */}
                            {data && (
                                <CoachPagination
                                    currentPage={data.data.currentPage}
                                    totalPages={data.data.totalPages}
                                    pageSize={pageSize}
                                    totalRecords={data.data.totalRecords}
                                    onPageChange={setCurrentPage}
                                    onPageSizeChange={handlePageSizeChange}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Create Coach Modal */}
            {showCreateModal && <CreateCoachModal onClose={() => setShowCreateModal(false)} onSubmit={handleCreateCoach} />}
        </div>
    )
}

