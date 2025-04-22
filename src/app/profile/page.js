"use client";

import Profile from "@/components/profile/Profile";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
    return (
        <div className="p-6 rounded-lg shadow-lg w-full">
            <Button
                variant="outline"
                className="border border-gray-300 text-gray-700 hover:bg-gray-100 transition-all duration-300"
                asChild
            >
                <Link href="/team-dashboard">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Quay lại
                </Link>
            </Button>
            <Profile />
        </div>
    );
}