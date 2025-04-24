"use client"

import { useParams, useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Badge } from "@/components/ui/Badge"
import { Card, CardContent, CardHeader } from "@/components/ui/Card"
import { Separator } from "@/components/ui/Seperator"
import {
  ShoppingBasketIcon as Basketball,
  CalendarIcon,
  MapPin,
  Phone,
  Mail,
  Ruler,
  Weight,
  Users,
  ShirtIcon as TShirt,
  ArrowLeft,
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { useEffect, useState } from "react"
import { UserMinus, UserPlus, User } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { cn } from "@/lib/utils"
import playerApi from "@/api/player"
import parentApi from "@/api/parent"
import { useToasts } from "@/hooks/providers/ToastProvider"
import { DatePicker } from "../ui/DatePicker"

// This would typically come from a database or API
const player = {
  userId: "3d13ec17-a669-4292-9dd5-e446a71a93d1",
  fullname: "sssin g",
  email: "uwo7rgdj@tempmail.id.vn",
  phone: "0344858585",
  teamId: "T001",
  teamName: "Team A",
  profileImage: null,
  address: null,
  dateOfBirth: null,
  weight: 10,
  height: 10,
  position: "Tiền Đạo",
  shirtNumber: null,
  clubJoinDate: "2025-04-03",
  parentId: "8bd4839e327140dfb192f38bb7843a18",
}

// Sample parent data
const parent = {
  userId: "8bd4839e327140dfb192f38bb7843a18",
  citizenId: "string",
  createdByManagerId: "7",
  username: "uanfgw@example.com",
  fullname: "anhfe",
  email: "uanfgw@example.com",
  phone: "string",
  address: "N/A",
  profileImage: null,
  dateOfBirth: null,
  isEnable: true,
}

export default function PlayerDetailPage() {
  const [player, setPlayer] = useState({
    userId: "",
    fullname: "",
    email: "",
    phone: "",
    teamId: "",
    teamName: "",
    profileImage: null,
    address: null,
    dateOfBirth: null,
    weight: 0,
    height: 0,
    position: "",
    shirtNumber: null,
    clubJoinDate: "2025-04-03",
    parentId: "",
  })
  const [parent, setParent] = useState(null)
  const router = useRouter()
  const {id}= useParams()
  const { addToast } = useToasts()


  useEffect(() => {
    if (!id) return
    fetchPlayerData()
  }, [id])

  const fetchPlayerData = async () => {
    try {
      const filter = {
        OnlyNoTeam: false
      }
      const response = await playerApi.getAllPlayerWithTeam()
      const playerData = response.data.data.items.find((player) => player.userId === id)
      console.log("Player data:", playerData);
      
      if (playerData) {
        setPlayer(playerData)
        if (playerData.parentId) {
          const parentResponse = await parentApi.getParentById(playerData.parentId)
          const parentData = parentResponse.data.data;
          if (parentData) {
            setParent(parentData)
            setHasParent(true)
          }
        }
      } else {
        console.error("Player not found")
        addToast("Cầu thủ không tồn tại", { type: "error" })
      }
    } catch (error) {
      console.error("Error fetching player data:", error)
      addToast("Lỗi khi tải dữ liệu cầu thủ", { type: "error" })
    }
  }

  // Format date to be more readable
  const formatDate = (dateString) => {
    if (!dateString) return "Không có thông tin"
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const [hasParent, setHasParent] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [date, setDate] = useState(new Date())

  // Parent form state
  const [parentForm, setParentForm] = useState({
    citizenId: "",
    username: "",
    fullname: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: null,
  })

  // Function to handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setParentForm({
      ...parentForm,
      [name]: value,
    })
  }

  // Function to handle removing parent
  const handleRemoveParent = () => {
    console.log("Gỡ bỏ phụ huynh có ID:", player.parentId)
    setHasParent(false)
    // This would typically make an API call to update the player record
  }

  // Function to handle adding parent
  const handleAddParent = () => {
    setIsModalOpen(true)
  }

  // Function to handle form submission
  const handleSubmit = () => {
    // Format the date if it exists
    const formData = {
      ...parentForm,
      dateOfBirth: date ? format(date, "yyyy-MM-dd") : null,
    }

    console.log("Thêm phụ huynh với dữ liệu:", formData)
    setParent({ ...parentForm })
    setHasParent(true)
    setIsModalOpen(false)
    setHasParent(true)
    // This would typically make an API call to create a parent and update the player
  }

  // Function to handle going back
  const handleGoBack = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#BD2427] text-white p-6 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Câu Lạc Bộ Bóng Rổ</h1>
        </div>
      </div>

      {/* Back Button */}
      <div className="container mx-auto pt-4 px-4">
        <Button
          variant="ghost"
          className="flex items-center text-[#BD2427] hover:bg-[#BD2427]/10 mb-4"
          onClick={handleGoBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-2 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Image and Basic Info */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg">
              <CardHeader className="bg-[#BD2427]/10 pb-0">
                <div className="flex flex-col items-center">
                  <Avatar className="w-32 h-32 border-4 border-[#BD2427]">
                    <AvatarImage
                      src={player?.profileImage || "/placeholder.svg?height=128&width=128"}
                      alt={player.fullname}
                    />
                    <AvatarFallback className="bg-[#BD2427] text-white text-3xl">
                      {player.fullname
                        .split(" ")
                        .map((name) => name[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="mt-4 text-2xl font-bold text-center">{player.fullname}</h2>
                  <div className="flex items-center justify-center mt-2 mb-4">
                    <Badge className="bg-red-300">{player.position}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <TShirt className="w-5 h-5 text-[#BD2427]" />
                    <span className="font-medium">Số áo:</span>
                    <span>{player.shirtNumber || "Chưa được gán"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-[#BD2427]" />
                    <span className="font-medium">Đội:</span>
                    <span>{player.teamName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="w-5 h-5 text-[#BD2427]" />
                    <span className="font-medium">Ngày tham gia:</span>
                    <span>{formatDate(player.clubJoinDate)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Detailed Information */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader className="bg-[#BD2427] text-white">
                <h3 className="text-xl font-bold">Thông Tin Cầu Thủ</h3>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h4 className="text-lg font-semibold mb-3 flex items-center">
                      <span className="inline-block w-1 h-6 bg-[#BD2427] mr-2"></span>
                      Thông Tin Cá Nhân
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-3">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-[#BD2427]" />
                        <span className="font-medium">Email:</span>
                        <span className="truncate">{player.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-[#BD2427]" />
                        <span className="font-medium">Điện thoại:</span>
                        <span>{player.phone}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-[#BD2427]" />
                        <span className="font-medium">Địa chỉ:</span>
                        <span>{player.address || "Chưa cung cấp"}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CalendarIcon className="w-5 h-5 text-[#BD2427]" />
                        <span className="font-medium">Ngày sinh:</span>
                        <span>{player.dateOfBirth ? formatDate(player.dateOfBirth) : "Chưa cung cấp"}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Physical Attributes */}
                  <div>
                    <h4 className="text-lg font-semibold mb-3 flex items-center">
                      <span className="inline-block w-1 h-6 bg-[#BD2427] mr-2"></span>
                      Thông Số Thể Chất
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-3">
                      <div className="flex items-center gap-3">
                        <Ruler className="w-5 h-5 text-[#BD2427]" />
                        <span className="font-medium">Chiều cao:</span>
                        <span>{player.height} cm</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Weight className="w-5 h-5 text-[#BD2427]" />
                        <span className="font-medium">Cân nặng:</span>
                        <span>{player.weight} kg</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Basketball className="w-5 h-5 text-[#BD2427]" />
                        <span className="font-medium">Vị trí:</span>
                        <span>{player.position}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Team Information */}
                  <div>
                    <h4 className="text-lg font-semibold mb-3 flex items-center">
                      <span className="inline-block w-1 h-6 bg-[#BD2427] mr-2"></span>
                      Thông Tin Đội
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-3">
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-[#BD2427]" />
                        <span className="font-medium">Mã đội:</span>
                        <span>{player.teamId}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-[#BD2427]" />
                        <span className="font-medium">Tên đội:</span>
                        <span>{player.teamName}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Parent Information */}
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-semibold mb-3 flex items-center">
                        <span className="inline-block w-1 h-6 bg-[#BD2427] mr-2"></span>
                        Thông Tin Phụ Huynh
                      </h4>
                      <div>
                        {hasParent ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 border-red-500 hover:bg-red-50"
                            onClick={handleRemoveParent}
                          >
                            <UserMinus className="w-4 h-4 mr-2" />
                            Gỡ Phụ Huynh
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-[#BD2427] border-[#BD2427] hover:bg-[#BD2427]/10"
                            onClick={handleAddParent}
                          >
                            <UserPlus className="w-4 h-4 mr-2" />
                            Thêm Phụ Huynh
                          </Button>
                        )}
                      </div>
                    </div>

                    {(parent && hasParent) ? (
                      <div className="pl-3 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-3">
                            <User className="w-5 h-5 text-[#BD2427]" />
                            <span className="font-medium">Họ tên:</span>
                            <span>{parent.fullname}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-[#BD2427]" />
                            <span className="font-medium">Email:</span>
                            <span className="truncate">{parent.email}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-[#BD2427]" />
                            <span className="font-medium">Điện thoại:</span>
                            <span>{parent.phone}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <MapPin className="w-5 h-5 text-[#BD2427]" />
                            <span className="font-medium">Địa chỉ:</span>
                            <span>{parent.address}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="pl-3 py-4 text-center text-gray-500 bg-gray-50 rounded-md">
                        <User className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>Chưa có thông tin phụ huynh</p>
                        <p className="text-sm">Nhấn "Thêm Phụ Huynh" để liên kết phụ huynh với cầu thủ này</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Add Parent Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Thêm Phụ Huynh</DialogTitle>
            <DialogDescription>Nhập thông tin phụ huynh để liên kết với cầu thủ này.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="citizenId">CMND/CCCD</Label>
                <Input
                  id="citizenId"
                  name="citizenId"
                  placeholder="Nhập số CMND/CCCD"
                  value={parentForm.citizenId}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="fullname">Họ và tên</Label>
                <Input
                  id="fullname"
                  name="fullname"
                  placeholder="Nhập họ và tên"
                  value={parentForm.fullname}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="username">Tên đăng nhập</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="Nhập tên đăng nhập (email)"
                  type="email"
                  value={parentForm.username}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="Nhập địa chỉ email"
                  type="email"
                  value={parentForm.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="Nhập số điện thoại"
                  value={parentForm.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Địa chỉ</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="Nhập địa chỉ"
                  value={parentForm.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label>Ngày sinh</Label>
                <DatePicker value={new Date(date)} onChange={setDate} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSubmit} className="bg-[#BD2427] hover:bg-[#BD2427]/90" disabled={!parentForm.username || !parentForm.fullname || !parentForm.email || !parentForm.phone || !parentForm.address || !parentForm.citizenId}>
              Thêm Phụ Huynh
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}