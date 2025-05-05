"use client"

import { useState, useEffect, useCallback } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import ImageUpload from "@/components/ImageUpload"
import courtApi from "@/api/court"
import { useToasts } from "@/hooks/providers/ToastProvider"
import { debounce } from "lodash"

export default function UpdateCourtModal({ isOpen, onClose, onUpdateCourt, court }) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    courtId: "",
    courtName: "",
    type: "Indoor",
    imageUrl: "example",
    address: "",
    contact: "",
    rentPricePerHour: 0,
    kind: "5x5",
    usagePurpose: "3",
  })
  const { addToast } = useToasts();
  const [imageWarning, setImageWarning] = useState(null);
  const [priceWarning, setPriceWarning] = useState(null);
  const [courtNameWarining, setCourtNameWarining] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Update form data when court changes
  useEffect(() => {
    if (court) {
      setFormData(court)
      console.log("court", court);
    }
  }, [court])

  const debouncedCheckCourtName = useCallback(
    debounce(async (value, setCourtNameWarining) => {
      const isValid = await checkCourtName(value);
      if (isValid) {
        setCourtNameWarining(null);
      } else {
        setCourtNameWarining("Đã tồn tại sân với tên này");
      }
    }, 500),
    []
  );
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  
    if (name === "courtName") {
      debouncedCheckCourtName(value, setCourtNameWarining);
    }
  };

  const checkCourtName = async (courtName) => {
    try {
      const response = await courtApi.checkCourtName({CourtName: courtName.trim()});
      return response?.data.status === "Success" ? true : false;
    } catch (error) {
      return false;
    }
  }

  const handleNumberChange = (e) => {
    const { name, value } = e.target;

    // Xử lý trường hợp input rỗng
    if (value === '') {
      setFormData(prev => ({ ...prev, [name]: 0 }));
      setPriceWarning('');
      return;
    }

    const numValue = parseInt(value, 10);

    // Kiểm tra nếu không phải là số hợp lệ
    if (isNaN(numValue)) {
      setPriceWarning("Vui lòng nhập số hợp lệ");
      return;
    }

    if (numValue < 0 || numValue > 500000) {
      setPriceWarning("Giá phải trong khoảng 0 - 500000");
      return;
    }

    // Clear warning nếu giá trị hợp lệ
    setPriceWarning('');
    setFormData(prev => ({ ...prev, [name]: numValue }));
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (imageUrl) => {
    if (!imageUrl.trim() || imageUrl.trim() === "") {
      setImageWarning("Vui lòng chọn ảnh sân.");
    } else {
      setImageWarning(null);
    }
    setFormData((prev) => ({ ...prev, imageUrl }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!formData.imageUrl.trim()) {
      setImageWarning("Vui lòng chọn ảnh sân.");
      setIsSubmitting(false);
      return;
    } else {
      setImageWarning(null);
    }

    try {
      // In a real app, you would make an API call here
      const response = await courtApi.updateCourt(formData);

      onUpdateCourt(response?.data.data);
      addToast({ message: response?.data.message, type: response?.data.status });
      onClose()
      router.refresh()
    } catch (error) {
      console.error("Error updating court:", error)
      addToast({ message: error?.response?.data.message, type: "error" });
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
            Cập nhật thông tin cho sân {court.courtName}. Vui lòng chỉnh sửa thông tin bên dưới.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Image Upload Component */}
          <ImageUpload initialImage={process.env.NEXT_PUBLIC_IMAGE_API_URL + formData.imageUrl} onImageChange={handleImageChange} />
          {imageWarning && <div className="text-red-500 text-sm">{imageWarning}</div>}
          <div className="space-y-2">
            <Label htmlFor="name" className="required">
              Tên Sân
            </Label>
            <Input
              id="name"
              name="courtName"
              value={formData.courtName}
              onChange={handleChange}
              placeholder="Main Arena Court"
              required
            />
            {courtNameWarining && <div className="text-red-500 text-sm">{courtNameWarining}</div>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div className="space-y-2">
              <Label htmlFor="kind">Kiểu Sân</Label>
              <Select value={formData.kind} onValueChange={(value) => handleSelectChange("kind", value)}>
                <SelectTrigger id="kind">
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
            <Label htmlFor="usagePurpose" className="required">
              Mục đích sử dụng
            </Label>
            <Select value={formData.usagePurpose.toString()} onValueChange={(value) => handleSelectChange("usagePurpose", value)} >
              <SelectTrigger id="usagePurpose">
                <SelectValue placeholder="Chọn mục đích sử dụng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">Tất Cả</SelectItem>
                <SelectItem value="2">Luyện tập</SelectItem>
                <SelectItem value="1">Thi đấu</SelectItem>
              </SelectContent>
            </Select>
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
              placeholder="251 Nguyễn Khang, Cầu Giấy, Hà Nội"
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
              placeholder="(+84) 0987654321"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Giá Thuê (VNĐ/giờ)</Label>
            <Input
              id="price"
              name="rentPricePerHour"
              type="number"
              value={formData.rentPricePerHour}
              onChange={handleNumberChange}
              min="0"
              max="500000"
            />
          </div>
          {priceWarning && <div className="text-red-500 text-sm">{priceWarning}</div>}


          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting || imageWarning > 0}>{isSubmitting ? "Đang Cập Nhật..." : "Cập Nhật"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
