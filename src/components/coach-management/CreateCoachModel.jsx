"use client"

import coachApi from "@/api/coach"
import { useState } from "react"
import { DatePicker } from "../ui/DatePicker"

export default function CreateCoachModal({ onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        "fullname": "",
        "email": "",
        "profileImage": "",
        "phone": "",
        "address": "",
        "dateOfBirth": "",
        "contractStartDate": "",
        "contractEndDate": "",
    })

    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }))
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.fullname.trim()) {
            newErrors.fullname = "Full name is required"
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required"
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateForm()) return

        setIsSubmitting(true)
        try {
            console.log("Submitting form data:", formData);

            const response = await coachApi.createNewCoachAccount(formData);
            console.log(response);

            onClose()
        } catch (error) {
            console.log("Error submitting form:", error)
            setIsSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="px-6 py-4 border-b flex justify-between items-center">
                    <h3 className="text-xl font-semibold">Tạo mới huấn luyện viên</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Họ và tên <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="fullname"
                            value={formData.fullname}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#bd2427] ${errors.fullname ? "border-red-500" : "border-gray-300"}`}
                        />
                        {errors.fullname && <p className="mt-1 text-sm text-red-500">{errors.fullname}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#bd2427] ${errors.email ? "border-red-500" : "border-gray-300"}`}
                            required
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                    </div>

                    {/* Profile Image */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh đại diện (URL)</label>
                        <input
                            type="text"
                            name="profileImage"
                            value={formData.profileImage}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#bd2427]"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#bd2427]"
                            required
                        />
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#bd2427]"
                            required
                        />
                    </div>

                    {/* Date of Birth */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                        <DatePicker
                            value={formData.dateOfBirth ? new Date(formData.dateOfBirth) : null}
                            onChange={(date) => setFormData((prev) => ({
                                ...prev,
                                dateOfBirth: date?.toISOString() || ""
                            }))}

                        />
                    </div>

                    {/* Contract Start Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ngày kí hợp đồng</label>
                        <DatePicker
                            value={formData.contractStartDate ? new Date(formData.contractStartDate) : null}
                            onChange={(date) => setFormData((prev) => ({
                                ...prev,
                                contractStartDate: date?.toISOString() || ""
                            }))}
                            minDate={formData.contractStartDate || Date.now()}
                            required
                        />
                    </div>

                    {/* Contract End Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ngày hết hạn hợp đồng</label>
                        <DatePicker
                            value={formData.contractEndDate ? new Date(formData.contractEndDate) : null}
                            onChange={(date) => setFormData((prev) => ({
                                ...prev,
                                contractEndDate: date?.toISOString() || ""
                            }))}
                            required
                        />
                    </div>

                    {/* Buttons */}
                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-[#bd2427] text-white rounded-md hover:bg-[#a61f22] transition-colors flex items-center"
                        >
                            {isSubmitting && (
                                <svg
                                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                            )}
                            Tạo huấn luyện viên
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
