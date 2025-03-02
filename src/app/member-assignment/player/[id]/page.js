"use client";

import { ProfileHeader } from "@/components/profile/profile-header";
import { PersonalInfo } from "@/components/profile/personal-info";
import { ParentInfo } from "@/components/profile/parent-info";
import { Button } from "@/components/ui/Button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/Alert-dialog";

// This would normally come from your database
const playerData = {
  id: "PLY001",
  avatar: "/placeholder.svg?height=128&width=128",
  fullName: "James Wilson",
  generationAndSchool: "Class of 2025 - Springfield High School",
  phoneNumber: "+1 (555) 0123",
  email: "james.wilson@example.com",
  facebookUrl: "https://facebook.com/jameswilson",
  gender: "Male",
  dateOfBirth: "2001-07-15",
  height: 188,
  weight: 82,
  position: "PG",
  disabled: false,
  parentInfo: {
    name: "Robert Wilson",
    relationship: "Father",
    phoneNumber: "+1 (555) 0124",
    email: "robert.wilson@example.com",
  },
};

export default function PlayerProfile({ params }) {
  const [hasParent, setHasParent] = useState(true);
  const [isDisabled, setIsDisabled] = useState(playerData.disabled);

  const handleRemoveParent = () => {
    setHasParent(false);
  };

  const handleDisableToggle = () => {
    setIsDisabled(!isDisabled);
  };

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="flex items-center justify-between">
        <Link href="/member-assignment">
          <Button variant="ghost">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Members
          </Button>
        </Link>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant={isDisabled ? "default" : "destructive"}>
              {isDisabled ? "Enable Member" : "Disable Member"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {isDisabled ? "Enable" : "Disable"} {playerData.fullName}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {isDisabled
                  ? "This will enable the member and allow them to be assigned to teams."
                  : "This will disable the member and remove them from any assigned teams."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDisableToggle}
                className={isDisabled ? "" : "bg-destructive hover:bg-destructive/90"}
              >
                {isDisabled ? "Enable" : "Disable"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <ProfileHeader
        avatar={playerData.avatar}
        fullName={playerData.fullName}
        generationAndSchool={playerData.generationAndSchool}
        phoneNumber={playerData.phoneNumber}
        email={playerData.email}
        facebookUrl={playerData.facebookUrl}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <PersonalInfo
          gender={playerData.gender}
          dateOfBirth={playerData.dateOfBirth}
          height={playerData.height}
          weight={playerData.weight}
          position={playerData.position}
        />
        {hasParent && <ParentInfo parentInfo={playerData.parentInfo} onRemove={handleRemoveParent} />}
      </div>
    </div>
  );
}
