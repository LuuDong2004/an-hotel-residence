import { addDays, differenceInCalendarDays, isValid, parseISO, startOfToday } from 'date-fns'
import { BedDouble, Check, CircleCheck, Clock, Copy, Hourglass, Info, MessageSquareText, Phone, Sparkles, User, Users } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MessengerIcon, ZaloIcon } from '../components/BrandIcons'
import { DateField, DateRangeField, Select, Stepper, TextField } from '../components/fields'
import { PageHero } from '../components/ui'
import { contact, decoration, getRoom, heroImages, rateTypes, rooms } from '../data/site'
import { formatDate, formatVND, fromPrice, quote } from '../lib/pricing'

const timeOptions = Array.from({ length: 29 }, (_, i) => {
  const h = String(8 + Math.floor(i / 2)).padStart(2, '0')
  const value = `${h}:${i % 2 ? '30' : '00'}`
  return { value, label: value }
})

const parseDate = (s) => {
  const d = s ? parseISO(s) : null
  return d && isValid(d) && d >= startOfToday() ? d : undefined
}

function buildMessage({ room, type, range, date, time, extraHours, guests, withDecoration, name, phone, note, total }) {
  const typeLabel = rateTypes.find((t) => t.id === type).label
  const when =
    type === 'hourly'
      ? `${formatDate(date)} lúc ${time} · ${2 + extraHours} tiếng`
      : `${formatDate(range.from)} → ${formatDate(range.to)} (${differenceInCalendarDays(range.to, range.from)} đêm)`
  return [
    'Xin chào AN Hotel & Residence, tôi muốn đặt phòng:',
    `• Phòng: ${room.name}`,
    `• Hình thức: ${typeLabel}`,
    `• Thời gian: ${when}`,
    `• Số khách: ${guests}`,
    withDecoration && `• Trang trí: ${decoration.name}`,
    `• Tạm tính: ${formatVND(total)}`,
    `• Họ tên: ${name}`,
    `• Điện thoại: ${phone}`,
    note && `• Ghi chú: ${note}`,
  ]
    .filter(Boolean)
    .join('\n')
}

