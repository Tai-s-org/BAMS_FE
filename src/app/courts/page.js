"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Slider } from "@/components/ui/Slider";
import { PlusCircle, Filter, Search } from "lucide-react";
import CourtList from "@/components/court/CourtList";
import CreateCourtModal from "@/components/court/CreateCourtModal";
import UpdateCourtModal from "@/components/court/UpdateCourtModal";
import Pagination from "@/components/Pagination";
import { Label } from "@/components/ui/Label";
import courtApi from "@/api/court";
import { useAuth } from "@/hooks/context/AuthContext";

export default function CourtManagement() {
  const { user } = useAuth();

  if (user.roleCode !== "Manager") return <p>Khong co quyen truy cap bro</p>

  const [courts, setCourts] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState(null);

  // Filtering states
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [courtKindFilter, setCourtKindFilter] = useState("");
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [isModified, setIsModified] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(1);
  const courtsPerPage = 6;

  const fetchCourts = async () => {
    try {
      const data = {
        CourtName: searchTerm,
        Type: typeFilter === "all" ? "" : typeFilter,
        Kind: courtKindFilter === "all" ? "" : courtKindFilter,
        MinRentPricePerHour: priceRange[0],
        MaxRentPricePerHour: priceRange[1],
        PageNumber: currentPage,
        PageSize: courtsPerPage
      }

      const currentCourts = await courtApi.courtList(data);
      setCourts(currentCourts?.data.items);
      setTotalPage(currentCourts?.data.totalPages);
      setTotalRecords(currentCourts?.data.totalRecords);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (isFilterApplied) {
      fetchCourts();
    }
    setIsFilterApplied(true);
  }, [currentPage, isModified])

  const handleCreateCourt = async (newCourt) => {
    try {
      const response = await courtApi.createCourt(newCourt);
      setIsCreateModalOpen(false);
      setIsModified(!isModified);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateCourt = (updatedCourt) => {
    try {
      console.log("Updated court 1", updatedCourt);

      setIsCreateModalOpen(false);
      setIsModified(!isModified);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCourt = async (id) => {
    try {
      await courtApi.deleteCourt(id);
      setIsModified(!isModified);
      await fetchCourts();
    } catch (err) {
      console.error(err);
    }
  };

  const openUpdateModal = (court) => {
    setSelectedCourt(court);
    setIsUpdateModalOpen(true);
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber)
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản Lý Sân</h1>
          <p className="text-lg text-gray-500">Quản lý và theo dõi tất cả các sân bóng rổ</p>
        </div>
        <Button
          variant="destructive"
          className="flex items-center gap-2 text-white px-4 py-2 rounded-md shadow-md active:scale-95 transition-all duration-300"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <PlusCircle className="h-4 w-4" />
          Thêm Sân Mới
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="bg-[#fef8f8] p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="md:col-span-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Tìm kiếm theo tên sân"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full bg-white border border-gray-300 rounded-md shadow-sm">
                <SelectValue placeholder="Chọn loại sân" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất Cả</SelectItem>
                <SelectItem value="Indoor">Trong Nhà</SelectItem>
                <SelectItem value="Outdoor">Ngoài Trời</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Select value={courtKindFilter} onValueChange={setCourtKindFilter}>
              <SelectTrigger className="w-full bg-white border border-gray-300 rounded-md shadow-sm">
                <SelectValue placeholder="Chọn kiểu sân" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất Cả</SelectItem>
                <SelectItem value="3x3">Sân 3x3</SelectItem>
                <SelectItem value="5x5">Sân 5x5</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

          <div className="md:col-span-2">
            <Label className="text-sm font-medium text-black block mb-2 pt-2">
              Khoảng Giá: {priceRange[0]}.000đ - {priceRange[1]}.000đ
            </Label>
            <Slider min={0} max={500} step={50} value={priceRange} onValueChange={setPriceRange} className="py-4" />
          </div>
          <div className="flex items-end">
            <Button
              className="w-full bg-[#BD2427] text-white rounded-md px-4 py-2 shadow-md hover:bg-red-500 transition-all duration-300"
              onClick={fetchCourts}
            >
              <Filter className="h-4 w-4 mr-2" />
              Lọc
            </Button>
          </div>
        </div>
      </div>

      <CourtList courts={courts} onEdit={openUpdateModal} onDelete={handleDeleteCourt} />

      <Pagination
        courtsPerPage={courtsPerPage}
        totalCourts={totalRecords}
        paginate={paginate}
        currentPage={currentPage}
      />

      {/* Modals */}
      <CreateCourtModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateCourt={handleCreateCourt}
      />

      <UpdateCourtModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onUpdateCourt={handleUpdateCourt}
        court={selectedCourt}
      />
    </div>
  );
}
