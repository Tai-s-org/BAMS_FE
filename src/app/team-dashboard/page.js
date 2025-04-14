"use client"

import { useState } from "react"
import { format } from "date-fns"
// Import additional icons
import { CalendarDays, Plus, Trash2, User, Users, BellIcon as Whistle, Clock, MapPin, Trophy } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { Badge } from "@/components/ui/Badge"
import { Checkbox } from "@/components/ui/Checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"

// Mock data for the team
const teamData = {
  teamId: "T001",
  teamName: "Đội A",
  status: 1,
  createAt: "2025-03-19T01:43:19.333",
  coaches: [
    {
      userId: "550e8400-e29b-41d4-a716-446655440002",
      teamId: "T001",
      coachName: "Alex Nguyễn",
      createdByPresidentId: "1",
      bio: null,
      contractStartDate: "2025-02-28",
      contractEndDate: "2026-03-30",
    },
    {
      userId: "550e8400-e29b-41d4-a716-556655440002",
      teamId: "T001",
      coachName: "Trần Văn Hiệp",
      createdByPresidentId: "550e8400-e29b-41d4-a716-556655440003",
      bio: null,
      contractStartDate: "2025-02-28",
      contractEndDate: "2026-03-30",
    },
  ],
  managers: [
    {
      userId: "550e8400-e29b-41d4-a716-446655440000",
      teamId: "T001",
      managerName: "Trần Văn Hiệp 123",
      bankName: null,
      bankAccountNumber: null,
    },
  ],
  players: [
    {
      userId: "1f615e210741446a8060a144c2a980c6",
      fullname: "An Hoàng Tuấn",
      email: null,
      phone: null,
      teamId: "T001",
      teamName: null,
      profileImage: null,
      address: null,
      dateOfBirth: null,
      weight: 0,
      height: 0,
      position: "PG",
      shirtNumber: null,
      relationshipWithParent: "Con trai",
      clubJoinDate: "2025-03-05",
    },
    {
      userId: "550e8400-e29b-41d4-a716-556655440001",
      fullname: "Trần Văn Hiệp 2",
      email: null,
      phone: null,
      teamId: "T001",
      teamName: null,
      profileImage: null,
      address: null,
      dateOfBirth: null,
      weight: 78,
      height: 180,
      position: "SF",
      shirtNumber: 10,
      relationshipWithParent: "Con trai",
      clubJoinDate: "2025-03-01",
    },
  ],
}

// Mock data for non-team players
const nonTeamPlayers = [
  {
    userId: "0f03a8d3-dd16-4fd3-a2d5-de8ac3b73840",
    fullname: "Ngô Hoàng Anh",
    email: "user21@example.com",
    phone: "0834567890",
    address: "N/A",
    roleCode: "Player",
    isEnable: true,
    relationshipWithParent: "Con trai",
    weight: 10,
    height: 10,
    position: "Tiền vệ",
    shirtNumber: null,
    clubJoinDate: "2025-04-03",
  },
  {
    userId: "11b9cf78-50a2-4f1c-ab05-460582abaa09",
    fullname: "Nguyễn Văn Sơn",
    email: "vodvum@mkomail.cyou",
    phone: "0344858585",
    address: "N/A",
    roleCode: "Player",
    isEnable: true,
    relationshipWithParent: "Con trai",
    weight: 10,
    height: 10,
    position: "Tiền Đạo",
    shirtNumber: null,
    clubJoinDate: "2025-04-03",
  },
  {
    userId: "1f615e210741446a8060a144c2a980c6",
    fullname: "An Hoàng Tuấn",
    email: "tuanballboo3@example.com",
    phone: "string",
    address: "N/A",
    roleCode: "Player",
    isEnable: true,
    relationshipWithParent: "Con trai",
    weight: 0,
    height: 0,
    position: "PG",
    shirtNumber: null,
    clubJoinDate: "2025-03-05",
  },
]

// Add mock data for training sessions and matches
const trainingSessionsData = [
  {
    trainingSessionId: "35386aec-c899-41c9-9af3-33f79fcaf5f9",
    teamId: "T001",
    teamName: "Đội A",
    playerId: null,
    playerName: null,
    courtId: "81657d43-cb30-4ec3-a331-1954d8d604f1",
    courtName: "Sân bóng rổ chính",
    scheduledDate: "2025-04-15",
    scheduledStartTime: "18:00:00",
    scheduledEndTime: "19:30:00",
    status: 0,
    note: null,
  },
]

