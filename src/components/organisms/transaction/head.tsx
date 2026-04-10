import { Download01Icon, PlusSignIcon, TextAlignJustifyRightIcon } from "hugeicons-react";
import Links from "../../atoms/links";

interface TransaksiHeaderProps {
  title?: string;
  period?: string;
  totalTransactions?: number;
  onExport?: () => void;
  onReport?: () => void;
}

export default function TransaksiHeader({
  title = "Asset Procurement Transactions",
  period = "January – March 2025",
  totalTransactions = 48,
  onExport,
  onReport,
}: TransaksiHeaderProps) {
  return (
    <div className="flex flex-col gap-3 py-4 px-4 md:px-6 md:flex-row md:items-center md:justify-between">
      {/* Left: Title & Subtitle */}
      <div className="flex flex-col gap-0.5">
        <h1 className="text-base font-bold text-gray-900 dark:text-white">{title}</h1>
        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
          Period: {period} &nbsp;·&nbsp; {totalTransactions} transactions registered
        </p>
      </div>

      {/* Right: Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onExport}
          className="flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Download01Icon size={14} />
          <span className="hidden md:inline">Export</span>
        </button>

        <button
          onClick={onReport}
          className="flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <TextAlignJustifyRightIcon size={14} />
          <span className="hidden md:inline">Report</span>
        </button>

        <Links
          href="/dashboard/transaction/create"
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-md hover:opacity-80 transition-opacity whitespace-nowrap"
        >
          <PlusSignIcon size={14} />
          <span className="hidden sm:inline">New Request</span>
          <span className="sm:hidden">New</span>
        </Links>
      </div>
    </div>
  );
}