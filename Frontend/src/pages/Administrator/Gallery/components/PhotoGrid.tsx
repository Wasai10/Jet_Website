import { motion } from "framer-motion";
import { Pencil, Trash2, ImageIcon, Star } from "lucide-react";
import type { Photo } from "@/api/gallery.service";

interface Props {
  photos: Photo[];
  onEdit: (photo: Photo) => void;
  onDelete: (photo: Photo) => void;
}

export default function PhotoGrid({ photos, onEdit, onDelete }: Props) {
  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-4">
          <ImageIcon className="w-6 h-6 text-white/20" />
        </div>
        <p className="text-white/50 font-medium">No photos found</p>
        <p className="text-white/25 text-sm mt-1">Upload some images to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 p-4">
      {photos.map((photo, i) => (
        <motion.div
          key={photo.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.03 }}
          className="relative aspect-square rounded-xl overflow-hidden group border border-white/[0.06] hover:border-white/[0.18] transition-all duration-300 shadow-md hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
        >
          <img
            src={photo.url}
            alt={photo.alt}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Featured badge — always visible */}
          {photo.featured && (
            <div className="absolute top-2 left-2 z-10">
              <span className="flex items-center gap-1 bg-amber-400/95 text-black text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full shadow">
                <Star className="w-2.5 h-2.5 fill-black" />
                Featured
              </span>
            </div>
          )}

          {/* Category badge — shows on hover */}
          <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="bg-[#0096FF]/85 backdrop-blur-sm text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full">
              {photo.category}
            </span>
          </div>

          {/* Caption + action buttons */}
          <div className="absolute bottom-0 left-0 right-0 p-2.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-white text-[11px] font-semibold leading-tight truncate mb-2">
              {photo.title}
            </p>
            <div className="flex gap-1.5">
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(photo); }}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-white/15 hover:bg-[#0096FF]/80 text-white text-[10px] font-semibold backdrop-blur-sm transition-all duration-200 cursor-pointer"
              >
                <Pencil className="w-3 h-3" />
                Edit
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(photo); }}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-white/15 hover:bg-red-500/80 text-white text-[10px] font-semibold backdrop-blur-sm transition-all duration-200 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                Delete
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
