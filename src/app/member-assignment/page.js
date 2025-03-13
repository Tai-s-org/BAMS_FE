import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import PlayerRegistrations from "@/components/member-assignment/PlayerRegistration";
import TeamAssignments from "@/components/member-assignment/TeamAssignment";

export default function MemberAssignment() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6 text-[#BD2427]">Quản Lý Câu Lạc Bộ Bóng Rổ</h1>

      <Tabs defaultValue="registrations" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100">
          <TabsTrigger
            value="registrations"
            className="data-[state=active]:bg-[#BD2427] data-[state=active]:text-white py-2"
          >
            Đăng Ký Cầu Thủ
          </TabsTrigger>
          <TabsTrigger value="assignments" className="data-[state=active]:bg-[#BD2427] data-[state=active]:text-white">
            Phân Công Đội
          </TabsTrigger>
        </TabsList>

        <TabsContent value="registrations" className="mt-0">
          <PlayerRegistrations />
        </TabsContent>

        <TabsContent value="assignments" className="mt-0">
          <TeamAssignments />
        </TabsContent>
      </Tabs>
    </div>

  );
}
