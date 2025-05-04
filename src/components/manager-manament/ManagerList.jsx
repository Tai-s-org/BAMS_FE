"use client"

export default function ManagerList({ managers, isDescending, toggleSortDirection, onViewDetails }) {
    return (
        <div className="rounded-md border overflow-hidden mb-6">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-xs uppercase">
                    <tr>
                        <th className="px-6 py-3 font-medium">Tên tài khoản</th>
                        <th className="px-6 py-3 font-medium cursor-pointer" onClick={toggleSortDirection}>
                            <div className="flex items-center">
                                Họ và tên
                                {isDescending === null && <span className="ml-2 text-gray-400">⇅</span>}
                                {isDescending === true && (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="ml-2"
                                    >
                                        <path d="m6 9 6 6 6-6" />
                                    </svg>
                                )}
                                {isDescending === false && (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="ml-2"
                                    >
                                        <path d="m18 15-6-6-6 6" />
                                    </svg>
                                )}
                            </div>
                        </th>
                        <th className="px-6 py-3 font-medium">Email</th>
                        <th className="px-6 py-3 font-medium">Đội</th>
                        <th className="px-6 py-3 font-medium">Trạng thái</th>
                        <th className="px-6 py-3 font-medium text-right"></th>
                    </tr>
                </thead>
                <tbody>
                    {managers.length > 0 ? (
                        managers.map((manager) => (
                            <tr key={manager.userId} className="bg-white border-b hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium">{manager.username}</td>
                                <td className="px-6 py-4">{manager.fullname}</td>
                                <td className="px-6 py-4">{manager.email}</td>
                                <td className="px-6 py-4">{manager.roleInformation.teamName || "Chưa có đội"}</td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-2 py-1 text-xs font-semibold rounded-full ${manager.isEnable ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                                    >
                                        {manager.isEnable ? "Đang hoạt động" : "Không hoạt động"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => onViewDetails(manager.userId)}
                                        className="px-3 py-1 text-sm border border-[#bd2427] text-[#bd2427] rounded hover:bg-[#bd2427] hover:text-white transition-colors inline-flex items-center"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="mr-1"
                                        >
                                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                        Xem chi tiết
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={7} className="px-6 py-4 text-center">
                                No managers found matching the current filters
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

