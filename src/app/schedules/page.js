"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, addDays, set } from "date-fns";
import { vi } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus, Filter, UserCheck } from "lucide-react"
import { AttendanceModal } from "@/components/attendance/AttendanceModal";
import { useAuth } from "@/hooks/context/AuthContext";
import { RecurringSessionModal } from "@/components/schedule/RecurringSessionModal";
import { SingleSessionModal } from "@/components/schedule/SingleSessionModal";
import scheduleApi from "@/api/schedule";

// Sample data
// const trainingSessions = [
//   {
//     id: 1,
//     name: "Luyện Tập Ném Rổ",
//     team: "Đội Chính",
//     court: "Sân A",
//     day: new Date(2025, 2, 17), // 17/3/2025
//     startTime: "16:00",
//     endTime: "17:00",
//   },
//   {
//     id: 2,
//     name: "Bài Tập Phòng Thủ",
//     team: "Đội Trẻ",
//     court: "Sân B",
//     day: new Date(2025, 2, 17), // 17/3/2025
//     startTime: "17:30",
//     endTime: "19:00",
//   },
//   {
//     id: 3,
//     name: "Đấu Tập",
//     team: "Đội Chính",
//     court: "Sân A",
//     day: new Date(2025, 2, 18), // 18/3/2025
//     startTime: "15:00",
//     endTime: "17:00",
//   },
//   {
//     id: 4,
//     name: "Tập Thể Lực",
//     team: "Tất Cả Đội",
//     court: "Sân C",
//     day: new Date(2025, 2, 19), // 19/3/2025
//     startTime: "16:30",
//     endTime: "18:00",
//   },
//   {
//     id: 5,
//     name: "Luyện Ném Phạt",
//     team: "Đội Trẻ",
//     court: "Sân B",
//     day: new Date(2025, 2, 20), // 20/3/2025
//     startTime: "15:30",
//     endTime: "16:30",
//   },
//   {
//     id: 6,
//     name: "Chiến Thuật Trận Đấu",
//     team: "Đội Chính",
//     court: "Sân A",
//     day: new Date(2025, 2, 21), // 21/3/2025
//     startTime: "17:00",
//     endTime: "19:00",
//   },
// ];

const teams = ["Tất Cả Đội", "Đội Chính", "Đội Trẻ", "Đội Thiếu Niên"];
const courts = ["Tất Cả Sân", "Sân A", "Sân B", "Sân C"];

