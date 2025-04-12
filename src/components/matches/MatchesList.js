"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { format, isAfter, isBefore, parseISO } from "date-fns"
import { Calendar, Clock, MapPin, Trash2, Edit, Eye, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/Alert-dialog"
import { Badge } from "@/components/ui/Badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import matchApi from "@/api/match"

// Sample data based on the provided format
const initialMatches = [
  {
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
  },
  {
    matchId: 9,
    matchName: "GIAO HỮU THÁNG 7",
    scheduledDate: "2025-04-28",
    scheduledStartTime: "12:00:00",
    scheduledEndTime: "13:00:00",
    homeTeamId: null,
    homeTeamName: null,
    scoreHome: 0,
    awayTeamId: "T001",
    awayTeamName: "Team A",
    scoreAway: 0,
    status: "Sắp diễn ra",
    courtId: "3d5e35e1-253f-482c-a3f8-5b8bdeed941c",
    courtName: "Nhà thi đấu huyện Thanh Trì",
    courtAddress: "303 Đường Nam Kỳ Khởi Nghĩa, Quận 3, TP.HCMinh",
    createdByCoachId: "550e8400-e29b-41d4-a716-556655440002",
    homeTeamPlayers: [],
    awayTeamPlayers: [],
    matchArticles: [],
  },
  {
    matchId: 10,
    matchName: "GIAO HỮU THÁNG 5",
    scheduledDate: "2025-05-10",
    scheduledStartTime: "14:00:00",
    scheduledEndTime: "15:30:00",
    homeTeamId: "T002",
    homeTeamName: "Team B",
    scoreHome: 0,
    awayTeamId: "T003",
    awayTeamName: "Team C",
    scoreAway: 0,
    status: "Sắp diễn ra",
    courtId: "4f6g46f2-364g-593d-b4g9-6c9cefff052d",
    courtName: "Nhà thi đấu Phú Nhuận",
    courtAddress: "123 Đường Nguyễn Văn Trỗi, Quận Phú Nhuận, TP.HCMinh",
    createdByCoachId: "550e8400-e29b-41d4-a716-556655440002",
    homeTeamPlayers: [],
    awayTeamPlayers: [],
    matchArticles: [],
  },
]

const getDefaultFilters = () => {
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);

  return {
    startDate: getFormattedDate(today),
    endDate: getFormattedDate(nextWeek),
  };
};

const getFormattedDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function MatchesList() {
  const [matches, setMatches] = useState([])
  const [filteredMatches, setFilteredMatches] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState(getDefaultFilters())

  const fetchMatches = async () => {
    // Fetch matches from the API or database
    try {
      console.log(filters);
      
      const response = await matchApi.getMatch({
        startDate: filters.startDate,
        endDate: filters.endDate,
      })
      console.log(response?.data);
      setMatches(response?.data.data || [])
      setFilteredMatches(response?.data.data || [])
    }
    catch (error) {
      console.error("Error fetching matches:", error);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [filters]);

  const handleDeleteMatch = (matchId) => {
    const updatedMatches = matches.filter((match) => match.matchId !== matchId)
    setMatches(updatedMatches)
    setFilteredMatches(updatedMatches)
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const clearFilters = () => {
    const defaultFilters = getDefaultFilters();
    setFilters(defaultFilters);
    setFilteredMatches(matches);
  };

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="flex items-center">
          <Filter className="mr-2 h-4 w-4" />
          {showFilters ? "Ẩn bộ lọc" : "Hiển thị bộ lọc"}
        </Button>
        {showFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="flex items-center text-gray-500">
            <X className="mr-2 h-4 w-4" />
            Xóa bộ lọc
          </Button>
        )}
      </div>

      {showFilters && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Lọc trận đấu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Từ ngày</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Đến ngày</Label>
                <Input id="endDate" name="endDate" type="date" value={filters.endDate} onChange={handleFilterChange} />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      <Tabs defaultValue="cards" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="cards">Thẻ</TabsTrigger>
          <TabsTrigger value="table">Bảng</TabsTrigger>
        </TabsList>

        <TabsContent value="cards" className="space-y-4">
          {filteredMatches.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">Không tìm thấy trận đấu nào</h3>
              <p className="mt-2 text-gray-500">Thử thay đổi bộ lọc hoặc tạo trận đấu mới</p>
            </div>
          ) : (
            filteredMatches.map((match) => (
              <Card key={match.matchId} className="overflow-hidden">
                <CardHeader className="bg-[#BD2427]/10 pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-bold">{match.matchName}</CardTitle>
                    <Badge
                      variant={match.status === "Sắp diễn ra" ? "outline" : "default"}
                      className="bg-[#BD2427] text-white"
                    >
                      {match.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Calendar className="mr-2 h-4 w-4 text-[#BD2427]" />
                        <span>{format(new Date(match.scheduledDate), "dd/MM/yyyy")}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="mr-2 h-4 w-4 text-[#BD2427]" />
                        <span>
                          {match.scheduledStartTime} - {match.scheduledEndTime}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin className="mr-2 h-4 w-4 text-[#BD2427]" />
                        <span>{match.courtName}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center bg-gray-50 rounded-lg p-4">
                      <div className="text-center">
                        <div className="font-bold">{match.homeTeamName || "Chưa xác định"}</div>
                        <div className="text-3xl font-bold my-2 flex items-center justify-center">
                          <span>{match.scoreHome}</span>
                          <span className="mx-2">-</span>
                          <span>{match.scoreAway}</span>
                        </div>
                        <div className="font-bold">{match.awayTeamName || "Chưa xác định"}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 flex justify-end gap-2">
                  <Link href={`/matches/${match.matchId}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      Xem
                    </Button>
                  </Link>
                  <Link href={`/matches/${match.matchId}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="mr-2 h-4 w-4" />
                      Sửa
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Xóa
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Bạn có chắc chắn?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Hành động này không thể hoàn tác. Điều này sẽ xóa vĩnh viễn trận đấu và tất cả dữ liệu liên quan.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-[#BD2427] hover:bg-[#9a1e21]"
                          onClick={() => handleDeleteMatch(match.matchId)}
                        >
                          Xóa
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="table" className="w-full">
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-[#BD2427]/10">
                  <th className="py-3 px-4 text-left font-medium">Tên trận đấu</th>
                  <th className="py-3 px-4 text-left font-medium">Ngày</th>
                  <th className="py-3 px-4 text-left font-medium">Thời gian</th>
                  <th className="py-3 px-4 text-left font-medium">Đội</th>
                  <th className="py-3 px-4 text-left font-medium">Địa điểm</th>
                  <th className="py-3 px-4 text-left font-medium">Trạng thái</th>
                  <th className="py-3 px-4 text-left font-medium">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredMatches.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-500">
                      Không tìm thấy trận đấu nào
                    </td>
                  </tr>
                ) : (
                  filteredMatches.map((match) => (
                    <tr key={match.matchId} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{match.matchName}</td>
                      <td className="py-3 px-4">{format(new Date(match.scheduledDate), "dd/MM/yyyy")}</td>
                      <td className="py-3 px-4">
                        {match.scheduledStartTime} - {match.scheduledEndTime}
                      </td>
                      <td className="py-3 px-4">
                        {match.homeTeamName || "Chưa xác định"} vs {match.awayTeamName || "Chưa xác định"}
                      </td>
                      <td className="py-3 px-4">{match.courtName}</td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={match.status === "Sắp diễn ra" ? "outline" : "default"}
                          className="bg-[#BD2427] text-white"
                        >
                          {match.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Link href={`/matches/${match.matchId}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/matches/${match.matchId}/edit`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Bạn có chắc chắn?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Hành động này không thể hoàn tác. Điều này sẽ xóa vĩnh viễn trận đấu và tất cả dữ liệu
                                  liên quan.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Hủy</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-[#BD2427] hover:bg-[#9a1e21]"
                                  onClick={() => handleDeleteMatch(match.matchId)}
                                >
                                  Xóa
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </>
  )
}
