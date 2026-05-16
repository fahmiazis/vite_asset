import { ArrowUpRight01Icon } from "hugeicons-react";

interface DisposalItem {
  id: string;
  name: string;
  description: string;
  avatar: string;
  avatarBgColor?: string;
}

interface DisposalListProps {
  title?: string;
  items: DisposalItem[];
  maxHeight?: string;
  showArrow?: boolean;
  onArrowClick?: () => void;
  onItemClick?: (item: DisposalItem) => void;
  className?: string;
}

const DisposalList = ({
  title = 'Assets',
  items,
  maxHeight = '400px',
  showArrow = true,
  onArrowClick,
  onItemClick,
  className = '',
}: DisposalListProps) => {
  return (
    <div
      className={`
        bg-white dark:bg-gray-800
        border border-gray-100 dark:border-zinc-800
        rounded-3xl p-6 shadow-sm
        ${className}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-zinc-50">{title}</h3>

        {showArrow && (
          <button
            onClick={onArrowClick}
            className="
              w-8 h-8 rounded-full flex items-center justify-center
              border border-gray-100 dark:border-zinc-800
              text-gray-500 dark:text-zinc-400
              hover:bg-gray-50 dark:hover:bg-zinc-900
              transition-colors flex-shrink-0
            "
          >
            <ArrowUpRight01Icon className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Scrollable List */}
      <div
        className="space-y-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-zinc-700 scrollbar-track-transparent"
        style={{ maxHeight }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => onItemClick?.(item)}
            className="
              flex items-start gap-3 p-3 rounded-2xl cursor-pointer
              hover:bg-gray-50 dark:hover:bg-zinc-900
              transition-colors
            "
          >
            {/* Avatar */}
            <div className="flex-shrink-0">
              <img
                src={item.avatar}
                alt={item.name}
                className="w-10 h-10 rounded-xl object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  if (target.nextElementSibling) {
                    (target.nextElementSibling as HTMLElement).style.display = 'flex';
                  }
                }}
              />
              <div
                className="w-10 h-10 rounded-xl hidden items-center justify-center text-white font-semibold text-sm"
                style={{ backgroundColor: item.avatarBgColor || '#6366f1' }}
              >
                {item.name.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold text-gray-900 dark:text-zinc-50 mb-0.5">
                {item.name}
              </h4>
              <p className="text-xs text-gray-500 dark:text-zinc-400 truncate">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisposalList;