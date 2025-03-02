"use client"

import { ProfileHeader } from "@/components/profile/profile-header"
import { PersonalInfo } from "@/components/profile/personal-info"
import { ParentInfo } from "@/components/profile/parent-info"
import { RegistratorInfo } from "@/components/profile/registrator-info"
import { Button } from "@/components/ui/Button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
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
} from "@/components/ui/Alert-dialog"

// This would normally come from your database
const registratorData = {
  id: "REG001",
  avatar: "/placeholder.svg?height=128&width=128",
  fullName: "John Smith",
  generationAndSchool: "Class of 2024 - Riverside Academy",
  phoneNumber: "+1 (555) 0125",
  email: "john.smith@example.com",
  facebookUrl: "https://facebook.com/johnsmith",
  gender: "Male",
  dateOfBirth: "1988-05-12",
  height: 185,
  weight: 80,
  position: "SG",
  disabled: false,
  parentInfo: {
    name: "Mary Smith",
    relationship: "Mother",
    phoneNumber: "+1 (555) 0126",
    email: "mary.smith@example.com",
  },
  reason:
    "I've always been passionate about basketball and want to develop my skills with a professional club. The club's reputation for developing young talent and its strong community focus really appeals to me.",
  experience:
    "Played basketball for 5 years at high school level. Captain of the school team for 2 years. Participated in several regional tournaments.",
  achievement:
    "MVP in Regional High School Championship 2023\nSelected for All-State Team 2022\nLed team to State Finals in 2023",
  tryOutNote:
    "Shows excellent court vision and leadership qualities. Strong fundamentals in ball handling and shooting. Need to improve defensive positioning and lateral movement speed.",
}

export default function RegistratorProfile({ params }) {
  const [hasParent, setHasParent] = useState(true)
  const [isDisabled, setIsDisabled] = useState(registratorData.disabled)

  const handleRemoveParent = () => {
    setHasParent(false)
  }

  const handleDisableToggle = () => {
    setIsDisabled(!isDisabled)
  }

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
                {isDisabled ? "Enable" : "Disable"} {registratorData.fullName}
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
        avatar={registratorData.avatar}
        fullName={registratorData.fullName}
        generationAndSchool={registratorData.generationAndSchool}
        phoneNumber={registratorData.phoneNumber}
        email={registratorData.email}
        facebookUrl={registratorData.facebookUrl}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <PersonalInfo
            gender={registratorData.gender}
            dateOfBirth={registratorData.dateOfBirth}
            height={registratorData.height}
            weight={registratorData.weight}
            position={registratorData.position}
          />
          {hasParent && <ParentInfo parentInfo={registratorData.parentInfo} onRemove={handleRemoveParent} />}
        </div>
        <RegistratorInfo
          reason={registratorData.reason}
          experience={registratorData.experience}
          achievement={registratorData.achievement}
          tryOutNote={registratorData.tryOutNote}
        />
      </div>
    </div>
  )
}
