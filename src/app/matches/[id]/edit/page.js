"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { ArrowLeft } from "lucide-react"
import matchApi from "@/api/match"
import { useToasts } from "@/hooks/providers/ToastProvider"

export default function EditMatchPage() {
  const params = useParams()
  const router = useRouter()
  const [formData, setFormData] = useState({
    matchName: "",
    scheduledDate: "",
    scheduledStartTime: "",
    scheduledEndTime: "",
    homeTeamId: "",
    homeTeamName: "",
    awayTeamId: "",
    awayTeamName: "",
    courtId: "",
    scoreHome: 0,
    scoreAway: 0,
  })
  const [match, setMatch] = useState({})
  const [courts, setAvailableCourts] = useState([])
  const { addToast } = useToasts()

  useEffect(() => {
    fetchMatchDetail()
  }, [params.id])

  useEffect(() => {
    if (formData.scheduledDate) {
      fetchAvailableCourts()
    }
  }
  , [formData.scheduledDate])

  const fetchMatchDetail = async () => {
    try {
      const response = await matchApi.getMatchById(params.id);
      setMatch(response?.data.data);
      setFormData({
        matchName: response?.data.data.matchName,
        scheduledDate: response?.data.data.scheduledDate,
        scheduledStartTime: response?.data.data.scheduledStartTime,
        scheduledEndTime: response?.data.data.scheduledEndTime,
        homeTeamId: response?.data.data.homeTeamId || "",
        homeTeamName: response?.data.data.homeTeamName || "",
        awayTeamId: response?.data.data.awayTeamId || "",
        awayTeamName: response?.data.data.awayTeamName || "",
        courtId: response?.data.data.courtId,
        scoreHome: response?.data.data.scoreHome,
        scoreAway: response?.data.data.scoreAway,
      })
    } catch (error) {
      console.error("Error fetching match details:", error.response?.data)
      if(error.status == 401) {
        addToast({ message: error?.response?.data.Message, type: "error" });
      }
    }
  }

  const fetchAvailableCourts = async () => {
    try {
      const data = {
        matchDate: formData.scheduledDate,
      }
      const response = await matchApi.getAvailableCourts(data);
      console.log("Available courts:", response?.data.data);
      setAvailableCourts(response?.data.data);
    } catch (error) {
      console.error("Error fetching available courts:", error)
      if(error.status == 401) {
        addToast({ message: error?.response?.data.Message, type: "error" });
      }
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // In a real app, you would update the match data in your backend here
    const data = {
      matchName: formData.matchName,
      matchDate: formData.scheduledDate + "T" + formData.scheduledStartTime,
      homeTeamId: match.homeTeamId,
      awayTeamId: match.awayTeamId,
      opponentTeamName: match.homeTeamId ? match.awayTeamName : match.homeTeamName,
      courtId: formData.courtId,
    }

    console.log("Match data to update:", data);
    console.log("Match ID:", params.id);
    
    try {
      const response = await matchApi.updateMatch(params.id, data)
      addToast({ message: response?.data.message, type: "success" })
      router.push(`/matches/${params.id}`)
    } catch (error) {
      console.error("Error updating match:", error);
      if (error.response && error.response.data && error.response.data.message) {
        addToast({ message: error.response.data.message, type: "error" });
      }
    }
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
                disabled={match.status === "Đã kết thúc"}
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
                  disabled={match.status === "Đã kết thúc"}
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
                  disabled={match.status === "Đã kết thúc"}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="homeTeamId">Đội nhà</Label>
                <div>
                  {formData.homeTeamName}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="awayTeamId">Đội khách</Label>
                <div>
                  {formData.awayTeamName}
                </div>
              </div>
            </div>

            {match.status === "Đã kết thúc" &&
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
              </div>}

            <div className="space-y-2">
              <Label htmlFor="courtId">Địa điểm</Label>
              {!(match.status === "Đã kết thúc" || match.status === "Đang diễn ra") ? <Select value={formData.courtId} onValueChange={(value) => handleSelectChange("courtId", value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn địa điểm" />
                </SelectTrigger>
                <SelectContent>
                  {courts.map((court) => (
                    <SelectItem key={court.courtId} value={court.courtId}>
                      {court.courtName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              : <div>{match.courtAddress}</div>}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.push(`/matches/${params.id}`)}>
              Hủy
            </Button>
            <Button type="submit" className="bg-[#BD2427] hover:bg-[#9a1e21]" disabled={formData.courtId === ""} >
              Lưu thay đổi
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}