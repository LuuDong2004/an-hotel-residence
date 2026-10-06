import { ArrowUpRight, Check, Clock, Mail, MapPin, Navigation, Phone } from 'lucide-react'
import { motion } from 'motion/react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { MessengerIcon, ZaloIcon } from '../components/BrandIcons'
import Lightbox from '../components/Lightbox'
import { FilterTabs, PageHero, Reveal, ReviewCard } from '../components/ui'
import { attractions, averageScore, contact, decoration, heroImages, otas, reviews } from '../data/site'
import gallery from '../data/gallery.json'
import { formatVND } from '../lib/pricing'
import { CallToAction } from './Home'

export function Services() {
  const [active, setActive] = useState(null)
  return (
    <>
      <PageHero eyebrow="Dịch vụ đặc biệt" title="Trang trí phòng lãng mạn" text="Hoa tươi, nến, bóng bay và rượu vang — cho những dịp kỷ niệm đáng nhớ." image={heroImages.services} />

      <section className="container-x grid gap-14 py-10 md:py-14 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-20">
        <div>
          <Reveal>
            <p className="text-[22px] leading-snug font-medium tracking-[-0.03em] md:text-[28px]">{decoration.intro}</p>
          </Reveal>
          <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3">
            {decoration.images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Xem ảnh trang trí ${i + 1}`}
                className={`img-zoom overflow-hidden ${i === 0 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-square'}`}
              >
                <img src={src} alt="" loading="lazy" className="size-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-3xl border border-line bg-white p-8 shadow-soft">
            <span className="text-[10.5px] font-medium tracking-[0.06em] text-gold-deep uppercase">Gói trang trí</span>
            <h2 className="mt-3 text-[36px]">{decoration.name}</h2>
            <p className="mt-3 font-display text-[46px] leading-none text-gold-deep">{formatVND(decoration.price)}</p>

            <div className="mt-8 space-y-7 border-t border-line pt-8">
              {decoration.groups.map((g) => (
                <div key={g.title}>
                  <h3 className="font-sans! text-[10.5px] font-medium tracking-[0.06em] text-mute uppercase">{g.title}</h3>
                  <ul className="mt-3.5 space-y-2.5">
                    {g.items.map((item) => (
                      <li key={item} className="flex items-center gap-3 text-[15px] font-normal">
                        <Check size={16} strokeWidth={1.75} className="shrink-0 text-gold-deep" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <Link to="/booking?decoration=1" className="btn btn-gold mt-9 w-full">
              Đặt dịch vụ trang trí
            </Link>
            <p className="mt-4 text-[12.5px] text-mute">* {decoration.note}</p>
          </div>
        </aside>
      </section>

      <Lightbox images={decoration.images.map((src) => ({ src, label: 'Trang trí phòng' }))} index={active} onChange={setActive} />
      <CallToAction />
    </>
  )
}

export function Gallery() {
  const [cat, setCat] = useState('all')
  const [active, setActive] = useState(null)

  const tabs = useMemo(() => {
    const seen = new Map()
    for (const g of gallery) seen.set(g.cat, { value: g.cat, label: g.label, count: (seen.get(g.cat)?.count ?? 0) + 1 })
    return [{ value: 'all', label: 'Tất cả', count: gallery.length }, ...seen.values()]
  }, [])

  const images = useMemo(() => (cat === 'all' ? gallery : gallery.filter((g) => g.cat === cat)), [cat])

  return (
    <>
      <PageHero eyebrow="Gallery" title="Thư viện ảnh" text="Hình ảnh thực tế từ AN Hotel & Residence." image={heroImages.gallery} />
      <section className="container-x py-10 md:py-14">
        <FilterTabs
          label="Lọc ảnh theo khu vực"
          options={tabs}
          value={cat}
          onChange={(v) => {
            setCat(v)
            setActive(null)
          }}
        />
        <motion.div key={cat} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }} className="mt-10 columns-2 gap-3 md:columns-3 xl:columns-4">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Xem ảnh ${img.label} ${i + 1}`}
              className="img-zoom group relative mb-3 block w-full overflow-hidden bg-ivory"
            >
              <img src={img.src} alt="" loading="lazy" className="w-full" />
              <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-night/85 to-transparent px-4 pt-10 pb-3 text-left text-[10.5px] font-medium tracking-[0.2em] text-snow uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                {img.label}
              </span>
            </button>
          ))}
        </motion.div>
      </section>
      <Lightbox images={images} index={active} onChange={setActive} />
    </>
  )
}

export function Reviews() {
  const [source, setSource] = useState('all')
  const tabs = [
    { value: 'all', label: 'Tất cả', count: reviews.length },
    ...otas.map((o) => ({ value: o.name, label: o.name, count: reviews.filter((r) => r.source === o.name).length })),
  ]
  const list = source === 'all' ? reviews : reviews.filter((r) => r.source === source)

  return (
    <>
      <PageHero eyebrow="Đánh giá" title="Khách hàng nói gì về chúng tôi" image={heroImages.reviews}>
        <div className="mt-9 inline-flex items-center gap-5 rounded-3xl border border-line bg-white px-7 py-5">
          <span className="font-display text-[58px] leading-none text-gold-deep">{averageScore}</span>
          <span className="text-[13px] text-mute">
            <span className="block text-[10.5px] font-medium tracking-[0.06em] text-ink uppercase">Điểm trung bình</span>
            Dựa trên {reviews.length} đánh giá
          </span>
        </div>
      </PageHero>

      <section className="container-x py-10 md:py-14">
        <FilterTabs label="Lọc đánh giá theo nguồn" options={tabs} value={source} onChange={setSource} />
        {list.length ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {list.map((r) => (
              <ReviewCard key={r.name + r.date} review={r} />
            ))}
          </div>
        ) : (
          <p className="mt-10 rounded-3xl border border-line bg-white p-10 text-center text-mute">
            Chưa có đánh giá từ {source} được hiển thị tại đây. Bạn có thể xem trực tiếp trên {source} bằng liên kết bên dưới.
          </p>
        )}

        <div className="mt-14 grid gap-3 sm:grid-cols-3">
          {otas.map((o) => (
            <a key={o.name} href={o.href} target="_blank" rel="noreferrer" className="flex min-h-16 items-center justify-between rounded-3xl border border-line bg-white px-6 text-[12px] font-medium tracking-[0.06em] uppercase transition-colors hover:border-gold-deep hover:text-gold-deep">
              Xem trên {o.name} <ArrowUpRight size={17} strokeWidth={1.5} className="text-gold-deep" />
            </a>
          ))}
        </div>
      </section>
      <CallToAction />
    </>
  )
}

export function Attractions() {
  return (
    <>
      <PageHero eyebrow="Khám phá" title="Khám phá Hồ Tây" text="Những điểm đến thú vị quanh AN Hotel & Residence." image={heroImages.attractions} />
      <div className="container-x py-10 md:py-14">
        {attractions.map((group) => (
          <section key={group.title} className="mb-20 last:mb-0">
            <Reveal className="flex items-end justify-between gap-6 border-b border-line pb-6">
              <h2 className="text-[36px] md:text-[46px]">{group.title}</h2>
              <span className="shrink-0 pb-2 text-[10.5px] font-medium tracking-[0.06em] text-gold-deep uppercase">{group.range}</span>
            </Reveal>
            <ul className="grid md:grid-cols-2 xl:grid-cols-3">
              {group.items.map(({ icon: Icon, name, text, km }, i) => (
                <Reveal as="li" key={name} delay={(i % 3) * 70} className="flex gap-5 border-b border-line py-8 md:px-6 md:first:pl-0 xl:[&:nth-child(3n+1)]:pl-0">
                  <span className="grid size-14 shrink-0 place-items-center rounded-3xl border border-line bg-white">
                    <Icon size={24} strokeWidth={1.1} className="text-gold-deep" />
                  </span>
                  <div>
                    <h3 className="text-[24px]">{name}</h3>
                    <p className="mt-2 text-[14.5px] text-mute">{text}</p>
                    <p className="mt-4 inline-flex items-center gap-2 text-[10.5px] font-medium tracking-[0.06em] text-gold-deep uppercase">
                      <Navigation size={13} strokeWidth={1.5} /> Cách {String(km).replace('.', ',')} km
                    </p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <iframe title="Vị trí AN Hotel & Residence West Lake" src={contact.mapEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-[460px] w-full border-0" />
    </>
  )
}

export function Contact() {
  const rows = [
    { icon: MapPin, label: 'Địa chỉ', value: contact.address, href: contact.directions, external: true },
    { icon: Phone, label: 'Hotline', value: contact.phone, href: contact.phoneHref },
    { icon: Mail, label: 'Email', value: contact.email, href: `mailto:${contact.email}` },
    { icon: Clock, label: 'Giờ làm việc', value: '24/7 — luôn sẵn sàng phục vụ bạn' },
  ]
  return (
    <>
      <PageHero eyebrow="Liên hệ" title="Liên hệ" text="Chúng tôi luôn sẵn sàng phục vụ bạn." image={heroImages.contact} />
      <section className="container-x grid gap-12 py-10 md:py-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <Reveal>
          <ul className="divide-y divide-line border-y border-line">
            {rows.map(({ icon: Icon, label, value, href, external }) => (
              <li key={label} className="flex gap-5 py-6">
                <Icon size={22} strokeWidth={1.2} className="mt-1 shrink-0 text-gold-deep" />
                <span className="min-w-0">
                  <span className="block text-[10.5px] font-medium tracking-[0.06em] text-mute uppercase">{label}</span>
                  {href ? (
                    <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined} className="mt-1 block text-[17px] font-normal break-words hover:text-gold-deep">
                      {value}
                    </a>
                  ) : (
                    <span className="mt-1 block text-[17px] font-normal">{value}</span>
                  )}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-9 grid gap-3 sm:grid-cols-2">
            <a href={contact.messenger} target="_blank" rel="noreferrer" className="btn btn-outline bg-white">
              <MessengerIcon size={17} /> Messenger
            </a>
            <a href={contact.zalo} target="_blank" rel="noreferrer" className="btn btn-outline bg-white">
              <ZaloIcon size={22} /> Zalo
            </a>
            <a href={contact.directions} target="_blank" rel="noreferrer" className="btn btn-outline">
              <Navigation size={16} strokeWidth={1.5} /> Chỉ đường
            </a>
            <Link to="/booking" className="btn btn-gold">
              Đặt phòng
            </Link>
          </div>
        </Reveal>

        <Reveal delay={100} className="min-h-[420px] overflow-hidden rounded-[32px] border border-line bg-ivory">
          <iframe title="Bản đồ AN Hotel & Residence West Lake" src={contact.mapEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="size-full min-h-[420px] border-0" />
        </Reveal>
      </section>
    </>
  )
}
