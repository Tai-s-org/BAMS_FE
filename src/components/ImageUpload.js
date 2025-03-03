"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Upload, X } from "lucide-react";

export default function ImageUpload({ initialImage, onImageChange }) {
  const [preview, setPreview] = useState(initialImage || null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      setPreview(result);
      onImageChange(result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onImageChange("/placeholder.svg?height=400&width=600");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full mb-8">
      <div
        className="relative w-full max-w-xl aspect-video rounded-xl overflow-hidden border-2 border-dashed border-primary/20 hover:border-primary/40 transition-all duration-300 bg-secondary/50 shadow-sm hover:shadow-md"
        onClick={() => fileInputRef.current?.click()}
      >
        {preview ? (
          <>
            <Image src={preview || "/placeholder.svg"} alt="Court preview" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/90 hover:bg-white shadow-sm"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveImage();
              }}
            >
              <X className="h-5 w-5" />
            </Button>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center cursor-pointer p-8">
            <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mb-3">
              <Upload className="h-8 w-8 text-primary/60" />
            </div>
            <p className="text-base font-medium text-primary/80">Click to upload court image</p>
            <p className="text-sm text-primary/60 mt-1">PNG, JPG, GIF up to 5MB</p>
          </div>
        )}
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
      </div>
    </div>
  );
}
