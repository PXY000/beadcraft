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
  onDemoClick?: () => void;
}

export function ImageUploader({
  previewUrl,
  isDragging,
  phase,
  onFileSelect,
  onReset,
  onDemoClick,
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
        <div className="relative overflow-hidden rounded-xl ring-1 ring-white/[0.12] bg-white/[0.05] backdrop-blur-xl">
          <img
            src={previewUrl}
            alt="已上传图片"
            className="w-full aspect-square object-cover"
          />
          {isProcessing && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="size-8 border-2 border-[#5E6AD2] border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-medium text-[#5E6AD2]">处理中...</span>
              </div>
            </div>
          )}
        </div>
        <button
          onClick={onReset}
          className="absolute top-2 right-2 size-7 rounded-full bg-black/80 ring-1 ring-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black"
        >
          <X className="size-3.5 text-white/70" />
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
          ? "border-[#5E6AD2] bg-[#5E6AD2]/10 scale-[0.99]"
          : "border-white/[0.12] bg-white/[0.05] backdrop-blur-xl hover:border-white/[0.20] hover:bg-white/[0.08]"
      )}
    >
      <div
        className={cn(
          "size-12 rounded-full flex items-center justify-center transition-colors",
          isDragging ? "bg-[#5E6AD2]/15" : "bg-[#0E0E14] ring-1 ring-white/[0.14]"
        )}
      >
        {isDragging ? (
          <ImageIcon className="size-5 text-[#5E6AD2]" />
        ) : (
          <Upload className="size-5 text-white/40" />
        )}
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-white/70">
          {isDragging ? "松开以上传图片" : "点击或拖拽上传图片"}
        </p>
        <p className="text-xs text-white/45 mt-1">
          支持 JPG、PNG、WEBP 格式
        </p>
        {onDemoClick && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDemoClick();
            }}
            className="mt-2 text-xs font-medium text-[#7B8AFF] hover:text-[#5E6AD2] transition-colors"
          >
            试试示例图片 →
          </button>
        )}
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
