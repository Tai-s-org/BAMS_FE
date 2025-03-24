"use client"

import { useState, useEffect } from "react"
import { Search, Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover"
import { Switch } from "@/components/ui/Switch"
import { Label } from "@/components/ui/Label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/Radio-group"


import registrationSessionApi from "@/api/registrationSession"
import { RegistrationSessionCard } from "./RegistrationSessionCard"

export default function RegistrationManagement() {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalItems, setTotalItems] = useState(0)

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [isEnable, setIsEnable] = useState(true)
  const [isAllowPlayerRecruit, setIsAllowPlayerRecruit] = useState(null)
  const [isAllowManagerRecruit, setIsAllowManagerRecruit] = useState(null)
  const [sortOrder, setSortOrder] = useState("desc") // desc = newest first

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(6)
  const [totalPages, setTotalPages] = useState(1)

  // Format date for display
  const formatDate = (date) => {
    if (!date) return ""
    return format(new Date(date), "dd/MM/yyyy", { locale: vi })
  }

  // Fetch data from API
  const fetchData = async () => {
    setLoading(true)

    try {
      // Build filters object
      const filters = {
        Name: searchQuery || undefined,
        StartDate: startDate ? format(startDate, "yyyy-MM-dd") : undefined,
        EndDate: endDate ? format(endDate, "yyyy-MM-dd") : undefined,
        IsEnable: true,
        IsAllowPlayerRecruit: isAllowPlayerRecruit,
        IsAllowManagerRecruit: isAllowManagerRecruit,
        IsDescending: sortOrder === "desc",
        PageNumber: currentPage,
        PageSize: pageSize,
      }

      const response = await registrationSessionApi.getRegistrationSessions(filters);
      console.log(response);
      
      if (response.data && response.data.status === "Success") {
        setCampaigns(response.data.data.items || [])
        setTotalItems(response.data.data.totalItems || 0)
        setTotalPages(response.data.data.totalPages)
      } else {
        console.error("API Error:", response.data?.message)
        setCampaigns([])
        setTotalItems(0)
        setTotalPages(0)
      }
    } catch (error) {
      console.error("Failed to fetch data:", error)
      setCampaigns([])
      setTotalItems(0)
      setTotalPages(0)
    } finally {
      setLoading(false)
    }
  }

  // Fetch data when filters or pagination changes
  useEffect(() => {
    fetchData()
  }, [
    searchQuery,
    startDate,
    endDate,
    isEnable,
    isAllowPlayerRecruit,
    isAllowManagerRecruit,
    sortOrder,
    currentPage,
    pageSize,
  ])

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  // Handle page size change
  const handlePageSizeChange = (event) => {
    setPageSize(Number.parseInt(event.target.value))
    setCurrentPage(1) // Reset to first page when changing page size
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-[#BD2427]">Đợt Tuyển Quân</h1>

      {/* Search and Filter Section */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm theo tên..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#BD2427] focus:border-transparent"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Start Date Picker */}
              <div>
                <Label htmlFor="start-date" className="text-sm font-medium mb-1 block">
                  Từ ngày
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal border-gray-200 hover:bg-gray-50"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {startDate ? formatDate(startDate) : "Chọn ngày bắt đầu"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0" align="start">
                    <DayPicker
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      locale={vi}
                      className="p-3"
                      showOutsideDays={true}
                      captionLayout="dropdown-buttons"
                      fromYear={2020}
                      toYear={2030}
                      classNames={{
                        day_selected:
                          "bg-[#BD2427] text-white hover:bg-[#A61F22] hover:text-white focus:bg-[#BD2427] focus:text-white",
                        day_today: "bg-gray-100",
                        button: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-gray-100 focus:bg-gray-100",
                        head_cell: "text-xs font-medium text-gray-500",
                        cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-[#FDE8E8] first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
                        caption: "flex justify-center pt-1 relative items-center px-2",
                        caption_label: "text-sm font-medium hidden",
                        caption_dropdowns: "flex justify-center gap-1 grow",
                        dropdown:
                          "appearance-none bg-white border border-gray-200 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#BD2427] focus:border-transparent",
                        dropdown_month: "mr-1",
                        dropdown_year: "ml-1",
                        nav: "space-x-1 flex items-center",
                        nav_button: "h-7 w-7 bg-transparent p-0 hover:bg-gray-100 rounded-full",
                        nav_button_previous: "absolute left-1",
                        nav_button_next: "absolute right-1",
                        table: "w-full border-collapse space-y-1",
                      }}
                      components={{
                        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
                        IconRight: () => <ChevronRight className="h-4 w-4" />,
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* End Date Picker */}
              <div>
                <Label htmlFor="end-date" className="text-sm font-medium mb-1 block">
                  Đến ngày
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal border-gray-200 hover:bg-gray-50"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {endDate ? formatDate(endDate) : "Chọn ngày kết thúc"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0" align="start">
                    <DayPicker
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      locale={vi}
                      className="p-3"
                      showOutsideDays={true}
                      captionLayout="dropdown-buttons"
                      fromYear={2020}
                      toYear={2030}
                      classNames={{
                        day_selected:
                          "bg-[#BD2427] text-white hover:bg-[#A61F22] hover:text-white focus:bg-[#BD2427] focus:text-white",
                        day_today: "bg-gray-100",
                        button: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-gray-100 focus:bg-gray-100",
                        head_cell: "text-xs font-medium text-gray-500",
                        cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-[#FDE8E8] first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
                        caption: "flex justify-center pt-1 relative items-center px-2",
                        caption_label: "text-sm font-medium hidden",
                        caption_dropdowns: "flex justify-center gap-1 grow",
                        dropdown:
                          "appearance-none bg-white border border-gray-200 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#BD2427] focus:border-transparent",
                        dropdown_month: "mr-1",
                        dropdown_year: "ml-1",
                        nav: "space-x-1 flex items-center",
                        nav_button: "h-7 w-7 bg-transparent p-0 hover:bg-gray-100 rounded-full",
                        nav_button_previous: "absolute left-1",
                        nav_button_next: "absolute right-1",
                        table: "w-full border-collapse space-y-1",
                      }}
                      components={{
                        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
                        IconRight: () => <ChevronRight className="h-4 w-4" />,
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Player Recruitment Filter */}
              <div>
                <Label className="text-sm font-medium mb-1 block">Tuyển cầu thủ</Label>
                <RadioGroup
                  value={isAllowPlayerRecruit === null ? "all" : isAllowPlayerRecruit ? "yes" : "no"}
                  onValueChange={(value) => {
                    if (value === "all") setIsAllowPlayerRecruit(null)
                    else if (value === "yes") setIsAllowPlayerRecruit(true)
                    else setIsAllowPlayerRecruit(false)
                  }}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="player-all" />
                    <Label htmlFor="player-all">Tất cả</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="player-yes" />
                    <Label htmlFor="player-yes">Có</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="player-no" />
                    <Label htmlFor="player-no">Không</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Manager Recruitment Filter */}
              <div>
                <Label className="text-sm font-medium mb-1 block">Tuyển HLV</Label>
                <RadioGroup
                  value={isAllowManagerRecruit === null ? "all" : isAllowManagerRecruit ? "yes" : "no"}
                  onValueChange={(value) => {
                    if (value === "all") setIsAllowManagerRecruit(null)
                    else if (value === "yes") setIsAllowManagerRecruit(true)
                    else setIsAllowManagerRecruit(false)
                  }}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="manager-all" />
                    <Label htmlFor="manager-all">Tất cả</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="manager-yes" />
                    <Label htmlFor="manager-yes">Có</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="manager-no" />
                    <Label htmlFor="manager-no">Không</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between gap-4">
              {/* Active Status Filter */}
              <div className="flex items-center space-x-2">
                <Switch id="active-status" checked={isEnable} onCheckedChange={setIsEnable} />
                <Label htmlFor="active-status">Chỉ hiện đợt đang hoạt động</Label>
              </div>

              {/* Sort Order */}
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">Sắp xếp:</span>
                <RadioGroup value={sortOrder} onValueChange={setSortOrder} className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="desc" id="sort-newest" />
                    <Label htmlFor="sort-newest">Mới nhất</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="asc" id="sort-oldest" />
                    <Label htmlFor="sort-oldest">Cũ nhất</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campaigns Grid */}
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-3 border-gray-200 border-t-[#BD2427] rounded-full animate-spin"></div>
        </div>
      ) : campaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <RegistrationSessionCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <div className="flex flex-col items-center">
            <Calendar className="h-12 w-12 text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">Không tìm thấy đợt tuyển quân nào phù hợp với bộ lọc.</p>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages >= 0 && (
        <div className="flex flex-col md:flex-row justify-between items-center mt-8 gap-4 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Hiển thị</span>
            <select
              value={pageSize}
              onChange={handlePageSizeChange}
              className="w-20 p-1 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#BD2427] focus:border-transparent"
            >
              {[3, 6, 9, 12, 24].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-500">mục trên mỗi trang</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="icon"
                  onClick={() => handlePageChange(page)}
                  className={`h-8 w-8 p-0 ${currentPage === page ? "bg-[#BD2427] hover:bg-[#A61F22]" : ""}`}
                >
                  {page}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

