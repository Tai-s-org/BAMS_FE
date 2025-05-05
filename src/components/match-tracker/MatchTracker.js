"use client"

import { useState, useEffect } from "react"
import { Calendar, ChevronLeft, ChevronRight, MapPin, Clock, Trophy, AlertCircle, User } from "lucide-react"
import { format, addMonths, subMonths, startOfMonth, endOfMonth, parseISO, isSameMonth } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/Select"
import { vi } from "date-fns/locale"
import parentApi from "@/api/parent"
import { useAuth } from "@/hooks/context/AuthContext"
import matchApi from "@/api/match"

export default function MatchTracker() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [matches, setMatches] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedChildId, setSelectedChildId] = useState(null)
  const [mockChildren, setMockChildren] = useState([])
  const { user } = useAuth()

  const startDate = startOfMonth(currentMonth)
  const endDate = endOfMonth(currentMonth)

  useEffect(() => {
    fetchMatches()
  }, [currentMonth, selectedChildId])

  useEffect(() => {
    fetchChild()
  }, [])

  const fetchMatches = async () => {
    setIsLoading(true)
    try {
      const data = {
        startDate: format(startDate, "yyyy-MM-dd"),
        endDate: format(endDate, "yyyy-MM-dd"),
        teamId: selectedChildId !== null
          ? mockChildren.find((child) => child.userId === selectedChildId)?.teamId
          : null,
      }
      const response = await matchApi.getMatch(data)
      setMatches(response?.data?.data || [])
      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching matches:", error)
      setIsLoading(false)
    }
  }

  const fetchChild = async () => {
    try {
      const response = await parentApi.getChildList(user?.userId);
      if (response?.data?.data && response?.data?.data.length > 0) {
        setMockChildren(response?.data?.data);
        setSelectedChildId(response?.data?.data[0]?.userId);
      } else {
        setMockChildren([]);
      }
    } catch (error) {
      console.error("Error fetching children:", error)
    }
  }

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))

  const getStatusColor = (status) => {
    switch (status) {
      case "Đã kết thúc":
        return "bg-green-100 text-green-800"
      case "Đang diễn ra":
        return "bg-blue-100 text-blue-800"
      case "Sắp diễn ra":
        return "bg-yellow-100 text-yellow-800"
      case "Đã hủy":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":")
    return `${hours}:${minutes}`
  }

  const isChildTeam = (teamId) => {
    if (!selectedChildId) return false
    const selectedChild = mockChildren.find((child) => child.userId === selectedChildId)
    return selectedChild?.teamId === teamId
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#BD2427] text-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center">
            <Trophy className="mr-2" />
            Lịch thi đấu
          </h1>
          <p className="mt-1 text-white/80">Theo dõi lịch thi đấu và kết quả các trận đấu của con</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Month Selector */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center">
              <button onClick={prevMonth} className="p-2 rounded-full hover:bg-gray-100" aria-label="Tháng trước">
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              <h2 className="text-xl font-semibold mx-4">{format(currentMonth, "MMMM yyyy", { locale: vi })}</h2>
              <button onClick={nextMonth} className="p-2 rounded-full hover:bg-gray-100" aria-label="Tháng sau">
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Child Filter */}
            {selectedChildId && <div className="flex items-center">
              <User className="mr-2 h-5 w-5 text-[#BD2427]" />
              <Select className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#BD2427] focus:border-transparent"
                value={selectedChildId}
                onValueChange={(value) => setSelectedChildId(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn con" />
                </SelectTrigger>
                <SelectContent>
                  {mockChildren.map((child) => (
                    <SelectItem key={child.userId} value={child.userId}>
                      {child.fullname} - {child.teamName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>}
          </div>
        </div>

        {/* Matches List */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#BD2427]"></div>
          </div>
        ) : matches.length > 0 ? (
          <div className="space-y-4">
            {matches.map((match) => (
              <div key={match.matchId} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Match Header */}
                <div className="bg-gray-50 p-4 border-b">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h3 className="text-lg font-semibold">{match.matchName}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(match.status)}`}>
                      {match.status}
                    </span>
                  </div>
                </div>

                {/* Match Details */}
                <div className="p-4">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Date, Time, Location */}
                    <div className="md:w-1/3 space-y-3">
                      <div className="flex items-start">
                        <Calendar className="h-5 w-5 text-[#BD2427] mt-0.5 mr-2 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Ngày thi đấu</p>
                          <p className="text-gray-600">
                            {format(parseISO(match.scheduledDate), "EEEE, dd/MM/yyyy", { locale: vi })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Clock className="h-5 w-5 text-[#BD2427] mt-0.5 mr-2 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Thời gian</p>
                          <p className="text-gray-600">
                            {formatTime(match.scheduledStartTime)} - {formatTime(match.scheduledEndTime)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-[#BD2427] mt-0.5 mr-2 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Địa điểm</p>
                          <p className="text-gray-600">{match.courtName}</p>
                          <p className="text-gray-500 text-sm">{match.courtAddress}</p>
                        </div>
                      </div>
                    </div>

                    {/* Teams and Score */}
                    <div className="md:w-2/3">
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-4">
                        {/* Home Team */}
                        <div className="text-center sm:w-1/3">
                          <div
                            className={`w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center ${isChildTeam(match.homeTeamId) ? "bg-[#BD2427] text-white" : "bg-gray-200"
                              }`}
                          >
                            <span className="text-xl font-bold">{match.homeTeamName.charAt(0)}</span>
                          </div>
                          <h4 className={`font-semibold ${isChildTeam(match.homeTeamId) ? "text-[#BD2427]" : ""}`}>
                            {match.homeTeamName}
                          </h4>
                          <p className="text-sm text-gray-500">Đội nhà</p>
                          {isChildTeam(match.homeTeamId) && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-[#BD2427]/10 text-[#BD2427] text-xs rounded-full">
                              Đội của con
                            </span>
                          )}
                        </div>

                        {/* Score */}
                        <div className="sm:w-1/3 flex items-center justify-center">
                          {match.status === "Đã kết thúc" ? (
                            <div className="text-center">
                              <div className="flex items-center justify-center gap-2">
                                <span
                                  className={`text-3xl font-bold ${isChildTeam(match.homeTeamId) ? "text-[#BD2427]" : ""}`}
                                >
                                  {match.scoreHome}
                                </span>
                                <span className="text-xl font-medium text-gray-400">-</span>
                                <span
                                  className={`text-3xl font-bold ${isChildTeam(match.awayTeamId) ? "text-[#BD2427]" : ""}`}
                                >
                                  {match.scoreAway}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">Kết quả cuối cùng</p>
                            </div>
                          ) : (
                            <div className="text-center px-6 py-3 rounded-lg bg-gray-100">
                              <p className="text-sm font-medium">VS</p>
                            </div>
                          )}
                        </div>

                        {/* Away Team */}
                        <div className="text-center sm:w-1/3">
                          <div
                            className={`w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center ${isChildTeam(match.awayTeamId) ? "bg-[#BD2427] text-white" : "bg-gray-200"
                              }`}
                          >
                            <span className="text-xl font-bold">{match.awayTeamName.charAt(0)}</span>
                          </div>
                          <h4 className={`font-semibold ${isChildTeam(match.awayTeamId) ? "text-[#BD2427]" : ""}`}>
                            {match.awayTeamName}
                          </h4>
                          <p className="text-sm text-gray-500">Đội khách</p>
                          {isChildTeam(match.awayTeamId) && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-[#BD2427]/10 text-[#BD2427] text-xs rounded-full">
                              Đội của con
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md flex flex-col items-center justify-center h-64 text-center p-4">
            <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-1">Không có trận đấu nào trong tháng này</h3>
            <p className="text-gray-500 max-w-md">Hãy thử chọn một tháng khác để xem lịch thi đấu.</p>
          </div>
        )}
      </main>
    </div>
  )
}