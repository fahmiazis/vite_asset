import { forwardRef, useState, type SelectHTMLAttributes } from 'react';

export interface SelectOption {
  id: string | number;
  value: string | number;
  label: string;
}

interface MultiSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'value'> {
  label: string;
  value: string[];
  onChange?: (value: string[]) => void;
  options: SelectOption[];
  error?: string;
  helperText?: string;
  placeholder?: string;
  containerClassName?: string;
  labelClassName?: string;
  selectClassName?: string;
  required?: boolean;
  showPlaceholder?: boolean;
  maxSelections?: number; // Default 5
}

export const MultiSelect = forwardRef<HTMLSelectElement, MultiSelectProps>(
  (
    {
      label,
      value,
      onChange,
      options,
      error,
      helperText,
      placeholder = 'Select options',
      containerClassName,
      labelClassName,
      selectClassName,
      disabled = false,
      required = false,
      showPlaceholder = true,
      maxSelections = 5,
      ...restProps
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (selectedValue: string) => {
      if (disabled) return;

      let newValue: string[];
      
      if (value.includes(selectedValue)) {
        // Remove if already selected
        newValue = value.filter((v) => v !== selectedValue);
      } else {
        // Add if not selected and not exceeding max
        if (value.length >= maxSelections) {
          return; // Don't add if max reached
        }
        newValue = [...value, selectedValue];
      }

      onChange?.(newValue);
    };

    const handleRemove = (removeValue: string) => {
      if (disabled) return;
      const newValue = value.filter((v) => v !== removeValue);
      onChange?.(newValue);
    };

    const hasError = !!error;
    const isMaxReached = value.length >= maxSelections;

    return (
      <div className={containerClassName}>
        {/* Label */}
        <label 
          className={
            labelClassName || 
            'block text-xl font-medium mb-1 md:mb-2'
          }
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>

        {/* Custom Select */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            disabled={disabled}
            className={`
              w-full px-4 py-2 text-left text-gray-700 border rounded-lg
              bg-white cursor-pointer
              transition-colors duration-200
              flex items-center justify-between
              ${
                hasError
                  ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500'
                  : disabled
                  ? 'bg-gray-100 border-gray-300 cursor-not-allowed'
                  : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none'
              }
              ${selectClassName || ''}
            `}
          >
            <span className={value.length === 0 ? 'text-gray-400' : ''}>
              {value.length === 0 ? placeholder : `${value.length} selected`}
            </span>

            {/* Arrow Icon */}
            <svg
              className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''} ${
                disabled ? 'text-gray-400' : 'text-gray-700'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Dropdown Options */}
          {isOpen && !disabled && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
              {isMaxReached && (
                <div className="px-4 py-2 text-sm text-orange-600 bg-orange-50 border-b border-orange-200">
                  Maximum {maxSelections} selections reached
                </div>
              )}
              {options.map((option) => {
                const isSelected = value.includes(String(option.value));
                const isDisabledOption = !isSelected && isMaxReached;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleSelect(String(option.value))}
                    disabled={isDisabledOption}
                    className={`
                      w-full px-4 py-2 text-left text-sm
                      transition-colors duration-150
                      flex items-center gap-2
                      ${
                        isSelected
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : isDisabledOption
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    {/* Checkbox */}
                    <div
                      className={`
                        w-4 h-4 border-2 rounded flex items-center justify-center
                        ${
                          isSelected
                            ? 'bg-blue-600 border-blue-600'
                            : 'border-gray-300'
                        }
                      `}
                    >
                      {isSelected && (
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    {option.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Hidden select for form compatibility */}
          <select
            ref={ref}
            multiple
            value={value}
            onChange={() => {}} // Controlled by custom UI
            className="hidden"
            {...restProps}
          >
            {options.map((option) => (
              <option key={option.id} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Selected Items */}
        {value.length > 0 && (
          <div className="mt-3">
            <p className="text-sm font-medium mb-2">
              Selected {label.toLowerCase()}
            </p>
            <div className="flex flex-wrap gap-2">
              {value.map((selectedValue) => {
                const option = options.find((opt) => String(opt.value) === selectedValue);
                return (
                  <div
                    key={selectedValue}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                  >
                    <span>{option?.label || selectedValue}</span>
                    <button
                      type="button"
                      onClick={() => handleRemove(selectedValue)}
                      disabled={disabled}
                      className="text-red-500 hover:text-red-700 focus:outline-none disabled:opacity-50"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <p 
            id={`${label}-error`}
            className="mt-1 text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}

        {/* Helper Text */}
        {helperText && !error && (
          <p 
            id={`${label}-helper`}
            className="mt-1 text-sm text-gray-500"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

MultiSelect.displayName = 'MultiSelect';