"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/Button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/Dialog"
import { Input } from "@/components/ui/Input"
import { Checkbox } from "@/components/ui/Checkbox"
import { Search } from "lucide-react"
import { ScrollArea } from "@/components/ui/ScrollArea"

export default function AddPlayersExDialog({ isOpen, onClose, onConfirm, availablePlayers, selectedPlayerIds = [] }) {
    const [searchTerm, setSearchTerm] = useState("")
    const [localSelectedPlayerIds, setLocalSelectedPlayerIds] = useState(selectedPlayerIds)
    console.log("select", selectedPlayerIds, localSelectedPlayerIds);
    
    useEffect(() => {
        if(selectedPlayerIds.length > 0) {
            setLocalSelectedPlayerIds(selectedPlayerIds)
        }
    },[selectedPlayerIds])
    
    // Filter players by search term
    const filteredPlayers = availablePlayers.filter((player) =>
        player.fullname.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    // Toggle player selection
    const handleTogglePlayer = (playerId) => {
        setLocalSelectedPlayerIds((prev) => {
            if (prev.includes(playerId)) {
                return prev.filter((id) => id !== playerId)
            } else {
                return [...prev, playerId]
            }
        })
    }

    // Select/deselect all
    const handleSelectAll = () => {
        if (localSelectedPlayerIds.length === filteredPlayers.length) {
            setLocalSelectedPlayerIds([])
        } else {
            setLocalSelectedPlayerIds(filteredPlayers.map((player) => player.userId))
        }
    }

    // Confirm selection
    const handleConfirm = () => {
        onConfirm(localSelectedPlayerIds)
        onClose()
    }

    // Close dialog
    const handleClose = () => {
        setLocalSelectedPlayerIds(selectedPlayerIds)
        setSearchTerm("")
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Thêm người vào khoản chi</DialogTitle>
                    <DialogDescription>Chọn những người cần thêm vào khoản chi này</DialogDescription>
                </DialogHeader>

                {/* Search input */}
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                        placeholder="Tìm kiếm theo tên..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Select all checkbox */}
                {filteredPlayers.length > 0 && (
                    <div className="flex items-center space-x-2 mb-2">
                        <Checkbox
                            id="select-all"
                            checked={localSelectedPlayerIds.length === filteredPlayers.length && filteredPlayers.length > 0}
                            onCheckedChange={handleSelectAll}
                        />
                        <label
                            htmlFor="select-all"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Chọn tất cả
                        </label>
                    </div>
                )}

                {/* Players list */}
                <ScrollArea className="h-[300px] pr-4">
                    {filteredPlayers.length > 0 ? (
                        <div className="space-y-2">
                            {filteredPlayers.map((player) => (
                                <div key={player.userId} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50">
                                    <Checkbox
                                        id={player.userId}
                                        checked={localSelectedPlayerIds.includes(player.userId)}
                                        onCheckedChange={() => handleTogglePlayer(player.userId)}
                                    />
                                    <label
                                        htmlFor={player.userId}
                                        className="flex-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        <div>{player.fullname}</div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {player.phone}
                                        </div>
                                    </label>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            {availablePlayers.length === 0
                                ? "Tất cả thành viên đã được thêm vào khoản chi"
                                : "Không tìm thấy thành viên nào"}
                        </div>
                    )}
                </ScrollArea>

                <DialogFooter className="sm:justify-between items-center">
                    <div className="text-sm text-gray-500">
                        Đã chọn: <span className="font-medium">{localSelectedPlayerIds.length}</span> người
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleClose}>
                            Hủy
                        </Button>
                        <Button
                            onClick={handleConfirm}
                            disabled={localSelectedPlayerIds.length === 0}
                            className="bg-[#BD2427] hover:bg-[#9a1e21]"
                        >
                            Thêm
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
