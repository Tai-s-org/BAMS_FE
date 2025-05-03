"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, addDays } from "date-fns";
import { vi } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus, Filter, UserCheck } from "lucide-react"
import { AttendanceModal } from "@/components/attendance/AttendanceModal";
import { useAuth } from "@/hooks/context/AuthContext";
import { RecurringSessionModal } from "@/components/schedule/RecurringSessionModal";
import { SingleSessionModal } from "@/components/schedule/SingleSessionModal";
import scheduleApi from "@/api/schedule";
import courtApi from "@/api/court";
import teamApi from "@/api/team";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { useToasts } from "@/hooks/providers/ToastProvider";
import attendanceApi from "@/api/attendance";
import parentApi from "@/api/parent";
import { FaChild } from "react-icons/fa";

export default function SchedulePage() {
  const { user, userInfo } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [teamFilter, setTeamFilter] = useState(null);
  const [childFilter, setChildFilter] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false)
  const [selectedSession, setSelectedSession] = useState(null)
  const [recurringSessionModalOpen, setRecurringSessionModalOpen] = useState(false)
  const [singleSessionModalOpen, setSingleSessionModalOpen] = useState(false)
  const [trainingSessions, setTrainingSessions] = useState([]);
  const [filteredSessions, setFilterSessions] = useState([]);
  const [courts, setCourts] = useState([]);
  const [teams, setTeams] = useState([]);
  const [children, setChildren] = useState([]);
  const [isModified, setIsModified] = useState(false)
  const { addToast } = useToasts()

  useEffect(() => {
    fetchTrainingSessions();
  }, [currentDate, teamFilter, isModified, childFilter]);

  useEffect(() => {
    setTeamFilter(userInfo?.roleInformation.teamId);

    if (user?.roleCode === "Coach") {
      fetchTeams();
    }
    if (user?.roleCode === "Parent") {
      fetchChild();
    }
    if (user?.roleCode === "Coach") {
      fetchCourts();
    }
  }, [userInfo?.roleInformation.teamId]);

  const fetchCourts = async () => {
    try {
      const data = {
        UsagePurpose: "Training",
      }
      const response = await courtApi.courtList(data);
      setCourts(response?.data.items);
    } catch (error) {
      console.error("Error fetching courts:", error);
      if (error.status == 401) {
        addToast({ message: error?.response?.data.Message, type: "error" });
      }
    }
  }

  const fetchTeams = async () => {
    try {
      const response = await teamApi.listTeams({ pageSize: 100, status: 1 });
      setTeams(response?.data.data.items);
    } catch (error) {
      console.error("Error fetching teams:", error);
      if (error.status == 401) {
        addToast({ message: error?.response?.data.Message, type: "error" });
      }
    }
  }

  const fetchChild = async () => {
    try {
      const response = await parentApi.getChildList(user?.userId);
      console.log(response?.data);
      setChildren(response?.data.data);
    } catch (error) {
      console.error("Error fetching child:", error);
      if (error.status == 401) {
        addToast({ message: error?.response?.data.Message, type: "error" });
      }
    }
  }

  // Fetch schedule
  const fetchTrainingSessions = async () => {
    try {
      let data = {
        startDate: weekStart,
        endDate: weekEnd,
        teamId: teamFilter ? teamFilter : userInfo?.roleInformation.teamId,
      }
      if (user?.roleCode !== "Coach") {
        data = {
          ...data,
          teamId: userInfo?.roleInformation.teamId,
        }
      }

      const response = await scheduleApi.getTrainingSessions(data);
      setTrainingSessions(response?.data.data);

      // Filter sessions for the current week
      const filteredSessions = response?.data.data?.filter((session) => {
        const sessionDate = new Date(session.scheduledDate);
        let isChild = true
        if (user?.roleCode === "Parent") {
          isChild = childFilter ? session?.playerId === childFilter : true
        }
        const isInWeek = sessionDate >= weekStart && sessionDate <= weekEnd;
        const isInTeam = teamFilter ? session.teamId === teamFilter : true;
        return isInWeek && isInTeam && isChild;
      });
      let sessionsWithAttendance
      if (user?.roleCode === "Coach" || user?.roleCode === "Player") {
        sessionsWithAttendance = await Promise.all(
          filteredSessions.map(async (session) => {
            try {
              const attendanceResponse = await attendanceApi.getUserAttendance({
                trainingSessionId: session.trainingSessionId,
                userId: user?.userId
              });

              return {
                ...session,
                attendanceStatus: attendanceResponse?.data.data.status === 1 ? 1 :
                  attendanceResponse?.data.data.status === 0 ? 0 : -1
              };
            } catch (error) {
              return {
                ...session,
                attendanceStatus: -1
              };
            }
          })
        )
      }
      else {
        sessionsWithAttendance = filteredSessions.map((session) => ({
          ...session,
          attendanceStatus: -1
        }))
      }
      setFilterSessions(sessionsWithAttendance);
      // Take the currentSession base on Date, time is between start time and end time
      const currentSession = filteredSessions.find((session) => {
        const sessionDate = new Date(session.scheduledDate);
        const currentTime = dateToSeconds(currentDate);
        const startTime = timeToSeconds(session.scheduledStartTime);
        const endTime = timeToSeconds(session.scheduledEndTime);

        return sessionDate.toDateString() === currentDate.toDateString() && currentTime >= startTime && currentTime <= endTime;
      })

      if (currentSession) {
        setSelectedSession(currentSession);
      }
    } catch (error) {
      console.error("Error fetching training sessions:", error);
      if (error.status == 401) {
        addToast({ message: error?.response?.data.Message, type: "error" });
      }
    }
  }

  // Convert time string to seconds
  const timeToSeconds = (timeString) => {
    const [hours, minutes, seconds] = timeString.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  }

  // Convert date to seconds
  const dateToSeconds = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return hours * 3600 + minutes * 60 + seconds;
  }

  // Take team info
  const takeTeamNameById = (teamId) => {
    const team = teams?.find((team) => team.teamId === teamId);
    if (team) {
      return team.teamName;
    }
    return "Unknown Team";
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


            {selectedSession && userInfo?.roleInformation.teamId === selectedSession?.teamId && user.roleCode == "Manager" && <button
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
                Tạo Chuỗi Buổi Tập
              </button>
              <button
                className="inline-flex items-center justify-center px-4 py-2 border border-[#BD2427] text-sm font-medium rounded-md shadow-sm text-[#BD2427] bg-white hover:bg-[#BD2427]/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BD2427] transition-colors duration-200"
                onClick={() => setSingleSessionModalOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Tạo Đơn Buổi Tập
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
            {(user?.roleCode === "Coach" || user?.roleCode === "Parent") && <div className="flex flex-col sm:flex-row gap-4">
              <div>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BD2427]"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="mr-2 h-4 w-4 text-gray-500" />
                  Bộ Lọc
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#BD2427] text-white">
                    {teamFilter !== userInfo?.roleInformation.teamId ? 1 : 0}
                  </span>
                </button>
              </div>
            </div>}

            {/* Filter Options */}
            {showFilters && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user?.roleCode === "Coach" && <div>
                  <label htmlFor="team-filter" className="block text-sm font-medium text-gray-700 mb-1">
                    Đội
                  </label>
                  <Select value={teamFilter} onValueChange={(value) => setTeamFilter(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn đội" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams?.map((team) => (
                        <SelectItem key={team.teamId} value={team.teamId}>
                          {team.teamName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>}
                {user?.roleCode === "Parent" && <div>
                  <label htmlFor="team-filter" className="block text-sm font-medium text-gray-700 mb-1">
                    Con cái
                  </label>
                  <Select value={childFilter} onValueChange={(value) => setChildFilter(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn con" />
                    </SelectTrigger>
                    <SelectContent>
                      {children?.map((child) => (
                        <SelectItem key={child.userId} value={child.userId}>
                          {child.fullname}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>}
              </div>
            )}

            {/* Active Filters */}
            {(teamFilter !== userInfo?.roleInformation.teamId) && (
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  Đội: {takeTeamNameById(teamFilter)}
                  <button
                    type="button"
                    className="ml-1.5 inline-flex items-center justify-center h-5 w-5 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={() => { setTeamFilter(userInfo?.roleInformation.teamId); }}
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
                            {daySessions.map((session, index) => (
                              <div
                                key={index}
                                className={
                                  session.attendanceStatus === 1
                                    ? "bg-green-600 text-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
                                    : session.attendanceStatus === 0
                                      ? "bg-red-500 text-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
                                      : "bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
                                }
                              >
                                <div className="px-4 py-3 border-l-4 border-[#BD2427]">
                                  <Link
                                    href={`/training-sessions/${session.trainingSessionId}`}
                                    className={`text-base font-medium ${session.attendanceStatus === 1 || session.attendanceStatus === 0
                                      ? "text-white"
                                      : "text-[#BD2427]"
                                      } hover:underline block mb-1`}
                                  >
                                    {session.sessionName}
                                    <div className={`flex flex-wrap gap-x-6 gap-y-1 text-sm ${session.attendanceStatus === 1 || session.attendanceStatus === 0
                                      ? "text-gray-200"  // Lighter gray for better contrast on colored backgrounds
                                      : "text-gray-500"
                                      }`}>
                                      <div className="flex items-center">
                                        <svg
                                          className={`mr-1.5 h-4 w-4 ${session.attendanceStatus === 1 || session.attendanceStatus === 0
                                            ? "text-gray-300"
                                            : "text-gray-400"
                                            }`}
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
                                          className={`mr-1.5 h-4 w-4 ${session.attendanceStatus === 1 || session.attendanceStatus === 0
                                            ? "text-gray-300"
                                            : "text-gray-400"
                                            }`}
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
                                        <FaChild className="mr-1.5 h-4 w-4" />
                                        <span>{session.playerName}</span>
                                      </div>
                                      <div className="flex items-center justify-end ml-auto">
                                        <svg
                                          className={`mr-1.5 h-4 w-4 ${session.attendanceStatus === 1 || session.attendanceStatus === 0
                                            ? "text-gray-300"
                                            : "text-gray-400"
                                            }`}
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
      {user?.roleCode === "Manager" && <AttendanceModal
        isOpen={attendanceModalOpen}
        onClose={() => setAttendanceModalOpen(false)}
        session={selectedSession}
      />}

      {userInfo && <RecurringSessionModal isOpen={recurringSessionModalOpen} onClose={() => setRecurringSessionModalOpen(false)} teamId={userInfo?.roleInformation.teamId} courts={courts} />}

      {userInfo && <SingleSessionModal isOpen={singleSessionModalOpen} onClose={() => setSingleSessionModalOpen(false)} teamId={userInfo?.roleInformation.teamId} courts={courts} isModified={() => setIsModified(!isModified)} />}
    </div>
  );
}