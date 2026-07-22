"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { FaSave, FaArrowLeft, FaImage } from "react-icons/fa";
import Link from "next/link";
import { toast } from "react-hot-toast";
import ImageUpload from "./ImageUpload";

const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  description: z.string().optional(),
  image: z.string().optional(),
  parentId: z.string().optional().nullable(),
  featured: z.boolean().default(false),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  initialData?: any;
  categories: any[];
}

export default function CategoryForm({ initialData, categories }: CategoryFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: initialData || {
      name: "",
      slug: "",
      description: "",
      image: "",
      parentId: null,
      featured: false,
    },
  });

  const onSubmit = async (data: CategoryFormValues) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/categories", {
        method: initialData ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(initialData ? { ...data, id: initialData.id } : data),
      });

      if (!response.ok) throw new Error("Failed to save category");

      toast.success(`Category ${initialData ? "updated" : "created"} successfully!`);
      router.push("/admin/categories");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-generate slug from name
  const nameValue = watch("name");
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue("name", value);
    if (!initialData) {
      setValue("slug", value.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-3">
          <Link href="/admin/categories" className="btn btn-outline-secondary rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
            <FaArrowLeft />
          </Link>
          <div>
            <h2 className="fw-bold mb-0">{initialData ? "Edit Category" : "New Category"}</h2>
            <p className="text-muted small">Define how products are grouped</p>
          </div>
        </div>
        <button type="submit" className="btn btn-plant px-4 py-2 d-flex align-items-center gap-2" disabled={isLoading}>
          <FaSave /> {isLoading ? "Saving..." : "Save Category"}
        </button>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-lg p-4">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label small fw-bold">Category Name</label>
                <input
                  type="text"
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  placeholder="e.g. Flowers"
                  {...register("name")}
                  onChange={handleNameChange}
                />
                {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-bold">Slug (URL friendly)</label>
                <input
                  type="text"
                  className={`form-control ${errors.slug ? "is-invalid" : ""}`}
                  placeholder="e.g. flowers"
                  {...register("slug")}
                />
                {errors.slug && <div className="invalid-feedback">{errors.slug.message}</div>}
              </div>

              <div className="col-12 text-success fw-bold">
                <label className="form-label small fw-bold text-dark">Parent Category (For Subcategories)</label>
                <select 
                  className="form-select" 
                  {...register("parentId")}
                >
                  <option value="">None (Top Level Category)</option>
                  {categories
                    .filter(c => c.id !== initialData?.id)
                    .map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))
                  }
                </select>
                <p className="extra-small text-muted mt-1 fw-normal">Select a parent if this is a subcategory.</p>
              </div>

              <div className="col-12">
                <label className="form-label small fw-bold">Description</label>
                <textarea
                  className="form-control"
                  rows={4}
                  placeholder="Describe this category..."
                  {...register("description")}
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-lg p-4 mb-4">
            <label className="form-label small fw-bold mb-3">Category Image</label>
            <div className="mb-3">
              <ImageUpload
                value={watch("image") || ""}
                onChange={(url) => setValue("image", url, { shouldValidate: true })}
                onRemove={() => setValue("image", "", { shouldValidate: true })}
              />
            </div>
            <p className="extra-small text-muted mt-2">Upload a high-quality square image (e.g., 500x500px) that represents this category.</p>
          </div>

          <div className="card border-0 shadow-sm rounded-lg p-4">
            <div className="form-check form-switch m-0">
              <input
                className="form-check-input"
                type="checkbox"
                id="featured"
                {...register("featured")}
              />
              <label className="form-check-label fw-bold" htmlFor="featured">Featured on Homepage</label>
            </div>
            <p className="extra-small text-muted mt-2 mb-0">Toggle on to show this category in the homepage category grid.</p>
          </div>
        </div>
      </div>
    </form>
  );
}
