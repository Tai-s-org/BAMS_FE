"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { CalendarDays, MapPin, Trophy, Edit, Power, User, Wallet } from "lucide-react";
import { Input } from "@/components/ui/Input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/Radio-group";
import PlayerList from "./PlayerList";
import ManagerList from "./ManagerList";
import CoachList from "./CoachList";
import teamApi from "@/api/team";
import { useToasts } from "@/hooks/providers/ToastProvider";
import matchApi from "@/api/match";
import { Badge } from "../ui/Badge";
import { Label } from "../ui/Label";
import RemoveMemberConfirmDialog from "./RemoveConfirm";

export default function TeamDetails() {
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelelectedTeamId] = useState();
  const [selectedTeam, setSelectedTeam] = useState({
    fundManagerId: null,
    fundManagerName: null,
    managers: [],
  });
  const [showPlayers, setShowPlayers] = useState(false);
  const [showManagers, setShowManagers] = useState(false);
  const [showCoaches, setShowCoaches] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [deletedId, setDeletedId] = useState(null);
  const [context, setContext] = useState("");
  const [showMonthlyMatches, setShowMonthlyMatches] = useState(false)
  const [selectedFundManager, setSelectedFundManager] = useState(
    selectedTeam.fundManagerId ? selectedTeam.fundManagerId : null,
  )
  const [editedGender, setEditedGender] = useState("")
  const [selectedFundManagerError, setSelectedFundManagerError] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [matches, setMatches] = useState([])
  const {addToast} = useToasts();

  const fetchTeams = async () => {
    try {
      const response = await teamApi.listTeams({pageSize: 100, status: 1});
      
      setTeams(response?.data.data.items);

    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  const takeWholeMonth = (date) => {
    const startDate = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split("T")[0];
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split("T")[0];
    return { startDate, endDate };
  };

  const fetchMatches = async (teamId) => {
    try {
      const { startDate, endDate } = takeWholeMonth(new Date());
      const response = await matchApi.getMatch({teamId: teamId, startDate: startDate, endDate: endDate});
      setMatches(response?.data.data || []);
    } catch (error) {
      console.error("Error fetching matches:", error);
    }
  };

  const fetchTeamDetails = async (selectedTeamId) => {
    try {
      const response = await teamApi.teamDetail(selectedTeamId);

      setSelectedTeam(response.data.data);
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  useEffect(() => {
    if (selectedTeamId) {
      fetchTeamDetails(selectedTeamId);
      fetchMatches(selectedTeamId);
    }
  }, [selectedTeamId]);

  useEffect(() => {
    fetchTeams();
  }, []);



  const handleEditName = (team) => {
    setEditedName(team.teamName.split(" ").slice(1).join(" "));
    setIsEditing(true);
  };

  const submitName = async () => {
    try {
      const data = {
        teamName: editedGender + " " + editedName,
        status: selectedTeam.status
      }
      const response = await teamApi.updateTeamName(data, selectedTeamId);
      addToast({ message: response?.data.message, type: response?.data.status });
    } catch (error) {
      console.error("Error updating team name:", error);
      addToast({ message: error?.response?.data.message, type: "error" });
    }
  };

  const handleSaveName = () => {
    if (!editedName.trim()) {
      addToast({ message: "Vui lí nhập tên đội", type: "error" });
      return;
    }

    const updatedTeams = teams.map((team) =>
      team.teamId === selectedTeam.teamId ? { ...team, teamName: editedName } : team
    );

    setTeams(updatedTeams);
    setSelectedTeam({ ...selectedTeam, teamName: editedGender + " " + editedName });
    setIsEditing(false);
    submitName();
  };

  const submitDissolve = async () => {
    try {
      const data = {
        note: "Thích - test"
      }
      const response = await teamApi.dissolveTeam(selectedTeamId, data);
      addToast({ message: response?.data.message, type: response?.data.status });
    } catch (error) {
      console.error("Error updating team name:", error);
      addToast({ message: error?.response?.data.message, type: "error" });
    }
  };

  const handleToggleStatus = (team) => {
  
    const updatedTeams = teams.filter((t) => (t.teamId != team.teamId ));

    setTeams(updatedTeams);
    submitDissolve();
    setSelectedTeam(updatedTeams[0]);
    setSelelectedTeamId(updatedTeams[0].teamId);
  };

  const handleSelectTeam = (team) => {
    setSelelectedTeamId(team.teamId);
    setShowPlayers(false);
    setShowManagers(false);
    setShowCoaches(false);
    setShowMonthlyMatches(false)
    setSelectedFundManager(team.fundManagerId ? team.fundManagerId : null)
    setIsEditing(false);
  };

  const handleChangeFundManager = async () => {
    if (!selectedFundManager) {
      setSelectedFundManagerError("Vui lòng chọn người quản lý quỹ")
      return
    } else {
      setSelectedFundManagerError(null)
    }

    const selectedManager = selectedTeam.managers.find((manager) => manager.userId === selectedFundManager)

    if (!selectedManager) {
      addToast({ message: "Người quản lý quỹ không hợp lệ", type: "error" })
      return
    }

    try {
      const response = await teamApi.updateFundManager(selectedTeam.teamId, selectedManager.userId)
      addToast({ message: response?.data.message, type: response?.data.status })
      const updatedTeams = teams.map((team) =>
        team.teamId === selectedTeam.teamId ? { ...team, fundManagerId: selectedManager.userId, fundManagerName: selectedManager.managerName } : team,
      )
  
      setTeams(updatedTeams)
      setSelectedTeam({ ...selectedTeam, fundManagerId: selectedManager.userId, fundManagerName: selectedManager.managerName })
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error updating fund manager:", error);
      addToast({ message: error?.response?.data.message, type: "error" })
    }
  }

  const handleRemoveMember = async (userId, date) => {
    if (!deletedId) return;
    if (!context) return;
    
    try {
      if (context.startsWith("cầu thủ")) {
        await teamApi.removePlayer(selectedTeam.teamId, [userId], {leftDate: format(new Date(date), "yyyy-MM-dd")});
      }
      else if (context.startsWith("quản lý")) {
        await teamApi.removeManager(selectedTeam.teamId, [userId], {leftDate: format(new Date(date), "yyyy-MM-dd")});
      }
      else if (context.startsWith("huấn luyện viên")) {
        await teamApi.removeCoach(selectedTeam.teamId, [userId], {leftDate: format(new Date(date), "yyyy-MM-dd")});
      }
    } catch (error) {
      console.error("Error removing member:", error);
    }
  }



  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":")
    return `${hours}:${minutes}`
  }

  const formatCreatedDate = (dateString) => {
    if (!dateString) return ""
    const date = dateString.split("T")[0]
    const [year, month, day] = date.split("-")
    return `${day}/${month}/${year}`
  }

  return (
    <div className="space-y-6">
      {teams.length > 0 && <Tabs className="w-full">
        <TabsList className="w-full justify-start overflow-auto bg-gray-200 p-1">
          {teams.map((team) => (
            <TabsTrigger
              key={team.teamId}
              value={team.teamId.toString()}
              onClick={() => handleSelectTeam(team)}
              className={team.teamId === selectedTeamId ? "border-2 border-red-400 bg-white p-2 rounded-md mx-1 font-bold" : "border-2 border-red-200 border-r-red-500 rounded-md opacity-60 p-2 mx-1 bg-white font-bold"}
            >
              {team.teamName}
            </TabsTrigger>
          ))}
        </TabsList>

        {teams.map((team) => (
          <TabsContent key={team.teamId} value={team.teamId.toString()}>
            <Card>
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-1">
                  {isEditing && selectedTeam.teamId === team.teamId ? (
                    <div className="flex items-center gap-2">
                    <Select
                      value={editedGender}
                      onValueChange={(value) => setEditedGender(value)}
                      required
                    >
                      <SelectTrigger className="w-28">
                        <SelectValue placeholder="Chọn" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Nam">Nam</SelectItem>
                        <SelectItem value="Nữ">Nữ</SelectItem>
                      </SelectContent>
                    </Select>
                  
                    <Input
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="max-w-xs"
                      placeholder="Nhập tên đội mới"
                    />
                    
                    <Button onClick={handleSaveName} size="sm" className="bg-[#BD2427] hover:bg-[#9a1e21]">
                      Lưu
                    </Button>
                    
                    <Button onClick={() => setIsEditing(false)} size="sm" variant="outline">
                      Hủy
                    </Button>
                  </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <CardTitle>{team.teamName}</CardTitle>
                      </div>
                      <CardDescription>Thành lập năm  {formatCreatedDate(selectedTeam.createAt)}</CardDescription>
                    </>
                  )}
                </div>
                <div className="flex gap-2 mt-2 sm:mt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => {
                      setEditedGender(team.teamName.split(" ")[0]);
                      handleEditName(team)}}
                  >
                    <Edit className="h-4 w-4" />
                    <span>Sửa tên</span>
                  </Button>
                  <Button
                    variant={"destructive"}
                    size="sm"
                    className={"bg-red-600 hover:bg-red-700"}
                    onClick={() => handleToggleStatus(team)}
                  >
                    <Power className="h-4 w-4 mr-1" />
                     Giải tán đội
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">

                <Card className="border-t-2 border-t-[#BD2427]">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Trophy className="w-5 h-5 mr-2 text-[#BD2427]" />
                        <CardTitle className="text-lg">Trận Đấu Trong Tháng</CardTitle>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowMonthlyMatches(!showMonthlyMatches)}
                        className="text-sm"
                      >
                        {showMonthlyMatches ? "Ẩn" : "Hiện"}
                      </Button>
                    </div>
                  </CardHeader>
                  {showMonthlyMatches && (
                    <CardContent>
                      {matches && matches.length > 0 ? (
                        <div className="space-y-4">
                          {matches?.map((match) => (
                            <div
                              key={match.matchId}
                              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex justify-between items-center mb-2">
                                <h3 className="font-medium">{match.matchName}</h3>
                                <Badge
                                  variant={match.status === "Đã kết thúc" ? "outline" : "default"}
                                  className={match.status === "Đã kết thúc" ? "" : "bg-green-500"}
                                >
                                  {match.status}
                                </Badge>
                              </div>
                              <div className="flex flex-col md:flex-row md:items-center justify-between">
                                <div className="space-y-1">
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <CalendarDays className="mr-1 h-4 w-4" />
                                    <span>
                                      {formatDate(match.scheduledDate)} • {formatTime(match.scheduledStartTime)} -{" "}
                                      {formatTime(match.scheduledEndTime)}
                                    </span>
                                  </div>
                                  <div className="flex items-center text-sm">
                                    <MapPin className="mr-1 h-4 w-4" />
                                    <span>{match.courtName}</span>
                                  </div>
                                </div>
                                <div className="mt-2 md:mt-0 flex items-center gap-2">
                                  <div className="text-right">
                                    <div className="font-medium">{match.homeTeamName}</div>
                                    <div className="text-xs text-muted-foreground">Chủ nhà</div>
                                  </div>
                                  <div className="bg-gray-100 px-3 py-1 rounded-md font-bold">
                                    {match.scoreHome} - {match.scoreAway}
                                  </div>
                                  <div>
                                    <div className="font-medium">{match.awayTeamName}</div>
                                    <div className="text-xs text-muted-foreground">Đội khách</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">Không có trận đấu nào trong tháng này</p>
                      )}
                    </CardContent>
                  )}
                </Card>

                {/* Người quản lý quỹ */}
                <Card className="border-t-2 border-t-[#BD2427]">
                  <CardHeader className="pb-2">
                    <div className="flex items-center">
                      <Wallet className="w-5 h-5 mr-2 text-[#BD2427]" />
                      <CardTitle className="text-lg">Người Quản Lý Quỹ</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {selectedTeam?.fundManagerId ? (
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-gray-100 rounded-full p-2">
                            <User className="h-6 w-6" />
                          </div>
                          <div>
                            <div className="font-medium">{selectedTeam?.fundManagerName}</div>
                          </div>
                        </div>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="mt-3 md:mt-0">
                              Thay đổi
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Chọn Người Quản Lý Quỹ</DialogTitle>
                              <DialogDescription>
                                Chọn một quản lý từ danh sách để giao trách nhiệm quản lý quỹ của đội.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                              <RadioGroup value={selectedFundManager || ""} onValueChange={setSelectedFundManager}>
                                {selectedTeam.managers.map((manager) => (
                                  <div key={manager.userId} className="flex items-start space-x-2 space-y-2">
                                    <RadioGroupItem value={manager.userId} id={manager.userId} />
                                    <div className="grid gap-1">
                                      <Label htmlFor={manager.userId} className="font-medium">
                                        {manager.managerName}
                                      </Label>
                                      <div className="text-sm text-muted-foreground">
                                        {manager.managerEmail} • {manager.managerPhone}
                                      </div>
                                      <div className="text-sm">
                                        {manager.bankName} • {manager.bankAccountNumber}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </RadioGroup>
                            </div>
                            <DialogFooter>
                              {selectedFundManagerError && <p className="text-red-500">{selectedFundManagerError}</p>}
                            </DialogFooter>
                            <div className="flex justify-end">
                              <Button onClick={handleChangeFundManager} className="bg-[#BD2427] hover:bg-[#9a1e21]">
                                Xác nhận
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-6">
                        <p className="text-muted-foreground mb-3">Chưa có người quản lý quỹ</p>
                        {selectedTeam?.managers?.length > 0 ? (
                          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                              <Button variant="outline">Chọn người quản lý quỹ</Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Chọn Người Quản Lý Quỹ</DialogTitle>
                                <DialogDescription>
                                  Chọn một quản lý từ danh sách để giao trách nhiệm quản lý quỹ của đội.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="py-4">
                                <RadioGroup value={selectedFundManager || ""} onValueChange={setSelectedFundManager}>
                                  {selectedTeam.managers.map((manager) => (
                                    <div key={manager.userId} className="flex items-start space-x-2 space-y-2">
                                      <RadioGroupItem value={manager.userId} id={manager.userId} />
                                      <div className="grid gap-1">
                                        <Label htmlFor={manager.userId} className="font-medium">
                                          {manager.managerName}
                                        </Label>
                                        <div className="text-sm text-muted-foreground">
                                          {manager.managerEmail} • {manager.managerPhone}
                                        </div>
                                        <div className="text-sm">
                                          {manager.bankName} • {manager.bankAccountNumber}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </RadioGroup>
                              </div>
                              <div className="flex justify-end">
                                <Button onClick={handleChangeFundManager} className="bg-[#BD2427] hover:bg-[#9a1e21]">
                                  Xác nhận
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        ) : (
                          <p className="text-sm text-muted-foreground">Không có quản lý nào trong đội</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Trận đấu sắp tới (nếu có) */}
                {team.upcomingMatch && (
                  <Card className="border-t-2 border-t-[#BD2427]">
                    <CardHeader className="pb-2">
                      <div className="flex items-center">
                        <CalendarDays className="w-5 h-5 mr-2 text-[#BD2427]" />
                        <CardTitle className="text-lg">Trận Đấu Sắp Tới</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div className="space-y-1">
                          <h3 className="text-xl font-bold">vs {team.upcomingMatch.opponent}</h3>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <CalendarDays className="mr-1 h-4 w-4" />
                            <span>
                              {team.upcomingMatch.date} lúc {team.upcomingMatch.time}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 md:mt-0 flex items-center text-sm">
                          <MapPin className="mr-1 h-4 w-4 text-[#BD2427]" />
                          <span>
                            <span className="font-medium">{team.upcomingMatch.location}</span>
                            <span className="text-muted-foreground block">{team.upcomingMatch.locationAddress}</span>
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="flex flex-wrap gap-3 pt-2">
                  <Button
                    variant={showPlayers ? "default" : "outline"}
                    className={showPlayers ? "bg-[#BD2427] hover:bg-[#9a1e21]" : ""}
                    onClick={() => setShowPlayers(!showPlayers)}
                  >
                    {showPlayers ? "Ẩn Cầu Thủ" : "Hiện Cầu Thủ"}
                  </Button>
                  <Button
                    variant={showManagers ? "default" : "outline"}
                    className={showManagers ? "bg-[#BD2427] hover:bg-[#9a1e21]" : ""}
                    onClick={() => setShowManagers(!showManagers)}
                  >
                    {showManagers ? "Ẩn Quản Lý" : "Hiện Quản Lý"}
                  </Button>
                  <Button
                    variant={showCoaches ? "default" : "outline"}
                    className={showCoaches ? "bg-[#BD2427] hover:bg-[#9a1e21]" : ""}
                    onClick={() => setShowCoaches(!showCoaches)}
                  >
                    {showCoaches ? "Ẩn HLV" : "Hiện HLV"}
                  </Button>
                </div>

                {showPlayers && <PlayerList onRemoveMember={(userId, userName) => {
                                setContext("cầu thủ "+userName);
                                setDeletedId(userId);
                                setRemoveDialogOpen(true);
                              }} players={selectedTeam.players} />}
                {showManagers && <ManagerList onRemoveMember={(userId, userName) => {
                                setContext("quản lý "+userName);
                                setDeletedId(userId);
                                setRemoveDialogOpen(true);
                              }} managers={selectedTeam.managers} />}
                {showCoaches && <CoachList onRemoveMember={(userId, userName) => {
                                setContext("huấn luyện viên "+userName);
                                setDeletedId(userId);
                                setRemoveDialogOpen(true);
                              }} coaches={selectedTeam.coaches} />}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>}

      {deletedId && <RemoveMemberConfirmDialog onClose={() => {
        setDeletedId(null);
        setContext(null);
        setRemoveDialogOpen(false)}} 
        onConfirm={handleRemoveMember} 
        deleteConfirmOpen={removeDialogOpen} 
        context={context} 
        deletedId={deletedId} />}
    </div>
  );
}