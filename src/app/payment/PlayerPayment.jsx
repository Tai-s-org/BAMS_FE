
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { PendingPaymentsList } from "@/components/payment/player/PendingPaymentList"
import { PaymentHistoryList } from "@/components/payment/player/PaymentHistoryList"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import paymentApi from "@/api/payment"

export default function PlayerPayment() {
  const [myPayments, setMyPayments] = useState([]);

  useEffect(() => {
    // Fetch the payments data from the API
    const fetchPayments = async () => {
      try {
        const response = await paymentApi.getMyPaymentHistory();
        console.log(response.data.data);
        setMyPayments(response.data.data.items);
      } catch (error) {
        console.error('Error fetching payments:', error);
      }
    };

    fetchPayments();
  }, []);
  const pendingPayments = myPayments.filter(payment => payment.status !== 1);
  const completedPayments = myPayments.filter(payment => payment.status === 1);
  const totalAmount = myPayments.reduce((sum, item) => sum + item.totalAmount, 0)

  function formatTienVN(number) {
    return number != null ? number.toLocaleString('vi-VN') : "";
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-bold ml-4">Thanh toán</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Thanh toán đang diễn ra</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingPayments.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tổng số tiền đã giao dịch</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTienVN(totalAmount)} VND</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Số thanh toán đã thực hiện</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedPayments.length}</div>
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
              <PendingPaymentsList pendingPayments={pendingPayments} />
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
              <PaymentHistoryList completedPayments={completedPayments}/>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
