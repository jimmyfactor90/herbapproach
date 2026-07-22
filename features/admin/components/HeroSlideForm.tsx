"use client";

import { useState } from "react";
import { FaSave } from "react-icons/fa";
import { saveSlideAction } from "@/features/admin/actions/hero.actions";
import ImageUpload from "./ImageUpload";
import { toast } from "react-hot-toast";

export default function HeroSlideForm() {
  const [image, setImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!image) {
      toast.error("Please upload an image first");
      return;
    }

    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.set("image", image);

    try {
      await saveSlideAction(formData);
      toast.success("Banner added successfully!");
      setImage("");
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      toast.error("Failed to add banner");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card border-0 shadow-sm rounded-lg p-4">
      <h5 className="fw-bold mb-4">Add New Banner</h5>
      <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
        <div>
          <label className="form-label small fw-bold">Banner Image (2040x410px recommended)</label>
          <ImageUpload
            value={image}
            onChange={(url) => setImage(url)}
            onRemove={() => setImage("")}
          />
        </div>
        <div>
          <label className="form-label small fw-bold">Hero Title (Optional)</label>
          <input name="title" className="form-control" placeholder="e.g. 50% OFF FLOWERS" />
        </div>
        <div>
          <label className="form-label small fw-bold">Subtitle</label>
          <input name="subtitle" className="form-control" placeholder="e.g. Premium quality AAAA+" />
        </div>
        <div className="row g-2">
          <div className="col-6">
            <label className="form-label small fw-bold">Button Text</label>
            <input name="buttonText" className="form-control" defaultValue="Shop Now" />
          </div>
          <div className="col-6">
            <label className="form-label small fw-bold">Order</label>
            <input name="order" type="number" className="form-control" defaultValue="0" />
          </div>
        </div>
        <div>
          <label className="form-label small fw-bold">Button Link</label>
          <input name="buttonLink" className="form-control" defaultValue="/shop" />
        </div>
        <button 
          type="submit" 
          className="btn btn-plant w-100 py-3 rounded-pill fw-bold mt-2 d-flex align-items-center justify-content-center gap-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="spinner-border spinner-border-sm"></span>
          ) : (
            <><FaSave /> Add Banner</>
          )}
        </button>
      </form>
    </div>
  );
}
