"use client"

import { useState, useRef, useEffect } from "react"
import { format, addMonths, subMonths, setMonth, setYear, getYear, getMonth } from "date-fns"
import { vi } from "date-fns/locale"
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover"

export function DatePicker({ value, onChange, placeholder, label, minDate, disabled }) {
    const [isOpen, setIsOpen] = useState(false)
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [yearSelectOpen, setYearSelectOpen] = useState(false)
    const [monthSelectOpen, setMonthSelectOpen] = useState(false)
    const yearSelectRef = useRef(null)
    const monthSelectRef = useRef(null)

    // Close dropdowns when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (yearSelectRef.current && !yearSelectRef.current.contains(event.target)) {
                setYearSelectOpen(false)
            }
            if (monthSelectRef.current && !monthSelectRef.current.contains(event.target)) {
                setMonthSelectOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    // Generate years for selection (10 years before and after current year)
    const currentYear = getYear(new Date())
    const years = Array.from({ length: 100 }, (_, i) => currentYear - 40 + i)

    // Month names in Vietnamese
    const months = [
        "Tháng 1",
        "Tháng 2",
        "Tháng 3",
        "Tháng 4",
        "Tháng 5",
        "Tháng 6",
        "Tháng 7",
        "Tháng 8",
        "Tháng 9",
        "Tháng 10",
        "Tháng 11",
        "Tháng 12",
    ]

    // Day names in Vietnamese
    const weekDays = ["CN", "Th 2", "Th 3", "Th 4", "Th 5", "Th 6", "Th 7"]

    // Navigate to previous month
    const prevMonth = () => {
        setCurrentMonth(subMonths(currentMonth, 1))
    }

    // Navigate to next month
    const nextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1))
    }

    // Select a specific month
    const selectMonth = (monthIndex) => {
        setCurrentMonth(setMonth(currentMonth, monthIndex))
        setMonthSelectOpen(false)
    }

    // Select a specific year
    const selectYear = (year) => {
        setCurrentMonth(setYear(currentMonth, year))
        setYearSelectOpen(false)
    }

    // Generate days for the current month view
    const getDaysInMonth = () => {
        const year = getYear(currentMonth)
        const month = getMonth(currentMonth)

        // First day of the month
        const firstDay = new Date(year, month, 1)
        // Last day of the month
        const lastDay = new Date(year, month + 1, 0)

        // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
        const firstDayOfWeek = firstDay.getDay()

        // Total days in the month
        const daysInMonth = lastDay.getDate()

        // Create array for all days to display
        const days = []

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDayOfWeek; i++) {
            days.push(null)
        }

        // Add days of the month
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i))
        }

        return days
    }

    // Check if a date is today
    const isToday = (date) => {
        const today = new Date()
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        )
    }

    // Check if a date is selected
    const isSelected = (date) => {
        if (!value) return false
        return (
            date.getDate() === value.getDate() &&
            date.getMonth() === value.getMonth() &&
            date.getFullYear() === value.getFullYear()
        )
    }

    // Check if a date is before minDate
    const isBeforeMinDate = (date) => {
        if (!minDate) return false
        return date < minDate
    }

    // Format date for display
    const formatDate = (date) => {
        if (!date) return ""
        return format(date, "dd/MM/yyyy", { locale: vi })
    }

    // Handle date selection
    const handleDateSelect = (date) => {
        if (minDate && date < minDate) return
        onChange(date)
        setIsOpen(false)
    }

    return (
        <div className="w-full">
            {label && <div className="text-sm font-medium mb-1 block">{label}</div>}
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal border-gray-200 hover:bg-gray-50"
                        disabled={disabled ? true : false}
                    >
                        <Calendar className="mr-2 h-4 w-4" />
                        {value ? formatDate(value) : placeholder}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-[400px]" align="start">
                    <div className="bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden">
                        {/* Calendar Header */}
                        <div className="p-3 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <Button variant="ghost" size="icon" onClick={prevMonth} className="h-7 w-7 p-0 rounded-full">
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>

                                <div className="flex items-center space-x-1">
                                    {/* Month selector */}
                                    <div className="relative" ref={monthSelectRef}>
                                        <Button
                                            variant="ghost"
                                            className="text-sm font-medium"
                                            onClick={() => {
                                                setMonthSelectOpen(!monthSelectOpen)
                                                setYearSelectOpen(false)
                                            }}
                                        >
                                            {months[getMonth(currentMonth)]}
                                        </Button>

                                        {monthSelectOpen && (
                                            <div className="absolute top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                                                <div className="grid grid-cols-3 p-2 gap-1 w-[220px]">
                                                    {months.map((month, index) => (
                                                        <Button
                                                            key={month}
                                                            variant="ghost"
                                                            className={`text-sm justify-center ${index === getMonth(currentMonth) ? "bg-[#FDE8E8] text-[#BD2427]" : ""
                                                                }`}
                                                            onClick={() => selectMonth(index)}
                                                        >
                                                            {month}
                                                        </Button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Year selector */}
                                    <div className="relative" ref={yearSelectRef}>
                                        <Button
                                            variant="ghost"
                                            className="text-sm font-medium"
                                            onClick={() => {
                                                setYearSelectOpen(!yearSelectOpen)
                                                setMonthSelectOpen(false)
                                            }}
                                        >
                                            {getYear(currentMonth)}
                                        </Button>

                                        {yearSelectOpen && (
                                            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                                                <div className="grid grid-cols-2 p-2 gap-1 w-[120px]">
                                                    {years.map((year) => (
                                                        <Button
                                                            key={year}
                                                            variant="ghost"
                                                            className={`text-sm justify-center ${year === getYear(currentMonth) ? "bg-[#FDE8E8] text-[#BD2427]" : ""
                                                                }`}
                                                            onClick={() => selectYear(year)}
                                                        >
                                                            {year}
                                                        </Button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <Button variant="ghost" size="icon" onClick={nextMonth} className="h-7 w-7 p-0 rounded-full">
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Calendar Body */}
                        <div className="p-3">
                            {/* Weekday headers */}
                            <div className="grid grid-cols-7 mb-2">
                                {weekDays.map((day) => (
                                    <div key={day} className="text-center text-xs font-medium text-gray-500">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar days */}
                            <div className="grid grid-cols-7 gap-1">
                                {getDaysInMonth().map((day, index) => (
                                    <div key={index} className="text-center">
                                        {day ? (
                                            <button
                                                type="button"
                                                onClick={() => handleDateSelect(day)}
                                                disabled={isBeforeMinDate(day)}
                                                className={`h-8 w-8 rounded-full flex items-center justify-center text-sm ${isSelected(day)
                                                        ? "bg-[#BD2427] text-white"
                                                        : isToday(day)
                                                            ? "bg-gray-100 hover:bg-gray-200"
                                                            : isBeforeMinDate(day)
                                                                ? "text-gray-300 cursor-not-allowed"
                                                                : "hover:bg-gray-100"
                                                    }`}
                                            >
                                                {day.getDate()}
                                            </button>
                                        ) : (
                                            <div className="h-8 w-8"></div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer with today button */}
                        <div className="p-2 border-t border-gray-200 flex justify-between">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    const today = new Date()
                                    if (!(minDate && today < minDate)) {
                                        handleDateSelect(today)
                                        setCurrentMonth(today)
                                    }
                                }}
                                className="text-xs"
                            >
                                Hôm nay
                            </Button>

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    onChange(null)
                                    setIsOpen(false)
                                }}
                                className="text-xs text-red-500 hover:text-red-600"
                            >
                                Xóa
                            </Button>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}
