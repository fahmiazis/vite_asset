import { CheckListIcon, Clock01Icon, Dollar01Icon, XVariableCircleIcon } from "hugeicons-react";

interface StatCardProps {
  color: "green" | "yellow" | "red" | "gray";
  icon: React.ReactNode;
  value: string;
  label: string;
  badge: {
    text: string;
    variant: "green" | "yellow" | "red" | "outline-green";
  };
  badgeSuffix?: string;
}

const colorMap = {
  green: "bg-green-500",
  yellow: "bg-yellow-400",
  red: "bg-red-500",
  gray: "bg-gray-800 dark:bg-gray-200",
};

const iconBgMap = {
  green: "bg-green-100 text-green-600",
  yellow: "bg-yellow-100 text-yellow-600",
  red: "bg-red-100 text-red-500",
  gray: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200",
};

const badgeMap = {
  green: "bg-green-100 text-green-700",
  yellow: "bg-yellow-100 text-yellow-700 border border-yellow-400",
  red: "bg-red-100 text-red-600",
  "outline-green": "bg-green-100 text-green-700",
};

function StatCard({ color, icon, value, label, badge, badgeSuffix }: StatCardProps) {
  return (
    <div className="relative flex flex-col gap-2.5 bg-white dark:bg-[#1a1a1a] rounded-2xl p-4 md:p-5 shadow-sm overflow-hidden flex-1 min-w-0">
      {/* Top color bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${colorMap[color]}`} />

      {/* Icon */}
      <div className={`w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBgMap[color]}`}>
        {icon}
      </div>

      {/* Value & Label */}
      <div>
        <p className="text-xl md:text-2xl font-bold tracking-tight">{value}</p>
        <p className="text-xs md:text-sm text-gray1 mt-0.5 leading-tight">{label}</p>
      </div>

      {/* Badge */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-md whitespace-nowrap ${badgeMap[badge.variant]}`}>
          {badge.text}
        </span>
        {badgeSuffix && (
          <span className="text-xs text-gray1 leading-tight">{badgeSuffix}</span>
        )}
      </div>
    </div>
  );
}

export default function StatCards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      <StatCard
        color="gray"
        icon={<Dollar01Icon size={15} />}
        value="Rp 4,82M"
        label="Total Nilai Pengadaan"
        badge={{ text: "+12%", variant: "green" }}
        badgeSuffix="vs kuartal sebelumnya"
      />
      <StatCard
        color="green"
        icon={<CheckListIcon size={15} />}
        value="29"
        label="Transaksi Disetujui"
        badge={{ text: "60%", variant: "outline-green" }}
        badgeSuffix="dari total pengajuan"
      />
      <StatCard
        color="yellow"
        icon={<Clock01Icon size={15} />}
        value="13"
        label="Menunggu Review"
        badge={{ text: "Perlu tindak lanjut", variant: "yellow" }}
      />
      <StatCard
        color="red"
        icon={<XVariableCircleIcon size={15} />}
        value="6"
        label="Ditolak / Revisi"
        badge={{ text: "13%", variant: "red" }}
        badgeSuffix="dari total pengajuan"
      />
    </div>
  );
}