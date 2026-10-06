import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useEffect } from 'react'

/** images = [{ src, label }], index = null khi đóng */
export default function Lightbox({ images, index, onChange }) {
  const open = index != null
  const count = images.length

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onChange(null)
      if (e.key === 'ArrowRight') onChange((index + 1) % count)
      if (e.key === 'ArrowLeft') onChange((index - 1 + count) % count)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, index, count, onChange])

  if (!open) return null
  const image = images[index]
  const control = 'grid size-12 shrink-0 place-items-center rounded-3xl border border-line bg-white text-ink transition-colors hover:border-gold-deep hover:text-gold-deep'

  return (
    <div role="dialog" aria-modal="true" aria-label="Xem ảnh" className="fixed inset-0 z-50 flex flex-col bg-paper/97 p-4 backdrop-blur-sm md:p-8" onClick={() => onChange(null)}>
      <div className="flex items-center justify-between text-ink">
        <p className="text-[11.5px] font-medium tracking-[0.06em] uppercase">
          <span className="text-gold-deep">{image.label}</span>
          <span className="ml-4 text-mute">
            {index + 1} / {count}
          </span>
        </p>
        <button type="button" autoFocus className={control} aria-label="Đóng" onClick={() => onChange(null)}>
          <X size={20} strokeWidth={1.5} />
        </button>
      </div>
      <div className="flex min-h-0 flex-1 items-center gap-3 py-4 md:gap-6" onClick={(e) => e.stopPropagation()}>
        <button type="button" className={control} aria-label="Ảnh trước" onClick={() => onChange((index - 1 + count) % count)}>
          <ChevronLeft size={22} strokeWidth={1.5} />
        </button>
        <img src={image.src} alt={image.label} className="mx-auto max-h-full min-w-0 flex-1 object-contain" />
        <button type="button" className={control} aria-label="Ảnh sau" onClick={() => onChange((index + 1) % count)}>
          <ChevronRight size={22} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  )
}
