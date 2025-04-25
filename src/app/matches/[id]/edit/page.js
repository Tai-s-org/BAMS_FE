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
import { DatePicker } from "@/components/ui/DatePicker"
import { format } from "date-fns"
import { TimePicker } from "@/components/ui/TimePicker"

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
    homeTeamScore: 0,
    awayTeamScore: 0,
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
        homeTeamScore: response?.data.data.scoreHome,
        awayTeamScore: response?.data.data.scoreAway,
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

  const formatDate = (date) => {
      const dateObj = new Date(date)
      return format(dateObj, "yyyy-MM-dd")
    }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const data = {
      matchName: formData.matchName,
      matchDate: formatDate(formData.scheduledDate) + "T" + formData.scheduledStartTime,
      homeTeamId: match.homeTeamId,
      awayTeamId: match.awayTeamId,
      opponentTeamName: match.homeTeamId ? match.awayTeamName : match.homeTeamName,
      awayTeamScore: formData.awayTeamScore,
      homeTeamScore: formData.homeTeamScore,
      courtId: formData.courtId,
    }
    
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
        <Button variant="ghost" onClick={() => router.back()} className="mr-2">
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
                <DatePicker
                  value={formData.scheduledDate ? new Date(formData.scheduledDate) : null}
                  onChange={(date) => {handleSelectChange("scheduledDate", date)}}
                  disabled={match.status === "Đã kết thúc"}
                  minDate={new Date()}
                  placeholderText="Chọn ngày"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="scheduledStartTime">Giờ bắt đầu</Label>
                <TimePicker
                  value={formData.scheduledStartTime}
                  onChange={(time) => {handleSelectChange("scheduledStartTime", time)}}
                  disabled={match.status === "Đã kết thúc"}
                  placeholderText="Chọn giờ bắt đầu"
                  required
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
                  <Label htmlFor="homeTeamScore">Điểm đội nhà</Label>
                  <Input
                    id="homeTeamScore"
                    name="homeTeamScore"
                    type="number"
                    min="0"
                    value={formData.homeTeamScore}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="awayTeamScore">Điểm đội khách</Label>
                  <Input
                    id="awayTeamScore"
                    name="awayTeamScore"
                    type="number"
                    min="0"
                    value={formData.awayTeamScore}
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
                      {court.courtName} - {court.address}
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