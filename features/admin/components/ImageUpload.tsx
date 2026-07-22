"use client";

import { useRef, useState } from "react";
import { FaCloudUploadAlt, FaSpinner } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { uploadImageAction } from "../actions/upload.actions";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  onRemove: () => void;
}

export default function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const url = await uploadImageAction(formData);
      onChange(url);
    } catch (error: any) {
      toast.error(error.message || "Upload failed");
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="image-upload-wrapper">
      {value ? (
        <div className="position-relative d-inline-block">
          <img
            src={value}
            alt="Upload"
            className="rounded border shadow-sm"
            style={{
              maxWidth: '300px',
              maxHeight: '200px',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain'
            }}
          />
          <button
            type="button"
            onClick={onRemove}
            className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1 rounded-circle p-1"
            style={{ width: '24px', height: '24px', lineHeight: '1', zIndex: 10 }}
          >
            &times;
          </button>
        </div>
      ) : (
        <label className="upload-container border border-dashed rounded p-4 text-center bg-light d-block mb-0" style={{ cursor: isUploading ? "wait" : "pointer" }}>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            className="d-none"
            disabled={isUploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
          {isUploading ? (
            <FaSpinner className="animate-spin" size={24} />
          ) : (
            <FaCloudUploadAlt size={24} className="text-muted" />
          )}
          <p className="mt-2 text-muted small mb-0">
            {isUploading ? "Uploading..." : "Click to upload an image"}
          </p>
        </label>
      )}
    </div>
  );
}
