"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { FileUp, X } from "lucide-react"
import matchApi from "@/api/match"
import { useToasts } from "@/hooks/providers/ToastProvider"

export default function ArticleForm({ article, onSave, onCancel, matchId }) {
  const [title, setTitle] = useState(article?.title || "")
  const [uploadType, setUploadType] = useState(article?.uploadType || "file")
  const [articleType, setarticleType] = useState(article?.articleType || "DOCUMENT")
  const [url, setUrl] = useState(article?.url || "")
  const [file, setFile] = useState(null)
  const [fileUrl, setFileUrl] = useState(article?.fileUrl || null)
  const [filePreview, setFilePreview] = useState(null)
  const { addToast } = useToasts()

  useEffect(() => {
    if (article) {
      setTitle(article.title)
      setUploadType(article.uploadType || "file")
      setUrl(article.url || "")
      setFileUrl(article.fileUrl || null)
      setarticleType(article.articleType || "DOCUMENT")
    }
  }, [article])

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)

      // Create a preview URL for the file
      const fileReader = new FileReader()
      fileReader.onload = () => {
        setFilePreview(fileReader.result)
      }
      fileReader.readAsDataURL(selectedFile)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    let fileUrl = null;
    // Handle uploading the file if it exists
    if (file) {
      try {
        const formData = new FormData()
        formData.append("File", file)
        formData.append("ArticleType", articleType)
        const response = await matchApi.uploadArticleFile(matchId, formData)
        setUrl(response.data.data)
        fileUrl = response.data.data
        addToast({ type: response.data.status, message: response.data.message })
      } catch (error) {
        console.error("Error upload article file:", error)
        if (error?.response?.status == 401) {
          addToast({ message: "Phiên đăng nhập của bạn đã hết", type: "error" });
        } else {
          addToast({ type: error.response.data.status, message: error.response.data.message })
        }
      } finally {
        setFile(null)
        setFilePreview(null)
      }
    }
    // Handle create article
    const submitData = [{
      title: title,
      articleType: articleType,
      url: uploadType === "url" ? url : `${process.env.NEXT_PUBLIC_IMAGE_API_URL}${fileUrl}`,
    }];

    try {
      const response = await matchApi.createArticle(matchId, submitData)
      addToast({ type: response.data.status, message: response.data.message })
      // Reset form
      setTitle("")
      setUrl("")
      setFile(null)
      setFilePreview(null)
      setFileUrl(null)
      onSave(true)
    } catch (error) {
      console.error("Error creating article:", error)
      if (error?.status == 401) {
        addToast({ message: "Phiên đăng nhập của bạn đã hết", type: "error" });
      } else {
        addToast({ type: error.response.data.status, message: error.response.data.message })
      }
    }
  }

  const removeFile = () => {
    setFile(null)
    setFilePreview(null)
    setFileUrl(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{article ? "Sửa tài liệu" : "Tài liệu mới"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Tiêu đề</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Tiêu đề tài liệu"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Loại tài liệu</Label>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="image-type"
                  name="articleType"
                  value="IMAGE"
                  checked={articleType === "IMAGE"}
                  onChange={() => setarticleType("IMAGE")}
                  className="h-4 w-4 text-[#BD2427] focus:ring-[#BD2427]"
                />
                <Label htmlFor="image-type" className="cursor-pointer">
                  Ảnh
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="video-type"
                  name="articleType"
                  value="VIDEO"
                  checked={articleType === "VIDEO"}
                  onChange={() => setarticleType("VIDEO")}
                  className="h-4 w-4 text-[#BD2427] focus:ring-[#BD2427]"
                />
                <Label htmlFor="video-type" className="cursor-pointer">
                  Video
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="document-type"
                  name="articleType"
                  value="DOCUMENT"
                  checked={articleType === "DOCUMENT"}
                  onChange={() => setarticleType("DOCUMENT")}
                  className="h-4 w-4 text-[#BD2427] focus:ring-[#BD2427]"
                />
                <Label htmlFor="document-type" className="cursor-pointer">
                  Tài liệu
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Phương thức đăng tải</Label>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="file-type"
                    name="uploadType"
                    value="file"
                    checked={uploadType === "file"}
                    onChange={() => setUploadType("file")}
                    className="h-4 w-4 text-[#BD2427] focus:ring-[#BD2427]"
                  />
                  <Label htmlFor="file-type" className="cursor-pointer">
                    Tệp đính kèm
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="url-type"
                    name="uploadType"
                    value="url"
                    checked={uploadType === "url"}
                    onChange={() => setUploadType("url")}
                    className="h-4 w-4 text-[#BD2427] focus:ring-[#BD2427]"
                  />
                  <Label htmlFor="url-type" className="cursor-pointer">
                    Đường dẫn URL
                  </Label>
                </div>
              </div>
            </div>

            {uploadType === "url" ? (
              <div className="space-y-2">
                <Label htmlFor="url">Đường dẫn URL</Label>
                <Input
                  id="url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  required={uploadType === "url"}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="file">Tệp đính kèm</Label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("file")?.click()}
                    className="w-full"
                  >
                    <FileUp className="mr-2 h-4 w-4" />
                    {file || fileUrl ? "Đổi tệp" : "Tải lên tệp"}
                  </Button>
                  <Input id="file" type="file" onChange={handleFileChange} className="hidden" />
                </div>

                {(filePreview || fileUrl) && (
                  <div className="mt-2 p-3 border rounded-md flex items-center justify-between">
                    <div className="flex items-center">
                      <FileUp className="h-5 w-5 mr-2 text-[#BD2427]" />
                      <span className="text-sm truncate max-w-[200px]">{file?.name || "Tài liệu đính kèm"}</span>
                    </div>
                    <Button type="button" variant="ghost" size="icon" onClick={removeFile} className="h-8 w-8">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Hủy
          </Button>
          <Button type="submit" className="bg-[#BD2427] hover:bg-[#9a1e21]" disabled={!title || (uploadType === "file" && !file) || (uploadType === "url" && !url)}>
            {article ? "Cập nhật" : "Lưu"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
