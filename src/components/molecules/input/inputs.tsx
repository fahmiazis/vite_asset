import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  error?: string;
  helperText?: string;
  numberOnly?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  required?: boolean;
}

export const Inputs = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      value,
      onChange,
      error,
      helperText,
      numberOnly = false,
      containerClassName,
      labelClassName,
      inputClassName,
      placeholder = 'Type here...',
      maxLength,
      readOnly = false,
      disabled = false,
      required = false,
      type = 'text',
      ...restProps
    },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVal = e.target.value;

      // Cek maxLength
      if (maxLength && newVal.length > maxLength) return;

      // Validasi angka jika numberOnly true
      if (numberOnly && !/^\d*$/.test(newVal)) return;

      onChange?.(newVal);
    };

    const isDisabled = disabled || readOnly;
    const hasError = !!error;

    return (
      <div className={containerClassName || 'w-full'}>
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

        {/* Input */}
        <div className="relative">
          <input
            ref={ref}
            type={numberOnly ? 'text' : type}
            inputMode={numberOnly ? 'numeric' : undefined}
            value={value}
            onChange={handleChange}
            readOnly={readOnly}
            disabled={disabled}
            maxLength={maxLength}
            placeholder={placeholder}
            aria-invalid={hasError}
            aria-describedby={
              error ? `${label}-error` : helperText ? `${label}-helper` : undefined
            }
            className={`
              w-full px-4 py-2 border rounded-lg placeholder-black
              transition-colors duration-200
              ${
                hasError
                  ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500'
                  : isDisabled
                  ? 'bg-gray-100 border-gray-300 cursor-not-allowed focus:ring-0 focus:outline-none'
                  : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none'
              }
              ${inputClassName || ''}
            `}
            {...restProps}
          />
          
          {/* Character Counter */}
          {maxLength && !readOnly && !disabled && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <span className={`text-xs ${
                value.length >= maxLength ? 'text-red-500' : 'text-gray-400'
              }`}>
                {value.length}/{maxLength}
              </span>
            </div>
          )}
        </div>

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

Inputs.displayName = 'Input';