"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import ImageUpload from "@/components/ImageUpload";

export default function CreateCourtModal({ isOpen, onClose, onCreateCourt }) {
  const router = useRouter();
  const [imageWarning, setImageWarning] = useState(null);
  const [priceWarning, setPriceWarning] = useState(null);
  const [formData, setFormData] = useState({
    courtName: "",
    type: "Indoor",
    imageUrl: "example",
    address: "",
    contact: "",
    rentPricePerHour: 0,
    kind: "5x5",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    if (value < 0 || value > 500) {
      setPriceWarning("Giá phải trong khoảng 0 - 500");
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: Number.parseInt(value) }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (imageUrl) => {
    if (!formData.imageUrl.trim()) {
      setImageWarning("Vui lòng chọn ảnh sân.");
    } else {
      setImageWarning(null);
    }
    setFormData((prev) => ({ ...prev, imageUrl }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.imageUrl.trim()) {
      setImageWarning("Vui lòng chọn ảnh sân.");
      setIsSubmitting(false);
      return;
    } else {
      setImageWarning(null);
    }

    try {
      // In a real app, you would make an API call here
      onCreateCourt(formData);
      onClose();
      router.refresh();
    } catch (error) {
      console.error("Error creating court:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm Sân Mới</DialogTitle>
          <DialogDescription>
            Thêm sân bóng rổ mới vào hệ thống. Vui lòng điền đầy đủ thông tin bên dưới.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Image Upload Component */}
          <ImageUpload onImageChange={handleImageChange}/>
          {imageWarning && <div className="text-red-500 text-sm">{imageWarning}</div>}

          <div className="space-y-2">
            <Label htmlFor="courtName" className="required">
              Tên Sân
            </Label>
            <Input
              id="courtName"
              name="courtName"
              value={formData.courtName}
              onChange={handleChange}
              placeholder="Main Arena Court"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Loại Sân</Label>
              <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)} className="border-0">
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
            <Label htmlFor="address" className="required">
              Địa Chỉ
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
              Số Điện Thoại
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
            <Label htmlFor="rentPricePerHour">Giá Thuê (nghìn đồng/giờ)</Label>
            <Input id="rentPricePerHour" name="rentPricePerHour" type="number" value={formData.rentPricePerHour} onChange={handleNumberChange} />
          </div>
          {priceWarning && <div className="text-red-500 text-sm">{priceWarning}</div>}

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting} variant="destructive">
              {isSubmitting ? "Đang Tạo..." : "Tạo Sân"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
