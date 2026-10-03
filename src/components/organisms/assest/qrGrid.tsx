import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Download04Icon, PrinterIcon } from "hugeicons-react"
import type { listAssetsState } from "../../../models/asset/list"
import { useAssetQRCodes } from "../../../hooks/query/asset/qrCodes"
import {
  assetQrFileName,
  downloadDataUrl,
  renderAssetQrLabelDataUrl,
} from "../../../utils/assetQrLabel"

interface AssetQrGridProps {
  /** aset di halaman yang sedang tampil (filter & paging sama dengan tab daftar) */
  assets: listAssetsState[]
}

/** buka dialog cetak berisi semua label di halaman ini, lewat iframe tersembunyi */
function printLabels(labels: { src: string; name: string }[], title: string) {
  const iframe = document.createElement("iframe")
  iframe.style.position = "fixed"
  iframe.style.width = "0"
  iframe.style.height = "0"
  iframe.style.border = "0"
  document.body.appendChild(iframe)

  const doc = iframe.contentDocument!
  doc.open()
  doc.write(`<!doctype html><html><head><title>${title}</title><style>
    @page { margin: 10mm; }
    body { margin: 0; font-family: Arial, sans-serif; }
    .grid { display: flex; flex-wrap: wrap; gap: 4mm; }
    .label { width: 50mm; border: 0.2mm dashed #999; padding: 1mm; break-inside: avoid; }
    .label img { width: 100%; display: block; }
  </style></head><body><div class="grid"></div></body></html>`)
  doc.close()

  const grid = doc.querySelector(".grid")!
  const loads = labels.map(
    (label) =>
      new Promise<void>((resolve) => {
        const wrap = doc.createElement("div")
        wrap.className = "label"
        const img = doc.createElement("img")
        img.alt = label.name
        img.onload = () => resolve()
        img.onerror = () => resolve()
        img.src = label.src
        wrap.appendChild(img)
        grid.appendChild(wrap)
      }),
  )

  Promise.all(loads).then(() => {
    const win = iframe.contentWindow!
    win.focus()
    win.print()
    // print() memblok sampai dialog ditutup di sebagian besar browser
    setTimeout(() => iframe.remove(), 1000)
  })
}

export function AssetQrGrid({ assets }: AssetQrGridProps) {
  const { t } = useTranslation()
  const assetNumbers = useMemo(() => assets.map((asset) => asset.asset_number), [assets])
  const { data: payloads, isLoading, error } = useAssetQRCodes(assetNumbers)
  // asset_number → gambar label (data URL PNG)
  const [labels, setLabels] = useState<Map<string, string>>(new Map())

  useEffect(() => {
    if (!payloads) return
    let cancelled = false
    Promise.all(
      assets
        .filter((asset) => payloads.has(asset.asset_number))
        .map(async (asset) => {
          const src = await renderAssetQrLabelDataUrl(payloads.get(asset.asset_number)!, {
            assetNumber: asset.asset_number,
            assetName: asset.asset_name,
            branchCode: asset.branch_code,
          })
          return [asset.asset_number, src] as const
        }),
    ).then((entries) => {
      if (!cancelled) setLabels(new Map(entries))
    })
    return () => {
      cancelled = true
    }
  }, [assets, payloads])

  if (error) {
    const e = error as { response?: { data?: { message?: string } }; message?: string }
    return (
      <div className="rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 p-4 text-sm text-red-700 dark:text-red-300">
        {t("assetQr.loadFailed")}: {e.response?.data?.message ?? e.message}
      </div>
    )
  }

  if (assets.length === 0) {
    return <p className="py-10 text-center text-sm text-gray1">{t("assetTable.empty")}</p>
  }

  const ready = assets.filter((asset) => labels.has(asset.asset_number))

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-gray1 max-w-2xl">{t("assetQr.hint")}</p>
        <button
          onClick={() =>
            printLabels(
              ready.map((asset) => ({ src: labels.get(asset.asset_number)!, name: asset.asset_number })),
              t("assetQr.printTitle"),
            )
          }
          disabled={ready.length === 0}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium border border-gray-900 dark:border-white text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors whitespace-nowrap disabled:opacity-50"
        >
          <PrinterIcon size={16} />
          {t("assetQr.printPage", { count: ready.length })}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {assets.map((asset) => {
          const src = labels.get(asset.asset_number)
          return (
            <div
              key={asset.asset_number}
              className="flex flex-col rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-3"
            >
              <div className="aspect-[720/790] w-full rounded-lg bg-white flex items-center justify-center overflow-hidden">
                {src ? (
                  <img src={src} alt={asset.asset_number} className="w-full h-full object-contain" />
                ) : isLoading || !payloads || payloads.has(asset.asset_number) ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500" />
                ) : (
                  <span className="text-xs text-gray1">{t("assetQr.unavailable")}</span>
                )}
              </div>
              <p className="mt-2 text-xs font-semibold truncate" title={asset.asset_number}>
                {asset.asset_number}
              </p>
              <p className="text-xs text-gray1 truncate" title={asset.asset_name}>
                {asset.asset_name}
              </p>
              <button
                onClick={() => src && downloadDataUrl(src, assetQrFileName(asset.asset_number))}
                disabled={!src}
                className="mt-2 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                <Download04Icon size={14} />
                {t("assetQr.download")}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
