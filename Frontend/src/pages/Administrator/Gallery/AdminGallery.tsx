import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, RefreshCw, Upload } from "lucide-react";
import {
  galleryService,
  type Photo,
  type PhotoCategory,
  type UpdatePhotoPayload,
} from "@/api/gallery.service";
import { eventsService } from "@/api/events.service";
import jetSwal from "@/lib/swal";
import PhotoGrid from "./components/PhotoGrid";
import PhotoModal, { type UploadItem } from "./components/PhotoModal";

type ModalTarget = Photo | "new" | null;

export default function AdminGallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<PhotoCategory | "ALL">("ALL");
  const [modalTarget, setModalTarget] = useState<ModalTarget>(null);
  const [eventCategories, setEventCategories] = useState<string[]>([]);

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      setPhotos(await galleryService.getAll());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
    // Fetch event titles to use as gallery categories
    eventsService.getAll().then((events) => {
      const titles = [...new Set(events.map((e) => e.title).filter(Boolean))];
      setEventCategories(titles);
    }).catch(() => {
      // If events fail to load, fall back to generic labels
      setEventCategories(["Worship", "Community", "Outreach", "Youth", "General"]);
    });
  }, []);

  const handleUpload = async (items: UploadItem[]) => {
    for (const { file, metadata } of items) {
      await galleryService.upload(file, metadata);
    }
    setModalTarget(null);
    await fetchPhotos();
    jetSwal.fire({
      icon: "success",
      title: items.length > 1 ? `${items.length} Photos Uploaded!` : "Photo Uploaded!",
      text: items.length > 1
        ? `${items.length} images have been added to the gallery.`
        : "The image has been added to the gallery.",
      timer: 2200,
      showConfirmButton: false,
    });
  };

  const handleUpdate = async (id: string, payload: UpdatePhotoPayload) => {
    await galleryService.update(id, payload);
    setModalTarget(null);
    await fetchPhotos();
    jetSwal.fire({
      icon: "success",
      title: "Photo Updated!",
      timer: 2200,
      showConfirmButton: false,
    });
  };

  const handleDelete = async (photo: Photo) => {
    const result = await jetSwal.fire({
      title: "Delete Photo?",
      html: `Are you sure you want to remove <strong>${photo.title}</strong>?<br/><span style="font-size:0.8125rem;opacity:0.45;display:block;margin-top:4px">This permanently removes it from Cloudinary too.</span>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "jet-swal-popup",
        title: "jet-swal-title",
        htmlContainer: "jet-swal-content",
        confirmButton: "jet-swal-confirm jet-swal-danger",
        cancelButton: "jet-swal-cancel",
      },
    });

    if (!result.isConfirmed) return;

    jetSwal.fire({
      title: "Deleting photo…",
      allowOutsideClick: false,
      showConfirmButton: false,
      customClass: { popup: "jet-swal-popup", title: "jet-swal-title" },
      didOpen: () => jetSwal.showLoading(),
    });

    try {
      await galleryService.remove(photo.id);
      setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
      jetSwal.fire({
        icon: "success",
        title: "Deleted!",
        text: `"${photo.title}" has been removed.`,
        timer: 2200,
        showConfirmButton: false,
      });
    } catch (err) {
      jetSwal.fire({
        icon: "error",
        title: "Failed to Delete",
        text: err instanceof Error ? err.message : "Something went wrong.",
      });
    }
  };

  const filtered = photos
    .filter((p) => categoryFilter === "ALL" || p.category === categoryFilter)
    .filter(
      (p) =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.alt.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
    );

  const editPhoto = modalTarget === "new" || modalTarget === null ? null : modalTarget;

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-xl font-bold text-foreground">Gallery</h2>
          <p className="text-muted-foreground text-sm mt-0.5">{photos.length} photos</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-2.5 w-48">
            <Search className="w-4 h-4 text-muted-foreground/60 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search photos…"
              className="bg-transparent text-sm text-foreground placeholder-muted-foreground/40 outline-none w-full"
            />
          </div>

          {/* Category filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as PhotoCategory | "ALL")}
            className="bg-card border border-border rounded-xl px-3 py-2.5 text-sm text-foreground/70 outline-none cursor-pointer hover:border-border transition-colors"
          >
            <option value="ALL">All Categories</option>
            {eventCategories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Refresh */}
          <button
            onClick={fetchPhotos}
            title="Refresh"
            className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          {/* Upload */}
          <button
            onClick={() => setModalTarget("new")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0096FF] hover:bg-[#0080ee] text-white text-sm font-semibold transition-all shadow-[0_0_16px_rgba(0,150,255,0.25)] cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Photo</span>
          </button>
        </div>
      </motion.div>

      {/* Grid card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card backdrop-blur-xl border border-border rounded-2xl overflow-hidden min-h-[200px]"
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 border-2 border-[#0096FF]/15 rounded-full" />
              <div className="absolute inset-0 border-2 border-transparent border-t-[#0096FF] rounded-full animate-spin" />
            </div>
            <p className="text-muted-foreground/60 text-sm">Loading gallery…</p>
          </div>
        ) : (
          <PhotoGrid
            photos={filtered}
            onEdit={(p) => setModalTarget(p)}
            onDelete={handleDelete}
          />
        )}

        {!loading && filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-border">
            <p className="text-muted-foreground/60 text-xs">
              Showing {filtered.length} of {photos.length} photos
            </p>
          </div>
        )}
      </motion.div>

      {/* Upload / Edit modal */}
      <PhotoModal
        open={modalTarget !== null}
        photo={editPhoto}
        categories={eventCategories}
        onClose={() => setModalTarget(null)}
        onUpload={handleUpload}
        onUpdate={handleUpdate}
      />
    </div>
  );
}
