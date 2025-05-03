"use client"

import { useRouter } from "next/navigation"

export default function CoachList({ coaches }) {
    const router = useRouter()

    // Handle view details by navigating to the coach detail page
    const handleViewDetails = (userId) => {
        router.push(`/coach-management/${userId}`)
    }

    // Format date to display in a more readable format
    const formatDate = (dateString) => {
        if (!dateString) return "N/A"
        return new Date(dateString).toLocaleDateString()
    }

    return (
        <div className="rounded-md border overflow-hidden mb-6">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-xs uppercase">
                    <tr>
                        <th className="px-6 py-3 font-medium">Họ và tên</th>
                        <th className="px-6 py-3 font-medium">Đội</th>
                        <th className="px-6 py-3 font-medium">Tiểu sử</th>
                        <th className="px-6 py-3 font-medium">Ngày kí hợp đồng</th>
                        <th className="px-6 py-3 font-medium">Ngày hết hạn hợp đồng</th>
                        <th className="px-6 py-3 font-medium text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {coaches.length > 0 ? (
                        coaches.map((coach) => (
                            <tr key={coach.userId} className="bg-white border-b hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium">{coach.fullname}</td>
                                <td className="px-6 py-4">{coach.teamId || "Not Assigned"}</td>
                                <td className="px-6 py-4">{coach.bio || "N/A"}</td>
                                <td className="px-6 py-4">{formatDate(coach.contractStartDate)}</td>
                                <td className="px-6 py-4">{formatDate(coach.contractEndDate)}</td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => handleViewDetails(coach.userId)}
                                        className="px-3 py-1 text-sm border border-[#bd2427] text-[#bd2427] rounded hover:bg-[#bd2427] hover:text-white transition-colors inline-flex items-center"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="mr-1"
                                        >
                                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                        Chi tiết
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} className="px-6 py-4 text-center">
                                No coaches found matching the current filters
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

