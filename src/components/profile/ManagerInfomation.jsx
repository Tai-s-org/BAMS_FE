// "use client"

// import { Card, CardContent } from "@/components/ui/Card"
// import { Input } from "@/components/ui/Input"
// import { Label } from "@/components/ui/Label"
// import axios from "axios"
// import { BanknoteIcon as Bank, CreditCard } from "lucide-react"
// import { useEffect, useState } from "react"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"

// export default function ManagerInformation({ roleInformation, isEditing, formData, handleInputChange }) {

//     const [bankList, setBankList] = useState([])

//     useEffect(() => {
//         const fetchBankList = async () => {
//             try {
//                 const response = await axios.get('https://api.vietqr.io/v2/banks');
//                 console.log(response.data);

//                 setBankList(response.data || [])
//             } catch (error) {
//                 console.error("Error fetching bank list:", error)
//             }
//         }

//         fetchBankList()
//     }, [])

//     return (
//         <Card className="md:col-span-12 border-none shadow-md">
//             <div className="bg-rose-600 py-4 px-6 rounded-t-lg">
//                 <h2 className="text-xl font-semibold text-white flex items-center">
//                     <Bank className="h-5 w-5 mr-2" />
//                     Thông tin tài khoản ngân hàng
//                 </h2>
//             </div>
//             <CardContent className="p-6">
//                 {!isEditing ? (
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                         <div className="flex items-center gap-3">
//                             <Bank className="h-5 w-5 text-red-700" />
//                             <div>
//                                 <p className="text-sm text-gray-500">Ngân hàng</p>
//                                 <p className="font-medium text-gray-900">{roleInformation.bankName}</p>
//                             </div>
//                         </div>
//                         <div className="flex items-center gap-3">
//                             <CreditCard className="h-5 w-5 text-red-600" />
//                             <div>
//                                 <p className="text-sm text-gray-500">Số tài khoản</p>
//                                 <p className="font-medium text-gray-900">{roleInformation.bankAccountNumber}</p>
//                             </div>
//                         </div>
//                     </div>
//                 ) : (
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                         <div className="space-y-2">
//                             {bankList.length > 0 && (
//                                 <Select defaultValue="april-2025">
//                                     <SelectTrigger className="w-full">
//                                         <SelectValue placeholder="Ngân hàng" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         {bankList.map((bank) => (
//                                             <SelectItem key={bank.id} value={bank.name}>
//                                                 {bank.name} - {bank.shortName}
//                                             </SelectItem>
//                                         ))}
//                                     </SelectContent>
//                                 </Select>
//                             )}
//                         </div>
//                         <div className="space-y-2">
//                             <Label htmlFor="bankAccountNumber" className="text-gray-700 flex items-center">
//                                 <CreditCard className="h-4 w-4 mr-2 text-red-600" />
//                                 Số tài khoản
//                             </Label>
//                             <Input
//                                 id="bankAccountNumber"
//                                 name="roleInformation.bankAccountNumber"
//                                 value={formData?.roleInformation?.bankAccountNumber}
//                                 onChange={handleInputChange}
//                                 className="border-gray-300 focus:border-red-600 focus:ring-red-600"
//                             />
//                         </div>
//                     </div>
//                 )}
//             </CardContent>
//         </Card>
//     )
// }

"use client"

import { Card, CardContent } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import axios from "axios"
import { BanknoteIcon as Bank, CreditCard } from "lucide-react"
import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import Image from "next/image"

export default function ManagerInformation({ roleInformation, isEditing, formData, handleInputChange }) {
    const [bankList, setBankList] = useState([])

    useEffect(() => {
        const fetchBankList = async () => {
            try {
                const response = await axios.get('https://api.vietqr.io/v2/banks');
                console.log(response.data);

                setBankList(response.data?.data || [])
            } catch (error) {
                console.error("Error fetching bank list:", error)
            }
        }

        fetchBankList()
    }, [])

    const handleBankChange = (bankName) => {
        const selectedBank = bankList.find(bank => bank.name === bankName);
        if (!selectedBank) return;

        handleInputChange({
            target: {
                name: "roleInformation.bankName",
                value: selectedBank.name
            }
        });

        handleInputChange({
            target: {
                name: "roleInformation.bankBinId",
                value: selectedBank.bin
            }
        });
    };

    return (
        <Card className="md:col-span-12 border-none shadow-md">
            <div className="bg-rose-600 py-4 px-6 rounded-t-lg">
                <h2 className="text-xl font-semibold text-white flex items-center">
                    <Bank className="h-5 w-5 mr-2" />
                    Thông tin tài khoản ngân hàng
                </h2>
            </div>
            <CardContent className="p-6">
                {!isEditing ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex items-center gap-3">
                            <Bank className="h-5 w-5 text-red-700" />
                            <div>
                                <p className="text-sm text-gray-500">Ngân hàng</p>
                                <p className="font-medium text-gray-900">{roleInformation.bankName}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <CreditCard className="h-5 w-5 text-red-600" />
                            <div>
                                <p className="text-sm text-gray-500">Số tài khoản</p>
                                <p className="font-medium text-gray-900">{roleInformation.bankAccountNumber}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-gray-700 flex items-center">
                                <Bank className="h-4 w-4 mr-2 text-red-600" />
                                Ngân hàng
                            </Label>
                            {bankList.length > 0 && (
                                <Select
                                    value={formData?.roleInformation?.bankName || ""}
                                    onValueChange={handleBankChange}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue
                                            placeholder="Chọn ngân hàng"
                                            defaultValue={formData?.roleInformation?.bankName}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {bankList.map((bank) => (
                                            <SelectItem key={bank.id} value={bank.name}>
                                                <div className="flex items-center">
                                                    <Image src={bank.logo} alt={bank.name} width={60} height={60} className="mr-2" />
                                                    {bank.name} - {bank.shortName}
                                                </div>

                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bankAccountNumber" className="text-gray-700 flex items-center">
                                <CreditCard className="h-4 w-4 mr-2 text-red-600" />
                                Số tài khoản
                            </Label>
                            <Input
                                id="bankAccountNumber"
                                name="roleInformation.bankAccountNumber"
                                value={formData?.roleInformation?.bankAccountNumber}
                                onChange={handleInputChange}
                                className="border-gray-300 focus:border-red-600 focus:ring-red-600"
                            />
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
