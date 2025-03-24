"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Check, X, UserCheck, UserX, Save, Clock } from "lucide-react";

// Sample data for coaches
const coaches = [
  { id: 1, name: "Nguyễn Văn A", role: "Huấn Luyện Viên Trưởng" },
  { id: 2, name: "Trần Thị B", role: "Huấn Luyện Viên Phụ" },
  { id: 3, name: "Lê Văn C", role: "Huấn Luyện Viên Thể Lực" },
];

// Sample data for players
const players = [
  { id: 1, name: "Phạm Văn D", number: 5, position: "Hậu vệ", team: "Đội Chính" },
  { id: 2, name: "Hoàng Thị E", number: 7, position: "Tiền vệ", team: "Đội Chính" },
  { id: 3, name: "Đỗ Văn F", number: 10, position: "Tiền đạo", team: "Đội Chính" },
  { id: 4, name: "Ngô Thị G", number: 12, position: "Hậu vệ", team: "Đội Chính" },
  { id: 5, name: "Vũ Văn H", number: 15, position: "Tiền vệ", team: "Đội Chính" },
  { id: 6, name: "Đinh Thị I", number: 3, position: "Tiền đạo", team: "Đội Trẻ" },
  { id: 7, name: "Bùi Văn J", number: 8, position: "Hậu vệ", team: "Đội Trẻ" },
  { id: 8, name: "Lý Thị K", number: 11, position: "Tiền vệ", team: "Đội Trẻ" },
  { id: 9, name: "Dương Văn L", number: 14, position: "Tiền đạo", team: "Đội Trẻ" },
  { id: 10, name: "Đặng Thị M", number: 20, position: "Hậu vệ", team: "Đội Trẻ" },
];

