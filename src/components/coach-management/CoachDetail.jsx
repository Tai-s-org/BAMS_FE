"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import coachApi from "@/api/coach"
import teamApi from "@/api/team"
import { useToasts } from "@/hooks/providers/ToastProvider"

export default function CoachDetail({ id }) {
    const router = useRouter()
    const [coach, setCoach] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showAssignTeamModal, setShowAssignTeamModal] = useState(false)
    const [showDisableModal, setShowDisableModal] = useState(false)
    const [selectedTeam, setSelectedTeam] = useState("1")
    const [isEnabled, setIsEnabled] = useState(true)
    const [teams, setTeams] = useState([])
    const { addToast } = useToasts();

    // Format date to display in a more readable format
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })
    }
    const fetchCoachData = async () => {
        try {
            setLoading(true)
            const coachData = await coachApi.getCoachById(id);
            console.log(coachData.data);

            setCoach(coachData.data.data)
            setSelectedTeam(coachData.data.teamId || "1")
            setIsEnabled(true)
        } catch (err) {
            console.error("Error fetching coach data:", err)
            setError("Failed to load coach data. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    // Fetch coach data
    useEffect(() => {


        const fetchTeam = async () => {
            try {
                const teamData = await teamApi.listTeams();
                console.log("Team: ", teamData.data);
                setTeams(teamData.data.data.items)
            } catch (err) {
                console.error("Error fetching team data:", err)
            }
        }
        fetchTeam();
        fetchCoachData()
    }, [id])

    const handleAssignTeam = async () => {
        try {
            // In a real app, you would call an API to update the team
            const response = await coachApi.assignCoachToTeam({
                "userId": coach.userId,
                "teamId": selectedTeam
            })

            // Update local state
            setCoach((prev) => ({
                ...prev,
                teamId: selectedTeam,
            }))
            fetchCoachData()
            addToast({ message: response.data.message, type: "success" })
            
            setShowAssignTeamModal(false)
        } catch (err) {
            console.log(err);

        }
    }

    const handleToggleStatus = async () => {
        try {
            // In a real app, you would call an API to toggle the coach's status
            const response = await coachApi.changeCoachStatus(coach.userId)
            console.log(response.data);
            
            // Update local state
            setIsEnabled((prev) => !prev)
            addToast({ message: response.data.message, type: "success" })
            setShowDisableModal(false)
        } catch (err) {
            addToast({ message: err, type: "error" })
        }
    }

    const handleBack = () => {
        router.back()
    }

    if (loading) {
        return (
            <div className="container mx-auto py-8 px-4 flex justify-center items-center min-h-[60vh]">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#bd2427]"></div>
                    <p className="mt-4 text-gray-600">Đang tải thông tin chi tiết về huấn luyện viên...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mx-auto py-8 px-4">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                    <p>{error}</p>
                    <button
                        onClick={() => router.back()}
                        className="mt-2 px-3 py-1 text-sm border border-red-300 rounded hover:bg-red-100 transition-colors"
                    >
                        Quay lại danh sách huấn luyện viên
                    </button>
                </div>
            </div>
        )
    }

    if (!coach) {
        return null
    }

    return (
        <div className="container mx-auto py-8 px-4">
            {/* Back button */}
            <button
                onClick={handleBack}
                className="mb-6 flex items-center text-gray-600 hover:text-[#bd2427] transition-colors"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                >
                    <path d="m15 18-6-6 6-6" />
                </svg>
                Quay lại danh sách huấn luyện viên
            </button>

            {/* Coach Profile Header */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 relative">
                <div className="bg-gradient-to-r from-[#bd2427] to-[#e74c3c] h-32"></div>
                <div className="px-6 pb-6 ">
                    <div className="absolute top-12 left-6 bg-white rounded-full p-2 shadow-lg">
                        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-4xl">
                            AAA
                        </div>
                    </div>
                    <div className="mt-12 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">@{coach.username}</h1>
                            {/* <div className="flex items-center mt-1">
                                <span
                                    className={`px-2 py-1 text-xs font-semibold rounded-full ${coach.isEnabled ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                                >
                                    {coach.isEnabled ? "Đang hoạt động" : "Không hoạt động"}
                                </span>
                            </div> */}
                        </div>
                        <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">
                            <button
                                onClick={() => setShowAssignTeamModal(true)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
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
                                    className="mr-2"
                                >
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                                Chỉ định vào đội
                            </button>
                            <button
                                onClick={() => setShowDisableModal(true)}
                                className={`px-4 py-2 ${coach?.isEnabled ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"} text-white rounded-md transition-colors flex items-center`}
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
                                    className="mr-2"
                                >
                                    {coach?.isEnabled ? (
                                        <path d="M18.36 6.64A9 9 0 0 1 20.77 15M5.64 6.64A9 9 0 1 0 18.36 19.36L5.64 6.64z" />
                                    ) : (
                                        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12s4.48 10 10 10 10-4.48 10-10z" />
                                    )}
                                </svg>
                                {coach.isEnabled ? "Vô hiệu hóa tài khoản" : "Kích hoạt tài khoản"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-10">
                <div className="px-6 py-4 bg-[#bd2427] border-b">
                    <h2 className="text-xl font-semibold text-white">Thông tin cá nhân</h2>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Họ và tên</p>
                                <p className="font-medium">{coach.fullname}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-medium">{coach.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Số điện thoại</p>
                                <p className="font-medium">{coach.phone}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Địa chỉ</p>
                                <p className="font-medium">{coach.address}</p>
                            </div>
                        </div>


                    </div>
                </div>
            </div>

            {/* Coach Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contract Information */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 border-b">
                        <h2 className="text-xl font-semibold">Thông tin hợp đồng</h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Ngày bắt đầu hợp đồng</p>
                                    <p className="font-medium">{(coach.roleInformation.contractStartDate)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Ngày hết hạn hợp đồng</p>
                                    <p className="font-medium">{(coach.roleInformation.contractEndDate)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Tiểu sử</p>
                                    <p className="font-medium">{coach.roleInformation.bio || "-"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Được kí bởi</p>
                                    <p className="font-medium">Chủ tịch {coach.roleInformation.createdByPresident}</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Team Information */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 border-b">
                        <h2 className="text-xl font-semibold">Thông tin đội</h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500">Đội</p>
                                <p className="font-medium">{coach.roleInformation.teamName || "Chưa có đội"}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Vai trò</p>
                                <p className="font-medium">Huấn luyện viên</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Assign Team Modal */}
            {showAssignTeamModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
                        <div className="px-6 py-4 border-b">
                            <h3 className="text-xl font-semibold">Phân công vào đội</h3>
                        </div>
                        <div className="p-6">
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-medium mb-2">Chọn đội</label>
                                <div className="relative">
                                    <select
                                        value={selectedTeam}
                                        onChange={(e) => setSelectedTeam(e.target.value)}
                                        className="w-full px-3 py-2 border rounded-md appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-[#bd2427] focus:border-transparent"
                                    >
                                        {Array.isArray(teams) && teams.map((team) => (
                                            <option key={team.teamId} value={team.teamId}>
                                                {team.teamName}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                        <svg
                                            className="w-4 h-4 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => setShowAssignTeamModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    onClick={handleAssignTeam}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Phân công
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Disable Coach Modal */}
            {showDisableModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
                        <div className="px-6 py-4 border-b">
                            <h3 className="text-xl font-semibold">{isEnabled ? "Vô hiệu hóa HLV" : "Kích hoạt HLV"}</h3>
                        </div>
                        <div className="p-6">
                            <p className="mb-4">
                            Bạn có chắc chắn muốn {coach?.isEnabled ? "vô hiệu hóa" : "kích hoạt"} HLV này không?
                                {coach?.isEnabled
                                    ? " Họ sẽ không còn có thể truy cập vào hệ thống nữa."
                                    : " Họ sẽ lấy lại được quyền truy cập vào hệ thống."}
                            </p>
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => setShowDisableModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleToggleStatus}
                                    className={`px-4 py-2 ${coach?.isEnabled ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"} text-white rounded-md transition-colors`}
                                >
                                    {coach?.isEnabled ? "Vô hiệu hóa" : "Kích hoạt"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

