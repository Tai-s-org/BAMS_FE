"use client"

import { useState, useEffect } from "react"
import { User, Users, Phone, Mail, Calendar, Info, Shield, Award } from "lucide-react"
import { format, parseISO } from "date-fns"
import { vi } from "date-fns/locale"
import { useAuth } from "@/hooks/context/AuthContext"
import parentApi from "@/api/parent"
import teamApi from "@/api/team"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/Select"

export default function ContactTracker() {
  const [selectedChildId, setSelectedChildId] = useState(null)
  const [mockChildren, setMockChildren] = useState([])
  const [teamData, setTeamData] = useState(null)
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchChild()
  }, [])

  useEffect(() => {
    if (selectedChildId) {
      fetchTeamData()
    }
  }, [selectedChildId])

  const fetchChild = async () => {
    try {
      if(user?.roleCode == "Parent") {
        const response = await parentApi.getChildList(user?.userId);
        setMockChildren(response?.data.data);
        setSelectedChildId(response?.data.data[0]?.userId);
      }
    } catch (error) {
      console.error("Error fetching child:", error)
    }
  }

  const fetchTeamData = async () => {
    setIsLoading(true)
    try {
      const selectedTeamId = mockChildren.find((child) => child.userId === selectedChildId)?.teamId
      const response = await teamApi.teamDetail(selectedTeamId)
      setTeamData(response?.data?.data || null)
      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching team data:", error)
      setIsLoading(false)
    }
  }

  const formatPhoneNumber = (phone) => {
    // Format phone number for better readability
    if (phone.length === 10) {
      return `${phone.slice(0, 4)} ${phone.slice(4, 7)} ${phone.slice(7)}`
    }
    return phone
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#BD2427] text-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center">
            <Users className="mr-2" />
            Thông tin liên lạc đội bóng
          </h1>
          <p className="mt-1 text-white/80">Xem thông tin liên lạc của đội bóng của con</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Child Selector */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
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
                    {child.fullname} - {child.teamName || "Không có đội"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>}
        </div>

        {/* Team Information */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#BD2427]"></div>
          </div>
        ) : teamData ? (
          <div className="space-y-6">
            {/* Team Overview */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-[#BD2427] text-white p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold flex items-center">
                    <Shield className="mr-2 h-5 w-5" />
                    {teamData.teamName}
                  </h2>
                  <span className="px-3 py-1 bg-white text-[#BD2427] rounded-full text-sm font-medium">
                    {teamData.status === 1 ? "Hoạt động" : "Không hoạt động"}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-[#BD2427] mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Ngày thành lập</p>
                      <p className="font-medium">{format(parseISO(teamData.createAt), "dd/MM/yyyy", { locale: vi })}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Award className="h-5 w-5 text-[#BD2427] mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Quản lý quỹ</p>
                      <p className="font-medium">{teamData.fundManagerName}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-[#BD2427] mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Số lượng thành viên</p>
                      <p className="font-medium">
                        {teamData.coaches.length + teamData.managers.length + teamData.players.length} thành viên
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Coaches Section */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gray-50 p-4 border-b">
                <h3 className="text-lg font-semibold flex items-center">
                  <Award className="mr-2 h-5 w-5 text-[#BD2427]" />
                  Huấn luyện viên ({teamData.coaches.length})
                </h3>
              </div>
              <div className="divide-y">
                {teamData.coaches.map((coach) => (
                  <div key={coach.userId} className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                          <span className="text-lg font-bold">{coach.coachName.charAt(0)}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold">{coach.coachName}</h4>
                          <p className="text-sm text-gray-500">Huấn luyện viên</p>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2 md:items-end">
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 text-[#BD2427] mr-2" />
                          <a href={`tel:${coach.coachPhone}`} className="text-gray-700 hover:text-[#BD2427]">
                            {formatPhoneNumber(coach.coachPhone)}
                          </a>
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 text-[#BD2427] mr-2" />
                          <a href={`mailto:${coach.coachEmail}`} className="text-gray-700 hover:text-[#BD2427]">
                            {coach.coachEmail}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Managers Section */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gray-50 p-4 border-b">
                <h3 className="text-lg font-semibold flex items-center">
                  <Info className="mr-2 h-5 w-5 text-[#BD2427]" />
                  Quản lý đội ({teamData.managers.length})
                </h3>
              </div>
              <div className="divide-y">
                {teamData.managers.map((manager) => (
                  <div key={manager.userId} className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                          <span className="text-lg font-bold">{manager.managerName.charAt(0)}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold">{manager.managerName}</h4>
                          <p className="text-sm text-gray-500">Quản lý đội</p>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2 md:items-end">
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 text-[#BD2427] mr-2" />
                          <a href={`tel:${manager.managerPhone}`} className="text-gray-700 hover:text-[#BD2427]">
                            {formatPhoneNumber(manager.managerPhone)}
                          </a>
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 text-[#BD2427] mr-2" />
                          <a href={`mailto:${manager.managerEmail}`} className="text-gray-700 hover:text-[#BD2427]">
                            {manager.managerEmail}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Players Summary */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gray-50 p-4 border-b">
                <h3 className="text-lg font-semibold flex items-center">
                  <Users className="mr-2 h-5 w-5 text-[#BD2427]" />
                  Cầu thủ ({teamData.players.length})
                </h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {teamData.players.map((player) => (
                    <div
                      key={player.userId}
                      className="flex flex-col items-center p-3 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                        <span className="text-lg font-bold">{player.fullname.charAt(0)}</span>
                      </div>
                      <h5 className="font-medium text-center">{player.fullname}</h5>
                      <p className="text-xs text-gray-500 text-center">
                        {player.position || "Chưa có vị trí"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md flex flex-col items-center justify-center h-64 text-center p-4">
            <Users className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-1">Không tìm thấy thông tin đội bóng</h3>
            <p className="text-gray-500 max-w-md">Vui lòng chọn một đội bóng khác để xem thông tin liên lạc.</p>
          </div>
        )}
      </main>
    </div>
  )
}