"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import ImageUpload from "./ImageUpload";
import MultiImageUpload from "./MultiImageUpload";
import { FaSave, FaTrash, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";

const productSchema = z.object({
  name: z.string().min(3, "Name is required"),
  description: z.string().min(10, "Description is required"),
  price: z.coerce.number().min(0, "Price must be positive"),
  comparePrice: z.coerce.number().min(0).optional(),
  sku: z.string().min(3, "SKU is required"),
  categoryId: z.string().min(1, "Category is required"),
  mainImage: z.string().min(1, "Main image is required"),
  quantity: z.coerce.number().min(0, "Quantity is required"),
  careLevel: z.string().default("MEDIUM"),
  sunlight: z.string().default("INDIRECT"),
  indoorOutdoor: z.string().default("INDOOR"),
  size: z.string().default("MEDIUM"),
  petFriendly: z.boolean().default(false),
  isActive: z.boolean().default(true),
  featured: z.boolean().default(false),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: any;
  categories: any[];
  action: (data: any) => Promise<any>;
}

export default function ProductForm({ initialData, categories, action }: ProductFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData ? {
      ...initialData,
      quantity: initialData.inventory?.quantity || 0,
    } : {
      isActive: true,
      featured: false,
    },
  });

  const mainImage = watch("mainImage");
  const [galleryImages, setGalleryImages] = useState<string[]>(
    initialData?.images?.map((img: any) => img.url) || []
  );

  const onSubmit = async (data: ProductFormValues) => {
    setIsLoading(true);
    try {
      await action({ ...data, images: galleryImages });
      toast.success(initialData ? "Product updated!" : "Product created!");
      router.push("/admin/products");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="row g-4">
      <div className="col-lg-8">
        <div className="card border-0 shadow-sm p-4 mb-4">
          <h5 className="fw-bold mb-4">Product Details</h5>
          
          <div className="mb-3">
            <label className="form-label small fw-bold">Title</label>
            <input 
              type="text" 
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              placeholder="e.g. Premium White Orchid"
              {...register("name")}
            />
            {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label small fw-bold">Description</label>
            <textarea 
              className={`form-control ${errors.description ? 'is-invalid' : ''}`}
              rows={5}
              placeholder="Tell customers about this plant..."
              {...register("description")}
            />
            {errors.description && <div className="invalid-feedback">{errors.description.message}</div>}
          </div>

          <div className="row g-3">
            <div className="col-md-6">
               <label className="form-label small fw-bold">Base Price ($)</label>
               <input 
                 type="number" 
                 step="0.01"
                 className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                 {...register("price")}
               />
               {errors.price && <div className="invalid-feedback">{errors.price.message}</div>}
            </div>
            <div className="col-md-6">
               <label className="form-label small fw-bold">Compare at Price ($)</label>
               <input 
                 type="number" 
                 step="0.01"
                 className={`form-control ${errors.comparePrice ? 'is-invalid' : ''}`}
                 {...register("comparePrice")}
               />
            </div>
          </div>
        </div>

        <div className="card border-0 shadow-sm p-4">
          <h5 className="fw-bold mb-4">Product Image</h5>
          <ImageUpload 
            value={mainImage} 
            onChange={(url) => setValue("mainImage", url, { shouldValidate: true })}
            onRemove={() => setValue("mainImage", "", { shouldValidate: true })}
          />
          {errors.mainImage && <p className="text-danger small mt-2">{errors.mainImage.message}</p>}
        </div>

        <div className="card border-0 shadow-sm p-4 mt-4">
          <h5 className="fw-bold mb-4">Additional Photos</h5>
          <MultiImageUpload value={galleryImages} onChange={setGalleryImages} />
        </div>
      </div>

      <div className="col-lg-4">
        <div className="card border-0 shadow-sm p-4 mb-4">
          <h5 className="fw-bold mb-4">Organization</h5>
          
          <div className="mb-3">
            <label className="form-label small fw-bold">Category</label>
            <select 
              className={`form-select ${errors.categoryId ? 'is-invalid' : ''}`}
              {...register("categoryId")}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {errors.categoryId && <div className="invalid-feedback">{errors.categoryId.message}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label small fw-bold">SKU</label>
            <input 
              type="text" 
              className={`form-control ${errors.sku ? 'is-invalid' : ''}`}
              {...register("sku")}
            />
            {errors.sku && <div className="invalid-feedback">{errors.sku.message}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label small fw-bold">Stock Quantity</label>
            <input 
              type="number" 
              className={`form-control ${errors.quantity ? 'is-invalid' : ''}`}
              {...register("quantity")}
            />
            {errors.quantity && <div className="invalid-feedback">{errors.quantity.message}</div>}
          </div>

          <div className="row g-2 mb-3">
            <div className="col-6">
              <label className="form-label extra-small fw-bold">Strain Type</label>
              <select className="form-select form-select-sm" {...register("careLevel")}>
                <option value="EASY">Indica</option>
                <option value="MEDIUM">Sativa</option>
                <option value="EXPERT">Hybrid</option>
              </select>
            </div>
            <div className="col-6">
              <label className="form-label extra-small fw-bold">Flower Quality</label>
              <select className="form-select form-select-sm" {...register("size")}>
                <option value="SMALL">AAA</option>
                <option value="MEDIUM">AAAA</option>
                <option value="LARGE">AAAA+</option>
                <option value="EXTRA_LARGE">Craft</option>
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label extra-small fw-bold">Growth Method</label>
            <select className="form-select form-select-sm" {...register("indoorOutdoor")}>
              <option value="INDOOR">Indoor</option>
              <option value="OUTDOOR">Outdoor</option>
              <option value="BOTH">Greenhouse</option>
            </select>
          </div>

          <div className="form-check form-switch mb-2">
            <input 
              className="form-check-input" 
              type="checkbox" 
              id="isActive" 
              {...register("isActive")}
            />
            <label className="form-check-label" htmlFor="isActive">Active (Display on site)</label>
          </div>

          <div className="form-check form-switch">
             <input 
               className="form-check-input" 
               type="checkbox" 
               id="featured" 
               {...register("featured")}
             />
             <label className="form-check-label" htmlFor="featured">Featured Product</label>
          </div>

          <div className="form-check form-switch mt-2">
             <input 
               className="form-check-input" 
               type="checkbox" 
               id="petFriendly" 
               {...register("petFriendly")}
             />
             <label className="form-check-label" htmlFor="petFriendly">Lab Tested / Organic</label>
          </div>
        </div>

        <div className="d-flex flex-column gap-2">
           <button 
             type="submit" 
             className="btn btn-plant btn-lg w-100 py-3 shadow-sm d-flex align-items-center justify-content-center gap-2"
             disabled={isLoading}
           >
             {isLoading ? <span className="spinner-border spinner-border-sm"></span> : <><FaSave /> {initialData ? 'Update Product' : 'Create Product'}</>}
           </button>
           <Link href="/admin/products" className="btn btn-outline-light text-dark border w-100 py-2">
             Cancel
           </Link>
        </div>
      </div>
    </form>
  );
}
