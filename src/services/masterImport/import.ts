import { axiosPrivate } from "../../libs/instance"
import type { ImportEntity, ImportMode, ImportResult } from "../../models/masterImport"

/** prefix endpoint per entitas */
const importBase: Record<ImportEntity, string> = {
  branch: "/branchs",
  user: "/users",
  asset: "/assets",
}

function extractFilename(contentDisposition: string | undefined, fallback: string): string {
  if (!contentDisposition) return fallback
  const match = contentDisposition.match(/filename="?([^";]+)"?/i)
  return match?.[1]?.trim() || fallback
}

export const downloadImportTemplate = async (entity: ImportEntity, mode: ImportMode): Promise<void> => {
  const res = await axiosPrivate.get(`${importBase[entity]}/import/template`, {
    params: { mode },
    responseType: "blob",
  })

  if (!res) {
    throw new Error(`fail to download ${entity} template`)
  }

  const filename = extractFilename(res.headers["content-disposition"], `template-${entity}-${mode}.xlsx`)
  const url = window.URL.createObjectURL(new Blob([res.data]))
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

/**
 * Unduh data yang sudah ada dalam format template mass update, supaya bisa
 * diedit lalu diunggah ulang. params = filter (aset: sama dengan GET /assets).
 */
export const downloadMasterExport = async (
  entity: ImportEntity,
  params?: Record<string, string | number | undefined>
): Promise<void> => {
  const cleaned = Object.fromEntries(
    Object.entries(params ?? {}).filter(([, value]) => value !== undefined && value !== "")
  )
  const res = await axiosPrivate.get(`${importBase[entity]}/export`, {
    params: cleaned,
    responseType: "blob",
  })

  if (!res) {
    throw new Error(`fail to download ${entity} data`)
  }

  const filename = extractFilename(res.headers["content-disposition"], `data-${entity}.xlsx`)
  const url = window.URL.createObjectURL(new Blob([res.data]))
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

/** dryRun = hanya validasi; tanpa dryRun disimpan kalau semua baris valid */
export const uploadImportFile = async (
  entity: ImportEntity,
  mode: ImportMode,
  file: File,
  dryRun: boolean
): Promise<ImportResult> => {
  const form = new FormData()
  form.append("file", file)

  const res = await axiosPrivate.post(`${importBase[entity]}/import`, form, {
    params: { mode, dry_run: dryRun ? "true" : undefined },
    headers: { "Content-Type": "multipart/form-data" },
  })

  if (!res) {
    throw new Error(`fail to upload ${entity} file`)
  }

  return res.data.data
}

/** apakah user boleh upload aset (hak akses import_asset) */
export const assetImportAllowed = async (): Promise<boolean> => {
  const res = await axiosPrivate.get("/assets/import/allowed")
  return !!res?.data?.data?.allowed
}
