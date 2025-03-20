"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import teamApi from "@/api/team";
// import { toast } from "@/components/";

export default function TeamCreationForm({onTeamCreated}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teamName, setTeamName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!teamName.trim()) {
      // toast({
      //   title: "Lỗi",
      //   description: "Vui lòng nhập tên đội",
      //   variant: "destructive",
      // });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    try {
      const response = await teamApi.createTeam({ teamName: teamName, status: 0 });

      if (onTeamCreated) {
        onTeamCreated();
      }
    } catch (error) {
      console.error("Error creating team:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tạo Đội Mới</CardTitle>
        <CardDescription>Nhập tên để tạo đội bóng rổ mới</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="team-name">Tên Đội</Label>
            <Input
              id="team-name"
              placeholder="Nhập tên đội"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full bg-[#BD2427] hover:bg-[#9a1e21]" disabled={isSubmitting}>
            {isSubmitting ? "Đang tạo..." : "Tạo Đội"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
