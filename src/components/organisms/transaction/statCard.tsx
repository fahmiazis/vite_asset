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
  green: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
  yellow: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
  red: "bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400",
  gray: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300",
};

const badgeMap = {
  green: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  yellow: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border border-yellow-400 dark:border-yellow-600",
  red: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
  "outline-green": "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
};

function StatCard({ color, icon, value, label, badge, badgeSuffix }: StatCardProps) {
  return (
    <div className="relative flex flex-col gap-2.5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 md:p-5 shadow-sm overflow-hidden flex-1 min-w-0">
      {/* Top color bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${colorMap[color]}`} />

      {/* Icon */}
      <div className={`w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBgMap[color]}`}>
        {icon}
      </div>

      {/* Value & Label */}
      <div>
        <p className="text-xl md:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {value}
        </p>
        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-0.5 leading-tight">
          {label}
        </p>
      </div>

      {/* Badge */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-md whitespace-nowrap ${badgeMap[badge.variant]}`}>
          {badge.text}
        </span>
        {badgeSuffix && (
          <span className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
            {badgeSuffix}
          </span>
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
        value="Rp 4.82M"
        label="Total Procurement Value"
        badge={{ text: "+12%", variant: "green" }}
        badgeSuffix="vs previous quarter"
      />
      <StatCard
        color="green"
        icon={<CheckListIcon size={15} />}
        value="29"
        label="Approved Transactions"
        badge={{ text: "60%", variant: "outline-green" }}
        badgeSuffix="of total submissions"
      />
      <StatCard
        color="yellow"
        icon={<Clock01Icon size={15} />}
        value="13"
        label="Awaiting Review"
        badge={{ text: "Needs follow-up", variant: "yellow" }}
      />
      <StatCard
        color="red"
        icon={<XVariableCircleIcon size={15} />}
        value="6"
        label="Rejected / Revision"
        badge={{ text: "13%", variant: "red" }}
        badgeSuffix="of total submissions"
      />
    </div>
  );
}