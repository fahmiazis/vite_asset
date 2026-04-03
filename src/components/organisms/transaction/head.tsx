import { Download01Icon, PlusSignIcon, TextAlignJustifyRightIcon } from "hugeicons-react";

interface TransaksiHeaderProps {
  title?: string;
  periode?: string;
  totalTransaksi?: number;
  onEkspor?: () => void;
  onLaporan?: () => void;
  onPengajuanBaru?: () => void;
}

export default function TransaksiHeader({
  title = "Transaksi Pengadaan Aset",
  periode = "Januari – Maret 2025",
  totalTransaksi = 48,
  onEkspor,
  onLaporan,
  onPengajuanBaru,
}: TransaksiHeaderProps) {
  return (
    <div className="flex flex-col gap-3 py-4 px-4 md:px-6 md:flex-row md:items-center md:justify-between">
      {/* Left: Title & Subtitle */}
      <div className="flex flex-col gap-0.5">
        <h1 className="text-base font-bold">{title}</h1>
        <p className="text-xs md:text-sm text-gray1">
          Periode: {periode} &nbsp;·&nbsp; Total {totalTransaksi} transaksi terdaftar
        </p>
      </div>

      {/* Right: Action Buttons */}
      <div className="flex items-center gap-2">
        {/* Ekspor & Laporan — icon only on mobile */}
        <button
          onClick={onEkspor}
          className="flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Download01Icon size={14} />
          <span className="hidden md:inline">Ekspor</span>
        </button>

        <button
          onClick={onLaporan}
          className="flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <TextAlignJustifyRightIcon size={14} />
          <span className="hidden md:inline">Laporan</span>
        </button>

        {/* Pengajuan Baru — always full */}
        <button
          onClick={onPengajuanBaru}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-black text-white dark:bg-white dark:text-black rounded-md hover:opacity-80 transition-opacity whitespace-nowrap"
        >
          <PlusSignIcon size={14} />
          <span className="hidden sm:inline">Pengajuan Baru</span>
          <span className="sm:hidden">Baru</span>
        </button>
      </div>
    </div>
  );
}