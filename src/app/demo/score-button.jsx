"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { ScorePopup } from "./score-popup"


export function ScoreButton({ playerId, playerName, registrationName, gender, email, candidateNumber, onStatusChange }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <Button onClick={() => setIsOpen(true)}>Chấm điểm</Button>

            <ScorePopup
                open={isOpen}
                onStatusChange = {onStatusChange}
                onClose={() => setIsOpen(false)}
                player={{
                    id: playerId,
                    name: playerName,
                    registrationName,
                    gender,
                    email,
                    candidateNumber
                }}
            />
        </>
    )
}

