type BrandMarkProps = {
  className?: string
  variant?: 'light' | 'reverse'
  decorative?: boolean
}

export function BrandMark({ className = '', variant = 'light', decorative = false }: BrandMarkProps) {
  return (
    <img
      className={`brand-mark brand-mark--${variant} ${className}`.trim()}
      src={`${import.meta.env.BASE_URL}brand/recipe-archive-mark-${variant}.png`}
      alt={decorative ? '' : 'The Recipe Àrchive emblem'}
      aria-hidden={decorative || undefined}
      width="512"
      height="512"
      decoding="async"
    />
  )
}
