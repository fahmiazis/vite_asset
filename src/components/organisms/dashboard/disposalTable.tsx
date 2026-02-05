import { ArrowUpRight01Icon } from "hugeicons-react";

interface DisposalItem {
  id: string;
  name: string;
  description: string;
  avatar: string; // URL atau path gambar
  avatarBgColor?: string; // Fallback color jika gambar gagal load
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
  title = 'Disposal',
  items,
  maxHeight = '400px',
  showArrow = true,
  onArrowClick,
  onItemClick,
  className = '',
}: DisposalListProps) => {
  return (
    <div className={`bg-white rounded-3xl p-6 shadow-sm border border-gray-100 w-full ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        
        {showArrow && (
          <button
            onClick={onArrowClick}
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors flex-shrink-0"
          >
            <ArrowUpRight01Icon className="w-4 h-4 text-gray-700" />
          </button>
        )}
      </div>

      {/* Scrollable List */}
      <div
        className="space-y-3 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        style={{ maxHeight }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => onItemClick?.(item)}
            className="flex items-start gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer"
          >
            {/* Avatar */}
            <div className="flex-shrink-0">
              <img
                src={item.avatar}
                alt={item.name}
                className="w-12 h-12 rounded-md object-cover"
                onError={(e) => {
                  // Fallback jika gambar gagal load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  if (target.nextElementSibling) {
                    (target.nextElementSibling as HTMLElement).style.display = 'flex';
                  }
                }}
              />
              {/* Fallback avatar dengan initial */}
              <div
                className="w-12 h-12 rounded-full hidden items-center justify-center text-white font-semibold text-lg"
                style={{ backgroundColor: item.avatarBgColor || '#6366f1' }}
              >
                {item.name.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-gray-900 mb-0.5">
                {item.name}
              </h4>
              <p className="text-xs text-gray-500 truncate">
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