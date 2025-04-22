"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { CalendarDays, MapPin, Trophy, Edit, Power } from "lucide-react";
import { Input } from "@/components/ui/Input";
import PlayerList from "./PlayerList";
import ManagerList from "./ManagerList";
import CoachList from "./CoachList";
import teamApi from "@/api/team";
import { useToasts } from "@/hooks/providers/ToastProvider";
import RemoveConfirmDialog from "../ui/RemoveConfirmDialog";

export default function TeamDetails({onRemoveMember}) {
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelelectedTeamId] = useState();
  const [selectedTeam, setSelectedTeam] = useState();
  const [showPlayers, setShowPlayers] = useState(false);
  const [showManagers, setShowManagers] = useState(false);
  const [showCoaches, setShowCoaches] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [deletedId, setDeletedId] = useState(null);
  const [context, setContext] = useState("");
  const {addToast} = useToasts();

  const fetchTeams = async () => {
    try {
      const response = await teamApi.listTeams({pageSize: 100, status: 1});
      
      setTeams(response?.data.data.items);

    } catch (error) {
      console.error("Error fetching teams:", error);
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
    }
  }, [selectedTeamId]);

  useEffect(() => {
    fetchTeams();
  }, []);



  const handleEditName = (team) => {
    setEditedName(team.teamName);
    setIsEditing(true);
  };

  const submitName = async () => {
    try {
      const data = {
        teamName: editedName,
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
    setSelectedTeam({ ...selectedTeam, teamName: editedName });
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
    setIsEditing(false);
  };

  const handleRemoveMember = async (userId) => {
    if (!deletedId) return;
    if (!context) return;
    
    try {
      if (context.startsWith("cầu thủ")) {
        await teamApi.removePlayer(selectedTeam.teamId, [userId]);
      }
      else if (context.startsWith("quản lý")) {
        await teamApi.removeManager(selectedTeam.teamId, [userId]);
      }
      else if (context.startsWith("huấn luyện viên")) {
        await teamApi.removeCoach(selectedTeam.teamId, [userId]);
      }
    } catch (error) {
      console.error("Error removing member:", error);
    }
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
                      <CardDescription>Thành lập năm {team.foundedYear}</CardDescription>
                    </>
                  )}
                </div>
                <div className="flex gap-2 mt-2 sm:mt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => handleEditName(team)}
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
                {/* Thành tích */}
                <Card className="border-t-2 border-t-[#BD2427]">
                  <CardHeader className="pb-2">
                    <div className="flex items-center">
                      <Trophy className="w-5 h-5 mr-2 text-[#BD2427]" />
                      <CardTitle className="text-lg">Thành Tích</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {team.achievements && team.achievements.length > 0 ? (
                      <ul className="list-disc pl-5 space-y-1">
                        {team.achievements.map((achievement, index) => (
                          <li key={index}>{achievement}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground">Chưa có thành tích</p>
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

      {deletedId && <RemoveConfirmDialog onClose={() => {
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