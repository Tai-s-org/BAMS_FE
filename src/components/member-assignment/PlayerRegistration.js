"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Checkbox } from "@/components/ui/Checkbox"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import toast from "@/components/ui/toast/ToastItem"
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
import Link from "next/link"
import { useToasts } from "@/hooks/providers/ToastProvider"

// Update the mock data to include avatar URLs and date of birth
const pendingRegistrations = [
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
    status: "pending",
    avatar: "/placeholder.svg?height=40&width=40",
    clubReason: "Tôi chọn câu lạc bộ này vì có đội ngũ huấn luyện viên giỏi và cơ sở vật chất hiện đại.",
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
    status: "pending",
    avatar: "/placeholder.svg?height=40&width=40",
    clubReason: "Tôi muốn phát triển kỹ năng cùng với những cầu thủ giỏi trong câu lạc bộ này.",
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
    status: "pending",
    avatar: "/placeholder.svg?height=40&width=40",
    clubReason: "Tôi thích phong cách huấn luyện và triết lý chơi bóng của câu lạc bộ.",
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
    status: "pending",
    avatar: "/placeholder.svg?height=40&width=40",
    clubReason: "Tôi muốn tham gia câu lạc bộ này để chuẩn bị cho sự nghiệp chuyên nghiệp.",
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
    status: "pending",
    avatar: "/placeholder.svg?height=40&width=40",
    clubReason: "Tôi ngưỡng mộ lịch sử và thành tích của câu lạc bộ này.",
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
    name: "Diana Taurasi",
    age: 15,
    gender: "Nữ",
    dateOfBirth: "1991-06-11",
    email: "diana@example.com",
    phone: "555-111-2222",
    experience: "3 năm thi đấu tại giải nữ. Từng đạt danh hiệu cầu thủ triển vọng.",
    position: "Hậu vệ",
    status: "pending",
    avatar: "/placeholder.svg?height=40&width=40",
    clubReason: "Tôi muốn tham gia câu lạc bộ có chương trình phát triển bóng rổ nữ tốt.",
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
    id: 7,
    name: "Sue Bird",
    age: 16,
    gender: "Nữ",
    dateOfBirth: "1990-10-16",
    email: "sue@example.com",
    phone: "555-333-4444",
    experience: "4 năm thi đấu. Chuyên về chuyền bóng và điều phối tấn công.",
    position: "Hậu vệ",
    status: "pending",
    avatar: "/placeholder.svg?height=40&width=40",
    clubReason: "Tôi thích cách câu lạc bộ này phát triển kỹ năng cho các cầu thủ trẻ.",
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

export default function PlayerRegistrations() {
  const [registrations, setRegistrations] = useState(pendingRegistrations)
  const [selectedPlayers, setSelectedPlayers] = useState([])
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const { addToast } = useToasts();

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedPlayers(registrations.map((player) => player.id))
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

  const handleApprove = () => {
    if (selectedPlayers.length === 0) {
      addToast({ message: "Vui lòng chọn ít nhất một cầu thủ để phê duyệt.", type: "error" });
      return
    }

    // Update the status of selected players to "approved"
    const updatedRegistrations = registrations.map((player) => {
      if (selectedPlayers.includes(player.id)) {
        return { ...player, status: "approved" }
      }
      return player
    })

    setRegistrations(updatedRegistrations)
    setSelectedPlayers([])
    addToast({ message: `Đã phê duyệt thành công ${selectedPlayers.length} cầu thủ.`, type: "success" });
  }

  const handleReject = () => {
    if (selectedPlayers.length === 0) {
      toast({
        title: "Không có cầu thủ nào được chọn",
        message: "Vui lòng chọn ít nhất một cầu thủ để từ chối.",
        type: "error",
      })
      return
    }

    // Remove rejected players from the list
    const updatedRegistrations = registrations.filter((player) => !selectedPlayers.includes(player.id))

    setRegistrations(updatedRegistrations)
    setSelectedPlayers([])
    setIsRejectDialogOpen(false)

    toast({
      title: "Đã từ chối cầu thủ",
      message: `Đã từ chối ${selectedPlayers.length} đăng ký cầu thủ.`,
      type: "warning",
    })
  }

  return (
    <Card className="border-t-4 border-t-[#BD2427]">
      <CardHeader className="bg-gray-50">
        <CardTitle className="text-[#BD2427]">Đăng Ký Cầu Thủ Đang Chờ</CardTitle>
        <CardDescription>Xem xét và quản lý các yêu cầu đăng ký cầu thủ mới</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end space-x-2 mb-4 mt-4">
          <Button
            className="bg-[#BD2427] hover:bg-[#9a1e20] text-white"
            onClick={handleApprove}
            disabled={selectedPlayers.length === 0}
          >
            Phê Duyệt Đã Chọn
          </Button>

          <AlertDialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="border-[#BD2427] text-[#BD2427] hover:bg-[#BD2427]/10"
                disabled={selectedPlayers.length === 0}
              >
                Từ Chối Đã Chọn
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Bạn có chắc không?</AlertDialogTitle>
                <AlertDialogDescription>
                  Hành động này sẽ từ chối vĩnh viễn {selectedPlayers.length} đăng ký cầu thủ.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction className="bg-[#BD2427] hover:bg-[#9a1e20]" onClick={handleReject}>
                  Xác Nhận
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="rounded-md border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedPlayers.length === registrations.length && registrations.length > 0}
                    onCheckedChange={handleSelectAll}
                    aria-label="Chọn tất cả cầu thủ"
                  />
                </TableHead>
                <TableHead className="w-14">Ảnh</TableHead>
                <TableHead>Tên</TableHead>
                <TableHead>Tuổi</TableHead>
                <TableHead>Giới tính</TableHead>
                <TableHead className="hidden md:table-cell">Liên Hệ</TableHead>
                <TableHead className="hidden md:table-cell">Kinh Nghiệm</TableHead>
                <TableHead className="hidden lg:table-cell">Vị Trí</TableHead>
                <TableHead>Trạng Thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registrations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-6 text-muted-foreground">
                    Không tìm thấy đăng ký đang chờ
                  </TableCell>
                </TableRow>
              ) : (
                registrations.map((player) => (
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
                      <Link href={`member-assignment/player/${player.id}?type=registration`} className="text-[#BD2427] hover:underline">
                        {player.name}
                      </Link>
                    </TableCell>
                    <TableCell>{player.age}</TableCell>
                    <TableCell>{player.gender}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div>{player.email}</div>
                      <div className="text-muted-foreground">{player.phone}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{player.experience}</TableCell>
                    <TableCell className="hidden lg:table-cell">{player.position}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          player.status === "approved"
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-[#BD2427]/10 text-[#BD2427] hover:bg-[#BD2427]/20"
                        }
                      >
                        {player.status === "approved" ? "Đã Duyệt" : "Đang Chờ"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}