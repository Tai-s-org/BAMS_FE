import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardFooter } from "@/components/ui/Card";
import { MapPin, Phone, Edit, Trash2, Eye } from "lucide-react";
import { PiMoneyWavy } from "react-icons/pi";
import RemoveConfirmDialog from "../ui/RemoveConfirmDialog";
import { useState } from "react";

export default function CourtList({ courts, onEdit, onDelete }) {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletedId, setDeletedId] = useState(null);
  const [context, setContext] = useState(null);

  const translateType = (type) => {
    return type === "Indoor" ? "Trong Nhà" : "Ngoài Trời";
  };
  
  const translateUsagePurpose = (usagePurpose) => {
    switch (usagePurpose.toString()) {
      case "1":
        return "Thi đấu";
      case "2":
        return "Luyện tập";
      case "3":
        return "Tất cả";
      default:
        return "Tất cả";
    }
  }
  
  const translateMoney = (money) => {
    return money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ/giờ";
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courts.length == 0 ? <h1 className="text-3xl font-bold tracking-tight text-gray-900">Bắt đầu lọc để tìm kiếm</h1> : courts?.map((court) => (
        <Card
          key={court.courtId}
          className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border bg-white"
        >
          <div className="relative h-56 w-full">
            <Image src={(process.env.NEXT_PUBLIC_IMAGE_API_URL + court.imageUrl) || "/placeholder.svg"} alt={"Court Images"} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <Badge
              variant="outline"
              className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm font-medium px-3 shadow-sm"
            >
              Sân {court.kind}
            </Badge>
          </div>
          <CardContent className="pt-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">{court.courtName.length > 24 ? `${court.courtName.slice(0, 24)}...` : court.courtName}</h3>
              <div className="flex flex-col gap-1 items-end">
                <Badge variant="outline" className="font-medium">
                  {translateType(court.type)}
                </Badge>
                <Badge variant="outline" className="font-medium text-xs">
                  {translateUsagePurpose(court.usagePurpose)}
                </Badge>
              </div>
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-[#BD2427]" />
                <span>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(court.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[#BD2427] transition-colors"
                  >
                    {court.address}
                  </a>
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-[#BD2427]" />
                <span>{court.contact}</span>
              </div>
              <div className="flex items-center gap-1 text-base font-semibold text-primary bg-primary/5 rounded-full text-[#BD2427]">
                <PiMoneyWavy className="h-4 w-4" />
                <span>{translateMoney(court.rentPricePerHour)}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t p-4 bg-[#fef8f8] items-end mt-auto">
            <Link href={`/courts/${court.courtId}`}>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1.5 transition-all duration-300 hover:shadow-md active:scale-95 bg-white"
              >
                <Eye className="h-4 w-4" />
                Xem Chi Tiết
              </Button>
            </Link>
            <div className="flex gap-2">
              {onEdit && (
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 transition-all duration-300 hover:shadow-md active:scale-95 bg-white"
                  onClick={() => onEdit(court)}
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Chỉnh Sửa</span>
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 text-red-500 hover:text-red-600 hover:border-text-red-600 transition-all duration-300 hover:shadow-md active:scale-95 bg-white"
                  onClick={() => {
                    setDeleteConfirmOpen(true);
                    setDeletedId(court.courtId);
                    setContext("Sân " + court.courtName);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Xóa</span>
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      ))}

      { deletedId && <RemoveConfirmDialog deleteConfirmOpen={deleteConfirmOpen} onClose={() => {
        setDeleteConfirmOpen(false);
        setDeletedId(null);
        setContext(null);
      }} onConfirm={() => {
        onDelete(deletedId);
        setDeleteConfirmOpen(false);
        setDeletedId(null);
        setContext(null);
      }} context={context} deletedId={deletedId} />}
    </div>
  );
}
