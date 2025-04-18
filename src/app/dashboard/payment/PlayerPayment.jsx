import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { PendingPaymentsList } from "@/components/payment/player/PendingPaymentList"
import { PaymentHistoryList } from "@/components/payment/player/PaymentHistoryList"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function PlayerPayment() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold ml-4">Thanh toán</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Thanh toán đang diễn ra</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tổng số tiền đã giao dịch</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">750.000 VND</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Số thanh toán đã thực hiện</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending">
        <TabsList className="mb-4 flex flex-col sm:flex-row items-start sm:items-center ">
          <TabsTrigger value="pending">Chờ thanh toán</TabsTrigger>
          <TabsTrigger value="history">Lịch sử thanh toán</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Thanh toán đang diễn ra</CardTitle>
              <CardDescription>Thanh toán hiện tại của bạn</CardDescription>
            </CardHeader>
            <CardContent>
              <PendingPaymentsList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Lịch sử thanh toán</CardTitle>
              <CardDescription>Hồ sơ thanh toán trước đây của bạn</CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentHistoryList />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
