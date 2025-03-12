"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { CalendarDays, MapPin, Trophy, Edit, Power } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
// import { toast } from "@/components/ui/use-toast";
import PlayerList from "./PlayerList";
import ManagerList from "./ManagerList";
import CoachList from "./CoachList";

// Mock data - in a real app, this would come from an API or database
const teamsData = [
  {
    teamId: "1",
    teamName: "Rồng Đỏ",
    status: 1, // 1: active, 0: inactive
    logo: "/placeholder.svg?height=80&width=80",
    foundedYear: 2018,
    achievements: ["Vô địch giải đấu khu vực 2023", "Á quân giải đấu quốc gia 2022", "Hạng 3 giải đấu thành phố 2021"],
    upcomingMatch: {
      opponent: "Sags",
      date: "15 Tháng 3, 2025",
      time: "19:00",
      location: "Sân Trung Tâm",
      locationAddress: "123 Đường Thể Thao, TP Bóng Rổ",
    },
    coaches: [
      {
        userId: "3",
        teamId: null,
        coachName: "Nguyễn Văn Minh",
        createdByPresidentId: null,
        bio: "Cựu cầu thủ chuyên nghiệp với 10 năm kinh nghiệm huấn luyện",
        contractStartDate: "2025-03-01",
        contractEndDate: "2026-03-01",
      },
      {
        userId: "550e8400-e29b-41d4-a716-446655440002",
        teamId: null,
        coachName: "Nguyễn Hoàng",
        createdByPresidentId: null,
        bio: "Chuyên về phát triển cầu thủ và chiến thuật tấn công",
        contractStartDate: "2025-03-01",
        contractEndDate: "2026-03-01",
      },
    ],
    managers: [
      {
        userId: "550e8400-e29b-41d4-a716-446655440000",
        teamId: null,
        managerName: "Trần Văn Hiệp",
        bankName: "Ngân hàng Thành phố",
        bankAccountNumber: "123456789",
      },
      {
        userId: "6",
        teamId: null,
        managerName: "Lê Văn Tùng",
        bankName: "Ngân hàng Quốc gia",
        bankAccountNumber: "987654321",
      },
      {
        userId: "7",
        teamId: null,
        managerName: "Hiếu Quản lý",
        bankName: "Ngân hàng Toàn cầu",
        bankAccountNumber: "456789123",
      },
    ],
    players: [
      {
        userId: "550e8400-e29b-41d4-a716-556655440001",
        teamId: null,
        playerName: "Trần Văn Hiệp",
        weight: 78,
        height: 180,
        position: "Hậu vệ dẫn bóng",
        shirtNumber: 10,
        relationshipWithParent: "Con",
        clubJoinDate: "2025-03-01",
      },
      {
        userId: "6ae352ba4d354703a34dbac51d6f8f5a",
        teamId: null,
        playerName: "Anh Hoàng Tuấn",
        weight: 82,
        height: 185,
        position: "Hậu vệ ném rổ",
        shirtNumber: 7,
        relationshipWithParent: "Con",
        clubJoinDate: "2025-03-05",
      },
    ],
  },
  {
    teamId: "2",
    teamName: "Phượng Hoàng",
    status: 1, // 1: active, 0: inactive
    logo: "/placeholder.svg?height=80&width=80",
    foundedYear: 2015,
    achievements: ["Vô địch giải đấu thành phố 2023", "Vô địch giải đấu khu vực 2022", "Á quân giải đấu quốc gia 2021"],
    upcomingMatch: null, // Không có trận đấu sắp tới
    coaches: [
      {
        userId: "4",
        teamId: null,
        coachName: "Nguyễn Thị Hương",
        createdByPresidentId: null,
        bio: "Cựu vận động viên Olympic với phương pháp huấn luyện sáng tạo",
        contractStartDate: "2024-09-01",
        contractEndDate: "2026-09-01",
      },
    ],
    managers: [
      {
        userId: "8",
        teamId: null,
        managerName: "Đặng Minh Tuấn",
        bankName: "Ngân hàng Metro",
        bankAccountNumber: "246813579",
      },
      {
        userId: "9",
        teamId: null,
        managerName: "Lê Thị Hà",
        bankName: "Ngân hàng Đầu tiên",
        bankAccountNumber: "135792468",
      },
    ],
    players: [
      {
        userId: "10",
        teamId: null,
        playerName: "Lê Minh Đức",
        weight: 90,
        height: 195,
        position: "Trung phong",
        shirtNumber: 23,
        relationshipWithParent: "Con",
        clubJoinDate: "2024-11-15",
      },
      {
        userId: "11",
        teamId: null,
        playerName: "Nguyễn Văn Tâm",
        weight: 85,
        height: 188,
        position: "Tiền phong mạnh",
        shirtNumber: 34,
        relationshipWithParent: "Con",
        clubJoinDate: "2024-12-01",
      },
      {
        userId: "12",
        teamId: null,
        playerName: "Trần Minh Quân",
        weight: 80,
        height: 183,
        position: "Tiền phong nhỏ",
        shirtNumber: 8,
        relationshipWithParent: "Con",
        clubJoinDate: "2025-01-10",
      },
    ],
  },
  {
    teamId: "3",
    teamName: "Sói Xám",
    status: 0, // 1: active, 0: inactive (đội này đang bị vô hiệu hóa)
    logo: "/placeholder.svg?height=80&width=80",
    foundedYear: 2019,
    achievements: ["Á quân giải đấu thành phố 2022", "Hạng 3 giải đấu khu vực 2021"],
    upcomingMatch: null,
    coaches: [],
    managers: [],
    players: [],
  },
];

