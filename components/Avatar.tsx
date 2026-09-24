import Image from 'next/image'
import { PawPrint } from 'lucide-react'
import { isOptimizableImage } from '@/lib/imageHosts'

type AvatarProps = {
  src?: string | null
  alt: string
  size: number
  className?: string
}

export default function Avatar({ src, alt, size, className = '' }: AvatarProps) {
  const box = `shrink-0 overflow-hidden rounded-full ${className}`

  if (!src) {
    return (
      <div className={`${box} flex items-center justify-center bg-violet-50 text-primary`} style={{ width: size, height: size }}>
        <PawPrint size={Math.round(size * 0.45)} aria-hidden />
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      unoptimized={!isOptimizableImage(src)}
      className={`${box} object-cover`}
      style={{ width: size, height: size }}
    />
  )
}
