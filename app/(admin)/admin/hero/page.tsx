import { prisma } from "@/lib/prisma";
import { FaPlus, FaTrash, FaImage, FaSave } from "react-icons/fa";
import { deleteSlideAction, saveSlideAction } from "@/features/admin/actions/hero.actions";
import { revalidatePath } from "next/cache";
import HeroSlideForm from "@/features/admin/components/HeroSlideForm";

export default async function AdminHeroPage() {
  const slides = await prisma.heroSlide.findMany({
    orderBy: { order: 'asc' }
  });

  return (
    <div className="container-fluid py-4 animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0">Home Hero Slider</h2>
          <p className="text-muted small">Manage up to 12 promotional banners for your shop</p>
        </div>
      </div>

      <div className="row g-4">
        {/* Current Slides */}
        <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-lg overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="px-4 py-3 border-0 small text-uppercase text-muted">Preview</th>
                                <th className="py-3 border-0 small text-uppercase text-muted">Details</th>
                                <th className="py-3 border-0 small text-uppercase text-muted">Order</th>
                                <th className="px-4 py-3 border-0 small text-uppercase text-muted text-end">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {slides.map((slide) => (
                                <tr key={slide.id}>
                                    <td className="px-4 py-3 border-0">
                                        <img src={slide.image} className="rounded" style={{ width: '120px', height: '60px', objectFit: 'cover' }} />
                                    </td>
                                    <td className="py-3 border-0">
                                        <h6 className="mb-0 fw-bold">{slide.title || "No Title"}</h6>
                                        <p className="extra-small text-muted mb-0">{slide.subtitle || "--"}</p>
                                    </td>
                                    <td className="py-3 border-0">{slide.order}</td>
                                    <td className="px-4 py-3 border-0 text-end">
                                        <form action={async () => {
                                            "use server";
                                            await deleteSlideAction(slide.id);
                                        }}>
                                            <button type="submit" className="btn btn-sm btn-outline-danger btn-circle">
                                                <FaTrash size={12} />
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            ))}
                            {slides.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center py-5 text-muted small">No slides active. Add your first banner below.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        {/* Add New Slide */}
        <div className="col-lg-4">
            <HeroSlideForm />
        </div>
      </div>
    </div>
  );
}
