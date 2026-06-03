"use client";

import { useState, useCallback, useRef } from "react";
import { loadImage } from "@/lib/canvas-operations/load-image";

interface UseImageUploadReturn {
  isDragging: boolean;
  previewUrl: string | null;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => Promise<void>;
  handleFileSelect: (file: File) => Promise<{
    image: HTMLImageElement;
    imageData: ImageData;
  }>;
  reset: () => void;
}

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function useImageUpload(): UseImageUploadReturn {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const dragCounter = useRef(0);

  const handleFileSelect = useCallback(
    async (file: File): Promise<{ image: HTMLImageElement; imageData: ImageData }> => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        throw new Error("Unsupported file type. Please use JPG, PNG, or WEBP.");
      }

      // Create preview URL
      const url = URL.createObjectURL(file);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(url);

      // Load image data
      const result = await loadImage(file);
      return result;
    },
    [previewUrl]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragEnter = useCallback(() => {
    dragCounter.current += 1;
    if (dragCounter.current === 1) setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      dragCounter.current = 0;

      const file = e.dataTransfer.files?.[0];
      if (!file) return;

      await handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const reset = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  }, [previewUrl]);

  return {
    isDragging,
    previewUrl,
    handleDragOver,
    handleDragLeave: (e) => {
      // We track via onDragEnter/onDragLeave on the zone
      setIsDragging(false);
    },
    handleDrop,
    handleFileSelect,
    reset,
  };
}
