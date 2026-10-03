import qrcode from "qrcode-generator"

/**
 * Label QR aset untuk dicetak & ditempel di aset fisik.
 *
 * Isi QR = nomor aset terenkripsi dari backend (POST /assets/qr-codes), bukan
 * nomor aset polos — scanner biasa hanya melihat teks acak. Teks nomor aset di
 * bawah QR sengaja tetap ditulis supaya label bisa dibaca orang.
 *
 * Error correction level H (±30% modul boleh rusak) supaya logo di tengah
 * tidak membuat QR gagal dibaca. Luas logo dijaga jauh di bawah batas itu.
 */

const LOGO_SRC = "/images/logos.png"

// ukuran dalam pixel canvas — cukup tajam untuk dicetak ±5 cm
const LABEL_WIDTH = 720
const QR_SIZE = 640
const QUIET_ZONE = 4 // modul putih di sekeliling QR (standar minimal 4)
const TEXT_AREA = 150
const LOGO_WIDTH_RATIO = 0.22 // lebar logo (sudah dipotong) terhadap sisi QR

export interface AssetQrLabelInfo {
  assetNumber: string
  assetName: string
  branchCode?: string
}

let logoPromise: Promise<HTMLCanvasElement | null> | null = null

/**
 * Buang area transparan di sekeliling logo. logos.png berukuran 677×369 tapi
 * logonya sendiri hampir persegi di tengah — tanpa dipotong, kotak putih di
 * tengah QR ikut selebar file, bukan selebar logo.
 */
function trimTransparent(img: HTMLImageElement): HTMLCanvasElement {
  const src = document.createElement("canvas")
  src.width = img.naturalWidth
  src.height = img.naturalHeight
  const sctx = src.getContext("2d")!
  sctx.drawImage(img, 0, 0)
  const { data, width, height } = sctx.getImageData(0, 0, src.width, src.height)

  let minX = width, minY = height, maxX = -1, maxY = -1
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] > 16) {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }
  if (maxX < 0) return src // seluruhnya transparan — biarkan apa adanya

  const out = document.createElement("canvas")
  out.width = maxX - minX + 1
  out.height = maxY - minY + 1
  out.getContext("2d")!.drawImage(src, minX, minY, out.width, out.height, 0, 0, out.width, out.height)
  return out
}

/** logo dimuat & dipotong sekali; kalau gagal QR tetap dibuat tanpa logo */
function loadLogo(): Promise<HTMLCanvasElement | null> {
  if (!logoPromise) {
    logoPromise = new Promise((resolve) => {
      const img = new Image()
      img.onload = () => resolve(trimTransparent(img))
      img.onerror = () => resolve(null)
      img.src = LOGO_SRC
    })
  }
  return logoPromise
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

/** potong teks dengan "…" supaya muat satu baris */
function fitText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
  if (ctx.measureText(text).width <= maxWidth) return text
  let end = text.length
  while (end > 0 && ctx.measureText(text.slice(0, end) + "…").width > maxWidth) end--
  return text.slice(0, end) + "…"
}

/** gambar label lengkap ke canvas baru */
export async function renderAssetQrLabel(payload: string, info: AssetQrLabelInfo): Promise<HTMLCanvasElement> {
  const qr = qrcode(0, "H")
  qr.addData(payload)
  qr.make()

  const modules = qr.getModuleCount()
  const cell = Math.floor(QR_SIZE / (modules + QUIET_ZONE * 2))
  const qrPixels = cell * (modules + QUIET_ZONE * 2)

  const canvas = document.createElement("canvas")
  canvas.width = LABEL_WIDTH
  canvas.height = qrPixels + TEXT_AREA
  const ctx = canvas.getContext("2d")!

  ctx.fillStyle = "#ffffff"
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // modul QR
  const offsetX = Math.floor((LABEL_WIDTH - qrPixels) / 2) + cell * QUIET_ZONE
  const offsetY = cell * QUIET_ZONE
  ctx.fillStyle = "#000000"
  for (let row = 0; row < modules; row++) {
    for (let col = 0; col < modules; col++) {
      if (qr.isDark(row, col)) ctx.fillRect(offsetX + col * cell, offsetY + row * cell, cell, cell)
    }
  }

  // logo di tengah, di atas kotak putih supaya kontras
  const logo = await loadLogo()
  if (logo) {
    const qrInner = modules * cell
    const logoW = qrInner * LOGO_WIDTH_RATIO
    const logoH = logoW * (logo.height / logo.width)
    const pad = cell * 0.8
    const boxW = logoW + pad * 2
    const boxH = logoH + pad * 2
    const cx = offsetX + qrInner / 2
    const cy = offsetY + qrInner / 2
    ctx.fillStyle = "#ffffff"
    roundRect(ctx, cx - boxW / 2, cy - boxH / 2, boxW, boxH, cell)
    ctx.fill()
    ctx.drawImage(logo, cx - logoW / 2, cy - logoH / 2, logoW, logoH)
  }

  // teks: nomor aset (tebal), nama aset, cabang
  const textTop = qrPixels
  const maxTextWidth = LABEL_WIDTH - 48
  ctx.fillStyle = "#000000"
  ctx.textAlign = "center"
  ctx.textBaseline = "top"
  ctx.font = "bold 34px Arial, sans-serif"
  ctx.fillText(fitText(ctx, info.assetNumber, maxTextWidth), LABEL_WIDTH / 2, textTop)
  ctx.font = "28px Arial, sans-serif"
  ctx.fillText(fitText(ctx, info.assetName, maxTextWidth), LABEL_WIDTH / 2, textTop + 50)
  if (info.branchCode) {
    ctx.fillStyle = "#555555"
    ctx.font = "24px Arial, sans-serif"
    ctx.fillText(fitText(ctx, info.branchCode, maxTextWidth), LABEL_WIDTH / 2, textTop + 94)
  }

  return canvas
}

export async function renderAssetQrLabelDataUrl(payload: string, info: AssetQrLabelInfo): Promise<string> {
  return (await renderAssetQrLabel(payload, info)).toDataURL("image/png")
}

/** nama file aman — nomor aset bisa mengandung "/" */
export function assetQrFileName(assetNumber: string): string {
  return `QR_${assetNumber.replace(/[^a-zA-Z0-9._-]+/g, "_")}.png`
}

export function downloadDataUrl(dataUrl: string, fileName: string) {
  const link = document.createElement("a")
  link.href = dataUrl
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()
}
