// ============================================================
// Penentuan tipe dokumen yang bisa dipreview langsung di dialog.
// Dipakai disposal dan mutation — aturannya harus sama supaya dokumen yang
// sama tidak dianggap bisa dipreview di satu menu dan tidak di menu lain.
// ============================================================

export type PreviewKind = "image" | "pdf" | "none"

export function previewKindOf(mimeType?: string | null, fileName?: string): PreviewKind {
  const mime = (mimeType ?? "").toLowerCase()
  if (mime.startsWith("image/")) return "image"
  if (mime === "application/pdf") return "pdf"

  // sebagian file lama tersimpan tanpa mime_type — jatuh ke ekstensi
  const ext = (fileName ?? "").split(".").pop()?.toLowerCase() ?? ""
  if (["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"].includes(ext)) return "image"
  if (ext === "pdf") return "pdf"

  return "none"
}
