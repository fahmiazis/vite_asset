import { PlusSignIcon } from "hugeicons-react";
import Links from "../../atoms/links";
import { useTranslation } from "react-i18next";

interface TransaksiHeaderProps {
  period?: string;
  totalTransactions?: number;
}

export default function TransaksiHeader({
  period = "January – March 2025",
  totalTransactions = 48,
}: TransaksiHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-3 py-4 px-4 md:px-6 md:flex-row md:items-center md:justify-between">
      {/* Left: Title & Subtitle */}
      <div className="flex flex-col gap-0.5">
        <h1 className="text-base font-bold text-gray-900 dark:text-white">
          {t("transaksiHeader.title")}
        </h1>
        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
          {t("transaksiHeader.period", { period })}
          &nbsp;·&nbsp;
          {t("transaksiHeader.totalTransactions", { count: totalTransactions })}
        </p>
      </div>

      {/* Right: Action Buttons */}
      <div className="flex items-center gap-2">
        <Links
          href="/dashboard/procurement/create"
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-md hover:opacity-80 transition-opacity whitespace-nowrap"
        >
          <PlusSignIcon size={14} />
          <span className="hidden sm:inline">{t("transaksiHeader.newRequest")}</span>
          <span className="sm:hidden">{t("transaksiHeader.new")}</span>
        </Links>
      </div>
    </div>
  );
}