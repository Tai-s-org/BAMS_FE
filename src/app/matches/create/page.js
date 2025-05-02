"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { ArrowLeft } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/Radio-group"
import { useAuth } from "@/hooks/context/AuthContext"
import teamApi from "@/api/team"
import { useToasts } from "@/hooks/providers/ToastProvider"
import matchApi from "@/api/match"
import { DatePicker } from "@/components/ui/DatePicker"
import { format } from "date-fns"
import { TimePicker } from "@/components/ui/TimePicker"

export default function CreateMatchPage() {
  const router = useRouter()
  const { addToast } = useToasts();
  const { userInfo } = useAuth();
  const [formData, setFormData] = useState({
    matchName: "",
    scheduledDate: "",
    scheduledStartTime: "",
    homeTeamId: "",
    homeTeamName: "",
    awayTeamId: "",
    awayTeamName: "",
    courtId: "",
  })
  const [clubTeams, setTeams] = useState([]) 
  const [allTeams, setAllTeams] = useState([]) 
  const [courts, setAvailableCourt] = useState([]) 

  const [matchType, setMatchType] = useState(null)

  const [venueType, setVenueType] = useState(null)

  useEffect(() => {
    fetchTeams()
  }, [])

  useEffect(() => {
    if (formData.scheduledDate) {
      fetchCourts()
    }
  }, [formData.scheduledDate])

  const fetchCourts = async () => {
    try {
      const response = await matchApi.getAvailableCourts({
        matchDate: formData.scheduledDate,
      });
      setAvailableCourt(response?.data.data)
    } catch (error) {
      console.error("Error fetching courts:", error)
    }
  }

  const fetchTeams = async () => {
    try {
      const response = await teamApi.listTeams({ status: 1, pageSize: 100 });
      setAllTeams(response?.data.data.items)
      let filteredTeams = response?.data.data.items.filter((team) => {
        return team.teamId !== userInfo?.roleInformation.teamId
      })
      if (filteredTeams.length > 0) {
        setTeams(filteredTeams)
      }
    } catch (error) {
      console.error("Error fetching teams:", error)

    }
  }

  const getTeamNameById = (teamId) => {
    const team = allTeams?.find((team) => team.teamId === teamId);
    if (team) {
      return team.teamName;
    } else {
      return "Đội bóng không tồn tại";
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    if (name === "homeTeamId") {
      const selectedTeam = clubTeams.find((team) => team.teamId === value)
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        homeTeamName: selectedTeam ? selectedTeam.teamName : "",
      }))
    } else if (name === "awayTeamId") {
      const selectedTeam = clubTeams.find((team) => team.teamId === value)
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        awayTeamName: selectedTeam ? selectedTeam.teamName : "",
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleMatchTypeChange = (value) => {
    setMatchType(value)
    // Reset các giá trị liên quan
    setVenueType(null)

    if (value === "internal") {
      setFormData((prev) => ({
        ...prev,
        homeTeamId: userInfo?.roleInformation.teamId,
        homeTeamName: getTeamNameById(userInfo?.roleInformation.teamId),
        awayTeamId: "",
        awayTeamName: "",
      }))
    } else if (value === "external") {
      setFormData((prev) => ({
        ...prev,
        homeTeamId: "",
        homeTeamName: "",
        awayTeamId: "",
        awayTeamName: "",
      }))
    }
  }

  const handleVenueTypeChange = (value) => {
    setVenueType(value)
    // Reset các giá trị liên quan
    if (value === "home") {
      setFormData((prev) => ({
        ...prev,
        homeTeamId: userInfo?.roleInformation.teamId,
        homeTeamName: getTeamNameById(userInfo?.roleInformation.teamId),
        awayTeamId: "",
        awayTeamName: "",
      }))
    } else if (value === "away") {
      setFormData((prev) => ({
        ...prev,
        awayTeamId: userInfo?.roleInformation.teamId,
        awayTeamName: getTeamNameById(userInfo?.roleInformation.teamId),
        homeTeamId: "",
        homeTeamName: "",
      }))
    }
  }

  const formatTime = (time) => {
    const timeSplit = time.split(":")
    if (timeSplit.length === 2) {
      return time + ":00"
    } else {
      return time;
    }
  }

  const formatDate = (date) => {
    const dateObj = new Date(date)
    return format(dateObj, "yyyy-MM-dd")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = {
      matchName: formData.matchName,
      matchDate: formatDate(formData.scheduledDate) + "T" + formatTime(formData.scheduledStartTime),
      homeTeamId: formData.homeTeamId === "" ? null : formData.homeTeamId,
      awayTeamId: formData.awayTeamId === "" ? null : formData.awayTeamId,
      opponentTeamName: (matchType === "external" && venueType === "away") ? formData.homeTeamName : formData.awayTeamName,
      courtId: formData.courtId,
    }
    
    try {
      const response = await matchApi.createMatch(data);
      addToast({ message: response.data.message, type: response.data.status });
    } catch (error) {
      console.error("Error creating match:", error);
      if (error.response && error.response.data && error.response.data.message) {
        addToast({ message: error.response.data.message, type: "error" });
      }
    }
    // Navigate back to the matches list
    router.push("/matches")
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => router.push("/matches")} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <h1 className="text-3xl font-bold text-[#BD2427]">Tạo trận đấu mới</h1>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Thông tin trận đấu</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Bước 1: Chọn loại trận đấu */}
            <div className="space-y-3">
              <Label>Loại trận đấu</Label>
              <RadioGroup
                value={matchType || ""}
                onValueChange={(value) => handleMatchTypeChange(value)}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="internal" id="internal" />
                  <Label htmlFor="internal">Nội bộ</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="external" id="external" />
                  <Label htmlFor="external">Đội ngoài</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Bước 2: Nếu chọn "Đội ngoài", hiển thị lựa chọn sân nhà/sân khách */}
            {matchType === "external" && (
              <div className="space-y-3">
                <Label>Địa điểm thi đấu</Label>
                <RadioGroup
                  value={venueType || ""}
                  onValueChange={(value) => handleVenueTypeChange(value)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="home" id="home" />
                    <Label htmlFor="home">Sân nhà</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="away" id="away" />
                    <Label htmlFor="away">Sân khách</Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Bước 3: Hiển thị lựa chọn đội dựa trên các lựa chọn trước đó */}
            {matchType && (
              <div className="grid md:grid-cols-2 gap-4">
                {/* Đội nhà */}
                <div className="space-y-2">
                  <Label htmlFor="homeTeam">Đội nhà</Label>
                  {matchType === "internal" || (matchType === "external" && venueType === "home") ? (
                    <div>{getTeamNameById(userInfo?.roleInformation.teamId)}</div>
                  ) : (
                    <Input
                      name="homeTeamName"
                      value={formData.homeTeamName}
                      onChange={handleInputChange}
                      placeholder="Nhập tên đội nhà"
                      required
                      disabled={venueType === "" || venueType === null}
                    />
                  )}
                </div>

                {/* Đội khách */}
                <div className="space-y-2">
                  <Label htmlFor="awayTeam">Đội khách</Label>
                  {matchType === "internal" &&
                    <Select
                      value={formData.awayTeamId}
                      onValueChange={(value) => handleSelectChange("awayTeamId", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn đội khách" />
                      </SelectTrigger>
                      <SelectContent>
                        {clubTeams.map((team) => (
                          <SelectItem key={team.teamId} value={team.teamId}>
                            {team.teamName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  }
                  {(matchType === "external" && venueType === "away") ? (
                    <div>{getTeamNameById(userInfo?.roleInformation.teamId)}</div>
                  ) : (
                    matchType !== "internal" && <Input
                      name="awayTeamName"
                      value={formData.awayTeamName}
                      onChange={handleInputChange}
                      placeholder="Nhập tên đội khách"
                      required
                      disabled={venueType === "" || venueType === null}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Các thông tin khác */}
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
                <DatePicker
                  value={formData.scheduledDate}
                  onChange={(date) => {
                    setFormData((prev) => ({ ...prev, scheduledDate: date }))
                  }}
                  placeholder="Chọn ngày"
                  minDate={new Date()}
                  className="w-full"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="scheduledStartTime">Giờ bắt đầu</Label>
                <TimePicker
                  value={formData.scheduledStartTime}
                  onChange={(time) => {
                    setFormData((prev) => ({ ...prev, scheduledStartTime: time }))
                  }}
                  placeholder="Chọn giờ bắt đầu"
                  className="w-full"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="courtId">Địa điểm {(formData.scheduledDate === "" || formData.scheduledStartTime === "") ? <span className="text-red-500">Vui lòng chọn ngày và giờ</span> : ""}</Label>
              <Select value={formData.courtId} onValueChange={(value) => handleSelectChange("courtId", value)} required disabled={formData.scheduledDate === "" || formData.scheduledStartTime === ""}>
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
            </div>

          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.push("/matches")}>
              Hủy
            </Button>
            <Button
              type="submit"
              className="bg-[#BD2427] hover:bg-[#9a1e21]"
              disabled={!matchType || (matchType === "external" && !venueType) || (formData.courtId === "") || (matchType === "internal" && formData.awayTeamId === "")}
            >
              Tạo trận đấu
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
