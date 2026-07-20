"use client";

import { Widget } from "@uploadcare/react-widget";

interface MultiImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
}

export default function MultiImageUpload({ value, onChange }: MultiImageUploadProps) {
  const addImage = (url: string) => onChange([...value, url]);
  const removeImage = (index: number) => onChange(value.filter((_, i) => i !== index));

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

      <div className="upload-container border border-dashed rounded p-4 text-center bg-light">
        <Widget
          publicKey={process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY || "demopublickey"}
          onChange={(fileInfo) => {
            if (fileInfo.cdnUrl) {
              addImage(fileInfo.cdnUrl);
            }
          }}
          clearable
          crop="free"
        />
        <p className="mt-2 text-muted small">Add another photo</p>
      </div>
    </div>
  );
}
