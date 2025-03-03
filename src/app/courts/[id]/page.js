"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { MapPin, Phone, ArrowLeft, DollarSign, Users, AlertCircle } from "lucide-react";
import { courts } from "@/lib/fake-data-court";
import UpdateCourtModal from "@/components/court/UpdateCourtModal";

// Helper function to translate status
const translateStatus = (status) => {
  switch (status) {
    case "Available":
      return "Còn Trống";
    case "Under Maintenance":
      return "Đang Bảo Trì";
    case "Closed":
      return "Đã Đóng";
    default:
      return status;
  }
};

// Helper function to translate court type
const translateType = (type) => {
  return type === "Indoor" ? "Trong Nhà" : "Ngoài Trời";
};

export default function CourtDetailPage({ params }) {
  const {id} = React.use(params);
  const court = courts.find((c) => c.id === id);
  const [currentCourt, setCurrentCourt] = useState(court || null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  if (!currentCourt) {
    notFound();
  }

  const handleUpdateCourt = (updatedCourt) => {
    setCurrentCourt(updatedCourt);
  };

  const handleSetClosed = () => {
    if (currentCourt) {
      const updatedCourt = {
        ...currentCourt,
        status: "Closed",
      };
      setCurrentCourt(updatedCourt);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link href="/courts">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Quay Lại
            </Button>
          </Link>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex items-center gap-2 btn-hover"
              onClick={() => setIsUpdateModalOpen(true)}
            >
              Chỉnh Sửa
            </Button>
            <Button
              variant="destructive"
              className="flex items-center gap-2 btn-hover"
              onClick={handleSetClosed}
              disabled={currentCourt.status === "Closed"}
            >
              <AlertCircle className="h-4 w-4" />
              Đóng Sân
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Court Image and Basic Info */}
          <div className="relative aspect-video w-full overflow-hidden rounded-xl border bg-muted">
            <Image
              src={currentCourt.imageUrl || "/placeholder.svg"}
              alt={currentCourt.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          {/* Court Name and Status */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-2">{currentCourt.name}</h1>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-primary font-medium">
                  {translateType(currentCourt.type)}
                </Badge>
                <Badge variant="outline" className="text-primary font-medium">
                  {currentCourt.courtKind}
                </Badge>
              </div>
            </div>
            <Badge
              className={`status-badge ${
                currentCourt.status === "Available"
                  ? "status-badge-available"
                  : currentCourt.status === "Under Maintenance"
                  ? "status-badge-maintenance"
                  : "status-badge-closed"
              }`}
            >
              {translateStatus(currentCourt.status)}
            </Badge>
          </div>

          {/* Location & Contact and Court Details */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6">
                <h2 className="text-lg font-semibold mb-4">Địa Chỉ & Liên Hệ</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Địa Chỉ</p>
                      <p className="text-muted-foreground">{currentCourt.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Số Điện Thoại</p>
                      <p className="text-muted-foreground">{currentCourt.contact}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6">
                <h2 className="text-lg font-semibold mb-4">Thông Tin Sân</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <DollarSign className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Giá Thuê</p>
                      <p className="text-muted-foreground">{currentCourt.price}.000đ/giờ</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Loại Sân</p>
                      <p className="text-muted-foreground">Sân {currentCourt.courtKind}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <UpdateCourtModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          onUpdateCourt={handleUpdateCourt}
          court={currentCourt}
        />
      </div>
    </div>
  );
}
