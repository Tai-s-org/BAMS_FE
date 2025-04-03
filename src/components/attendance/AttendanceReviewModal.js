"use client"

import { useState } from "react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Check, X, UserCheck, Edit } from "lucide-react"

// Sample data for coaches
const coaches = [
  { id: 1, name: "Nguyễn Văn A", role: "Huấn Luyện Viên Trưởng", status: "present", note: "" },
  { id: 2, name: "Trần Thị B", role: "Huấn Luyện Viên Phụ", status: "absent", note: "Đi công tác" },
  { id: 3, name: "Lê Văn C", role: "Huấn Luyện Viên Thể Lực", status: "present", note: "" },
]

// Sample data for players
const players = [
  { id: 1, name: "Phạm Văn D", number: 5, position: "Hậu vệ", team: "T001", status: "present", note: "" },
  { id: 2, name: "Hoàng Thị E", number: 7, position: "Tiền vệ", team: "T001", status: "present", note: "" },
  { id: 3, name: "Đỗ Văn F", number: 10, position: "Tiền đạo", team: "T001", status: "absent", note: "Bị ốm" },
  {
    id: 4,
    name: "Ngô Thị G",
    number: 12,
    position: "Hậu vệ",
    team: "T001",
    status: "absent",
    note: "Chấn thương",
  },
  { id: 5, name: "Vũ Văn H", number: 15, position: "Tiền vệ", team: "T001", status: "present", note: "" },
  { id: 6, name: "Đinh Thị I", number: 3, position: "Tiền đạo", team: "T001", status: "present", note: "" },
  { id: 7, name: "Bùi Văn J", number: 8, position: "Hậu vệ", team: "T001", status: "absent", note: "Lý do cá nhân" },
  { id: 8, name: "Lý Thị K", number: 11, position: "Tiền vệ", team: "T001", status: "present", note: "" },
  {
    id: 9,
    name: "Dương Văn L",
    number: 14,
    position: "Tiền đạo",
    team: "Đội Trẻ",
    status: "absent",
    note: "Thi đấu giải khác",
  },
  { id: 10, name: "Đặng Thị M", number: 20, position: "Hậu vệ", team: "Đội Trẻ", status: "present", note: "" },
]

export function AttendanceReviewModal({ isOpen, onClose, session }) {
  const [activeTab, setActiveTab] = useState("coaches")

  // Filter players by session team
  const filteredPlayers = session
    ? players.filter((player) => session.teamId === "Tất Cả Đội" || player.team === session.teamId)
    : []

  // Count attendance status
  const getStatusCount = (items, status) => {
    return items.filter((item) => item.status === status).length
  }

  // Display status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "present":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <Check className="mr-1 h-3 w-3" />
            Có mặt
          </span>
        )
      case "absent":
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
                    <p className="mt-1 text-base font-semibold text-gray-900">{session.teamId}</p>
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
                    Huấn Luyện Viên ({coaches.length})
                  </button>
                  <button
                    onClick={() => setActiveTab("players")}
                    className={`${
                      activeTab === "players"
                        ? "border-[#BD2427] text-[#BD2427]"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    } w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm`}
                  >
                    Cầu Thủ ({filteredPlayers.length})
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
                          ? getStatusCount(coaches, "present")
                          : getStatusCount(filteredPlayers, "present")}
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
                          ? getStatusCount(coaches, "absent")
                          : getStatusCount(filteredPlayers, "absent")}
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
                          ? Math.round((getStatusCount(coaches, "present") / coaches.length) * 100)
                          : Math.round((getStatusCount(filteredPlayers, "present") / filteredPlayers.length) * 100)}
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
                            Vai Trò
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
                        {coaches.map((coach) => (
                          <tr key={coach.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                  <span className="font-medium text-gray-600">{coach.name.charAt(0)}</span>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{coach.name}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{coach.role}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(coach.status)}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{coach.note || "-"}</div>
                            </td>
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
                            Số Áo
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Vị Trí
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
                        {filteredPlayers.map((player) => (
                          <tr key={player.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#BD2427]/10 flex items-center justify-center">
                                  <span className="font-medium text-[#BD2427]">{player.name.charAt(0)}</span>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{player.name}</div>
                                  <div className="text-xs text-gray-500">{player.team}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-100">
                                <span className="text-xs font-medium">{player.number}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{player.position}</div>
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
                  Điểm danh được cập nhật lần cuối: {format(new Date(), "dd/MM/yyyy HH:mm", { locale: vi })}
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