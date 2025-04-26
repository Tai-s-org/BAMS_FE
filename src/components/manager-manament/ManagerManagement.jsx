"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import ManagerFilters from "@/components/manager-manament/ManagerFilter"
import ManagerList from "@/components/manager-manament/ManagerList"
import ManagerPagination from "@/components/manager-manament/ManagerPagingation"
import managerApi from "@/api/manager"
import { useRouter } from "next/navigation"

export default function ManagerManagement() {
    // State for filters and pagination
    const [searchName, setSearchName] = useState("")
    const [searchEmail, setSearchEmail] = useState("")
    const [isEnableFilter, setIsEnableFilter] = useState("all")
    const [teamIdFilter, setTeamIdFilter] = useState("all")
    const [isDescending, setIsDescending] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const router = useRouter();
    // Fetch data from API
    const fetchData = async () => {
        //setLoading(true)
        setError(null)

        try {
            // Ensure pageSize is at least 10
            const effectivePageSize = Math.max(10, pageSize)

            // Build filters object
            const filters = {
                // Only include filters with values
                ...(searchName ? { Name: searchName } : {}),
                ...(searchEmail ? { Email: searchEmail } : {}),
                ...(isEnableFilter !== "all" ? { IsEnable: isEnableFilter === "true" } : {}),
                ...(teamIdFilter !== "all" ? { TeamId: teamIdFilter } : {}),
                ...(isDescending !== null ? { IsDescending: isDescending } : {}),
                Page: currentPage,
                PageSize: effectivePageSize,
            }

            // Call the API using your service
            const response = await managerApi.getManagers(filters)
            console.log(response.data.data);

            setData(response.data)
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
    }, [searchName, searchEmail, isEnableFilter, teamIdFilter, isDescending, currentPage, pageSize])

    // Toggle sort direction
    const toggleSortDirection = () => {
        if (isDescending === null) {
            setIsDescending(true)
        } else if (isDescending === true) {
            setIsDescending(false)
        } else {
            setIsDescending(null)
        }
    }

    // Handle view details
    const handleViewDetails = (userId) => {
        router.push(`/dashboard/manager-management/${userId}`)
    }

    // Handle search change
    const handleSearchChange = (type, value) => {
        if (type === "name") {
            setSearchName(value)
        } else if (type === "email") {
            setSearchEmail(value)
        }
        setCurrentPage(1) // Reset to first page when search changes
    }

    // Handle filter change
    const handleFilterChange = (type, value) => {
        if (type === "isEnable") {
            setIsEnableFilter(value)
        } else if (type === "teamId") {
            setTeamIdFilter(value)
        }
        setCurrentPage(1) // Reset to first page when filters change
    }

    // Handle page size change
    const handlePageSizeChange = (newSize) => {
        setPageSize(Number(newSize))
        setCurrentPage(1) // Reset to first page when page size changes
    }

    // Extract unique team IDs for the filter dropdown
    const uniqueTeamIds = data?.data.items
        ? Array.from(new Set(data.data.items.map((item) => item.roleInformation.teamId).filter(Boolean)))
        : []

    return (
        <div className="container mx-auto py-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Header */}
                <div className="bg-[#bd2427] text-white px-6 py-4">
                    <h1 className="text-2xl font-bold">Danh sách quản lý</h1>
                </div>

                <div className="p-6">
                    {/* Filters Component */}
                    <ManagerFilters
                        searchName={searchName}
                        searchEmail={searchEmail}
                        isEnableFilter={isEnableFilter}
                        teamIdFilter={teamIdFilter}
                        uniqueTeamIds={uniqueTeamIds}
                        onSearchChange={handleSearchChange}
                        onFilterChange={handleFilterChange}
                    />

                    {/* Error state */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                            <p>Lỗi: {error}</p>
                            <button
                                onClick={fetchData}
                                className="mt-2 px-3 py-1 text-sm border border-red-300 rounded hover:bg-red-100 transition-colors"
                            >
                                Tải lại
                            </button>
                        </div>
                    )}

                    <>
                        {/* Table Component */}
                        <ManagerList
                            managers={data?.data.items || []}
                            isDescending={isDescending}
                            toggleSortDirection={toggleSortDirection}
                            onViewDetails={handleViewDetails}
                        />

                        {/* Pagination Component */}
                        {data && (
                            <ManagerPagination
                                currentPage={data.data.currentPage}
                                totalPages={data.data.totalPages}
                                pageSize={pageSize}
                                totalRecords={data.data.totalRecords}
                                onPageChange={setCurrentPage}
                                onPageSizeChange={handlePageSizeChange}
                            />
                        )}
                    </>
                </div>
            </div>
        </div>
    )
}

