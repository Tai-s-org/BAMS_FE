"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Separator } from "@/components/ui/Seperator"
import { ArrowLeft, Mail, Phone, Trash2, User } from "lucide-react"
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

// Function to format date from YYYY-MM-DD to DD/MM/YYYY
const formatDate = (dateString) => {
  if (!dateString) return "N/A"
  const [year, month, day] = dateString.split("-")
  return `${day}/${month}/${year}`
}

export default function PlayerDetailPage({ params }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const type = searchParams.get("type") || "team" // Default to team if not specified
  const isRegistration = type === "registration"
  const param = React.use(params);

  const [player, setPlayer] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, we would fetch this data from an API
    // For this demo, we'll use the mock data from our components
    const fetchPlayer = () => {
      try {
        // Get the player data from the appropriate component
        // This is a simplified approach for the demo
        const playerId = Number.parseInt(param.id)

        // Import the mock data directly
        let playerData

        if (isRegistration) {
          // Get from pendingRegistrations in player-registrations.tsx
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
              avatar: "/placeholder.svg?height=120&width=120",
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
              avatar: "/placeholder.svg?height=120&width=120",
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
              avatar: "/placeholder.svg?height=120&width=120",
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
              avatar: "/placeholder.svg?height=120&width=120",
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
              avatar: "/placeholder.svg?height=120&width=120",
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
              avatar: "/placeholder.svg?height=120&width=120",
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
              avatar: "/placeholder.svg?height=120&width=120",
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

          playerData = pendingRegistrations.find((p) => p.id === playerId)
        } else {
          // Get from approvedPlayers in team-assignments.tsx
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
              avatar: "/placeholder.svg?height=120&width=120",
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
              avatar: "/placeholder.svg?height=120&width=120",
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
              avatar: "/placeholder.svg?height=120&width=120",
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
              avatar: "/placeholder.svg?height=120&width=120",
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
              avatar: "/placeholder.svg?height=120&width=120",
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
              avatar: "/placeholder.svg?height=120&width=120",
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
              avatar: "/placeholder.svg?height=120&width=120",
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
              avatar: "/placeholder.svg?height=120&width=120",
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

          playerData = approvedPlayers.find((p) => p.id === playerId)
        }

        if (playerData) {
          setPlayer(playerData)
        } else {
          // Player not found, redirect to home
          router.push("/")
        }
      } catch (error) {
        console.error("Error fetching player data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPlayer()
  }, [param.id, router, isRegistration])

  const handleRemoveGuardian = (guardianId) => {
    if (!player) return

    // Create updated player with guardian removed
    const updatedGuardians = player.guardians.filter((g) => g.id !== guardianId)
    setPlayer({
      ...player,
      guardians: updatedGuardians,
    })

    // In a real app, we would save this to the database
    alert(`Đã xóa thông tin người giám hộ`)
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 flex justify-center">
        <div className="animate-pulse">Đang tải thông tin cầu thủ...</div>
      </div>
    )
  }

  if (!player) {
    return (
      <div className="container mx-auto py-8 px-4 flex justify-center">
        <div>Không tìm thấy cầu thủ</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="outline" className="mb-6" onClick={() => router.push("/member-assignment")}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - Player basic info */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl text-[#BD2427]">Thông tin cầu thủ</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-[#BD2427]/20">
                <img
                  src={player.avatar || "/placeholder.svg"}
                  alt={player.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <h2 className="text-2xl font-bold">{player.name}</h2>

              <div className="flex flex-wrap justify-center gap-2 mt-2">
                <Badge>{player.position}</Badge>
                {player.team && <Badge className="bg-[#BD2427]/10 text-[#BD2427]">{player.team}</Badge>}
                {isRegistration && <Badge className="bg-[#BD2427]/10 text-[#BD2427]">Đang chờ duyệt</Badge>}
              </div>

              <div className="w-full mt-6 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div className="flex justify-between w-full">
                    <span className="text-muted-foreground">Tuổi:</span>
                    <span>{player.age}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div className="flex justify-between w-full">
                    <span className="text-muted-foreground">Ngày sinh:</span>
                    <span>{formatDate(player.dateOfBirth)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div className="flex justify-between w-full">
                    <span className="text-muted-foreground">Giới tính:</span>
                    <span>{player.gender}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div className="flex justify-between w-full">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="truncate">{player.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div className="flex justify-between w-full">
                    <span className="text-muted-foreground">Điện thoại:</span>
                    <span>{player.phone}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column - Additional info */}
        <div className="md:col-span-2 space-y-6">
          {/* Experience and club reason for registrations */}
          {isRegistration && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-[#BD2427]">Thông tin đăng ký</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Lý do chọn câu lạc bộ</h3>
                  <p className="text-sm bg-[#dcdce5]/40 p-3 rounded-md ">{player.clubReason}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Kinh nghiệm bóng rổ</h3>
                  <p className="text-sm bg-[#dcdce5]/40 p-3 rounded-md">{player.experience}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Team info for team assignments */}
          {!isRegistration && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-[#BD2427]">Thông tin đội bóng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Đội hiện tại</h3>
                  {player.team ? (
                    <Badge className="bg-[#BD2427]/10 text-[#BD2427] text-base px-4 py-1">{player.team}</Badge>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">Chưa được phân công vào đội</p>
                  )}
                </div>

                <div>
                  <h3 className="font-medium mb-2">Kinh nghiệm bóng rổ</h3>
                  <p className="text-sm bg-muted/30 p-3 rounded-md">{player.experience}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Guardian information */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl text-[#BD2427]">Thông tin người giám hộ</CardTitle>
              <CardDescription>Thông tin liên hệ của phụ huynh hoặc người giám hộ</CardDescription>
            </CardHeader>
            <CardContent>
              {player.guardians && player.guardians.length > 0 ? (
                <div className="space-y-4">
                  {player.guardians.map((guardian) => (
                    <div key={guardian.id} className="border rounded-md p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold">{guardian.name}</p>
                          <p className="text-sm text-gray-600">{guardian.relationship}</p>
                        </div>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="icon" className="h-8 w-8 text-red-600 hover:text-red-500 hover:bg-red-50 hover:border-2 hover:border-red-100">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Xóa thông tin người giám hộ?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Bạn có chắc chắn muốn xóa thông tin của {guardian.name}? Hành động này không thể hoàn
                                tác.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 text-white hover:bg-red-600/90"
                                onClick={() => handleRemoveGuardian(guardian.id)}
                              >
                                Xóa
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{guardian.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{guardian.phone}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground italic">Không có thông tin người giám hộ</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
