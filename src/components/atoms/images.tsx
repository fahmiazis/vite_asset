import { useState } from 'react'
import type { ImgHTMLAttributes } from 'react'

export interface ImagesProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string
  alt?: string
  width?: number
  height?: number
  fill?: boolean
  priority?: boolean
  quality?: number 
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
}

export default function Images({
  src,
  alt = 'images',
  width,
  height,
  fill = false,
  priority = false,
  quality, // intentionally unused (compat)
  placeholder,
  blurDataURL,
  style,
  loading,
  ...props
}: ImagesProps) {
  const [loaded, setLoaded] = useState(false)

  const imgStyle: React.CSSProperties = {
    width: fill ? '100%' : width,
    height: fill ? '100%' : height,
    objectFit: fill ? 'cover' : undefined,
    ...(placeholder === 'blur' && !loaded
      ? {
          backgroundImage: `url(${blurDataURL})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(12px)',
        }
      : {}),
    ...style,
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : loading ?? 'lazy'}
      style={imgStyle}
      onLoad={() => setLoaded(true)}
      {...props}
    />
  )
}
