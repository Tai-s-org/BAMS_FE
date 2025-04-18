"use client"

import { useState, useEffect, useRef } from "react"
import { Clock } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover"
import { Label } from "@/components/ui/Label"
import { cn } from "@/lib/utils"

export function TimePicker({ value, onChange, label, className, disabled }) {
    const [isOpen, setIsOpen] = useState(false)
    const [hours, setHours] = useState("01")
    const [minutes, setMinutes] = useState("00")
    const [period, setPeriod] = useState("AM")

    const hoursRef = useRef(null)
    const minutesRef = useRef(null)

    // Parse initial value on mount and when value changes
    useEffect(() => {
        if (value) {
            const [h, m] = value.split(":")
            let hourValue = Number.parseInt(h, 10)
            const isPM = hourValue >= 12

            if (isPM) {
                hourValue = hourValue === 12 ? 12 : hourValue - 12
                setPeriod("PM")
            } else {
                hourValue = hourValue === 0 ? 12 : hourValue
                setPeriod("AM")
            }

            setHours(hourValue.toString().padStart(2, "0"))
            setMinutes(m.padStart(2, "0"))
        }
    }, [value])

    // Scroll to selected hour and minute when popover opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                if (hoursRef.current) {
                    const hourElement = hoursRef.current.querySelector(`[data-hour="${hours}"]`)
                    if (hourElement) {
                        hourElement.scrollIntoView({ block: "center", behavior: "auto" })
                    }
                }

                if (minutesRef.current) {
                    const minuteElement = minutesRef.current.querySelector(`[data-minute="${minutes}"]`)
                    if (minuteElement) {
                        minuteElement.scrollIntoView({ block: "center", behavior: "auto" })
                    }
                }
            }, 100)
        }
    }, [isOpen, hours, minutes])

    // Format time for display
    const formatTime = () => {
        if (!hours || !minutes) return ""

        let h = Number.parseInt(hours, 10)
        if (period === "PM" && h < 12) h += 12
        if (period === "AM" && h === 12) h = 0

        return `${h.toString().padStart(2, "0")}:${minutes}`
    }

    // Update the time value
    const updateTime = (newHours, newMinutes, newPeriod) => {
        const h = newHours !== undefined ? newHours : hours
        const m = newMinutes !== undefined ? newMinutes : minutes
        const p = newPeriod !== undefined ? newPeriod : period

        let hourValue = Number.parseInt(h, 10)
        if (p === "PM" && hourValue < 12) hourValue += 12
        if (p === "AM" && hourValue === 12) hourValue = 0

        const formattedTime = `${hourValue.toString().padStart(2, "0")}:${m}`
        onChange(formattedTime)
    }

    // Generate hours for selection (1-12)
    const hourOptions = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0"))

    // Generate minutes for selection (00-59)
    const minuteOptions = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"))

    return (
        <div className={cn("w-full", className)}>
            {label && <Label className="mb-1 block">{label}</Label>}
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal border-gray-200 hover:bg-gray-50"
                        disabled={disabled ? true : false}
                    >
                        <Clock className="mr-2 h-4 w-4" />
                        {value ? formatTime() : "Chọn giờ"}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-[300px]" align="start">
                    <div className="bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden">
                        {/* Time Picker Header */}
                        <div className="p-3 border-b border-gray-200 flex justify-center">
                            <div className="flex items-center space-x-2 text-2xl font-semibold">
                                <span className="text-[#BD2427]">{hours}</span>
                                <span>:</span>
                                <span className="text-[#BD2427]">{minutes}</span>
                                <span className="text-base ml-2">{period}</span>
                            </div>
                        </div>

                        {/* Time Picker Body - Two Column Layout */}
                        <div className="flex border-b border-gray-200">
                            {/* Hours Column */}
                            <div className="w-1/3 border-r border-gray-200">
                                <div className="text-center py-2 text-sm font-medium text-gray-500">Giờ</div>
                                <div
                                    ref={hoursRef}
                                    className="h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                                >
                                    <div className="py-3">
                                        {" "}
                                        {/* Padding to allow scrolling to first/last items */}
                                        {hourOptions.map((hour) => (
                                            <div
                                                key={hour}
                                                data-hour={hour}
                                                className={cn(
                                                    "py-2 px-4 text-center cursor-pointer hover:bg-gray-100 transition-colors",
                                                    hours === hour ? "bg-[#FDE8E8] text-[#BD2427] font-medium" : "",
                                                )}
                                                onClick={() => {
                                                    setHours(hour)
                                                    updateTime(hour, undefined, undefined)
                                                }}
                                            >
                                                {Number.parseInt(hour, 10)}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Minutes Column */}
                            <div className="w-1/3 border-r border-gray-200">
                                <div className="text-center py-2 text-sm font-medium text-gray-500">Phút</div>
                                <div
                                    ref={minutesRef}
                                    className="h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                                >
                                    <div className="py-3">
                                        {" "}
                                        {/* Padding to allow scrolling to first/last items */}
                                        {minuteOptions.map((minute) => (
                                            <div
                                                key={minute}
                                                data-minute={minute}
                                                className={cn(
                                                    "py-2 px-4 text-center cursor-pointer hover:bg-gray-100 transition-colors",
                                                    minutes === minute ? "bg-[#FDE8E8] text-[#BD2427] font-medium" : "",
                                                )}
                                                onClick={() => {
                                                    setMinutes(minute)
                                                    updateTime(undefined, minute, undefined)
                                                }}
                                            >
                                                {minute}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* AM/PM Column */}
                            <div className="w-1/3">
                                <div className="text-center py-2 text-sm font-medium text-gray-500">AM/PM</div>
                                <div className="flex flex-col h-[200px]">
                                    <div
                                        className={cn(
                                            "flex-1 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors",
                                            period === "AM" ? "bg-[#FDE8E8] text-[#BD2427] font-medium" : "",
                                        )}
                                        onClick={() => {
                                            setPeriod("AM")
                                            updateTime(undefined, undefined, "AM")
                                        }}
                                    >
                                        AM
                                    </div>
                                    <div
                                        className={cn(
                                            "flex-1 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors",
                                            period === "PM" ? "bg-[#FDE8E8] text-[#BD2427] font-medium" : "",
                                        )}
                                        onClick={() => {
                                            setPeriod("PM")
                                            updateTime(undefined, undefined, "PM")
                                        }}
                                    >
                                        PM
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-2 flex justify-between">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    const now = new Date()
                                    const h = now.getHours()
                                    const m = now.getMinutes()
                                    const isPM = h >= 12

                                    const hour12 = h === 0 ? "12" : h > 12 ? (h - 12).toString() : h.toString()
                                    const minute = m.toString().padStart(2, "0")

                                    setHours(hour12.padStart(2, "0"))
                                    setMinutes(minute)
                                    setPeriod(isPM ? "PM" : "AM")
                                    updateTime(hour12.padStart(2, "0"), minute, isPM ? "PM" : "AM")
                                }}
                                className="text-xs"
                            >
                                Hiện tại
                            </Button>

                            <div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        onChange("")
                                        setIsOpen(false)
                                    }}
                                    className="text-xs text-red-500 hover:text-red-600 mr-2"
                                >
                                    Xóa
                                </Button>
                                <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => setIsOpen(false)}
                                    className="text-xs bg-[#BD2427] hover:bg-[#9A1D1F]"
                                >
                                    Xác nhận
                                </Button>
                            </div>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}