export function AttendanceModal({ isOpen, onClose, session }) {
  const [coachAttendance, setCoachAttendance] = useState([]);
  const [playerAttendance, setPlayerAttendance] = useState([]);
  const [activeTab, setActiveTab] = useState("coaches");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Filter players by session team
  const filteredPlayers = session
    ? players.filter((player) => session.team === "Tất Cả Đội" || player.team === session.team)
    : [];

  // Initialize attendance data
  useEffect(() => {
    if (session) {
      setCoachAttendance(coaches.map((coach) => ({ id: coach.id, status: "none", note: "" })));
      setPlayerAttendance(filteredPlayers.map((player) => ({ id: player.id, status: "none", note: "" })));
    }
  }, [session]);

  // Update coach attendance status
  const updateCoachStatus = (id, status) => {
    setCoachAttendance((prev) => prev.map((record) => (record.id === id ? { ...record, status } : record)));
  };

  // Update coach note
  const updateCoachNote = (id, note) => {
    setCoachAttendance((prev) => prev.map((record) => (record.id === id ? { ...record, note } : record)));
  };

  // Update player attendance status
  const updatePlayerStatus = (id, status) => {
    setPlayerAttendance((prev) => prev.map((record) => (record.id === id ? { ...record, status } : record)));
  };

  // Update player note
  const updatePlayerNote = (id, note) => {
    setPlayerAttendance((prev) => prev.map((record) => (record.id === id ? { ...record, note } : record)));
  };

  // Save attendance
  const saveAttendance = () => {
    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Coach Attendance:", coachAttendance);
      console.log("Player Attendance:", playerAttendance);
      setIsSaving(false);
      setSaveSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 1000);
  };

  // Count attendance status
  const getStatusCount = (records, status) => {
    return records.filter((record) => record.status === status).length;
  };

  if (!isOpen) return null;

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
              Điểm Danh Buổi Tập
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
              {/* Session Info */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Buổi tập</p>
                    <p className="mt-1 text-base font-semibold text-gray-900">{session.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Đội</p>
                    <p className="mt-1 text-base font-semibold text-gray-900">{session.team}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Thời gian</p>
                    <p className="mt-1 text-base font-semibold text-gray-900">
                      {format(new Date(session.day), "EEEE, dd/MM/yyyy", { locale: vi })} ({session.startTime} -{" "}
                      {session.endTime})
                    </p>
                  </div>
                </div>
              </div>

              {/* Tabs */}
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

              {/* Content */}
              <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
                {/* Summary */}
                <div className="mb-6 grid grid-cols-4 gap-4">
                  <div className="bg-green-50 rounded-lg p-3 flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <UserCheck className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800">Có mặt</p>
                      <p className="text-xl font-semibold text-green-900">
                        {activeTab === "coaches"
                          ? getStatusCount(coachAttendance, "present")
                          : getStatusCount(playerAttendance, "present")}
                      </p>
                    </div>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3 flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                      <UserX className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-800">Vắng mặt</p>
                      <p className="text-xl font-semibold text-red-900">
                        {activeTab === "coaches"
                          ? getStatusCount(coachAttendance, "absent")
                          : getStatusCount(playerAttendance, "absent")}
                      </p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-600 font-medium">?</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-800">Chưa điểm danh</p>
                      <p className="text-xl font-semibold text-gray-900">
                        {activeTab === "coaches"
                          ? getStatusCount(coachAttendance, "none")
                          : getStatusCount(playerAttendance, "none")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Attendance List */}
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
                        {coaches.map((coach) => {
                          const attendance = coachAttendance.find((a) => a.id === coach.id) || {
                            status: "none",
                            note: "",
                          };

                          return (
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
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => updateCoachStatus(coach.id, "present")}
                                    className={`inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded ${
                                      attendance.status === "present"
                                        ? "bg-green-100 text-green-800 ring-2 ring-green-500"
                                        : "bg-gray-100 text-gray-800 hover:bg-green-50 hover:text-green-700"
                                    }`}
                                  >
                                    <Check className="mr-1 h-4 w-4" />
                                    Có mặt
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => updateCoachStatus(coach.id, "absent")}
                                    className={`inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded ${
                                      attendance.status === "absent"
                                        ? "bg-red-100 text-red-800 ring-2 ring-red-500"
                                        : "bg-gray-100 text-gray-800 hover:bg-red-50 hover:text-red-700"
                                    }`}
                                  >
                                    <X className="mr-1 h-4 w-4" />
                                    Vắng mặt
                                  </button>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <input
                                  type="text"
                                  className="shadow-sm focus:ring-[#BD2427] focus:border-[#BD2427] block w-full sm:text-sm border-gray-300 rounded-md"
                                  placeholder="Thêm ghi chú..."
                                  value={attendance.note}
                                  onChange={(e) => updateCoachNote(coach.id, e.target.value)}
                                />
                              </td>
                            </tr>
                          );
                        })}
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
                        {filteredPlayers.map((player) => {
                          const attendance = playerAttendance.find((a) => a.id === player.id) || {
                            status: "none",
                            note: "",
                          };

                          return (
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
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => updatePlayerStatus(player.id, "present")}
                                    className={`inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded ${
                                      attendance.status === "present"
                                        ? "bg-green-100 text-green-800 ring-2 ring-green-500"
                                        : "bg-gray-100 text-gray-800 hover:bg-green-50 hover:text-green-700"
                                    }`}
                                  >
                                    <Check className="mr-1 h-4 w-4" />
                                    Có mặt
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => updatePlayerStatus(player.id, "absent")}
                                    className={`inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded ${
                                      attendance.status === "absent"
                                        ? "bg-red-100 text-red-800 ring-2 ring-red-500"
                                        : "bg-gray-100 text-gray-800 hover:bg-red-50 hover:text-red-700"
                                    }`}
                                  >
                                    <X className="mr-1 h-4 w-4" />
                                    Vắng mặt
                                  </button>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <input
                                  type="text"
                                  className="shadow-sm focus:ring-[#BD2427] focus:border-[#BD2427] block w-full sm:text-sm border-gray-300 rounded-md"
                                  placeholder="Thêm ghi chú..."
                                  value={attendance.note}
                                  onChange={(e) => updatePlayerNote(player.id, e.target.value)}
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center">
                  {saveSuccess && (
                    <div className="flex items-center text-green-700 bg-green-50 px-3 py-1 rounded-md">
                      <Check className="h-4 w-4 mr-1" />
                      <span className="text-sm">Đã lưu điểm danh thành công</span>
                    </div>
                  )}
                </div>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BD2427]"
                    onClick={onClose}
                  >
                    Đóng
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#BD2427] hover:bg-[#A61F22] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BD2427]"
                    onClick={saveAttendance}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Lưu Điểm Danh
                      </>
                    )}
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
  );
}