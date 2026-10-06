import { animate, motion, useInView, useScroll, useTransform } from 'motion/react'
import { ArrowUpRight, BedDouble, Maximize2, Users } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatVND, fromPrice } from '../lib/pricing'

const ease = [0.2, 0.7, 0.2, 1]

/** Hiện dần + trượt lên khi cuộn tới */
export function Reveal({ as: Tag = 'div', delay = 0, y = 28, className = '', children, ...rest }) {
  const M = motion[Tag]
  return (
    <M
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.9, delay: delay / 1000, ease }}
      {...rest}
    >
      {children}
    </M>
  )
}

/** Tiêu đề hiện từng từ, trượt lên từ dưới */
export function SplitText({ text, className = '', delay = 0, onView = true }) {
  const words = text.split(' ')
  const show = { y: '0%', opacity: 1 }
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.14em] align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: '105%', opacity: 0 }}
            {...(onView ? { whileInView: show, viewport: { once: true } } : { animate: show })}
            transition={{ duration: 0.9, delay: delay + i * 0.07, ease }}
          >
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

/** Số đếm tăng dần khi vào khung nhìn */
export function CountUp({ to, decimals = 0, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, { duration: 1.6, ease: 'easeOut', onUpdate: setValue })
    return () => controls.stop()
  }, [inView, to])
  return (
    <span ref={ref} className="tabular-nums">
      {value.toFixed(decimals).replace('.', ',')}
      {suffix}
    </span>
  )
}

/** Dải chạy ngang vô tận; children được nhân đôi để nối liền */
export function Marquee({ children, className = '', duration = 38, reverse = false }) {
  return (
    <div className={`marquee overflow-hidden ${className}`}>
      <div
        className="marquee-track flex w-max animate-marquee"
        style={{ animationDuration: `${duration}s`, animationDirection: reverse ? 'reverse' : 'normal' }}
      >
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  )
}

/** Ảnh trôi nhẹ theo cuộn trang (parallax) */
export function ParallaxImage({ src, alt = '', className = '', strength = 40 }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [-strength, strength])
  return (
    <div ref={ref} className={`overflow-hidden rounded-[28px] ${className}`}>
      <motion.img src={src} alt={alt} loading="lazy" style={{ y, scale: 1.18 }} className="size-full object-cover" />
    </div>
  )
}

export function SectionHeading({ eyebrow, title, text, center, action }) {
  return (
    <div className={`flex flex-col gap-6 ${center ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between'}`}>
      <div className="max-w-2xl">
        <Reveal y={12}>
          <span className="eyebrow">{eyebrow}</span>
        </Reveal>
        <h2 className="mt-5 text-[36px] md:text-[54px]">
          <SplitText text={title} />
        </h2>
        {text && (
          <Reveal delay={200}>
            <p className="mt-5 text-[16.5px] text-mute">{text}</p>
          </Reveal>
        )}
      </div>
      {action && (
        <Reveal delay={250} className="shrink-0">
          {action}
        </Reveal>
      )}
    </div>
  )
}

/** Hero dùng chung cho các trang con */
export function PageHero({ eyebrow, title, text, image, children }) {
  return (
    <section className="pt-28 md:pt-32">
      <div className="container-x grid items-center gap-8 pb-6 md:pb-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-16">
        <div>
          <motion.span className="eyebrow" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
            {eyebrow}
          </motion.span>
          <h1 className="mt-6 text-[44px] md:text-[72px]">
            <SplitText text={title} onView={false} delay={0.1} />
          </h1>
          {text && (
            <motion.p
              className="mt-6 max-w-xl text-[16.5px] text-mute md:text-[18px]"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45, ease }}
            >
              {text}
            </motion.p>
          )}
          {children}
        </div>
        <motion.div
          className="overflow-hidden rounded-[32px] shadow-soft"
          initial={{ clipPath: 'inset(0 0 100% 0 round 32px)' }}
          animate={{ clipPath: 'inset(0 0 0% 0 round 32px)' }}
          transition={{ duration: 1.2, delay: 0.15, ease }}
        >
          <motion.img
            src={image}
            alt=""
            className="aspect-[16/10] w-full object-cover"
            initial={{ scale: 1.25 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.8, delay: 0.15, ease }}
          />
        </motion.div>
      </div>
    </section>
  )
}

export function RoomSpecs({ room, className = '' }) {
  const items = [
    { icon: Maximize2, label: `${room.area} m²` },
    { icon: BedDouble, label: room.bed },
    { icon: Users, label: `Tối đa ${room.guests} khách` },
  ]
  return (
    <ul className={`flex flex-wrap gap-2 text-[13px] ${className}`}>
      {items.map(({ icon: Icon, label }) => (
        <li key={label} className="flex items-center gap-2 rounded-full bg-paper px-3 py-1.5 text-ink/80">
          <Icon size={14} strokeWidth={1.6} className="text-gold-deep" />
          {label}
        </li>
      ))}
    </ul>
  )
}

export function Price({ amount, unit = '/ đêm', size = 'md' }) {
  const big = size === 'lg' ? 'text-[40px]' : 'text-[26px]'
  return (
    <p className="flex items-baseline gap-2">
      <span className="text-[12.5px] text-mute">Từ</span>
      <span className={`leading-none font-medium tracking-[-0.03em] ${big}`}>{formatVND(amount)}</span>
      <span className="text-[13px] text-mute">{unit}</span>
    </p>
  )
}

