"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { MapPin, Phone, ArrowLeft, Users } from "lucide-react";
import UpdateCourtModal from "@/components/court/UpdateCourtModal";
import { PiMoneyWavy } from "react-icons/pi";
import courtApi from "@/api/court";
import { useAuth } from "@/hooks/context/AuthContext";

export default function CourtDetailPage({ params }) {
  const { user } = useAuth();

  if (user.roleCode !== "Manager") {
    alert("Không có quyền truy cập");
    redirect("/dashboard");
  }

  const { id } = React.use(params);
  const [currentCourt, setCurrentCourt] = useState();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  if (!id) {
    return <div>Đang tải...</div>;
  }

  const fetchCourt = async () => {
    try {
      const response = await courtApi.courtDetail(id);
      if (response)
        setCurrentCourt(response.data.data);
    } catch (err) {
      console.error("Error: ", err);
    }
  }

  useEffect(() => {
    fetchCourt();
  }, [id]);

  const handleUpdateCourt = (updatedCourt) => {
    setCurrentCourt(updatedCourt);
  };

  const translateCourtType = (type) => {
    switch (type) {
      case "Outdoor":
        return "Sân Ngoài Trời";
      case "Indoor":
        return "Sân Trong Nhà";
      default:
        return type;
    }
  }

  const translateCourtUsagePurpose = (usagePurpose) => {
    switch (usagePurpose) {
      case "1":
        return "Thi đấu";
      case "2":
        return "Luyện tập";
      case "3":
        return "Tất Cả";
      default:
        return usagePurpose;
    }
  }

  const translateMoney = (money) => {
    return money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ/giờ";
  }

  return (
    currentCourt && <div className="container mx-auto px-4 py-8">
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
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Court Image and Basic Info */}
          <div className="relative aspect-video w-full overflow-hidden rounded-xl border bg-muted">
            <Image
              src={process.env.NEXT_PUBLIC_IMAGE_API_URL + currentCourt.imageUrl || "/placeholder.svg"}
              alt={"Court Image"}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          {/* Court Name and Status */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-2">{currentCourt.courtName}</h1>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="font-medium">
                  {translateCourtType(currentCourt.type)}
                </Badge>
                <Badge variant="outline" className="font-medium">
                  {currentCourt.kind}
                </Badge>
                <Badge variant="outline" className="font-medium">
                  {translateCourtUsagePurpose(currentCourt.usagePurpose.toString())}
                </Badge>
              </div>
            </div>
          </div>

          {/* Location & Contact and Court Details */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white">
              <CardContent className="pt-6">
                <h2 className="text-lg font-semibold mb-4">Địa Chỉ & Liên Hệ</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-[#BD2427] mt-0.5" />
                    <div>
                      <p className="font-medium">Địa Chỉ</p>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(currentCourt.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground underline hover:text-[#BD2427] transition-colors"
                      >
                        {currentCourt.address}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-[#BD2427] mt-0.5" />
                    <div>
                      <p className="font-medium">Số Điện Thoại</p>
                      <p className="text-muted-foreground">{currentCourt.contact}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white">
              <CardContent className="pt-6">
                <h2 className="text-lg font-semibold mb-4">Thông Tin Sân</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <PiMoneyWavy className="h-5 w-5 text-[#BD2427] mt-0.5" />
                    <div>
                      <p className="font-medium">Giá Thuê</p>
                      <p className="text-muted-foreground">{translateMoney(currentCourt.rentPricePerHour)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-[#BD2427] mt-0.5" />
                    <div>
                      <p className="font-medium">Loại Sân</p>
                      <p className="text-muted-foreground">Sân {currentCourt.kind}</p>
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