export default function Booking() {
  const [params] = useSearchParams()
  const today = startOfToday()

  const [roomId, setRoomId] = useState(() => (getRoom(params.get('room')) ? params.get('room') : null))
  const [type, setType] = useState(() => (rateTypes.some((t) => t.id === params.get('type')) ? params.get('type') : 'overnight'))
  const [range, setRange] = useState(() => {
    const from = parseDate(params.get('from'))
    const to = parseDate(params.get('to'))
    return from && to && to > from ? { from, to } : { from: addDays(today, 1), to: addDays(today, 2) }
  })
  const [date, setDate] = useState(() => parseDate(params.get('from')) ?? addDays(today, 1))
  const [time, setTime] = useState('14:00')
  const [extraHours, setExtraHours] = useState(0)
  const [guests, setGuests] = useState(() => Math.min(2, Math.max(1, Number(params.get('guests')) || 2)))
  const [withDecoration, setWithDecoration] = useState(params.get('decoration') === '1')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [note, setNote] = useState('')
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(null)
  const [copied, setCopied] = useState(false)

  const room = getRoom(roomId)
  const result = useMemo(
    () => quote({ room, type, range, date, extraHours, withDecoration }),
    [room, type, range, date, extraHours, withDecoration],
  )

  const validate = () => {
    const e = {}
    if (!room) e.room = 'Vui lòng chọn hạng phòng.'
    if (type === 'hourly') {
      if (!date) e.date = 'Vui lòng chọn ngày.'
    } else if (!range?.from || !range?.to) {
      e.range = 'Vui lòng chọn ngày nhận và trả phòng.'
    }
    if (!name.trim()) e.name = 'Vui lòng nhập họ tên.'
    if (!/^(\+?84|0)\d{9,10}$/.test(phone.replace(/[\s.-]/g, ''))) e.phone = 'Số điện thoại chưa đúng, ví dụ 0348278000.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      setCopied(false)
    }
  }

  const submit = (e) => {
    e.preventDefault()
    if (!validate()) return
    const message = buildMessage({ room, type, range, date, time, extraHours, guests, withDecoration, name: name.trim(), phone: phone.trim(), note: note.trim(), total: result.total })
    setSent(message)
    copy(message)
  }

  const sectionTitle = 'flex items-center gap-4 text-[24px] md:text-[28px]'
  const step = 'grid size-9 shrink-0 place-items-center rounded-full border border-gold font-sans text-[13px] font-medium text-gold-deep'

  return (
    <>
      <PageHero eyebrow="Đặt phòng" title="Đặt phòng tại AN Hotel & Residence" text="Chọn phòng, thời gian và xem tạm tính ngay — chúng tôi xác nhận qua Zalo hoặc Messenger." image={heroImages.booking} />

      <div className="container-x grid gap-10 py-10 md:py-14 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-14">
        <form onSubmit={submit} noValidate className="space-y-14">
          <section>
            <h2 className={sectionTitle}>
              <span className={step}>1</span> Phòng & hình thức thuê
            </h2>
            <div className="mt-7 grid gap-5 md:grid-cols-2">
              <Select
                label="Hạng phòng"
                icon={BedDouble}
                value={roomId}
                onChange={(v) => {
                  setRoomId(v)
                  setErrors((e) => ({ ...e, room: undefined }))
                }}
                placeholder="Chọn hạng phòng"
                error={errors.room}
                options={rooms.map((r) => ({ value: r.id, label: r.name, hint: `${r.area} m² · ${r.bed}`, meta: formatVND(fromPrice(r)) }))}
              />
              <Select
                label="Hình thức thuê"
                icon={Clock}
                value={type}
                onChange={setType}
                options={rateTypes.map((t) => ({ value: t.id, label: t.label, hint: t.hint, meta: room ? formatVND(room.rates[t.id][0]) : undefined }))}
              />
            </div>
          </section>

          <section>
            <h2 className={sectionTitle}>
              <span className={step}>2</span> Thời gian & số khách
            </h2>
            <div className="mt-7 grid gap-5 md:grid-cols-2">
              {type === 'hourly' ? (
                <>
                  <DateField
                    label="Ngày thuê"
                    value={date}
                    error={errors.date}
                    onChange={(d) => {
                      setDate(d)
                      setErrors((e) => ({ ...e, date: undefined }))
                    }}
                  />
                  <Select label="Giờ nhận phòng" icon={Clock} value={time} onChange={setTime} options={timeOptions} />
                  <Stepper label="Giờ thêm (sau 2 tiếng đầu)" icon={Hourglass} value={extraHours} onChange={setExtraHours} min={0} max={8} unit="giờ" />
                </>
              ) : (
                <DateRangeField
                  value={range}
                  error={errors.range}
                  onChange={(r) => {
                    setRange(r)
                    setErrors((e) => ({ ...e, range: undefined }))
                  }}
                />
              )}
              <Stepper label="Số khách" icon={Users} value={guests} onChange={setGuests} min={1} max={2} unit="khách" />
            </div>

            <label className="mt-5 flex cursor-pointer items-start gap-4 rounded-3xl border border-line bg-white p-5 transition-colors hover:border-gold has-checked:border-ink has-checked:bg-ivory/60">
              <input type="checkbox" className="peer sr-only" checked={withDecoration} onChange={(e) => setWithDecoration(e.target.checked)} />
              <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-3xl border border-line bg-white text-transparent peer-checked:border-ink peer-checked:bg-ink peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold">
                <Check size={15} strokeWidth={2.5} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2 text-[15.5px] font-medium">
                  <Sparkles size={16} strokeWidth={1.5} className="text-gold-deep" /> Thêm trang trí phòng lãng mạn
                </span>
                <span className="mt-1 block text-[13.5px] text-mute">Gói {decoration.name}: standee & hoa, bóng bay, box hoa hồng, nến và set ly vang.</span>
              </span>
              <span className="shrink-0 font-display text-[22px] text-gold-deep">+{formatVND(decoration.price)}</span>
            </label>
          </section>

          <section>
            <h2 className={sectionTitle}>
              <span className={step}>3</span> Thông tin liên hệ
            </h2>
            <div className="mt-7 grid gap-5 md:grid-cols-2">
              <TextField
                label="Họ và tên"
                icon={User}
                name="name"
                autoComplete="name"
                placeholder="Nguyễn Văn A"
                value={name}
                error={errors.name}
                onChange={(e) => {
                  setName(e.target.value)
                  setErrors((er) => ({ ...er, name: undefined }))
                }}
              />
              <TextField
                label="Số điện thoại"
                icon={Phone}
                name="tel"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="0348 278 000"
                value={phone}
                error={errors.phone}
                onChange={(e) => {
                  setPhone(e.target.value)
                  setErrors((er) => ({ ...er, phone: undefined }))
                }}
              />
              <div className="md:col-span-2">
                <TextField label="Ghi chú (không bắt buộc)" icon={MessageSquareText} multiline name="note" placeholder="Giờ đến dự kiến, yêu cầu riêng…" value={note} onChange={(e) => setNote(e.target.value)} />
              </div>
            </div>
          </section>

          <button type="submit" className="btn btn-gold w-full md:w-auto">
            Tạo yêu cầu đặt phòng
          </button>

          {sent && (
            <section aria-live="polite" className="rounded-[28px] border border-gold bg-ivory p-6 md:p-8">
              <h2 className="flex items-center gap-3 text-[28px]">
                <CircleCheck size={26} strokeWidth={1.3} className="text-gold-deep" /> Yêu cầu đã sẵn sàng
              </h2>
              <p className="mt-3 text-[14.5px] text-mute">
                {copied ? 'Nội dung đã được sao chép. ' : ''}Mở Zalo hoặc Messenger và dán nội dung bên dưới để gửi cho lễ tân — chúng tôi sẽ xác nhận phòng trống và giá cuối cùng.
              </p>
              <pre className="mt-5 rounded-3xl border border-line bg-white p-5 font-sans text-[14px] leading-relaxed font-normal whitespace-pre-wrap">{sent}</pre>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <a href={contact.zalo} target="_blank" rel="noreferrer" className="btn btn-gold px-4!">
                  <ZaloIcon size={22} /> Mở Zalo
                </a>
                <a href={contact.messenger} target="_blank" rel="noreferrer" className="btn btn-outline bg-white px-4!">
                  <MessengerIcon size={17} /> Messenger
                </a>
                <button type="button" className="btn btn-outline px-4!" onClick={() => copy(sent)}>
                  <Copy size={15} strokeWidth={1.5} /> {copied ? 'Đã sao chép' : 'Sao chép'}
                </button>
              </div>
            </section>
          )}
        </form>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="overflow-hidden rounded-[28px] border border-line bg-white shadow-soft">
            {room ? (
              <img src={room.cover} alt={room.name} className="aspect-[16/9] w-full object-cover" />
            ) : (
              <div className="grid aspect-[16/9] place-items-center bg-ivory text-gold-deep">
                <BedDouble size={40} strokeWidth={0.9} />
              </div>
            )}
            <div className="p-7">
              <span className="text-[10.5px] font-medium tracking-[0.06em] text-gold-deep uppercase">Tạm tính</span>
              <h2 className="mt-2 text-[30px]">{room ? room.name : 'Chưa chọn phòng'}</h2>
              <p className="mt-1 text-[13.5px] text-mute">
                {rateTypes.find((t) => t.id === type).label} · {guests} khách
                {type === 'hourly' && date ? ` · ${formatDate(date, 'dd/MM')} ${time}` : ''}
              </p>

              {result ? (
                <>
                  <ul className="mt-6 space-y-3 border-t border-line pt-6">
                    {result.lines.map((l) => (
                      <li key={l.label} className="flex items-baseline justify-between gap-4 text-[14px]">
                        <span className="text-mute">{l.label}</span>
                        <span className="shrink-0 font-normal tabular-nums">{formatVND(l.amount)}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 flex items-baseline justify-between gap-4 border-t border-gold pt-5">
                    <span className="text-[11px] font-medium tracking-[0.06em] uppercase">Tổng cộng</span>
                    <span className="font-display text-[38px] leading-none text-gold-deep tabular-nums">{formatVND(result.total)}</span>
                  </p>
                </>
              ) : (
                <p className="mt-6 border-t border-line pt-6 text-[14px] text-mute">
                  Chọn hạng phòng và thời gian để xem giá tạm tính.
                </p>
              )}

              <p className="mt-6 flex gap-2.5 text-[12.5px] text-mute">
                <Info size={15} strokeWidth={1.5} className="mt-0.5 shrink-0 text-gold-deep" />
                Giá tạm tính theo bảng giá niêm yết; lễ tân sẽ xác nhận phòng trống và giá cuối cùng.
              </p>
            </div>
          </div>

          <a href={contact.phoneHref} className="mt-4 flex min-h-16 items-center gap-4 rounded-3xl border border-line bg-white px-6 transition-colors hover:border-ink">
            <Phone size={20} strokeWidth={1.3} className="text-gold-deep" />
            <span>
              <span className="block text-[10.5px] font-medium tracking-[0.06em] text-mute uppercase">Đặt nhanh qua điện thoại · 24/7</span>
              <span className="block text-[17px] font-normal">{contact.phone}</span>
            </span>
          </a>
        </aside>
      </div>
    </>
  )
}
