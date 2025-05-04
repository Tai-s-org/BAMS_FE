"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import managerApi from "@/api/manager"
import { useToasts } from "@/hooks/providers/ToastProvider"
import teamApi from "@/api/team"

export default function ManagerDetail({ id }) {
    const [manager, setManager] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showAssignTeamModal, setShowAssignTeamModal] = useState(false)
    const [showDisableModal, setShowDisableModal] = useState(false)
    const [selectedTeam, setSelectedTeam] = useState("")
    const router = useRouter()
    const [teams, setTeams] = useState([])
    const { addToast } = useToasts();

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                // Fetch teams data from the API
                const response = await teamApi.listTeams()
                console.log("team:", response.data.data);
                setTeams(response.data.data.items)
            } catch (error) {
                console.error("Error fetching teams:", error)
            }
        }

        fetchTeams()
    }, [])

    // Mock teams data
    // const teams = [
    //     { id: "1", name: "Development Team" },
    //     { id: "2", name: "Marketing Team" },
    //     { id: "3", name: "Sales Team" },
    //     { id: "4", name: "Support Team" },
    // ]

    const fetchManagerData = async () => {
        try {
            setLoading(true)
            const response = await managerApi.getManagerById(id)
            setManager(response.data.data)
            //setSelectedTeam(response.data.roleInformation.teamId || "")
        } catch (err) {
            console.error("Error fetching user data:", err)
            setError("Failed to load user data. Please try again.")
        } finally {
            setLoading(false)
        }
    }


    // Fetch user data
    useEffect(() => {
        fetchManagerData()
    }, [id])

    const handleAssignTeam = async () => {
        console.log("Assigning team:", selectedTeam);

        try {
            // In a real app, you would call an API to update the team
            const response = await managerApi.assignManagerToTeam(
                {
                    "userId": manager.userId,
                    "teamId": selectedTeam,
                    "bankName": manager.roleInformation.bankName,
                    "bankAccountNumber": manager.roleInformation.bankBinId,
                    "paymentMethod": manager.roleInformation.paymentMethod,
                    "bankBinId": manager.roleInformation.bankAccountNumber
                }, selectedTeam)
            console.log("response:", response);
            // Update local state
            setManager((prev) => ({
                ...prev,
                roleInformation: {
                    ...prev.roleInformation,
                    teamId: selectedTeam,
                },
            }))
            fetchManagerData()
            addToast({ message: response.data.message, type: "success" });
            setShowAssignTeamModal(false)
        } catch (err) {
            console.log(err);

        }
    }

    const viewTeamName = (teamId) => {
        const team = teams.find((team) => team.teamId === teamId)
        return team ? team.teamName : "Chưa có đội"
    }

    const handleDisableUser = async () => {
        try {
            // In a real app, you would call an API to toggle the user's status
            const response = await managerApi.disableManager(id)

            // Update local state
            setUser((prev) => ({
                ...prev,
                isEnable: !prev.isEnable,
            }))

            addToast({ message: response.message, type: "success" });
            setShowDisableModal(false)
        } catch (error) {
            addToast({ message: error.response, type: "error" });
        }
    }

    const handleUpdate = () => {
        //router.push(`/users/${user.userId}/edit`)
    }

    const handleBack = () => {
        router.back()
    }

    if (loading) {
        return (
            <div className="container mx-auto py-8 px-4 flex justify-center items-center min-h-[60vh]">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#bd2427]"></div>
                    <p className="mt-4 text-gray-600">Đang tải thông tin người dùng...</p>
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
                        Quay lại
                    </button>
                </div>
            </div>
        )
    }

    if (!manager) {
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
                Quay lại danh sách quản lý
            </button>

            {/* User Profile Header */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 relative">
                <div className="bg-gradient-to-r from-[#bd2427] to-[#e74c3c] h-32"></div>
                <div className="px-6 pb-6 ">
                    <div className="absolute top-12 left-6 bg-white rounded-full p-2 shadow-lg">
                        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-4xl">
                            <img
                                src={manager.profileImage || "/placeholder.svg"}
                                alt={manager.fullname}
                                className="w-full h-full rounded-full object-cover"
                            />
                        </div>
                    </div>
                    <div className="mt-12 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">{manager.fullname}</h1>
                            <div className="flex items-center mt-1">
                                <span className="text-gray-600 mr-3">@{manager.username}</span>
                                <span
                                    className={`px-2 py-1 text-xs font-semibold rounded-full ${manager.isEnable ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                                >
                                    {manager.isEnable ? "Đang hoạt động" : "Ngừng hoạt động"}
                                </span>
                            </div>
                            <div className="mt-1 text-gray-500">Quản lí</div>
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
                                Phân công vào đội
                            </button>
                            <button
                                onClick={() => setShowDisableModal(true)}
                                className={`px-4 py-2 ${manager.isEnable ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"} text-white rounded-md transition-colors flex items-center`}
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
                                    {manager.isEnable ? (
                                        <path d="M18.36 6.64A9 9 0 0 1 20.77 15M5.64 6.64A9 9 0 1 0 18.36 19.36L5.64 6.64z" />
                                    ) : (
                                        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12s4.48 10 10 10 10-4.48 10-10z" />
                                    )}
                                </svg>
                                {manager.isEnable ? "Vô hiệu hóa" : "Kích hoạt"}
                            </button>
                            <button
                                onClick={handleUpdate}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center"
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
                                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                    <path d="m15 5 4 4" />
                                </svg>
                                Thay đổi thông tin
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* User Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 border-b">
                        <h2 className="text-xl font-semibold">Thông tin cá nhân</h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Họ và tên</p>
                                    <p className="font-medium">{manager.fullname}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Tên tài khoản</p>
                                    <p className="font-medium">{manager.username}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-medium">{manager.email}</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Số điện thoại</p>
                                    <p className="font-medium">{manager.phone || "-"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Ngày sinh</p>
                                    <p className="font-medium">{manager.dateOfBirth || "N-"}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Địa chỉ</p>
                                <p className="font-medium">{manager.address || "-"}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Role Information */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 border-b">
                        <h2 className="text-xl font-semibold">Thông tin vai trò</h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Vai trò</p>
                                    <p className="font-medium">Quản lí</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Đội</p>
                                    <p className="font-medium">{viewTeamName(manager.roleInformation?.teamId) || "-"}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Tên ngân hàng</p>
                                    <p className="font-medium">{manager.roleInformation?.bankName || "-"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Số tài khoản ngân hàng</p>
                                    <p className="font-medium">{manager.roleInformation?.bankAccountNumber || "-"}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Tạo ngày</p>
                                    <p className="font-medium">{manager.createdAt}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Lần cuối cập nhật</p>
                                    <p className="font-medium">{manager.updatedAt}</p>
                                </div>
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
                                    Hủy
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

            {/* Disable User Modal */}
            {showDisableModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
                        <div className="px-6 py-4 border-b">
                            <h3 className="text-xl font-semibold">{manager.isEnable ? "Disable User" : "Enable User"}</h3>
                        </div>
                        <div className="p-6">
                            <p className="mb-4">
                                Are you sure you want to {manager.isEnable ? "disable" : "enable"} this user?
                                {manager.isEnable
                                    ? " They will no longer be able to access the system."
                                    : " They will regain access to the system."}
                            </p>
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => setShowDisableModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDisableUser}
                                    className={`px-4 py-2 ${manager.isEnable ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"} text-white rounded-md transition-colors`}
                                >
                                    {manager.isEnable ? "Disable" : "Enable"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

