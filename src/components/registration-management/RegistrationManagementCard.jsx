import { Calendar, Users } from "lucide-react"
import { Button } from "../ui/Button"
import { useRouter } from "next/navigation"

// Function to format date to a more readable format
const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    })
}

export function RegistrationManagementCard({ campaign }) {
    const router = useRouter();

    const handleDetailButtonClick = (campaignId) => {
        router.push(`/dashboard/registration-session-management/${campaignId}`);
        localStorage.setItem("memberRegistrationSessionId", campaignId);
    }
    return (
        <div className="bg-white rounded-lg overflow-hidden border border-gray-200 border-t-4 border-t-[#BD2427] shadow-lg">
            <div className="p-4 pb-2">
                <h2 className="text-xl font-bold">{campaign.registrationName}</h2>
            </div>
            <div className="p-4">
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-[#BD2427]" />
                        <div>
                            <p className="text-sm text-gray-500">Thời gian bắt đầu:</p>
                            <p className="font-medium">{formatDate(campaign.startDate)}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-[#BD2427]" />
                        <div>
                            <p className="text-sm text-gray-500">Thời gian kết thúc:</p>
                            <p className="font-medium">{formatDate(campaign.endDate)}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-[#BD2427]" />
                        <div>
                            <p className="text-sm text-gray-500">Loại tuyển quân:</p>
                            <div className="flex gap-2 mt-1">
                                {campaign.isAllowPlayerRecruit && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#BD2427]/10 text-[#BD2427] border border-[#BD2427]">
                                        Cầu thủ
                                    </span>
                                )}
                                {campaign.isAllowManagerRecruit && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#BD2427]/10 text-[#BD2427] border border-[#BD2427]">
                                        Quản lý
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <Button className="w-full py-2 px-4 bg-[#BD2427] hover:bg-[#BD2427]/90 text-white font-medium rounded-md transition-colors"
                            onClick={() => handleDetailButtonClick(campaign.id)}>
                            Chi tiết
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

