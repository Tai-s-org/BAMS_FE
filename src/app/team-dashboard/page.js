"use client"

import { useEffect, useState } from "react"
import { format, set } from "date-fns"
import { CalendarDays, Plus, Trash2, Users, BellIcon as Whistle, Clock, MapPin, Trophy, AlertCircle, CheckCircle2, Eye } from "lucide-react"

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
import { useAuth } from "@/hooks/context/AuthContext"
import teamApi from "@/api/team"
import playerApi from "@/api/player"
import scheduleApi from "@/api/schedule"
import matchApi from "@/api/match"
import { GiBasketballJersey, GiWhistle } from "react-icons/gi"
import { useToasts } from "@/hooks/providers/ToastProvider"
import RemoveConfirmDialog from "@/components/ui/RemoveConfirmDialog"
import Link from "next/link"
import { LuEye } from "react-icons/lu"
import { useRouter } from "next/navigation"

export default function TeamDashboard() {
  const [team, setTeam] = useState({
    teamId: "",
    teamName: "",
    status: -1,
    createAt: "",
    coaches: [],
    managers: [],
    players: []
  })
  const [isAddPlayerModalOpen, setIsAddPlayerModalOpen] = useState(false)
  const [selectedPlayers, setSelectedPlayers] = useState([])
  const [trainingSessionsData, setTrainingSessionsData] = useState([])
  const [matchesData, setMatchesData] = useState([])
  const [nonTeamPlayers, setNonTeamPlayers] = useState([])
  const { user, userInfo } = useAuth();
  const { addToast } = useToasts();
  const [isNewPlayersAdded, setIsNewPlayersAdded] = useState(false)
  const [isResultModalOpen, setIsResultModalOpen] = useState(false)
  const [addResults, setAddResults] = useState([])
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deletePlayerName, setDeletePlayerName] = useState(null)
  const [deletePlayerId, setDeletePlayerId] = useState(null)
  const router = useRouter();

  useEffect(() => {
    if (!userInfo?.roleInformation?.teamId) return
    fetchTeam();
    fetchNonTeamPlayers();
    fetchTodayTrainingSession();
    fetchTodayMatches();
  }, [userInfo?.roleInformation?.teamId]);

  useEffect(() => {
    fetchNonTeamPlayers();
  }, [isNewPlayersAdded]);

  const fetchTeam = async () => {
    try {
      const response = await teamApi.teamDetail(userInfo?.roleInformation.teamId);
      setTeam(response?.data.data);
    } catch (error) {
      console.error("Error fetching team:", error)
      if (error?.response?.data.status === 401) {
        addToast({ message: error?.response?.data.Message, type: "error" });
        router.refresh();
      }
    }
  }

  const fetchNonTeamPlayers = async () => {
    try {
      const data = {
        OnlyNoTeam: true
      }
      const response = await playerApi.getNonTeamPlayers(data);
      setNonTeamPlayers(response?.data.data.items);
    } catch (error) {
      console.error("Error fetching non-team players:", error)
      if (error?.response?.data.status === 401) {
        addToast({ message: error?.response?.data.Message, type: "error" });
      }
    }
  }

  const fetchTodayTrainingSession = async () => {
    try {
      const data = {
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date().toISOString().split("T")[0],
        teamId: userInfo?.roleInformation.teamId
      }
      const response = await scheduleApi.getTrainingSessions(data);
      setTrainingSessionsData(response?.data.data);
    } catch (error) {
      console.error("Error fetching tody training session:", error)
      if (error?.response?.data.status === 401) {
        addToast({ message: error?.response?.data.Message, type: "error" });
      }
    }
  }

  const fetchTodayMatches = async () => {
    try {
      const data = {
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date().toISOString().split("T")[0],
        teamId: userInfo?.roleInformation.teamId
      }
      const response = await matchApi.getMatch(data);
      setMatchesData(response?.data.data);
    } catch (error) {
      console.error("Error fetching today matches:", error)
      if (error?.response?.data.status === 401) {
        addToast({ message: error?.response?.data.Message, type: "error" });
      }
    }
  }

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
  const handleAddPlayersToTeam = async () => {
    const data = selectedPlayers.map((userId) => userId)
    try {
      const response = await playerApi.addToTeam(userInfo?.roleInformation.teamId, data);
      setAddResults(response?.data.data || []);
      addToast({ message: response?.data.message, type: response?.data.status });
      setIsResultModalOpen(true);
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


    } catch (error) {
      console.error("Error adding players to team:", error)
      addToast({ message: "Lỗi khi thêm người cho team", type: "error" });
    } finally {
      setIsAddPlayerModalOpen(false)
      setSelectedPlayers([])
    }
  }

  // Remove player from team
  const handleRemovePlayer = async (userId) => {
    try {
      const response = await teamApi.removePlayer(userInfo?.roleInformation.teamId, [userId]);
      addToast({ message: response?.data.message, type: response?.data.status });
      setTeam({
        ...team,
        players: team.players.filter((player) => player.userId !== userId),
      })
      setIsDeleteModalOpen(false)
      setDeletePlayerId(null)
      setDeletePlayerName(null)
    } catch (error) {
      console.error("Error removing player:", error);

      if (error?.response?.data.status === 401) {
        addToast({ message: error?.response?.data.Message, type: "error" });
      }
    }
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
            className={`px-3 py-1 ${team.status === 1 ? "bg-green-100 text-green-800" : team.status === 0 ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"}`}
          >
            {team.status === 1 ? "Đang hoạt động" : team.status === 0 ? "Không hoạt động" : "Chưa có đội"}
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
                      <h3 className="font-medium">{session.courtName} - {session.courtAddress}</h3>
                      <Link href={`/training-sessions/${session.trainingSessionId}`} className="text-[#BD2427] hover:text-[#9a1e20]">
                        <Badge variant={"outline"}>
                          <LuEye className="h-4 w-4 mr-1" /> Chi tiết
                        </Badge>
                      </Link>
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
              Trận đấu hôm nay
            </CardTitle>
            <CardDescription>Các trận đấu đã lên lịch cho đội hôm nay</CardDescription>
          </CardHeader>
          <CardContent>
            {matchesData.length > 0 ? (
              <div className="space-y-4">
                {matchesData.map((match) => (
                  <div key={match.matchId} className="flex flex-col p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{match.matchName}</h3>
                      <Link href={`/matches/${match.matchId}`} className="text-[#BD2427] hover:text-[#9a1e20]">
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                          <LuEye className="h-4 w-4 mr-1" /> Chi tiết
                        </Badge>
                      </Link>
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
                      <span>{match.courtName} - {match.courtAddress}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">Không có trận đấu nào hôm nay.</div>
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
              <TabsTrigger value="coaches" >
                <GiWhistle className="h-4 w-4" />
                HLV
              </TabsTrigger>
              <TabsTrigger value="managers">
                <Users className="h-4 w-4" />
                Quản lý
              </TabsTrigger>
              <TabsTrigger value="players">
                <GiBasketballJersey className="h-4 w-4" />
                Cầu thủ
              </TabsTrigger>
            </TabsList>

            {/* Coaches Tab */}
            <TabsContent value="coaches">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Số điện thoại</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {team?.coaches.map((coach) => (
                    <TableRow key={coach.userId}>
                      <TableCell className="font-medium">{coach.coachName}</TableCell>
                      <TableCell>{coach.coachEmail || "N/A"}</TableCell>
                      <TableCell>{coach.coachPhone || "N/A"}</TableCell>
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
                    <TableHead>Email</TableHead>
                    <TableHead>Số điện thoại</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {team.managers.map((manager) => (
                    <TableRow key={manager.userId}>
                      <TableCell className="font-medium">{manager.managerName}</TableCell>
                      <TableCell>{manager.managerEmail || "N/A"}</TableCell>
                      <TableCell>{manager.managerPhone || "N/A"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            {/* Players Tab */}
            <TabsContent value="players">
              {user?.roleCode === "Manager" && <div className="flex justify-end mb-4">
                <Button
                  onClick={() => setIsAddPlayerModalOpen(true)}
                  className="bg-[#BD2427] hover:bg-[#9a1e20] text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm cầu thủ
                </Button>
              </div>}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Vị trí</TableHead>
                    <TableHead>Ngày sinh</TableHead>
                    <TableHead>Số điện thoại</TableHead>
                    <TableHead>Ngày tham gia</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {team.players.map((player) => (
                    <TableRow key={player.userId}>
                      <TableCell className="font-medium">{player.fullname}</TableCell>
                      <TableCell>{player.email || "N/A"}</TableCell>
                      <TableCell>{player.position || "N/A"}</TableCell>
                      <TableCell>{player.dateOfBirth || "N/A"}</TableCell>
                      <TableCell>{player.phone || "N/A"}</TableCell>
                      <TableCell>{formatDate(player.clubJoinDate)}</TableCell>
                      <TableCell className="text-right">
                        {(user?.roleCode === "Manager" || user?.roleCode === "Coach") &&
                          <div>
                            <Button className="text-[#BD2427] bg-white hover:bg-gray-200 border border-[#BD2427]" asChild>
                              <Link href={`/dashboard/player-management/${player.userId}`}><LuEye className="mr-2" />Chi tiết</Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setDeletePlayerName(player.fullname)
                                setDeletePlayerId(player.userId)
                                setIsDeleteModalOpen(true)
                              }}
                              className="text-[#BD2427] hover:text-[#9a1e20] hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        }
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {nonTeamPlayers.map((player) => {

                  return (
                    <TableRow key={player.userId}>
                      <TableCell>
                        <Checkbox
                          checked={selectedPlayers.includes(player.userId)}
                          onCheckedChange={() => handlePlayerSelection(player.userId)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{player.fullname}</TableCell>
                      <TableCell>{player.email || "N/A"}</TableCell>
                      <TableCell>{player.phone || "N/A"}</TableCell>
                      <TableCell>{player.position || "N/A"}</TableCell>
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

      {/* Results Modal */}
      <Dialog open={isResultModalOpen} onOpenChange={setIsResultModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Thêm thêm cầu thủ</DialogTitle>
            <DialogDescription>Kết quả thêm cầu thủ vào {team.teamName}</DialogDescription>
          </DialogHeader>

          <div className="max-h-[60vh] overflow-y-auto">
            <div className="space-y-3 py-2">
              {addResults.map((result, index) => (
                <div
                  key={index}
                  className={`flex items-start p-3 rounded-md ${result.success ? "bg-green-50" : "bg-red-50"}`}
                >
                  {result.success ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      {nonTeamPlayers.find((p) => p.userId === result.playerId)?.fullname}
                    </div>
                    <div className={`text-sm ${result.success ? "text-green-700" : "text-red-700"}`}>
                      {result.message}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button onClick={() => {
              setIsNewPlayersAdded((prev) => !prev)
              setIsResultModalOpen(false)
            }} className="bg-[#BD2427] hover:bg-[#9a1e20] text-white">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {deletePlayerId && deletePlayerName
        && <RemoveConfirmDialog deleteConfirmOpen={isDeleteModalOpen}
          onClose={() => {
            setDeletePlayerId(null)
            setDeletePlayerName(null)
            setIsDeleteModalOpen(false)
          }}
          onConfirm={handleRemovePlayer}
          context={deletePlayerName + " khỏi đội " + team.teamName}
          deletedId={deletePlayerId}
        />
      }
    </div>
  )
}