export function RoomCard({ room, delay = 0 }) {
  return (
    <Reveal as="article" delay={delay} className="h-full">
      <Link to={`/rooms/${room.id}`} className="group lift flex h-full flex-col rounded-[32px] border border-line bg-white p-3">
        <div className="img-zoom relative aspect-[4/3]">
          <img src={room.cover} alt={room.name} loading="lazy" className="size-full object-cover" />
          <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1.5 text-[12.5px] font-medium backdrop-blur-sm">{room.area} m²</span>
          <span className="absolute right-3 bottom-3 grid size-12 place-items-center rounded-full bg-white text-ink transition-all duration-500 group-hover:rotate-45 group-hover:bg-ink group-hover:text-white">
            <ArrowUpRight size={20} strokeWidth={1.6} />
          </span>
        </div>
        <div className="flex flex-1 flex-col px-4 pt-6 pb-4">
          <h3 className="text-[27px]">{room.name}</h3>
          <RoomSpecs room={room} className="mt-4" />
          <p className="mt-4 mb-6 line-clamp-2 text-[14.5px] text-mute">{room.description}</p>
          <div className="mt-auto border-t border-line pt-5">
            <Price amount={fromPrice(room)} />
          </div>
        </div>
      </Link>
    </Reveal>
  )
}

export function RateTable({ room }) {
  const rows = [
    { label: 'Cả ngày', hint: '15:00 – 11:00', pair: room.rates.day },
    { label: 'Qua đêm', hint: '22:00 – 11:00', pair: room.rates.overnight },
    { label: '2 tiếng', hint: 'Thuê theo giờ', pair: room.rates.hourly },
    { label: 'Giờ thêm', hint: 'Mỗi giờ', pair: [room.rates.extraHour, room.rates.extraHour] },
  ]
  return (
    <div className="overflow-x-auto rounded-3xl border border-line bg-white">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-ivory/70 text-[12.5px] text-mute">
            <th className="px-3 py-3.5 sm:px-5 sm:py-4 font-medium">Bảng giá</th>
            <th className="px-3 py-3.5 sm:px-5 sm:py-4 text-right font-medium">Trong tuần <span className="block text-[11px] font-normal sm:inline sm:text-[12.5px] sm:font-medium">T2–T5</span></th>
            <th className="px-3 py-3.5 sm:px-5 sm:py-4 text-right font-medium">Cuối tuần <span className="block text-[11px] font-normal sm:inline sm:text-[12.5px] sm:font-medium">T6–CN</span></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="border-t border-line transition-colors hover:bg-paper/60">
              <th scope="row" className="px-3 py-3.5 sm:px-5 sm:py-4 font-normal">
                <span className="block text-[15px] font-medium">{r.label}</span>
                <span className="block text-[12px] whitespace-nowrap text-mute sm:text-[12.5px]">{r.hint}</span>
              </th>
              {r.pair.map((v, i) => (
                <td key={i} className="px-3 py-3.5 sm:px-5 sm:py-4 text-right text-[14.5px] font-medium tracking-[-0.02em] whitespace-nowrap tabular-nums sm:text-[17px]">
                  {formatVND(v)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function ScoreBadge({ score }) {
  return (
    <span className="grid h-9 min-w-12 shrink-0 place-items-center rounded-full bg-ink px-3 text-[14px] font-medium text-white">
      {score.toFixed(1).replace('.0', '').replace('.', ',')}
    </span>
  )
}

export function ReviewCard({ review, delay = 0, animate: animated = true, className = '' }) {
  const body = (
    <figure className={`lift flex h-full flex-col rounded-[28px] border border-line bg-white p-7 ${className}`}>
      <div className="flex items-center gap-3.5">
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-ivory text-[18px] font-medium text-gold-deep">{review.name[0]}</span>
        <figcaption className="min-w-0 flex-1">
          <span className="block truncate text-[15px] font-medium">{review.name}</span>
          <span className="block text-[12.5px] text-mute">{review.country}</span>
        </figcaption>
        <ScoreBadge score={review.score} />
      </div>
      <blockquote className="mt-6 flex-1">
        <p className="text-[19px] leading-snug font-medium tracking-[-0.02em]">“{review.title}”</p>
        <p className="mt-3 text-[14.5px] text-mute">{review.text}</p>
      </blockquote>
      <div className="mt-6 flex items-center justify-between border-t border-line pt-4 text-[12.5px] text-mute">
        <span className="font-medium text-gold-deep">{review.source}</span>
        <span>{review.date}</span>
      </div>
    </figure>
  )
  return animated ? (
    <Reveal delay={delay} className="h-full">
      {body}
    </Reveal>
  ) : (
    body
  )
}

export function FilterTabs({ options, value, onChange, label, id = 'tabs' }) {
  return (
    <div role="tablist" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={`relative min-h-11 rounded-full border px-5 text-[14px] font-medium transition-colors duration-300 ${active ? 'border-ink text-white' : 'border-line bg-white text-ink/75 hover:border-ink'}`}
          >
            {active && <motion.span layoutId={`${id}-pill`} className="absolute inset-0 rounded-full bg-ink" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
            <span className="relative">
              {o.label}
              {o.count != null && <span className={`ml-2 text-[12.5px] ${active ? 'text-white/60' : 'text-mute'}`}>{o.count}</span>}
            </span>
          </button>
        )
      })}
    </div>
  )
}
