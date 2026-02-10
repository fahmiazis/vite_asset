import { forwardRef, useState, type InputHTMLAttributes } from 'react';

interface ToggleProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type'> {
  label?: string;
  checked: boolean;
  onChange?: (checked: boolean) => void;
  activeLabel?: string;
  inactiveLabel?: string;
  containerClassName?: string;
  labelClassName?: string;
  disabled?: boolean;
  showTooltip?: boolean;
  error?: string;
  helperText?: string;
}

export const InputToggle = forwardRef<HTMLInputElement, ToggleProps>(
  (
    {
      label,
      checked,
      onChange,
      activeLabel = 'Active',
      inactiveLabel = 'Inactive',
      containerClassName = '',
      labelClassName = '',
      disabled = false,
      showTooltip = true,
      error,
      helperText,
      ...restProps
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!disabled) {
        onChange?.(e.target.checked);
      }
    };

    return (
      <div className={`space-y-2 ${containerClassName}`}>
        {/* Label */}
        {label && (
          <label
            className={
              labelClassName || 'block text-xl font-medium text-white mb-1 md:mb-2'
            }
          >
            {label}
          </label>
        )}

        <div className="relative inline-flex items-center">
          {/* Toggle */}
          <label
            className={`
              relative block h-[3em] w-[6em] cursor-pointer rounded-full
              bg-[hsl(0,0%,7%)]
              shadow-[0px_2px_4px_0px_rgba(18,18,18,0.25),0px_4px_8px_0px_rgba(18,18,18,0.35)]
              ${disabled ? 'cursor-not-allowed opacity-50' : ''}
            `}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Inner border */}
            <span className="absolute inset-[0.1em] rounded-full border border-[hsl(0,0%,25%)]" />

            {/* Off indicator */}
            <div className="absolute left-[0.5em] top-1/2 flex h-[2em] w-[2em] -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[inset_0px_2px_2px_0px_hsl(0,0%,85%)]">
              <div className="h-[1.5em] w-[1.5em] rounded-full bg-[hsl(0,0%,7%)] shadow-[0px_2px_2px_0px_hsl(0,0%,85%)]" />
            </div>

            {/* On indicator line */}
            <div className="absolute right-[0.5em] top-1/2 h-[0.25em] w-[1.5em] -translate-y-1/2 rounded-full bg-[hsl(0,0%,50%)] shadow-[inset_0px_2px_1px_0px_hsl(0,0%,40%)]" />

            {/* Hidden checkbox */}
            <input
              ref={ref}
              type="checkbox"
              className="peer absolute h-0 w-0 opacity-0"
              checked={checked}
              onChange={handleChange}
              disabled={disabled}
              {...restProps}
            />

            {/* Moving knob */}
            <span
              className={`
                absolute top-1/2 left-[0.25em]
                flex h-[2.5em] w-[2.5em]
                -translate-y-1/2
                items-center justify-center
                rounded-full
                bg-[rgb(26,26,26)]
                shadow-[inset_4px_4px_4px_0px_rgba(64,64,64,0.25),inset_-4px_-4px_4px_0px_rgba(16,16,16,0.5)]
                transition-transform duration-300 ease-in-out
                peer-checked:translate-x-[3em]
                ${disabled ? 'transition-none' : ''}
              `}
            >
              <span className="relative h-full w-full rounded-full">
                <span className="absolute inset-[0.1em] rounded-full border border-[hsl(0,0%,50%)]" />
              </span>
            </span>

            {/* Tooltip */}
            {showTooltip && isHovered && (
              <div
                className={`
                  absolute -top-10 left-1/2 -translate-x-1/2
                  rounded-md px-3 py-1.5 text-sm font-medium
                  text-white whitespace-nowrap
                  ${checked ? 'bg-green-600' : 'bg-gray-600'}
                `}
              >
                {checked ? activeLabel : inactiveLabel}
                <div
                  className={`
                    absolute top-full left-1/2 -translate-x-1/2
                    h-0 w-0 border-l-4 border-r-4 border-t-4
                    border-l-transparent border-r-transparent
                    ${checked ? 'border-t-green-600' : 'border-t-gray-600'}
                  `}
                />
              </div>
            )}
          </label>

          {/* Status text */}
          <span
            className={`ml-3 text-sm font-medium ${
              checked ? 'text-green-500' : 'text-gray-400'
            }`}
          >
            {checked ? activeLabel : inactiveLabel}
          </span>
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        {/* Helper */}
        {helperText && !error && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

InputToggle.displayName = 'InputToggle';
