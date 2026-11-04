$file = "c:\Users\wasai\Jet_Website\Frontend\src\pages\Administrator\Gallery\AdminGallery.tsx"
$content = Get-Content $file -Raw

# New header block: use PHOTO_CATEGORIES from gallery.service, remove eventsService
$newHeader = @'
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, RefreshCw, Upload } from "lucide-react";
import {
  galleryService,
  PHOTO_CATEGORIES,
  type Photo,
  type PhotoCategory,
  type UpdatePhotoPayload,
} from "@/api/gallery.service";
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
  }, []);

'@

# Pattern to replace: from the first import line through the closing of the useEffect block
$pattern = '(?s)import \{ useEffect, useState \} from "react";.*?  \}, \[\]\);\r?\n'

$newContent = [System.Text.RegularExpressions.Regex]::Replace($content, $pattern, $newHeader, [System.Text.RegularExpressions.RegexOptions]::Singleline)

Set-Content $file $newContent -NoNewline
Write-Host "Done."