export default function TeamDetails() {
  const [teams, setTeams] = useState(teamsData);
  const [selectedTeam, setSelectedTeam] = useState(teams[0]);
  const [showPlayers, setShowPlayers] = useState(false);
  const [showManagers, setShowManagers] = useState(false);
  const [showCoaches, setShowCoaches] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");

  const handleEditName = (team) => {
    setEditedName(team.teamName);
    setIsEditing(true);
  };

  const handleSaveName = () => {
    if (!editedName.trim()) {
      toast({
        title: "Lỗi",
        description: "Tên đội không được để trống",
        variant: "destructive",
      });
      return;
    }

    const updatedTeams = teams.map((team) =>
      team.teamId === selectedTeam.teamId ? { ...team, teamName: editedName } : team
    );

    setTeams(updatedTeams);
    setSelectedTeam({ ...selectedTeam, teamName: editedName });
    setIsEditing(false);

    toast({
      title: "Thành công",
      description: "Đã cập nhật tên đội",
    });
  };

  const handleToggleStatus = (team) => {
    const newStatus = team.status === 1 ? 0 : 1;

    const updatedTeams = teams.map((t) => (t.teamId === team.teamId ? { ...t, status: newStatus } : t));

    setTeams(updatedTeams);
    setSelectedTeam({ ...selectedTeam, status: newStatus });

    toast({
      title: "Thành công",
      description: newStatus === 1 ? "Đã kích hoạt đội" : "Đã vô hiệu hóa đội",
    });
  };

  const handleSelectTeam = (team) => {
    setSelectedTeam(team);
    setShowPlayers(false);
    setShowManagers(false);
    setShowCoaches(false);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue={teams[0].teamId.toString()} className="w-full">
        <TabsList className="w-full justify-start overflow-auto">
          {teams.map((team) => (
            <TabsTrigger
              key={team.teamId}
              value={team.teamId.toString()}
              onClick={() => handleSelectTeam(team)}
              className={team.status === 0 ? "opacity-60" : ""}
            >
              {team.teamName}
              {team.status === 0 && (
                <Badge variant="outline" className="ml-2 text-xs">
                  Vô hiệu
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {teams.map((team) => (
          <TabsContent key={team.teamId} value={team.teamId.toString()}>
            <Card>
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <img
                  src={team.logo || "/placeholder.svg"}
                  alt={`Logo ${team.teamName}`}
                  className="w-16 h-16 rounded-full border"
                />
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
                        {team.status === 0 && (
                          <Badge variant="outline" className="text-xs">
                            Đã vô hiệu hóa
                          </Badge>
                        )}
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
                    variant={team.status === 1 ? "destructive" : "default"}
                    size="sm"
                    className={team.status === 1 ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
                    onClick={() => handleToggleStatus(team)}
                  >
                    <Power className="h-4 w-4 mr-1" />
                    {team.status === 1 ? "Vô hiệu hóa" : "Kích hoạt"}
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

                {showPlayers && <PlayerList players={selectedTeam.players} />}
                {showManagers && <ManagerList managers={selectedTeam.managers} />}
                {showCoaches && <CoachList coaches={selectedTeam.coaches} />}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}