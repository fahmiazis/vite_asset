import { useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()

  // external link detection
  const isExternal =
    href.startsWith('http') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:')

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Call custom onClick if provided
    if (onClick) {
      onClick(e)
    }

    // For external links, let the default behavior happen
    if (isExternal) {
      return
    }

    // Prevent default navigation for internal links
    e.preventDefault()

    // Navigate using react-router's navigate
    navigate(href, { replace })
  }

  // if (isExternal) {
  //   return (
  //     <a
  //       href={href}
  //       target={target ?? '_blank'}
  //       rel={rel ?? 'noopener noreferrer'}
  //       className={className}
  //       onClick={handleClick}
  //     >
  //       {children}
  //     </a>
  //   )
  // }

  return (
    <a
      href={href}
      className={className}
      onClick={handleClick}
    >
      {children}
    </a>
  )
}