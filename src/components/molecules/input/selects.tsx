import { forwardRef, type SelectHTMLAttributes } from 'react';

export interface SelectOption {
  id: string | number;
  value: string | number;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label: string;
  value: string | number;
  onChange?: (value: string) => void;
  options: SelectOption[];
  error?: string;
  helperText?: string;
  placeholder?: string;
  containerClassName?: string;
  labelClassName?: string;
  selectClassName?: string;
  required?: boolean;
  showPlaceholder?: boolean;
}

export const Selects = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      value,
      onChange,
      options,
      error,
      helperText,
      placeholder = 'Select an option',
      containerClassName,
      labelClassName,
      selectClassName,
      disabled = false,
      required = false,
      showPlaceholder = true,
      ...restProps
    },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange?.(e.target.value);
    };

    const hasError = !!error;

    return (
      <div className={containerClassName}>
        {/* Label */}
        <label
          className={
            labelClassName ||
            'block text-lg font-medium mb-1 md:mb-2 text-gray-700 dark:text-gray-300'
          }
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>

        {/* Select */}
        <div className="relative">
          <select
            ref={ref}
            value={value}
            onChange={handleChange}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={
              error ? `${label}-error` : helperText ? `${label}-helper` : undefined
            }
            className={`
              w-full px-4 py-2 border rounded-lg
              appearance-none cursor-pointer
              transition-colors duration-200
              text-gray-800 dark:text-gray-100
              bg-white dark:bg-gray-900
              ${
                hasError
                  ? 'border-red-400 focus:ring-2 focus:ring-red-400 focus:border-red-400 focus:outline-none'
                  : disabled
                  ? 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 cursor-not-allowed text-gray-400 dark:text-gray-500 focus:ring-0 focus:outline-none'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none'
              }
              ${selectClassName || ''}
            `}
            {...restProps}
          >
            {/* Placeholder Option */}
            {showPlaceholder && (
              <option value="" disabled className="text-gray-400 dark:text-gray-500">
                {placeholder}
              </option>
            )}

            {/* Options */}
            {options.map((option) => (
              <option
                key={option.id}
                value={option.value}
                className="text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-900"
              >
                {option.label}
              </option>
            ))}
          </select>

          {/* Arrow Icon */}
          <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
            <svg
              className={`w-5 h-5 ${disabled ? 'text-gray-400 dark:text-gray-600' : 'text-gray-500 dark:text-gray-400'}`}
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
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <p
            id={`${label}-error`}
            className="mt-1 text-xs text-red-500 dark:text-red-400"
            role="alert"
          >
            {error}
          </p>
        )}

        {/* Helper Text */}
        {helperText && !error && (
          <p
            id={`${label}-helper`}
            className="mt-1 text-xs text-gray-500 dark:text-gray-400"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Selects.displayName = 'Select';