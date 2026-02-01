import { Link as RouterLink } from 'react-router-dom'
import type { MouseEvent, ReactNode } from 'react'

export interface LinksProps {
  href: string
  replace?: boolean
  target?: '_self' | '_blank' | '_parent' | '_top'
  rel?: string
  className?: string
  children: ReactNode
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void
}

/**
 * Atom Link — Next.js-like Link for React Vite
 */
export default function Links({
  href,
  replace = false,
  target,
  rel,
  className,
  children,
  onClick,
}: LinksProps) {
  // external link detection
  const isExternal =
    href.startsWith('http') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:')

  if (isExternal) {
    return (
      <a
        href={href}
        target={target ?? '_blank'}
        rel={rel ?? 'noopener noreferrer'}
        className={className}
        onClick={onClick}
      >
        {children}
      </a>
    )
  }

  return (
    <RouterLink
      to={href}
      replace={replace}
      className={className}
      onClick={onClick}
    >
      {children}
    </RouterLink>
  )
}
