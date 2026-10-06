import { ArrowRight, ChevronLeft } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import Lightbox from '../components/Lightbox'
import { PageHero, Price, RateTable, Reveal, RoomSpecs } from '../components/ui'
import { getRoom, heroImages, rooms } from '../data/site'
import { formatVND, fromPrice } from '../lib/pricing'
import { CallToAction } from './Home'

function AmenityList({ items, columns = 'sm:grid-cols-2' }) {
  return (
    <ul className={`grid gap-x-8 gap-y-3.5 ${columns}`}>
      {items.map(({ icon: Icon, label }) => (
        <li key={label} className="flex items-center gap-3 text-[14.5px] font-normal">
          <Icon size={18} strokeWidth={1.3} className="shrink-0 text-gold-deep" />
          {label}
        </li>
      ))}
    </ul>
  )
}

export default function Rooms() {
  return (
    <>
      <PageHero
        eyebrow="Phòng & Giá"
        title="Phòng & Bảng giá"
        text="Lựa chọn không gian lý tưởng cho kỳ nghỉ của bạn — thuê theo giờ, qua đêm hoặc cả ngày."
        image={heroImages.rooms}
      />
      <div className="container-x divide-y divide-line">
        {rooms.map((room, i) => (
          <section key={room.id} className="grid grid-cols-1 items-start gap-10 py-10 md:py-14 lg:grid-cols-2 lg:gap-20">
            <Reveal className={`grid min-w-0 grid-cols-6 gap-3 lg:sticky lg:top-28 ${i % 2 ? 'lg:order-2' : ''}`}>
              <Link to={`/rooms/${room.id}`} className="img-zoom col-span-6 aspect-[3/2] overflow-hidden">
                <img src={room.images[0]} alt={room.name} loading="lazy" className="size-full object-cover" />
              </Link>
              {room.images.slice(1, 4).map((src) => (
                <div key={src} className="img-zoom col-span-2 aspect-[4/3] overflow-hidden">
                  <img src={src} alt="" loading="lazy" className="size-full object-cover" />
                </div>
              ))}
              {room.images.slice(4, 6).map((src) => (
                <div key={src} className="img-zoom col-span-3 aspect-[3/2] overflow-hidden">
                  <img src={src} alt="" loading="lazy" className="size-full object-cover" />
                </div>
              ))}
            </Reveal>

            <Reveal delay={100} className="min-w-0">
              <span className="eyebrow">Hạng phòng 0{i + 1}</span>
              <h2 className="mt-5 text-[40px] md:text-[54px]">{room.name}</h2>
              <RoomSpecs room={room} className="mt-5" />
              <p className="mt-6 text-[16px] text-mute">{room.description}</p>

              <h3 className="mt-10 mb-5 font-sans! text-[10.5px] font-medium tracking-[0.06em] text-gold-deep uppercase">Tiện nghi</h3>
              <AmenityList items={room.amenities} />

              <div className="mt-10">
                <RateTable room={room} />
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link to={`/booking?room=${room.id}`} className="btn btn-gold">
                  Đặt phòng này
                </Link>
                <Link to={`/rooms/${room.id}`} className="btn btn-outline">
                  Xem chi tiết <ArrowRight size={15} strokeWidth={1.5} />
                </Link>
              </div>
            </Reveal>
          </section>
        ))}
      </div>
      <CallToAction />
    </>
  )
}

export function RoomDetail() {
  const { id } = useParams()
  const room = getRoom(id)
  const [active, setActive] = useState(null)
  if (!room) return <Navigate to="/rooms" replace />

  const quick = [
    { label: 'Cả ngày', hint: '15:00 – 11:00', value: room.rates.day[0] },
    { label: 'Qua đêm', hint: '22:00 – 11:00', value: room.rates.overnight[0] },
    { label: '2 tiếng', hint: 'Theo giờ', value: room.rates.hourly[0] },
  ]

  return (
    <>
      <PageHero eyebrow={`${room.area} m² · Tối đa ${room.guests} khách`} title={room.name} image={room.cover}>
        <Link to="/rooms" className="mt-8 inline-flex items-center gap-2 text-[11.5px] font-medium tracking-[0.2em] text-mute uppercase hover:text-gold-deep">
          <ChevronLeft size={15} strokeWidth={1.5} /> Tất cả phòng
        </Link>
      </PageHero>

      <div className="container-x grid grid-cols-1 gap-14 py-10 md:py-14 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-20">
        <div className="min-w-0">
          <RoomSpecs room={room} />
          <p className="mt-6 text-[21px] leading-snug font-medium tracking-[-0.03em] md:text-[26px]">{room.description}</p>

          <ul className="mt-9 flex flex-wrap gap-2">
            {room.highlights.map((h) => (
              <li key={h} className="rounded-3xl border border-line bg-white px-4 py-2.5 text-[11px] font-medium tracking-[0.06em] text-mute uppercase">
                {h}
              </li>
            ))}
          </ul>

          <h2 className="mt-16 mb-7 text-[34px]">Tiện nghi</h2>
          <AmenityList items={room.amenities} />

          <h2 className="mt-16 mb-7 text-[34px]">Bảng giá</h2>
          <RateTable room={room} />

          <h2 className="mt-16 mb-7 text-[34px]">Hình ảnh</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {room.images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Xem ảnh ${i + 1} của ${room.name}`}
                className={`img-zoom overflow-hidden ${i === 0 ? 'col-span-2 row-span-2' : ''} aspect-[4/3]`}
              >
                <img src={src} alt="" loading="lazy" className="size-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-[28px] border border-line bg-white p-8 shadow-soft">
            <Price amount={fromPrice(room)} size="lg" />
            <ul className="mt-7 divide-y divide-line border-y border-line">
              {quick.map((q) => (
                <li key={q.label} className="flex items-center justify-between gap-4 py-4">
                  <span>
                    <span className="block text-[15px] font-normal">{q.label}</span>
                    <span className="block text-[12.5px] text-mute">{q.hint}</span>
                  </span>
                  <span className="font-display text-[22px] text-gold-deep tabular-nums">{formatVND(q.value)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[12.5px] text-mute">Giá trong tuần (T2–T5). Cuối tuần xem bảng giá chi tiết.</p>
            <Link to={`/booking?room=${room.id}`} className="btn btn-gold mt-7 w-full">
              Đặt phòng này
            </Link>
          </div>
        </aside>
      </div>

      <Lightbox images={room.images.map((src) => ({ src, label: room.name }))} index={active} onChange={setActive} />
    </>
  )
}
