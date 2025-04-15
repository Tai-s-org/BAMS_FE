'use client'

import { Suspense } from "react"
import SetNewPasswordForm from "./SetNewPasswordForm"

export default function SetNewPasswordPage() {
    return (
        <Suspense fallback={<div className="h-full flex items-center justify-center bg-gray-100 p-4">Loading...</div>}>
            <SetNewPasswordForm />
        </Suspense>
    )
}