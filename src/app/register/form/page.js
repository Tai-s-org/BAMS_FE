'use client'

import ManagerRegistrationForm from "@/components/member-registration/manager-registration/ManagerRegistrationForm"
import PlayerRegistrationForm from "@/components/member-registration/player-registration/PlayerRegistrationForm"
import { sq } from "date-fns/locale"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Form() {
    const [email, setEmail] = useState("")
    const [role, setRole] = useState("")
    const [sessionId, setSessionId] = useState("")
    const [data, setData] = useState("")
    const router = useRouter()

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

    return (
        <div>

            {role === "manager" ? (
                <ManagerRegistrationForm data={data} email={email} sessionId={sessionId} />
            ) : (
                <PlayerRegistrationForm />
            )}
        </div>
    )
}