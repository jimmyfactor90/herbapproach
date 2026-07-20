"use client";

import { Widget } from "@uploadcare/react-widget";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  onRemove: () => void;
  crop?: string;
}

export default function ImageUpload({ value, onChange, onRemove, crop = "free" }: ImageUploadProps) {
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
        <div className="upload-container border border-dashed rounded p-4 text-center bg-light">
          <Widget
            publicKey={process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY || "demopublickey"}
            onChange={(fileInfo) => {
              if (fileInfo.cdnUrl) {
                onChange(fileInfo.cdnUrl);
              }
            }}
            clearable
            crop={crop}
          />
          <p className="mt-2 text-muted small">Upload or drag and drop your image</p>
        </div>
      )}
    </div>
  );
}
