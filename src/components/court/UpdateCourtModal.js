"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
import { Textarea } from "@/components/ui/Textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import ImageUpload from "@/components/ImageUpload"

export default function UpdateCourtModal({ isOpen, onClose, onUpdateCourt, court }) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    type: "Indoor",
    status: "Available",
    imageUrl: "",
    address: "",
    contact: "",
    description: "",
    price: 0,
    courtKind: "5x5",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Update form data when court changes
  useEffect(() => {
    if (court) {
      setFormData(court)
    }
  }, [court])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNumberChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: Number.parseInt(value) || 0 }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (imageUrl) => {
    setFormData((prev) => ({ ...prev, imageUrl }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // In a real app, you would make an API call here
      onUpdateCourt(formData)
      onClose()
      router.refresh()
    } catch (error) {
      console.error("Error updating court:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!court) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cập Nhật Sân</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin cho sân {court.name}. Vui lòng chỉnh sửa thông tin bên dưới.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Image Upload Component */}
          <ImageUpload initialImage={formData.imageUrl} onImageChange={handleImageChange} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="required">
              Tên Sân
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Main Arena Court"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Loại Sân</Label>
              <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="Indoor">Trong nhà</SelectItem>
                <SelectItem value="Outdoor">Ngoài trời</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Trạng Thái</Label>
              <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="Available">Đang hoạt động</SelectItem>
                  <SelectItem value="Under Maintenance">Đang bảo trì</SelectItem>
                  <SelectItem value="Closed">Đóng</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="courtKind">Kiểu Sân</Label>
              <Select value={formData.courtKind} onValueChange={(value) => handleSelectChange("courtKind", value)}>
                <SelectTrigger id="courtKind">
                  <SelectValue placeholder="Select court kind" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3x3">3x3</SelectItem>
                  <SelectItem value="5x5">5x5</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="required">
              Địa chỉ
            </Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="123 Basketball Ave, Đường Sports, Quận SC 12345"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact" className="required">
              Số điện thoại
            </Label>
            <Input
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="(555) 123-4567"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Mô tả của sân bóng, các tính năng,..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Giá Thuê (nghìn đồng/giờ)</Label>
            <Input id="price" name="price" type="number" min="0" value={formData.price} onChange={handleNumberChange} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit">{isSubmitting ? "Đang Cập Nhật..." : "Cập Nhật"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
