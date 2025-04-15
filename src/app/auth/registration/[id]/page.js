"use client";

import RegistrationSessionDetail from "@/components/registration-session/RegisTrationSessionDetail";
import { useParams } from 'next/navigation';

export default function RegistrationSessionDetailPage() {
    const { id } = useParams();
    return (
        <div>
            <RegistrationSessionDetail id={id} />
        </div>
    );
}