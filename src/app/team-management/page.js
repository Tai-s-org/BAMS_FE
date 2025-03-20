"use client";

import { useState } from "react";
import TeamCreationForm from "@/components/team-management/TeamCreationForm";
import TeamDetails from "@/components/team-management/TeamDetails";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";

export default function TeamManagement() {
  const [activeTab, setActiveTab] = useState("view");

  const handleCreatedTeam = () => {
    setActiveTab("view");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#BD2427] text-white p-4 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Quản Lý Đội Bóng Rổ</h1>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4">
        <div className="mt-4">
          <Tabs key={activeTab} value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1">
              <TabsTrigger value="view">Xem Đội</TabsTrigger>
              <TabsTrigger value="create">Tạo Đội Mới</TabsTrigger>
            </TabsList>
            <TabsContent value="view">
              <TeamDetails />
            </TabsContent>
            <TabsContent value="create">
              <TeamCreationForm onTeamCreated={handleCreatedTeam} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
