'use client'

import registrationSessionApi from "@/api/registrationSession"
import ManagerRegistrationForm from "@/components/member-registration/manager-registration/ManagerRegistrationForm"
import PlayerRegistrationForm from "@/components/member-registration/player-registration/PlayerRegistrationForm"
import { se, sq } from "date-fns/locale"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Form() {
    const [email, setEmail] = useState("")
    const [role, setRole] = useState("")
    const [sessionId, setSessionId] = useState("")
    const [data, setData] = useState("")
    const [sessionData, setSessionData] = useState("")
    const router = useRouter()

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })
    }

    useEffect(() => {
        const storedEmail = localStorage.getItem("email")
        const storedRole = localStorage.getItem("role")
        const sessionId = localStorage.getItem("session")
        if (localStorage.getItem("formData") && localStorage.getItem("formData") !== "undefined") {
            const formData = JSON.parse(localStorage.getItem("formData"))
            setData(formData)
        }

        if (!storedEmail || !storedRole) {
            router.push("/")
            return
        }

        setEmail(storedEmail)
        setRole(storedRole)
        setSessionId(sessionId)

    }, [router])

    useEffect(() => {
        const fetchRegistrationSession = async () => {
            if (sessionId) {
                try {
                    const sessionData = await registrationSessionApi.getRegistrationSessionById(sessionId);
                    console.log(sessionData);
                    setSessionData(sessionData.data);
                } catch (error) {
                    console.log("Error fetching registration session:", error);
                }
            };
        }

        fetchRegistrationSession()
    }, [sessionId])

    return (
        <div>
            <h1 className="text-3xl font-bold text-center mb-8 text-[#bd2427]">
                {sessionData?.registrationName}
            </h1>
            <p className="text-center">Ngày bắt đầu: {formatDate(sessionData?.startDate)} - Ngày kết thúc: {formatDate(sessionData?.endDate)}</p>
            {role === "manager" ? (
                <ManagerRegistrationForm data={data} email={email} sessionId={sessionId} />
            ) : (
                <PlayerRegistrationForm data={data} email={email} sessionId={sessionId} />
            )}
        </div>
    )
}