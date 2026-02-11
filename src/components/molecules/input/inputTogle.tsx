import { forwardRef, type InputHTMLAttributes } from 'react'

interface CyberToggleProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  checked: boolean
  onChange?: (checked: boolean) => void
  id?: string
}

export const InputToggle = forwardRef<
  HTMLInputElement,
  CyberToggleProps
>(({ checked, onChange, id = 'cyber-toggle', disabled, ...rest }, ref) => {
  return (
    <div className="cyber-toggle-wrapper">
      {/* INPUT — WAJIB SEBELUM LABEL */}
      <input
        ref={ref}
        id={id}
        type="checkbox"
        className="cyber-toggle-checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        {...rest}
      />

      {/* TOGGLE */}
      <label className="cyber-toggle" htmlFor={id}>
        <div className="cyber-toggle-track">
          <div className="cyber-toggle-track-glow"></div>

          <div className="cyber-toggle-track-dots">
            <span className="cyber-toggle-track-dot"></span>
            <span className="cyber-toggle-track-dot"></span>
            <span className="cyber-toggle-track-dot"></span>
          </div>
        </div>

        <div className="cyber-toggle-thumb">
          <div className="cyber-toggle-thumb-shadow"></div>
          <div className="cyber-toggle-thumb-highlight"></div>

          <div className="cyber-toggle-thumb-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M16.5 12c0-2.48-2.02-4.5-4.5-4.5s-4.5 2.02-4.5 4.5 2.02 4.5 4.5 4.5 4.5-2.02 4.5-4.5zm-4.5 7.5c-4.14 0-7.5-3.36-7.5-7.5s3.36-7.5 7.5-7.5 7.5 3.36 7.5 7.5-3.36 7.5-7.5 7.5zm0-16.5c-4.97 0-9 4.03-9 9h-3l3.89 3.89.07.14 4.04-4.03h-3c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42c1.63 1.63 3.87 2.64 6.36 2.64 4.97 0 9-4.03 9-9s-4.03-9-9-9z" />
            </svg>
          </div>
        </div>

        <div className="cyber-toggle-particles">
          <span className="cyber-toggle-particle"></span>
          <span className="cyber-toggle-particle"></span>
          <span className="cyber-toggle-particle"></span>
          <span className="cyber-toggle-particle"></span>
        </div>
      </label>

      {/* LABELS — WAJIB SETELAH INPUT */}
      <div className="cyber-toggle-labels">
        <span className="cyber-toggle-label-off">OFF</span>
        <span className="cyber-toggle-label-on">ON</span>
      </div>
    </div>
  )
})

InputToggle.displayName = 'InputToggle'
