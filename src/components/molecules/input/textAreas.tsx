import { forwardRef, type TextareaHTMLAttributes } from 'react';

interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  error?: string;
  helperText?: string;
  containerClassName?: string;
  labelClassName?: string;
  textareaClassName?: string;
  required?: boolean;
  rows?: number;
}

export const Textareas = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      value,
      onChange,
      error,
      helperText,
      containerClassName,
      labelClassName,
      textareaClassName,
      placeholder = 'Type here...',
      maxLength,
      readOnly = false,
      disabled = false,
      required = false,
      rows = 4,
      ...restProps
    },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newVal = e.target.value;

      // Cek maxLength
      if (maxLength && newVal.length > maxLength) return;

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
            'block text-lg font-medium mb-1 md:mb-2'
          }
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>

        {/* Textarea */}
        <div className="relative">
          <textarea
            ref={ref}
            value={value}
            onChange={handleChange}
            readOnly={readOnly}
            disabled={disabled}
            maxLength={maxLength}
            placeholder={placeholder}
            rows={rows}
            aria-invalid={hasError}
            aria-describedby={
              error ? `${label}-error` : helperText ? `${label}-helper` : undefined
            }
            className={`
              w-full px-4 py-2 border rounded-lg placeholder-black text-black
              transition-colors duration-200 resize-y
              ${
                hasError
                  ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500'
                  : isDisabled
                  ? 'bg-gray-100 border-gray-300 cursor-not-allowed focus:ring-0 focus:outline-none'
                  : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none'
              }
              ${textareaClassName || ''}
            `}
            {...restProps}
          />
          
          {/* Character Counter */}
          {maxLength && !readOnly && !disabled && (
            <div className="absolute right-3 bottom-3 pointer-events-none">
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
            className="mt-1 text-xs text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}

        {/* Helper Text */}
        {helperText && !error && (
          <p 
            id={`${label}-helper`}
            className="mt-1 text-xs text-gray-500"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textareas.displayName = 'Textareas';