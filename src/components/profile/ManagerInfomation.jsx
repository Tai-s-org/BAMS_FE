"use client"

import { Card, CardContent } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { BanknoteIcon as Bank, CreditCard } from "lucide-react"

export default function ManagerInformation({ roleInformation, isEditing, formData, handleInputChange }) {
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
                            <Label htmlFor="bankName" className="text-gray-700 flex items-center">
                                <Bank className="h-4 w-4 mr-2 text-red-700" />
                                Ngân hàng
                            </Label>
                            <Input
                                id="bankName"
                                name="bankName"
                                value={formData.bankName}
                                onChange={handleInputChange}
                                className="border-gray-300 focus:border-red-700 focus:ring-red-700"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bankAccountNumber" className="text-gray-700 flex items-center">
                                <CreditCard className="h-4 w-4 mr-2 text-red-600" />
                                Số tài khoản
                            </Label>
                            <Input
                                id="bankAccountNumber"
                                name="bankAccountNumber"
                                value={formData.bankAccountNumber}
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

