"use client"

import { useState, useRef, useEffect } from "react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"

export function DatePicker({ date, setDate, placeholder }) {
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef(null)
    const [currentMonth, setCurrentMonth] = useState(date || new Date())

    // Close calendar when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    // Generate days for the current month
    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate()
    }

    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay()
    }

    const handleDateSelect = (day) => {
        const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
        setDate(selectedDate)
        setIsOpen(false)
    }

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
    }

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
    }

    const renderCalendar = () => {
        const year = currentMonth.getFullYear()
        const month = currentMonth.getMonth()
        const daysInMonth = getDaysInMonth(year, month)
        const firstDay = getFirstDayOfMonth(year, month)

        const days = []
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="w-9 h-9"></div>)
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const isSelected = date && date.getDate() === day && date.getMonth() === month && date.getFullYear() === year

            days.push(
                <div
                    key={day}
                    onClick={() => handleDateSelect(day)}
                    className={`w-9 h-9 flex items-center justify-center rounded-full cursor-pointer ${isSelected ? "bg-[#BD2427] text-white font-semibold" : "text-gray-700 hover:bg-gray-100"
                        }`}
                >
                    {day}
                </div>,
            )
        }

        return days
    }

    return (
        <div ref={containerRef} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full py-2 px-3 flex items-center justify-start bg-white border border-gray-200 rounded text-left font-normal ${date ? "text-gray-700" : "text-gray-400"
                    }`}
            >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "dd/MM/yyyy", { locale: vi }) : <span>{placeholder}</span>}
            </button>

            {isOpen && (
                <div className="absolute top-full mt-1 left-0 z-50 bg-white rounded-lg shadow-lg w-[280px] p-4">
                    <div className="flex justify-between items-center mb-4">
                        <button
                            onClick={handlePrevMonth}
                            className="border-none bg-transparent cursor-pointer p-1 hover:bg-gray-100 rounded"
                        >
                            &lt;
                        </button>
                        <div className="font-medium">{format(currentMonth, "MMMM yyyy", { locale: vi })}</div>
                        <button
                            onClick={handleNextMonth}
                            className="border-none bg-transparent cursor-pointer p-1 hover:bg-gray-100 rounded"
                        >
                            &gt;
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((day, index) => (
                            <div key={index} className="text-center text-xs font-semibold text-gray-500">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>

                    {date && (
                        <div className="mt-4 flex justify-between">
                            <button
                                onClick={() => {
                                    setDate(null)
                                    setIsOpen(false)
                                }}
                                className="py-1.5 px-3 bg-white border border-gray-200 rounded text-sm hover:bg-gray-50"
                            >
                                Xóa
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="py-1.5 px-3 bg-[#BD2427] text-white border-none rounded text-sm hover:bg-[#BD2427]/90"
                            >
                                Áp dụng
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

