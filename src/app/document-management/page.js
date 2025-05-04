"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/Dialog"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { FileText, Upload, Search, X, Download } from "lucide-react"
import { useToasts } from "@/hooks/providers/ToastProvider"
import chatbotApi from "@/api/chatbot"

export default function DocumentManagement() {
    // Thông tin về tài liệu hiện tại
    const [currentDocument, setCurrentDocument] = useState({
        fileName: "so-tay-clb-bong-ro-yen-hoa-2025.pdf",
        uploadDate: "2025-01-10",
        fileSize: "2.4 MB",
        documentUrl: ""
    })

    const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedFile, setSelectedFile] = useState(null)
    const [documentSections, setDocumentSections] = useState([
        {
            id: "",
            text: "",
        }])
    const [filteredSections, setFilteredSections] = useState([])
    const { addToast } = useToasts()
    const fileInputRef = useRef(null)
    const [isNewDocument, setIsNewDocument] = useState(false)

    useEffect(() => {
        fetchDocumentSections()
    }, [isNewDocument])

    useEffect(() => {
        const timer = setTimeout(() => {
            const filtered = documentSections.filter((section) =>
                section.text.toLowerCase().includes(searchQuery.toLowerCase()),
            )
            setFilteredSections(filtered)
            if (filtered.length === 0) {
                setFilteredSections([
                    {
                        id: "no-results",
                        text: "Không tìm thấy đề mục nào phù hợp với từ khóa tìm kiếm của bạn.",
                    },
                ])
            }
        }, 300) // Thay đổi thời gian debounce nếu cần
        return () => clearTimeout(timer)
    }, [searchQuery])

    const fetchDocumentSections = async () => {
        try {
            const data = {
                useFor: "Guest"
            }
            const response = await chatbotApi.getDocuments(data)
            setDocumentSections(response.data)
            setFilteredSections(response.data)

        } catch (error) {
            console.error("Lỗi khi tải dữ liệu đề mục:", error)
            if (error.response.status === 401) {
                addToast({ message: error.response.data.Message, type: "error" });
            }
        }
    }

    // Xử lý khi chọn file
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0])
        }
    }

    // Xử lý khi đăng tải tài liệu mới
    const handleUploadDocument = async () => {
        if (selectedFile) {
            try {
                const data = new FormData()
                data.append("DocumentFile", selectedFile)
                const filter = {
                    useFor: "Guest",
                }
                const response = await chatbotApi.uploadDocument(filter, data)
                setCurrentDocument({
                    fileName: response?.data.data.documentName,
                    uploadDate: new Date().toISOString().split("T")[0],
                    fileSize: formatFileSize(selectedFile.size),
                    documentUrl: response?.data.data.documentUrl,
                })
                addToast({ message: "Tài liệu đã được đăng tải thành công!", type: "success" });
                setIsNewDocument(!isNewDocument)
            } catch (error) {
                console.error("Lỗi khi đăng tải tài liệu:", error)
                if (error.response.status === 401) {
                    addToast({ message: error.response.data.Message, type: "error" });
                }
            } finally {
                setUploadDialogOpen(false)
                setSelectedFile(null)
            }
        }
    }

    const handleDownload = async () => {
        try {
            const response = await chatbotApi.downloadDocument(); // cần trả về response đầy đủ, không destructuring .data
            console.log("Headers:", response.headers);
            const blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            });
    
            const url = window.URL.createObjectURL(blob);
            const fileName = getFileNameFromHeader(response) || "YHBT_So_Tay.docx";
    
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Lỗi khi tải xuống tài liệu:", error);
            if (error.response?.status === 401) {
                addToast({ message: error.response.data.Message, type: "error" });
            }
        }
    };
    
    const getFileNameFromHeader = (response) => {
        const disposition = response.headers["content-disposition"];
        if (!disposition) return null;
    
        // Ưu tiên filename*=UTF-8''ten
        const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/);
        if (utf8Match) return decodeURIComponent(utf8Match[1]);
    
        // Fallback: filename=ten
        const fileNameMatch = disposition.match(/filename="?([^"]+)"?/);
        if (fileNameMatch) return fileNameMatch[1];
    
        return null;
    };

    // Hàm định dạng kích thước file
    const formatFileSize = (bytes) => {
        if (bytes === 0) return "0 Bytes"
        const k = 1024
        const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
    }

    // Xử lý khi nhấn nút "Chọn file"
    const handleSelectFileClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click()
        }
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-6 text-[#BD2427]">Quản Lý Tài Liệu Câu Lạc Bộ</h1>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <FileText className="h-10 w-10 text-[#BD2427]" />
                        <div>
                            {/* <h2 className="text-lg font-medium">{currentDocument.fileName}</h2>
                            <p className="text-sm text-gray-500">
                                Đăng tải ngày: {currentDocument.uploadDate} • Kích thước: {currentDocument.fileSize}
                            </p> */}
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                        <Button variant="outline" className="flex items-center gap-2" onClick={handleDownload}>
                            <Download className="h-4 w-4" />
                            Tải Tài Liệu Hiện Tại
                        </Button>
                        <Button
                            onClick={() => setUploadDialogOpen(true)}
                            className="bg-[#BD2427] hover:bg-[#9a1e21] text-white flex items-center gap-2"
                        >
                            <Upload className="h-4 w-4" />
                            Đăng Tải Tài Liệu Mới
                        </Button>
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Tìm kiếm đề mục trong tài liệu..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            <div className="grid gap-4">
                <h2 className="text-xl font-semibold text-[#BD2427]">Các Đề Mục Trong Tài Liệu</h2>

                {filteredSections.length > 0 ? (
                    filteredSections.map((section) => (
                        <Card key={section.id} className="overflow-hidden">
                            <CardContent className="pt-6">
                                <p className="text-sm whitespace-pre-line">{section.text}</p>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <FileText className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                        <h3 className="text-lg font-medium text-gray-900">Không tìm thấy đề mục</h3>
                        <p className="text-gray-500 mt-1">Không có đề mục nào phù hợp với từ khóa tìm kiếm của bạn.</p>
                    </div>
                )}
            </div>

            {/* Hộp thoại Đăng tải tài liệu */}
            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Đăng Tải Tài Liệu Mới</DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="file">Tệp tài liệu</Label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="file"
                                    id="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden"
                                    accept=".docx"
                                />
                                <Button type="button" variant="outline" onClick={handleSelectFileClick} className="flex-1">
                                    {selectedFile ? selectedFile.name : "Chọn tệp"}
                                </Button>
                                {selectedFile && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setSelectedFile(null)}
                                        className="h-8 w-8"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                            <p className="text-xs text-gray-500">Hỗ trợ các định dạng: DOCX</p>
                            <p className="text-xs text-amber-600">Lưu ý: Tài liệu mới sẽ thay thế tài liệu hiện tại.</p>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                            Hủy
                        </Button>
                        <Button
                            onClick={handleUploadDocument}
                            disabled={!selectedFile}
                            className="bg-[#BD2427] hover:bg-[#9a1e21] text-white"
                        >
                            Đăng Tải
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}