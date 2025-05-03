"use client";

import RegistrationManagementDetail from "@/components/registration-management/RegisTrationManagementDetail";
import { useParams } from 'next/navigation';

export default function RegistrationSessionDetailPage() {
    const { id } = useParams();
    return (
        <div>
            <RegistrationManagementDetail id={id} />
        </div>
    );
}