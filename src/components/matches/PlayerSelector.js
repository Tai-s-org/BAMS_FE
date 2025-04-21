"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { Checkbox } from "@/components/ui/Checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Search } from "lucide-react"
import matchApi from "@/api/match"

export default function PlayerSelector({ team, onSave, onCancel, availablePlayers, matchId }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPlayers, setSelectedPlayers] = useState([])
  const [playerList, setPlayerList] = useState(availablePlayers)

  const filteredPlayers = playerList.filter(
    (player) =>
      player.playerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.shirtNumber.toString().includes(searchTerm),
  )

  const handleTogglePlayer = (playerId) => {
    setSelectedPlayers((prev) => (prev.includes(playerId) ? prev.filter((id) => id !== playerId) : [...prev, playerId]))
  }

  const handleSave = async () => {
    const playersToAdd = playerList.filter((player) => selectedPlayers.includes(player.userId))
    // try {
    //   const data = {
    //     matchId: matchId,
    //     playerId: selectedPlayers,
    //     isStarting: false,
    //   }
    //   const response = await matchApi.callPlayer(data)
    // } catch (error) {
    //   console.error("Error adding players:", error)
    // }
    onSave(playersToAdd, team)
  }

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
          <div className="grid grid-cols-[auto_1fr_auto] gap-4 p-3 bg-gray-50 border-b">
            <div className="w-6"></div>
            <Label>Cầu thủ</Label>
            <Label>Vị trí</Label>
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {filteredPlayers.length === 0 ? (
              <div className="p-4 text-center text-gray-500">Không tìm thấy cầu thủ</div>
            ) : (
              filteredPlayers.map((player) => (
                <div
                  key={player.userId}
                  className={`grid grid-cols-[auto_1fr_auto] gap-4 p-3 items-center hover:bg-gray-50 border-b last:border-b-0 ${
                    selectedPlayers.includes(player.userId) ? "bg-[#BD2427]/5" : ""
                  }`}
                >
                  <Checkbox
                    checked={selectedPlayers.includes(player.userId)}
                    onCheckedChange={() => handleTogglePlayer(player.userId)}
                    className="data-[state=checked]:bg-[#BD2427] data-[state=checked]:border-[#BD2427]"
                  />
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-3">
                      <AvatarImage src={player.imageUrl || "/placeholder.svg?height=40&width=40"} alt={player.playerName} />
                      <AvatarFallback>{player.playerName}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{player.playerName}</div>
                      <div className="text-sm text-gray-500">#{player.shirtNumber}</div>
                    </div>
                  </div>
                  <div className="text-sm">{player.position}</div>
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
          disabled={selectedPlayers.length === 0}
        >
          Thêm {selectedPlayers.length} cầu thủ{selectedPlayers.length !== 1 ? "" : ""}
        </Button>
      </CardFooter>
    </Card>
  )
}
