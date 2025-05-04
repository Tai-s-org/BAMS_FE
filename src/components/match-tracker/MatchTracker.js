"use client"

import { useState, useEffect } from "react"
import { Calendar, ChevronLeft, ChevronRight, MapPin, Clock, Trophy, AlertCircle, User } from "lucide-react"
import { format, addMonths, subMonths, startOfMonth, endOfMonth, parseISO, isSameMonth } from "date-fns"
import { vi } from "date-fns/locale"

// Mock data for matches - in a real app, this would come from an API
const mockMatches = [
  {
    matchId: 1,
    matchName: "Giao hữu đầu mùa",
    scheduledDate: "2025-05-06",
    scheduledStartTime: "14:02:00",
    scheduledEndTime: "15:02:00",
    homeTeamId: "30517058-1cb6-4ede-8818-bfe559e479cc",
    homeTeamName: "Nam A",
    scoreHome: 0,
    awayTeamId: "9fedde57-97a7-4c26-a5c5-423c0edf13be",
    awayTeamName: "Nam B",
    scoreAway: 0,
    status: "Sắp diễn ra",
    courtId: "88ec0f27-f00f-4061-a87c-c18bf2d98638",
    courtName: "An Dương",
    courtAddress: "70 An Dương, quận Tây Hồ",
    createdByCoachId: "37d46080-f527-43a8-8d33-cc9902f9b5e0",
    homeTeamPlayers: [],
    awayTeamPlayers: [],
    matchArticles: [],
  },
  {
    matchId: 2,
    matchName: "Giải đấu mùa hè",
    scheduledDate: "2025-05-12",
    scheduledStartTime: "16:00:00",
    scheduledEndTime: "17:30:00",
    homeTeamId: "30517058-1cb6-4ede-8818-bfe559e479cc",
    homeTeamName: "Nam A",
    scoreHome: 78,
    awayTeamId: "9fedde57-97a7-4c26-a5c5-423c0edf13be",
    awayTeamName: "Đội Hoàng Gia",
    scoreAway: 72,
    status: "Đã kết thúc",
    courtId: "88ec0f27-f00f-4061-a87c-c18bf2d98638",
    courtName: "Nhà thi đấu Bách Khoa",
    courtAddress: "Số 1 Đại Cồ Việt, Hai Bà Trưng",
    createdByCoachId: "37d46080-f527-43a8-8d33-cc9902f9b5e0",
    homeTeamPlayers: [],
    awayTeamPlayers: [],
    matchArticles: [],
  },
  {
    matchId: 3,
    matchName: "Vòng loại giải U16",
    scheduledDate: "2025-05-20",
    scheduledStartTime: "09:30:00",
    scheduledEndTime: "11:00:00",
    homeTeamId: "9fedde57-97a7-4c26-a5c5-423c0edf13be",
    homeTeamName: "Đội Sao Đỏ",
    scoreHome: 0,
    awayTeamId: "30517058-1cb6-4ede-8818-bfe559e479cc",
    awayTeamName: "Nam A",
    scoreAway: 0,
    status: "Sắp diễn ra",
    courtId: "88ec0f27-f00f-4061-a87c-c18bf2d98638",
    courtName: "Cung thể thao Quần Ngựa",
    courtAddress: "30 Văn Cao, Ba Đình",
    createdByCoachId: "37d46080-f527-43a8-8d33-cc9902f9b5e0",
    homeTeamPlayers: [],
    awayTeamPlayers: [],
    matchArticles: [],
  },
]

// Mock data for children - in a real app, this would come from an API
const mockChildren = [
  {
    userId: "1f0e5627-988a-4313-8714-58081655488a",
    fullname: "Nguyễn Huy Hoàng",
    email: "tainghe171475@fpt.edu.vn",
    phone: "091234567",
    teamId: "30517058-1cb6-4ede-8818-bfe559e479cc",
    teamName: "Nam A",
    profileImage: null,
    address: "N/A",
    dateOfBirth: "2004-06-01",
    weight: null,
    height: null,
    position: null,
    shirtNumber: null,
    relationshipWithParent: null,
    clubJoinDate: "2025-05-04",
  },
  {
    userId: "2a1b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p",
    fullname: "Trần Minh Đức",
    email: "duc.tran@example.com",
    phone: "0987654321",
    teamId: "9fedde57-97a7-4c26-a5c5-423c0edf13be",
    teamName: "Nam B",
    profileImage: null,
    address: "N/A",
    dateOfBirth: "2005-03-15",
    weight: null,
    height: null,
    position: null,
    shirtNumber: null,
    relationshipWithParent: null,
    clubJoinDate: "2024-11-10",
  },
]

export default function MatchTracker() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [matches, setMatches] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedChildId, setSelectedChildId] = useState("all")

  const startDate = startOfMonth(currentMonth)
  const endDate = endOfMonth(currentMonth)

  useEffect(() => {
    fetchMatches()
  }, [currentMonth, selectedChildId])

  const fetchMatches = async () => {
    setIsLoading(true)
    try {
      // In a real app, you would call your API here
      // const response = await fetch('/api/matches', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     startDate: format(startDate, 'yyyy-MM-dd'),
      //     endDate: format(endDate, 'yyyy-MM-dd'),
      //     teamId: selectedChildId !== 'all'
      //       ? mockChildren.find(child => child.userId === selectedChildId)?.teamId
      //       : undefined
      //   })
      // });
      // const data = await response.json();

      // For demo purposes, we'll just set mock data
      setTimeout(() => {
        // Filter matches for the current month
        let filteredMatches = mockMatches.filter((match) => {
          const matchDate = parseISO(match.scheduledDate)
          return isSameMonth(matchDate, currentMonth)
        })

        // Filter by team if a child is selected
        if (selectedChildId !== "all") {
          const selectedChild = mockChildren.find((child) => child.userId === selectedChildId)
          if (selectedChild) {
            filteredMatches = filteredMatches.filter(
              (match) => match.homeTeamId === selectedChild.teamId || match.awayTeamId === selectedChild.teamId,
            )
          }
        }

        setMatches(filteredMatches)
        setIsLoading(false)
      }, 500)
    } catch (error) {
      console.error("Error fetching matches:", error)
      setIsLoading(false)
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
    if (selectedChildId === "all") return false
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
            <div className="flex items-center">
              <User className="mr-2 h-5 w-5 text-[#BD2427]" />
              <select
                value={selectedChildId}
                onChange={(e) => setSelectedChildId(e.target.value)}
                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#BD2427] focus:border-transparent"
              >
                <option value="all">Tất cả các con</option>
                {mockChildren.map((child) => (
                  <option key={child.userId} value={child.userId}>
                    {child.fullname} - {child.teamName}
                  </option>
                ))}
              </select>
            </div>
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
                            className={`w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center ${
                              isChildTeam(match.homeTeamId) ? "bg-[#BD2427] text-white" : "bg-gray-200"
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
                            className={`w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center ${
                              isChildTeam(match.awayTeamId) ? "bg-[#BD2427] text-white" : "bg-gray-200"
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