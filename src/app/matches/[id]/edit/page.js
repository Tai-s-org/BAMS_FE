"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { ArrowLeft } from "lucide-react"

// Sample match data
const matchData = {
  matchId: 1,
  matchName: "GIAO HỮU THÁNG 4",
  scheduledDate: "2025-04-15",
  scheduledStartTime: "17:00:00",
  scheduledEndTime: "18:00:00",
  homeTeamId: "T001",
  homeTeamName: "Team A",
  scoreHome: 0,
  awayTeamId: null,
  awayTeamName: null,
  scoreAway: 0,
  status: "Sắp diễn ra",
  courtId: "3d5e35e1-253f-482c-a3f8-5b8bdeed941c",
  courtName: "Nhà thi đấu huyện Thanh Trì",
  courtAddress: "303 Đường Nam Kỳ Khởi Nghĩa, Quận 3, TP.HCMinh",
  createdByCoachId: "550e8400-e29b-41d4-a716-556655440002",
  homeTeamPlayers: [],
  awayTeamPlayers: [],
  matchArticles: [],
}

export default function EditMatchPage() {
  const params = useParams()
  const router = useRouter()
  const [formData, setFormData] = useState({
    matchName: "",
    scheduledDate: "",
    scheduledStartTime: "",
    scheduledEndTime: "",
    homeTeamId: "",
    awayTeamId: "",
    courtId: "",
    status: "",
    scoreHome: 0,
    scoreAway: 0,
  })

  // Sample data for dropdowns
  const teams = [
    { id: "T001", name: "Team A" },
    { id: "T002", name: "Team B" },
    { id: "T003", name: "Team C" },
  ]

  const courts = [
    {
      id: "3d5e35e1-253f-482c-a3f8-5b8bdeed941c",
      name: "Nhà thi đấu huyện Thanh Trì",
      address: "303 Đường Nam Kỳ Khởi Nghĩa, Quận 3, TP.HCMinh",
    },
    {
      id: "4f6g46f2-364g-593d-b4g9-6c9cefff052d",
      name: "Nhà thi đấu Phú Nhuận",
      address: "123 Đường Nguyễn Văn Trỗi, Quận Phú Nhuận, TP.HCMinh",
    },
  ]

  useEffect(() => {
    // In a real app, you would fetch the match data from your API
    // For now, we'll use the sample data
    setFormData({
      matchName: matchData.matchName,
      scheduledDate: matchData.scheduledDate,
      scheduledStartTime: matchData.scheduledStartTime,
      scheduledEndTime: matchData.scheduledEndTime,
      homeTeamId: matchData.homeTeamId || "",
      awayTeamId: matchData.awayTeamId || "",
      courtId: matchData.courtId,
      status: matchData.status,
      scoreHome: matchData.scoreHome,
      scoreAway: matchData.scoreAway,
    })
  }, [params.id])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // In a real app, you would update the match data in your backend here
    console.log("Match data to update:", formData)

    // Navigate back to the match detail page
    router.push(`/matches/${params.id}`)
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => router.push(`/matches/${params.id}`)} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <h1 className="text-3xl font-bold text-[#BD2427]">Sửa trận đấu</h1>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Thông tin trận đấu</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="matchName">Tên trận đấu</Label>
              <Input
                id="matchName"
                name="matchName"
                value={formData.matchName}
                onChange={handleInputChange}
                placeholder="Nhập tên trận đấu"
                required
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scheduledDate">Ngày</Label>
                <Input
                  id="scheduledDate"
                  name="scheduledDate"
                  type="date"
                  value={formData.scheduledDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="scheduledStartTime">Giờ bắt đầu</Label>
                <Input
                  id="scheduledStartTime"
                  name="scheduledStartTime"
                  type="time"
                  value={formData.scheduledStartTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="scheduledEndTime">Giờ kết thúc</Label>
                <Input
                  id="scheduledEndTime"
                  name="scheduledEndTime"
                  type="time"
                  value={formData.scheduledEndTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="homeTeamId">Đội nhà</Label>
                <Select value={formData.homeTeamId} onValueChange={(value) => handleSelectChange("homeTeamId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn đội nhà" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Không có</SelectItem>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="awayTeamId">Đội khách</Label>
                <Select value={formData.awayTeamId} onValueChange={(value) => handleSelectChange("awayTeamId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn đội khách" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Không có</SelectItem>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scoreHome">Điểm đội nhà</Label>
                <Input
                  id="scoreHome"
                  name="scoreHome"
                  type="number"
                  min="0"
                  value={formData.scoreHome}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="scoreAway">Điểm đội khách</Label>
                <Input
                  id="scoreAway"
                  name="scoreAway"
                  type="number"
                  min="0"
                  value={formData.scoreAway}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="courtId">Địa điểm</Label>
              <Select value={formData.courtId} onValueChange={(value) => handleSelectChange("courtId", value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn địa điểm" />
                </SelectTrigger>
                <SelectContent>
                  {courts.map((court) => (
                    <SelectItem key={court.id} value={court.id}>
                      {court.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sắp diễn ra">Sắp diễn ra</SelectItem>
                  <SelectItem value="Đang diễn ra">Đang diễn ra</SelectItem>
                  <SelectItem value="Đã kết thúc">Đã kết thúc</SelectItem>
                  <SelectItem value="Đã hủy">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.push(`/matches/${params.id}`)}>
              Hủy
            </Button>
            <Button type="submit" className="bg-[#BD2427] hover:bg-[#9a1e21]">
              Lưu thay đổi
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}