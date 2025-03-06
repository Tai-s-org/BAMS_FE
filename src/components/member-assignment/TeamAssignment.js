"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Checkbox } from "@/components/ui/Checkbox"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import toast from "@/components/ui/toast/ToastItem"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"

// Update the mock data to include avatar URLs and date of birth
const approvedPlayers = [
  {
    id: 1,
    name: "Michael Jordan",
    age: 16,
    gender: "Nam",
    dateOfBirth: "1990-05-15",
    email: "michael@example.com",
    phone: "555-123-4567",
    experience: "3 năm thi đấu tại giải trẻ thành phố. Từng đạt giải nhất U14.",
    position: "Hậu vệ",
    team: null,
    avatar: "/placeholder.svg?height=40&width=40",
    guardians: [
      {
        id: "g1",
        name: "John Jordan",
        relationship: "Cha",
        email: "john@example.com",
        phone: "555-111-2222",
      },
    ],
  },
  {
    id: 2,
    name: "LeBron James",
    age: 15,
    gender: "Nam",
    dateOfBirth: "1991-08-20",
    email: "lebron@example.com",
    phone: "555-987-6543",
    experience: "4 năm thi đấu tại trường học. Đội trưởng đội bóng rổ trường.",
    position: "Tiền đạo",
    team: "Lakers",
    avatar: "/placeholder.svg?height=40&width=40",
    guardians: [
      {
        id: "g2",
        name: "Gloria James",
        relationship: "Mẹ",
        email: "gloria@example.com",
        phone: "555-333-4444",
      },
    ],
  },
  {
    id: 3,
    name: "Stephen Curry",
    age: 14,
    gender: "Nam",
    dateOfBirth: "1992-03-10",
    email: "stephen@example.com",
    phone: "555-456-7890",
    experience: "2 năm thi đấu tại câu lạc bộ trước đó. Chuyên về ném 3 điểm.",
    position: "Hậu vệ",
    team: null,
    avatar: "/placeholder.svg?height=40&width=40",
    guardians: [
      {
        id: "g3",
        name: "Dell Curry",
        relationship: "Cha",
        email: "dell@example.com",
        phone: "555-555-6666",
      },
      {
        id: "g4",
        name: "Sonya Curry",
        relationship: "Mẹ",
        email: "sonya@example.com",
        phone: "555-777-8888",
      },
    ],
  },
  {
    id: 4,
    name: "Kevin Durant",
    age: 17,
    gender: "Nam",
    dateOfBirth: "1989-09-29",
    email: "kevin@example.com",
    phone: "555-789-0123",
    experience: "5 năm thi đấu tại nhiều câu lạc bộ. Từng đạt giải thưởng cầu thủ xuất sắc.",
    position: "Tiền đạo",
    team: "Warriors",
    avatar: "/placeholder.svg?height=40&width=40",
    guardians: [
      {
        id: "g5",
        name: "Wayne Durant",
        relationship: "Cha",
        email: "wayne@example.com",
        phone: "555-999-0000",
      },
    ],
  },
  {
    id: 5,
    name: "Kobe Bryant",
    age: 16,
    gender: "Nam",
    dateOfBirth: "1990-12-05",
    email: "kobe@example.com",
    phone: "555-321-6547",
    experience: "4 năm thi đấu. Chuyên về kỹ thuật dứt điểm và phòng thủ.",
    position: "Hậu vệ",
    team: null,
    avatar: "/placeholder.svg?height=40&width=40",
    guardians: [
      {
        id: "g6",
        name: "Joe Bryant",
        relationship: "Cha",
        email: "joe@example.com",
        phone: "555-123-7890",
      },
    ],
  },
  {
    id: 6,
    name: "Giannis Antetokounmpo",
    age: 17,
    gender: "Nam",
    dateOfBirth: "1989-12-06",
    email: "giannis@example.com",
    phone: "555-654-3210",
    experience: "3 năm thi đấu. Chuyên về tấn công và phòng ngự đa năng.",
    position: "Tiền đạo",
    team: null,
    avatar: "/placeholder.svg?height=40&width=40",
    guardians: [
      {
        id: "g9",
        name: "Charles Antetokounmpo",
        relationship: "Cha",
        email: "charles@example.com",
        phone: "555-111-3333",
      },
    ],
  },
  {
    id: 7,
    name: "Diana Taurasi",
    age: 15,
    gender: "Nữ",
    dateOfBirth: "1991-06-11",
    email: "diana@example.com",
    phone: "555-111-2222",
    experience: "3 năm thi đấu tại giải nữ. Từng đạt danh hiệu cầu thủ triển vọng.",
    position: "Hậu vệ",
    team: "Mercury",
    avatar: "/placeholder.svg?height=40&width=40",
    guardians: [
      {
        id: "g7",
        name: "Mario Taurasi",
        relationship: "Cha",
        email: "mario@example.com",
        phone: "555-444-5555",
      },
    ],
  },
  {
    id: 8,
    name: "Sue Bird",
    age: 16,
    gender: "Nữ",
    dateOfBirth: "1990-10-16",
    email: "sue@example.com",
    phone: "555-333-4444",
    experience: "4 năm thi đấu. Chuyên về chuyền bóng và điều phối tấn công.",
    position: "Hậu vệ",
    team: null,
    avatar: "/placeholder.svg?height=40&width=40",
    guardians: [
      {
        id: "g8",
        name: "Nancy Bird",
        relationship: "Mẹ",
        email: "nancy@example.com",
        phone: "555-666-7777",
      },
    ],
  },
]

