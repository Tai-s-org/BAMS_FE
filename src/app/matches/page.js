import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { PlusCircle } from "lucide-react"
import MatchesList from "@/components/matches/MatchesList"

export default function MatchManagement() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[#BD2427]">Quản Lý Trận Đấu</h1>
        <Link href="/matches/create">
          <Button className="bg-[#BD2427] hover:bg-[#9a1e21]">
            <PlusCircle className="mr-2 h-4 w-4" />
            Tạo Trận Đấu
          </Button>
        </Link>
      </div>
      <MatchesList />
    </div>
  )
}