export default function SchedulePage() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [teamFilter, setTeamFilter] = useState("Tất Cả Đội");
  const [courtFilter, setCourtFilter] = useState("Tất Cả Sân");
  const [showFilters, setShowFilters] = useState(false);
  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false)
  const [selectedSession, setSelectedSession] = useState(null)
  const [recurringSessionModalOpen, setRecurringSessionModalOpen] = useState(false)
  const [singleSessionModalOpen, setSingleSessionModalOpen] = useState(false)
  const [trainingSessions, setTrainingSessions] = useState([]);
  const [filteredSessions, setFilterSessions] = useState([]);

  useEffect(() => {
    fetchTrainingSessions();
  }, [currentDate, teamFilter, courtFilter]);

  // Fetch schedule
  const fetchTrainingSessions = async () => {
    try {
      const data = {
        startDate: weekStart,
        endDate: weekEnd,
        // courtId: courtFilter,
        // teamId: teamFilter
      }
      const response = await scheduleApi.getTrainingSessions(data);
      console.log("trainingSessions", response?.data.data);
      setTrainingSessions(response?.data.data);

      // Filter sessions for the current week
      const filteredSessions = response?.data.data?.filter((session) => {
        const sessionDate = new Date(session.scheduledDate);
        const isInWeek = sessionDate >= weekStart && sessionDate <= weekEnd;
        // const isTeamMatch = teamFilter === "Tất Cả Đội" || session.team === teamFilter;
        // const isCourtMatch = courtFilter === "Tất Cả Sân" || session.court === courtFilter;

        // return isInWeek && isTeamMatch && isCourtMatch;
        return isInWeek;
      });

      setFilterSessions(filteredSessions);
      console.log(filteredSessions);
      
    } catch (error) {
      console.error("Error fetching training sessions:", error);
    }
  }

  // Calculate week range
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Start from Monday
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 }); // End on Sunday

  // Navigation functions
  const previousWeek = () => setCurrentDate(subWeeks(currentDate, 1));
  const nextWeek = () => setCurrentDate(addWeeks(currentDate, 1));

  // Group sessions by day
  const days = [];
  for (let i = 0; i < 7; i++) {
    const day = addDays(weekStart, i);
    days.push(day);
  }

  // Mở modal điểm danh
  const openAttendanceModal = (session) => {
    setSelectedSession(session)
    setAttendanceModalOpen(true)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Lịch Chung</h1>
          <div className="flex flex-wrap gap-2">


            {user.roleCode == "Manager" && <button
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#BD2427] hover:bg-[#A61F22] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BD2427] transition-colors duration-200"
              onClick={() => openAttendanceModal(selectedSession)}
            >
              <UserCheck className="mr-2 h-4 w-4" />
              Thực hiện điểm danh
            </button>}
            {user.roleCode == "Coach" && <div>
              <button
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#BD2427] hover:bg-[#A61F22] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BD2427] transition-colors duration-200 mr-1"
                onClick={() => setRecurringSessionModalOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Tạo Buổi Tập Lặp Lại
              </button>
              <button
                className="inline-flex items-center justify-center px-4 py-2 border border-[#BD2427] text-sm font-medium rounded-md shadow-sm text-[#BD2427] bg-white hover:bg-[#BD2427]/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BD2427] transition-colors duration-200"
                onClick={() => setSingleSessionModalOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Tạo Buổi Tập Lẻ
              </button>
            </div>}
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Card Header */}
          <div className="px-6 py-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl font-semibold text-gray-800">Lịch Tuần</h2>
            <div className="flex items-center space-x-2">
              <button
                className="inline-flex items-center justify-center p-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BD2427] transition-colors duration-200"
                onClick={previousWeek}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm font-medium text-gray-900">
                {format(weekStart, "dd/MM")} - {format(weekEnd, "dd/MM/yyyy")}
              </span>
              <button
                className="inline-flex items-center justify-center p-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BD2427] transition-colors duration-200"
                onClick={nextWeek}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BD2427]"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="mr-2 h-4 w-4 text-gray-500" />
                  Bộ Lọc
                  {(teamFilter !== "Tất Cả Đội" || courtFilter !== "Tất Cả Sân") && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#BD2427] text-white">
                      {teamFilter !== "Tất Cả Đội" && courtFilter !== "Tất Cả Sân" ? 2 : 1}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Filter Options */}
            {showFilters && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="team-filter" className="block text-sm font-medium text-gray-700 mb-1">
                    Đội
                  </label>
                  <select
                    id="team-filter"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#BD2427] focus:border-[#BD2427] sm:text-sm rounded-md"
                    value={teamFilter}
                    onChange={(e) => setTeamFilter(e.target.value)}
                  >
                    {teams.map((team) => (
                      <option key={team} value={team}>
                        {team}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="court-filter" className="block text-sm font-medium text-gray-700 mb-1">
                    Sân
                  </label>
                  <select
                    id="court-filter"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#BD2427] focus:border-[#BD2427] sm:text-sm rounded-md"
                    value={courtFilter}
                    onChange={(e) => setCourtFilter(e.target.value)}
                  >
                    {courts.map((court) => (
                      <option key={court} value={court}>
                        {court}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Active Filters */}
            {(teamFilter !== "Tất Cả Đội" || courtFilter !== "Tất Cả Sân") && (
              <div className="mt-4 flex flex-wrap gap-2">
                {teamFilter !== "Tất Cả Đội" && (
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    Đội: {teamFilter}
                    <button
                      type="button"
                      className="ml-1.5 inline-flex items-center justify-center h-5 w-5 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
                      onClick={() => setTeamFilter("Tất Cả Đội")}
                    >
                      <span className="sr-only">Xóa bộ lọc</span>
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </span>
                )}
                {courtFilter !== "Tất Cả Sân" && (
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    Sân: {courtFilter}
                    <button
                      type="button"
                      className="ml-1.5 inline-flex items-center justify-center h-5 w-5 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
                      onClick={() => setCourtFilter("Tất Cả Sân")}
                    >
                      <span className="sr-only">Xóa bộ lọc</span>
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Schedule Table */}
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[180px]"
                  >
                    Ngày
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Buổi Tập
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {days.map((day, dayIndex) => {
                  const daySessions = filteredSessions.filter(
                    (session) => session.scheduledDate === format(day, "yyyy-MM-dd"),
                  );
                  return (
                    <tr key={format(day, "yyyy-MM-dd")} className={dayIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div className="flex flex-col">
                          <span className="font-semibold">{format(day, "EEEE", { locale: vi })}</span>
                          <span className="text-gray-500">{format(day, "dd/MM/yyyy")}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {daySessions.length > 0 ? (
                          <div className="space-y-4">
                            {daySessions.map((session) => (
                              <div
                                key={session.trainingSessionId}
                                className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
                              >
                                <div className="px-4 py-3 border-l-4 border-[#BD2427]">
                                  <Link
                                    href={`/training-sessions/${session.trainingSessionId}`}
                                    className="text-base font-medium text-[#BD2427] hover:underline block mb-1"
                                  >
                                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-500">
                                      <div className="flex items-center">
                                        <svg
                                          className="mr-1.5 h-4 w-4 text-gray-400"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                          />
                                        </svg>
                                        <span>{session.teamName}</span>
                                      </div>
                                      <div className="flex items-center">
                                        <svg
                                          className="mr-1.5 h-4 w-4 text-gray-400"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                          />
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                          />
                                        </svg>
                                        <span>{session.courtName}</span>
                                      </div>
                                      <div className="flex items-center">
                                        <svg
                                          className="mr-1.5 h-4 w-4 text-gray-400"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                          />
                                        </svg>
                                        <span>
                                          {session.scheduledStartTime} - {session.scheduledEndTime}
                                        </span>
                                      </div>
                                    </div>
                                  </Link>

                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500 italic">Không có buổi tập nào</div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AttendanceModal
        isOpen={attendanceModalOpen}
        onClose={() => setAttendanceModalOpen(false)}
        session={selectedSession}
      />

      <RecurringSessionModal isOpen={recurringSessionModalOpen} onClose={() => setRecurringSessionModalOpen(false)} />

      <SingleSessionModal isOpen={singleSessionModalOpen} onClose={() => setSingleSessionModalOpen(false)} />
    </div>
  );
}