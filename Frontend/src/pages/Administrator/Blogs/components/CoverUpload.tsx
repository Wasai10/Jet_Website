import { useEffect, useRef, useState } from "react";
import { ImagePlus, X, Loader2, Upload } from "lucide-react";
import { blogsService } from "@/api/blogs.service";

interface Props {
  url: string;
  publicId: string;
  alt: string;
  onChangeImage: (url: string, publicId: string) => void;
  onChangeAlt: (alt: string) => void;
  onRemove: () => void;
}

export default function CoverUpload({ url, publicId: _publicId, alt, onChangeImage, onChangeAlt, onRemove }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Revoke local object URL when component unmounts or url changes to Cloudinary URL
  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  // Clear img error when url changes
  useEffect(() => {
    setImgError(false);
  }, [url]);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5 MB.");
      return;
    }

    setError("");
    setImgError(false);

    // Show local preview immediately while uploading
    const objUrl = URL.createObjectURL(file);
    setLocalPreview(objUrl);

    setUploading(true);
    try {
      const result = await blogsService.uploadCover(file);
      onChangeImage(result.url, result.publicId);
      if (!alt) onChangeAlt(file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "));
      // Once Cloudinary URL is ready, drop the local blob URL
      URL.revokeObjectURL(objUrl);
      setLocalPreview(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
      setLocalPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-2">
      {/* Upload zone / preview */}
      {(localPreview || url) && !imgError ? (
        <div className="relative rounded-xl overflow-hidden border border-border group">
          <img
            src={localPreview ?? url}
            alt={alt || "Cover image"}
            className="w-full h-40 object-cover"
            onError={() => setImgError(true)}
          />
          {/* Uploading overlay */}
          {uploading && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 text-white animate-spin" />
              <span className="text-white text-xs">Uploading…</span>
            </div>
          )}
          {/* Hover action buttons */}
          {!uploading && (
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0096FF] text-white text-xs font-medium hover:bg-[#0080ee] transition-colors cursor-pointer"
              >
                <Upload className="w-3 h-3" />
                Replace
              </button>
              <button
                type="button"
                onClick={onRemove}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EF4444]/80 text-white text-xs font-medium hover:bg-[#EF4444] transition-colors cursor-pointer"
              >
                <X className="w-3 h-3" />
                Remove
              </button>
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`flex flex-col items-center justify-center gap-2 h-32 rounded-xl border-2 border-dashed transition-all cursor-pointer
            ${dragging
              ? "border-primary bg-primary/10"
              : "border-border bg-card hover:border-primary/40 hover:bg-input"
            }`}
        >
          {uploading ? (
            <>
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
              <span className="text-muted-foreground/60 text-xs">Uploading…</span>
            </>
          ) : (
            <>
              <ImagePlus className="w-6 h-6 text-muted-foreground/50" />
              <p className="text-muted-foreground/60 text-xs text-center">
                Drop an image here or <span className="text-primary">browse</span>
              </p>
              <p className="text-muted-foreground/40 text-xs">Max 5 MB · JPEG, PNG, GIF, WebP</p>
            </>
          )}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onInputChange}
        className="hidden"
      />

      {/* Alt text */}
      <div>
        <label className="block text-muted-foreground text-xs mb-1">Alt text</label>
        <input
          type="text"
          value={alt}
          onChange={(e) => onChangeAlt(e.target.value)}
          placeholder="Describe the image…"
          className="w-full bg-input border border-border rounded-lg px-3 py-2 text-foreground text-xs placeholder-muted-foreground/50 outline-none focus:border-primary/50 transition-colors"
        />
      </div>

      {/* Error */}
      {error && (
        <p className="text-[#EF4444] text-xs">{error}</p>
      )}
    </div>
  );
}
