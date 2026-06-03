"use client";

import { useRef } from "react";
import { Upload, ImageIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  previewUrl: string | null;
  isDragging: boolean;
  phase: string;
  onFileSelect: (file: File) => void;
  onReset: () => void;
}

export function ImageUploader({
  previewUrl,
  isDragging,
  phase,
  onFileSelect,
  onReset,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  const isProcessing = phase === "processing";

  if (previewUrl) {
    return (
      <div className="relative group">
        <div className="relative overflow-hidden rounded-xl ring-1 ring-black/5 bg-[#F8F8FA]">
          <img
            src={previewUrl}
            alt="已上传图片"
            className="w-full aspect-square object-cover"
          />
          {isProcessing && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="size-8 border-2 border-[#5E6AD2] border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-medium text-[#5E6AD2]">处理中...</span>
              </div>
            </div>
          )}
        </div>
        <button
          onClick={onReset}
          className="absolute top-2 right-2 size-7 rounded-full bg-white/90 ring-1 ring-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
        >
          <X className="size-3.5 text-[#6B6B6B]" />
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files?.[0];
        if (file) onFileSelect(file);
      }}
      className={cn(
        "relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 cursor-pointer transition-all",
        isDragging
          ? "border-[#5E6AD2] bg-[#5E6AD2]/5 scale-[0.99]"
          : "border-black/10 bg-[#F8F8FA] hover:border-black/20 hover:bg-[#F0F0F4]"
      )}
    >
      <div
        className={cn(
          "size-12 rounded-full flex items-center justify-center transition-colors",
          isDragging ? "bg-[#5E6AD2]/10" : "bg-white ring-1 ring-black/5"
        )}
      >
        {isDragging ? (
          <ImageIcon className="size-5 text-[#5E6AD2]" />
        ) : (
          <Upload className="size-5 text-[#6B6B6B]" />
        )}
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-[#1A1A1A]">
          {isDragging ? "松开以上传图片" : "点击或拖拽上传图片"}
        </p>
        <p className="text-xs text-[#9B9B9B] mt-1">
          支持 JPG、PNG、WEBP 格式
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}