const matchesData = [
  {
    matchId: 11,
    matchName: "GIAO HỮU THÁNG",
    scheduledDate: "2025-04-18",
    scheduledStartTime: "16:16:00",
    scheduledEndTime: "17:16:00",
    homeTeamId: null,
    homeTeamName: "Khách",
    scoreHome: 0,
    awayTeamId: "T001",
    awayTeamName: "Đội A",
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
    matchId: 13,
    matchName: "GIAO HỮU THÁNG Test",
    scheduledDate: "2025-04-24",
    scheduledStartTime: "04:45:00",
    scheduledEndTime: "05:45:00",
    homeTeamId: "T001",
    homeTeamName: "Đội A",
    scoreHome: 0,
    awayTeamId: "34a2e1f8-0bd4-4a8a-ad49-6bc8ea2d4a4d",
    awayTeamName: "ABCD",
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
]

export default function TeamDashboard() {
  const [team, setTeam] = useState(teamData)
  const [isAddPlayerModalOpen, setIsAddPlayerModalOpen] = useState(false)
  const [selectedPlayers, setSelectedPlayers] = useState([])

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return format(new Date(dateString), "dd/MM/yyyy")
  }

  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return "N/A"
    const [hours, minutes] = timeString.split(":")
    return `${hours}:${minutes}`
  }

  // Handle player selection in modal
  const handlePlayerSelection = (userId) => {
    setSelectedPlayers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  // Add selected players to team
  const handleAddPlayersToTeam = () => {
    // In a real app, you would make an API call here
    // For this demo, we'll just update the state
    const playersToAdd = nonTeamPlayers.filter(
      (player) => selectedPlayers.includes(player.userId) && !team.players.some((p) => p.userId === player.userId),
    )

    const updatedPlayers = [
      ...team.players,
      ...playersToAdd.map((player) => ({
        userId: player.userId,
        fullname: player.fullname,
        email: player.email,
        phone: player.phone,
        teamId: team.teamId,
        teamName: null,
        profileImage: null,
        address: player.address,
        dateOfBirth: null,
        weight: player.weight,
        height: player.height,
        position: player.position,
        shirtNumber: player.shirtNumber,
        relationshipWithParent: player.relationshipWithParent,
        clubJoinDate: player.clubJoinDate,
      })),
    ]

    setTeam({
      ...team,
      players: updatedPlayers,
    })

    setIsAddPlayerModalOpen(false)
    setSelectedPlayers([])
  }

  // Remove player from team
  const handleRemovePlayer = (userId) => {
    // In a real app, you would make an API call here
    setTeam({
      ...team,
      players: team.players.filter((player) => player.userId !== userId),
    })
  }

  return (
    <div className="container mx-auto py-6">
      {/* Team Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#BD2427]">{team.teamName}</h1>
            <div className="flex items-center text-muted-foreground mt-1">
              <CalendarDays className="h-4 w-4 mr-1" />
              <span>Ngày tạo: {formatDate(team.createAt)}</span>
            </div>
          </div>
          <Badge
            variant="outline"
            className={`px-3 py-1 ${team.status === 1 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
          >
            {team.status === 1 ? "Đang hoạt động" : "Không hoạt động"}
          </Badge>
        </div>
      </div>

      {/* Today's Training Sessions */}
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        {/* Training Sessions Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Whistle className="h-5 w-5 text-[#BD2427]" />
              Lịch tập hôm nay
            </CardTitle>
            <CardDescription>Các buổi tập đã lên lịch cho hôm nay</CardDescription>
          </CardHeader>
          <CardContent>
            {trainingSessionsData.length > 0 ? (
              <div className="space-y-4">
                {trainingSessionsData.map((session) => (
                  <div key={session.trainingSessionId} className="flex flex-col p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{session.courtName}</h3>
                      <Badge variant={session.status === 0 ? "outline" : "secondary"}>
                        {session.status === 0 ? "Đã lên lịch" : "Đã hoàn thành"}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>
                        {formatTime(session.scheduledStartTime)} - {formatTime(session.scheduledEndTime)}
                      </span>
                    </div>
                    {session.note && (
                      <div className="mt-2 text-sm">
                        <span className="font-medium">Ghi chú:</span> {session.note}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                Không có buổi tập nào được lên lịch cho hôm nay.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Matches Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="h-5 w-5 text-[#BD2427]" />
              Trận đấu sắp tới
            </CardTitle>
            <CardDescription>Các trận đấu đã lên lịch cho đội</CardDescription>
          </CardHeader>
          <CardContent>
            {matchesData.length > 0 ? (
              <div className="space-y-4">
                {matchesData.map((match) => (
                  <div key={match.matchId} className="flex flex-col p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{match.matchName}</h3>
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                        {match.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{match.homeTeamName}</span>
                        <span>vs</span>
                        <span className="font-medium">{match.awayTeamName}</span>
                      </div>
                      <div className="text-sm font-medium">
                        {match.scoreHome} - {match.scoreAway}
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CalendarDays className="h-4 w-4 mr-1" />
                      <span>{formatDate(match.scheduledDate)}</span>
                      <span className="mx-1">•</span>
                      <Clock className="h-4 w-4 mr-1" />
                      <span>
                        {formatTime(match.scheduledStartTime)} - {formatTime(match.scheduledEndTime)}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{match.courtName}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">Không có trận đấu nào sắp tới.</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Card>
        <CardHeader className="pb-0">
          <CardTitle>Thành viên đội</CardTitle>
          <CardDescription>Quản lý huấn luyện viên, quản lý và cầu thủ cho {team.teamName}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="players" className="mt-4">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="coaches" className="flex items-center gap-2">
                <Whistle className="h-4 w-4" />
                HLV ({team.coaches.length})
              </TabsTrigger>
              <TabsTrigger value="managers" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Quản lý ({team.managers.length})
              </TabsTrigger>
              <TabsTrigger value="players" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Cầu thủ ({team.players.length})
              </TabsTrigger>
            </TabsList>

            {/* Coaches Tab */}
            <TabsContent value="coaches">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên</TableHead>
                    <TableHead>Ngày bắt đầu hợp đồng</TableHead>
                    <TableHead>Ngày kết thúc hợp đồng</TableHead>
                    <TableHead>Tiểu sử</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {team.coaches.map((coach) => (
                    <TableRow key={coach.userId}>
                      <TableCell className="font-medium">{coach.coachName}</TableCell>
                      <TableCell>{formatDate(coach.contractStartDate)}</TableCell>
                      <TableCell>{formatDate(coach.contractEndDate)}</TableCell>
                      <TableCell>{coach.bio || "N/A"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            {/* Managers Tab */}
            <TabsContent value="managers">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên</TableHead>
                    <TableHead>Tên ngân hàng</TableHead>
                    <TableHead>Số tài khoản</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {team.managers.map((manager) => (
                    <TableRow key={manager.userId}>
                      <TableCell className="font-medium">{manager.managerName}</TableCell>
                      <TableCell>{manager.bankName || "N/A"}</TableCell>
                      <TableCell>{manager.bankAccountNumber || "N/A"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            {/* Players Tab */}
            <TabsContent value="players">
              <div className="flex justify-end mb-4">
                <Button
                  onClick={() => setIsAddPlayerModalOpen(true)}
                  className="bg-[#BD2427] hover:bg-[#9a1e20] text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm cầu thủ
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên</TableHead>
                    <TableHead>Vị trí</TableHead>
                    <TableHead>Chiều cao</TableHead>
                    <TableHead>Cân nặng</TableHead>
                    <TableHead>Số áo</TableHead>
                    <TableHead>Ngày tham gia</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {team.players.map((player) => (
                    <TableRow key={player.userId}>
                      <TableCell className="font-medium">{player.fullname}</TableCell>
                      <TableCell>{player.position || "N/A"}</TableCell>
                      <TableCell>{player.height ? `${player.height} cm` : "N/A"}</TableCell>
                      <TableCell>{player.weight ? `${player.weight} kg` : "N/A"}</TableCell>
                      <TableCell>{player.shirtNumber || "N/A"}</TableCell>
                      <TableCell>{formatDate(player.clubJoinDate)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemovePlayer(player.userId)}
                          className="text-[#BD2427] hover:text-[#9a1e20] hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {team.players.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                        Chưa có cầu thủ nào trong đội. Hãy thêm cầu thủ để bắt đầu.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Add Players Modal */}
      <Dialog open={isAddPlayerModalOpen} onOpenChange={setIsAddPlayerModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Thêm cầu thủ vào {team.teamName}</DialogTitle>
            <DialogDescription>Chọn cầu thủ để thêm vào đội. Bạn có thể chọn nhiều cầu thủ cùng lúc.</DialogDescription>
          </DialogHeader>

          <div className="max-h-[60vh] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Chọn</TableHead>
                  <TableHead>Tên</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Điện thoại</TableHead>
                  <TableHead>Vị trí</TableHead>
                  <TableHead>Chiều cao</TableHead>
                  <TableHead>Cân nặng</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {nonTeamPlayers.map((player) => {
                  // Check if player is already in the team
                  const isInTeam = team.players.some((p) => p.userId === player.userId)

                  return (
                    <TableRow key={player.userId} className={isInTeam ? "opacity-50" : ""}>
                      <TableCell>
                        <Checkbox
                          checked={selectedPlayers.includes(player.userId)}
                          onCheckedChange={() => !isInTeam && handlePlayerSelection(player.userId)}
                          disabled={isInTeam}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{player.fullname}</TableCell>
                      <TableCell>{player.email || "N/A"}</TableCell>
                      <TableCell>{player.phone || "N/A"}</TableCell>
                      <TableCell>{player.position || "N/A"}</TableCell>
                      <TableCell>{player.height ? `${player.height} cm` : "N/A"}</TableCell>
                      <TableCell>{player.weight ? `${player.weight} kg` : "N/A"}</TableCell>
                    </TableRow>
                  )
                })}
                {nonTeamPlayers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      Không có cầu thủ nào khả dụng để thêm.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <DialogFooter className="flex justify-between items-center mt-4">
            <div className="text-sm text-muted-foreground">Đã chọn {selectedPlayers.length} cầu thủ</div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddPlayerModalOpen(false)
                  setSelectedPlayers([])
                }}
              >
                Hủy
              </Button>
              <Button
                onClick={handleAddPlayersToTeam}
                disabled={selectedPlayers.length === 0}
                className="bg-[#BD2427] hover:bg-[#9a1e20] text-white"
              >
                Thêm vào đội
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}