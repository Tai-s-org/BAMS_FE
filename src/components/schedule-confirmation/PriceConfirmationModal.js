"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"

export default function PriceConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  scheduledDate,
  currentPrice,
  courtName,
}) {
  const [price, setPrice] = useState(currentPrice)
  const [error, setError] = useState("")

  const handleConfirm = () => {
    if (price <= 0) {
      setError("Giá phải lớn hơn 0")
      return
    }

    onConfirm(price)
    setError("")
  }

  const handleClose = () => {
    setPrice(currentPrice)
    setError("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] border-[#BD2427]/30">
        <DialogHeader>
          <DialogTitle className="text-[#BD2427]">Xác nhận giá sân</DialogTitle>
          <DialogDescription>Vui lòng xác nhận hoặc cập nhật giá sân trước khi phê duyệt.</DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-muted-foreground">Ngày diễn ra</Label>
                <p className="font-medium">{scheduledDate}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Sân</Label>
                <p className="font-medium">{courtName}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="current-price" className="text-muted-foreground">
              Giá hiện tại
            </Label>
            <p className="font-medium text-[#BD2427]">{currentPrice}.000 Đồng</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-price">Giá thực tế(phần nghìn)</Label>
            <Input
              id="new-price"
              type="number"
              value={price}
              onChange={(e) => {
                setPrice(Number(e.target.value))
                if (Number(e.target.value) > 0) setError("")
              }}
            />
            {error && <p className="text-sm text-[#BD2427]">{error}</p>}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            className="border-[#BD2427]/30 hover:border-[#BD2427]/70 hover:bg-[#BD2427]/10"
          >
            Hủy bỏ
          </Button>
          <Button onClick={handleConfirm} className="bg-[#BD2427] hover:bg-[#BD2427]/90 text-white">
            Xác nhận phê duyệt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}