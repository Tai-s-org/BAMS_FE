"use client";

import CoachDetail from "@/components/coach-management/CoachDetail";
import { useParams } from 'next/navigation';

export default function ManagerDetailPage() {
    const { id } = useParams();
    return (
        <div>
            <CoachDetail id={id} />
        </div>
    );
}