// Mock data for available teams
const availableTeams = [
  { id: 1, name: "Lakers" },
  { id: 2, name: "Warriors" },
  { id: 3, name: "Bulls" },
  { id: 4, name: "Celtics" },
  { id: 5, name: "Heat" },
  { id: 6, name: "Mercury" },
  { id: 7, name: "Storm" },
]

export default function TeamAssignments() {
  const [players, setPlayers] = useState(approvedPlayers)
  const [selectedPlayers, setSelectedPlayers] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState(null)

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedPlayers(players.map((player) => player.id))
    } else {
      setSelectedPlayers([])
    }
  }

  const handleSelectPlayer = (playerId, checked) => {
    if (checked) {
      setSelectedPlayers([...selectedPlayers, playerId])
    } else {
      setSelectedPlayers(selectedPlayers.filter((id) => id !== playerId))
    }
  }

  const handleOpenDialog = () => {
    if (selectedPlayers.length === 0) {
      toast({
        title: "Không có cầu thủ nào được chọn",
        message: "Vui lòng chọn ít nhất một cầu thủ để phân công vào đội.",
        type: "error",
      })
      return
    }

    setIsDialogOpen(true)
  }

  const handleAssignTeam = () => {
    if (!selectedTeam) {
      toast({
        title: "Không có đội nào được chọn",
        message: "Vui lòng chọn một đội để phân công cầu thủ.",
        type: "error",
      })
      return
    }

    // Update the team assignment for selected players
    const updatedPlayers = players.map((player) => {
      if (selectedPlayers.includes(player.id)) {
        return { ...player, team: selectedTeam }
      }
      return player
    })

    setPlayers(updatedPlayers)
    setSelectedPlayers([])
    setSelectedTeam(null)
    setIsDialogOpen(false)

    toast({
      title: "Đã phân công đội",
      message: `Đã phân công thành công ${selectedPlayers.length} cầu thủ vào đội ${selectedTeam}.`,
      type: "success",
    })
  }

  return (
    <Card className="border-t-4 border-t-[#BD2427]">
      <CardHeader className="bg-gray-50">
        <CardTitle className="text-[#BD2427]">Phân Công Đội</CardTitle>
        <CardDescription>Phân công cầu thủ đã được phê duyệt vào các đội bóng rổ</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mb-4 mt-4">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-[#BD2427] hover:bg-[#9a1e20] text-white"
                onClick={handleOpenDialog}
                disabled={selectedPlayers.length === 0}
              >
                Phân Công Vào Đội
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Phân Công Cầu Thủ Vào Đội</DialogTitle>
                <DialogDescription>Chọn một đội để phân công {selectedPlayers.length} cầu thủ.</DialogDescription>
              </DialogHeader>

              <div className="py-4">
                <Select onValueChange={setSelectedTeam}>
                  <SelectTrigger className="border-[#BD2427]/20 focus:ring-[#BD2427]/20">
                    <SelectValue placeholder="Chọn một đội" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTeams.map((team) => (
                      <SelectItem key={team.id} value={team.name}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Hủy
                </Button>
                <Button className="bg-[#BD2427] hover:bg-[#9a1e20]" onClick={handleAssignTeam}>
                  Xác Nhận Phân Công
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-md border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedPlayers.length === players.length && players.length > 0}
                    onCheckedChange={handleSelectAll}
                    aria-label="Chọn tất cả cầu thủ"
                  />
                </TableHead>
                <TableHead className="w-14">Ảnh</TableHead>
                <TableHead>Tên</TableHead>
                <TableHead>Tuổi</TableHead>
                <TableHead>Giới tính</TableHead>
                <TableHead className="hidden md:table-cell">Liên Hệ</TableHead>
                <TableHead className="hidden lg:table-cell">Kinh Nghiệm</TableHead>
                <TableHead className="hidden lg:table-cell">Vị Trí</TableHead>
                <TableHead>Đội</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {players.map((player) => (
                <TableRow key={player.id} className="hover:bg-gray-50">
                  <TableCell>
                    <Checkbox
                      checked={selectedPlayers.includes(player.id)}
                      onCheckedChange={(checked) => handleSelectPlayer(player.id, !!checked)}
                      aria-label={`Chọn ${player.name}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <img
                        src={player.avatar || "/placeholder.svg"}
                        alt={player.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    <a href={`member-assignment/player/${player.id}?type=team`} className="text-[#BD2427] hover:underline">
                      {player.name}
                    </a>
                  </TableCell>
                  <TableCell>{player.age}</TableCell>
                  <TableCell>{player.gender}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div>{player.email}</div>
                    <div className="text-muted-foreground">{player.phone}</div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">{player.experience}</TableCell>
                  <TableCell className="hidden lg:table-cell">{player.position}</TableCell>
                  <TableCell>
                    {player.team ? (
                      <Badge className="bg-[#BD2427]/10 text-[#BD2427] border-[#BD2427]/20">{player.team}</Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">
                        Chưa Phân Công
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}