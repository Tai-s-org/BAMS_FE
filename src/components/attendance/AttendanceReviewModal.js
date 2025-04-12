"use client"

import { useEffect, useState } from "react"
import { Check, X, UserCheck } from "lucide-react"
import attendanceApi from "@/api/attendance"

export function AttendanceReviewModal({ isOpen, onClose, session, sessionId }) {
  const [activeTab, setActiveTab] = useState("coaches")
  const [playerAttendance, setPlayerAttendance] = useState([])
  const [coachAttendance, setCoachAttendance] = useState([])

  useEffect(() => {
    if (isOpen) {
      fetchPlayerAttendance()
      fetchCoachAttendance()
    }
  }, [isOpen, session])

  const fetchPlayerAttendance = async () => {
    try {
      const data = {
        trainingSessionId: sessionId,
      }
      const response = await attendanceApi.getPlayerAttendance(data)
      setPlayerAttendance(response?.data.data)
    } catch (error) {
      console.log("Error fetching player attendance:", error)
    }
  }

  const fetchCoachAttendance = async () => {
    try {
      const data = {
        trainingSessionId: sessionId,
      }  
      const response = await attendanceApi.getCoachAttendance(data)
      setCoachAttendance(response?.data.data)
    } catch (error) {
      console.log("Error fetching coach attendance:", error)
    }
  }

  // Count attendance status
  const getStatusCount = (items, status) => {
    return items.filter((item) => item.status === status).length
  }

  // Display status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 1:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <Check className="mr-1 h-3 w-3" />
            Có mặt
          </span>
        )
      case 0:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <X className="mr-1 h-3 w-3" />
            Vắng mặt
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Chưa điểm danh
          </span>
        )
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          {/* Header */}
          <div className="bg-[#BD2427] px-6 py-4 flex items-center justify-between">
            <h3 className="text-lg leading-6 font-medium text-white" id="modal-title">
              Kết Quả Điểm Danh
            </h3>
            <button
              type="button"
              className="bg-[#BD2427] rounded-md text-white hover:text-gray-200 focus:outline-none"
              onClick={onClose}
            >
              <span className="sr-only">Đóng</span>
              <X className="h-6 w-6" />
            </button>
          </div>

          {session ? (
            <>
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Đội</p>
                    <p className="mt-1 text-base font-semibold text-gray-900">{session.teamName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Thời gian</p>
                    <p className="mt-1 text-base font-semibold text-gray-900">
                      {session.scheduledDate} ({session.time})
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-b border-gray-200">
                <nav className="flex -mb-px" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab("coaches")}
                    className={`${
                      activeTab === "coaches"
                        ? "border-[#BD2427] text-[#BD2427]"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    } w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm`}
                  >
                    Huấn Luyện Viên ({coachAttendance.length})
                  </button>
                  <button
                    onClick={() => setActiveTab("players")}
                    className={`${
                      activeTab === "players"
                        ? "border-[#BD2427] text-[#BD2427]"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    } w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm`}
                  >
                    Cầu Thủ ({playerAttendance.length})
                  </button>
                </nav>
              </div>

              <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
                <div className="mb-6 grid grid-cols-3 gap-4">
                  <div className="bg-green-50 rounded-lg p-3 flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <UserCheck className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800">Có mặt</p>
                      <p className="text-xl font-semibold text-green-900">
                        {activeTab === "coaches"
                          ? getStatusCount(coachAttendance, 1)
                          : getStatusCount(playerAttendance, 1)}
                      </p>
                    </div>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3 flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                      <X className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-800">Vắng mặt</p>
                      <p className="text-xl font-semibold text-red-900">
                        {activeTab === "coaches"
                          ? getStatusCount(coachAttendance, 0)
                          : getStatusCount(playerAttendance, 0)}
                      </p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-600 font-medium">%</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-800">Tỷ lệ tham gia</p>
                      <p className="text-xl font-semibold text-gray-900">
                        {activeTab === "coaches"
                          ? Math.round((getStatusCount(coachAttendance, 1) / coachAttendance.length) * 100)
                          : Math.round((getStatusCount(playerAttendance, 1) / playerAttendance.length) * 100)}
                        %
                      </p>
                    </div>
                  </div>
                </div>

                {activeTab === "coaches" ? (
                  <div className="overflow-hidden rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Huấn Luyện Viên
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Trạng Thái
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {coachAttendance.map((coach) => (
                          <tr key={coach.userId}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                  <span className="font-medium text-gray-600">{coach.fullName.charAt(0)}</span>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{coach.fullName}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(coach.status)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Cầu Thủ
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Sinh nhật
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Trạng Thái
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Ghi Chú
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {playerAttendance.map((player) => (
                          <tr key={player.userId}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#BD2427]/10 flex items-center justify-center">
                                  <span className="font-medium text-[#BD2427]">{player.fullName.charAt(0)}</span>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{player.fullName}</div>
                                  <div className="text-xs text-gray-500"></div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">20/11/2005</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(player.status)}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{player.note || "-"}</div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                </div>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BD2427]"
                    onClick={onClose}
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="px-6 py-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#BD2427] mx-auto"></div>
              <p className="mt-4 text-gray-500">Đang tải dữ liệu...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}