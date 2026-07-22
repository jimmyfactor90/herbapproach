"use client";

import { useRef, useState } from "react";
import { FaCloudUploadAlt, FaSpinner } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { uploadImageAction } from "../actions/upload.actions";

interface MultiImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
}

export default function MultiImageUpload({ value, onChange }: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const removeImage = (index: number) => onChange(value.filter((_, i) => i !== index));

  const handleFiles = async (files: FileList) => {
    setIsUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        uploaded.push(await uploadImageAction(formData));
      }
      onChange([...value, ...uploaded]);
    } catch (error: any) {
      toast.error(error.message || "Upload failed");
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="multi-image-upload-wrapper">
      <div className="d-flex flex-wrap gap-3 mb-3">
        {value.map((url, i) => (
          <div key={i} className="position-relative">
            <img
              src={url}
              alt={`Product photo ${i + 1}`}
              className="rounded border shadow-sm"
              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
            />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1 rounded-circle p-1"
              style={{ width: '24px', height: '24px', lineHeight: '1' }}
            >
              &times;
            </button>
          </div>
        ))}
      </div>

      <label className="upload-container border border-dashed rounded p-4 text-center bg-light d-block mb-0" style={{ cursor: isUploading ? "wait" : "pointer" }}>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          multiple
          className="d-none"
          disabled={isUploading}
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) handleFiles(e.target.files);
          }}
        />
        {isUploading ? (
          <FaSpinner className="animate-spin" size={20} />
        ) : (
          <FaCloudUploadAlt size={20} className="text-muted" />
        )}
        <p className="mt-2 text-muted small mb-0">
          {isUploading ? "Uploading..." : "Add photos"}
        </p>
      </label>
    </div>
  );
}
