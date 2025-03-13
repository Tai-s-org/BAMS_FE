"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { MapPin, Phone, ArrowLeft, DollarSign, Users } from "lucide-react";
import UpdateCourtModal from "@/components/court/UpdateCourtModal";
import authApi from "@/api/auth";


// Helper function to translate court type
const translateType = (type) => {
  return type === "Indoor" ? "Trong Nhà" : "Ngoài Trời";
};

export default function CourtDetailPage({ params }) {
  const { id } = React.use(params);
  const [currentCourt, setCurrentCourt] = useState({});
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  if (!id) {
    return <div>Loading...</div>; // Handle case where courtId is not yet available
  }

  useEffect(() => {
    const fetchCourt = async () => {
      try {
        const response = await authApi.courtDetail(id);
        console.log(response.data);
        
        setCurrentCourt(response?.data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchCourt();
  }, [id]);

  if (!currentCourt) {
    notFound();
  }

  const handleUpdateCourt = (updatedCourt) => {
    setCurrentCourt(updatedCourt);
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
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Court Image and Basic Info */}
          <div className="relative aspect-video w-full overflow-hidden rounded-xl border bg-muted">
            <Image
              src={currentCourt.imageUrl || "/placeholder.svg"}
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
                  {translateType(currentCourt.type)}
                </Badge>
                <Badge variant="outline" className="font-medium">
                  {currentCourt.kind}
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
                      <p className="text-muted-foreground">{currentCourt.address}</p>
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
                    <DollarSign className="h-5 w-5 text-[#BD2427] mt-0.5" />
                    <div>
                      <p className="font-medium">Giá Thuê</p>
                      <p className="text-muted-foreground">{currentCourt.rentPricePerHour}.000đ/giờ</p>
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
