"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { Checkbox } from "@/components/ui/Checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Search } from "lucide-react"
import { useToasts } from "@/hooks/providers/ToastProvider"

export default function PlayerSelector({ team, onSave, onCancel, availablePlayers, matchId, startingTotal, currentPlayersTotal }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPlayers, setSelectedPlayers] = useState([])
  const { addToast } = useToasts()

  const handleTogglePlayer = (playerId) => {
    setSelectedPlayers((prev) =>
      prev.some((p) => p.playerId === playerId)
        ? prev.filter((p) => p.playerId !== playerId)
        : [...prev, { playerId, isStarting: false }]
    )
  }

  const handleToggleStarting = (playerId) => {
    setSelectedPlayers((prev) =>
      prev.map((p) =>
        p.playerId === playerId ? { ...p, isStarting: !p.isStarting } : p
      )
    )
  }

  const handleSave = () => {
    const neededPlayers = 5 - currentPlayersTotal
    if (selectedPlayers.length < neededPlayers && currentPlayersTotal < 5) {
      addToast({ message: `Phải chọn ít nhất ${neededPlayers} cầu thủ.`, type: "error" })
      return
    }

    const startingCount = selectedPlayers.filter((p) => p.isStarting).length
    const neededStarting = 5 - startingTotal
    if (startingCount != neededStarting) {
      addToast({ message: `Phải chọn ${neededStarting} cầu thủ xuất phát.`, type: "error" })
      return
    }

    const playersToSubmit = selectedPlayers.map((p) => ({
      matchId,
      playerId: p.playerId,
      isStarting: p.isStarting
    }))

    onSave(playersToSubmit, team)
  }

  const filteredPlayers = availablePlayers.filter(
    (player) =>
      player.playerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.shirtNumber.toString().includes(searchTerm)
  )

  const isPlayerSelected = (playerId) =>
    selectedPlayers.some((p) => p.playerId === playerId)

  const isPlayerStarting = (playerId) =>
    selectedPlayers.find((p) => p.playerId === playerId)?.isStarting || false

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thêm cầu thủ vào {team === "home" ? "đội nhà" : "đội khách"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm cầu thủ theo tên, vị trí hoặc số áo"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="border rounded-md overflow-hidden">
          <div className="hidden lg:grid grid-cols-[40px_200px_120px_100px_100px_100px_120px] gap-4 p-3 bg-gray-50 border-b">
            <div></div>
            <Label>Cầu thủ</Label>
            <Label>Vị trí</Label>
            <Label>Chiều cao</Label>
            <Label>Cân nặng</Label>
            <Label>Ngày gia nhập</Label>
            <Label>Đội hình chính</Label>
          </div>



          <div className="max-h-[300px] overflow-y-auto">
            {filteredPlayers.length === 0 ? (
              <div className="p-4 text-center text-gray-500">Không tìm thấy cầu thủ</div>
            ) : (
              filteredPlayers.map((player) => (
                <div
                  key={player.userId}
                  className={`border-b p-3 hover:bg-gray-50 last:border-b-0 
      ${isPlayerSelected(player.userId) ? "bg-[#BD2427]/5" : ""}
      grid lg:grid-cols-[40px_200px_120px_100px_100px_100px_120px] gap-4 items-center`}
                >
                  {/* Checkbox */}
                  <div className="flex lg:block justify-start">
                    <Checkbox
                      checked={isPlayerSelected(player.userId)}
                      onCheckedChange={() => handleTogglePlayer(player.userId)}
                      className="data-[state=checked]:bg-[#BD2427] data-[state=checked]:border-[#BD2427]"
                    />
                  </div>

                  {/* Cầu thủ */}
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-3">
                      <AvatarImage src={"/placeholder.svg?height=40&width=40"} alt={player.playerName} />
                      <AvatarFallback className={"bg-[#BD2427]/80 text-white"}>{player?.playerName.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{player.playerName}</div>
                      <div className="text-sm text-gray-500">#{player.shirtNumber == -1 ? "N/A" : player.shirtNumber}</div>
                    </div>
                  </div>

                  {/* Vị trí */}
                  <div className="text-sm">{player.position || "-"}</div>

                  {/* Chiều cao */}
                  <div className="text-sm">{player.height ? `${player.height} cm` : "-"}</div>

                  {/* Cân nặng */}
                  <div className="text-sm">{player.weight ? `${player.weight} kg` : "-"}</div>

                  {/* Ngày gia nhập */}
                  <div className="text-sm">
                    {player.clubJoinDate ? new Date(player.clubJoinDate).toLocaleDateString("vi-VN") : "-"}
                  </div>

                  {/* Checkbox đội hình chính */}
                  <div className="flex lg:block justify-end lg:justify-start">
                    <Checkbox
                      checked={isPlayerStarting(player.userId)}
                      onCheckedChange={() => handleToggleStarting(player.userId)}
                      disabled={!isPlayerSelected(player.userId)}
                      className="data-[state=checked]:bg-gray-600 data-[state=checked]:border-gray-600"
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Hủy
        </Button>
        <Button
          onClick={handleSave}
          className="bg-[#BD2427] hover:bg-[#9a1e21]"
          disabled={(selectedPlayers.length + currentPlayersTotal < 5) || (selectedPlayers.length === 0) ? true : false}
        >
          Thêm {selectedPlayers.length} cầu thủ
        </Button>
      </CardFooter>
    </Card>
  )
}
