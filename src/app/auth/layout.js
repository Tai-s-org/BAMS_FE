import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Auth({ children }) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-lg w-full">
            <Button
                variant="outline"
                className="border border-gray-300 text-gray-700 hover:bg-gray-100 transition-all duration-300"
                asChild
            >
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Trang chủ
                </Link>
            </Button>
            {children}
        </div>
    );
}