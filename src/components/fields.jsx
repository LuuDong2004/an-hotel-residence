import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Popover,
  PopoverButton,
  PopoverPanel,
} from '@headlessui/react'
import { CalendarDays, Check, ChevronDown, Minus, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import { vi } from 'react-day-picker/locale'
import { differenceInCalendarDays, startOfToday } from 'date-fns'
import { formatDate } from '../lib/pricing'

function useIsDesktop() {
  const query = '(min-width: 768px)'
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = (e) => setMatches(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return matches
}

export function Field({ label, error, children }) {
  return (
    <div className="min-w-0">
      <span className="field-label">{label}</span>
      {children}
      {error && <p className="mt-2 text-[13px] font-normal text-wine">{error}</p>}
    </div>
  )
}

/** Dropdown: options = [{ value, label, hint?, meta? }] */
export function Select({ label, icon: Icon, value, onChange, options, placeholder = 'Chọn', error }) {
  const selected = options.find((o) => o.value === value)
  return (
    <Field label={label} error={error}>
      <Listbox value={value} onChange={onChange}>
        <ListboxButton className="field-control group" data-invalid={Boolean(error)}>
          {Icon && <Icon size={18} strokeWidth={1.5} className="shrink-0 text-gold-deep" />}
          <span className={`flex-1 truncate ${selected ? '' : 'text-[#8b98a1]'}`}>
            {selected ? selected.label : placeholder}
          </span>
          <ChevronDown
            size={16}
            strokeWidth={1.5}
            className="shrink-0 text-mute transition-transform duration-200 group-data-open:rotate-180"
          />
        </ListboxButton>
        <ListboxOptions
          anchor={{ to: 'bottom start', gap: 8, padding: 12 }}
          transition
          className="z-50 w-(--button-width) min-w-[21rem] max-w-[calc(100vw-2rem)] origin-top rounded-3xl border border-line bg-white p-1.5 shadow-pop transition duration-150 ease-out focus:outline-none data-closed:scale-98 data-closed:opacity-0"
        >
          {options.map((o) => (
            <ListboxOption
              key={o.value}
              value={o.value}
              className="group flex cursor-pointer items-center gap-3 rounded-2xl px-3.5 py-3 transition-colors data-focus:bg-paper"
            >
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px] font-normal group-data-selected:font-medium">
                  {o.label}
                </span>
                {o.hint && <span className="block truncate text-[12.5px] text-mute">{o.hint}</span>}
              </span>
              {o.meta && (
                <span className="shrink-0 text-[13.5px] font-medium text-gold-deep tabular-nums">{o.meta}</span>
              )}
              <Check
                size={16}
                strokeWidth={2}
                className="hidden shrink-0 text-gold-deep group-data-selected:block"
              />
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
    </Field>
  )
}

const panelClass =
  'z-50 rounded-3xl border border-line bg-white p-4 shadow-pop transition duration-150 ease-out data-closed:translate-y-1 data-closed:opacity-0 md:p-5'

/** Chọn khoảng ngày nhận – trả phòng */
export function DateRangeField({ label = 'Nhận phòng — Trả phòng', value, onChange, error }) {
  const isDesktop = useIsDesktop()
  const nights = value?.from && value?.to ? differenceInCalendarDays(value.to, value.from) : 0
  return (
    <Field label={label} error={error}>
      <Popover>
        {({ close }) => (
          <>
            <PopoverButton className="field-control" data-invalid={Boolean(error)}>
              <CalendarDays size={18} strokeWidth={1.5} className="shrink-0 text-gold-deep" />
              <span className={`flex-1 truncate ${value?.from ? '' : 'text-[#8b98a1]'}`}>
                {value?.from
                  ? `${formatDate(value.from, 'dd/MM')} — ${value.to ? formatDate(value.to, 'dd/MM/yyyy') : 'Trả phòng'}`
                  : 'Chọn ngày'}
              </span>
              {nights > 0 && (
                <span className="shrink-0 rounded-full bg-paper px-2.5 py-1 text-[12px] font-medium text-gold-deep">
                  {nights} đêm
                </span>
              )}
            </PopoverButton>
            <PopoverPanel anchor={{ to: 'bottom start', gap: 8, padding: 12 }} transition className={panelClass}>
              <DayPicker
                mode="range"
                locale={vi}
                numberOfMonths={isDesktop ? 2 : 1}
                selected={value}
                onSelect={onChange}
                min={1}
                excludeDisabled
                disabled={{ before: startOfToday() }}
                defaultMonth={value?.from}
              />
              <div className="mt-3 flex items-center justify-between gap-4 border-t border-line pt-3">
                <p className="text-[12.5px] text-mute">Giá cuối tuần áp dụng từ thứ 6 đến chủ nhật.</p>
                <div className="flex shrink-0 gap-4">
                  <button type="button" className="text-[12px] font-medium tracking-widest text-mute hover:text-ink" onClick={() => onChange(undefined)}>
                    Xóa
                  </button>
                  <button type="button" className="text-[12px] font-medium tracking-widest text-gold-deep hover:text-ink" onClick={() => close()}>
                    Xong
                  </button>
                </div>
              </div>
            </PopoverPanel>
          </>
        )}
      </Popover>
    </Field>
  )
}

/** Chọn một ngày (thuê theo giờ) */
export function DateField({ label = 'Ngày', value, onChange, error }) {
  return (
    <Field label={label} error={error}>
      <Popover>
        {({ close }) => (
          <>
            <PopoverButton className="field-control" data-invalid={Boolean(error)}>
              <CalendarDays size={18} strokeWidth={1.5} className="shrink-0 text-gold-deep" />
              <span className={`flex-1 truncate ${value ? '' : 'text-[#8b98a1]'}`}>
                {value ? formatDate(value) : 'Chọn ngày'}
              </span>
            </PopoverButton>
            <PopoverPanel anchor={{ to: 'bottom start', gap: 8, padding: 12 }} transition className={panelClass}>
              <DayPicker
                mode="single"
                locale={vi}
                selected={value}
                onSelect={(d) => {
                  onChange(d)
                  if (d) close()
                }}
                disabled={{ before: startOfToday() }}
                defaultMonth={value}
              />
            </PopoverPanel>
          </>
        )}
      </Popover>
    </Field>
  )
}

export function Stepper({ label, icon: Icon, value, onChange, min = 0, max = 10, unit = '' }) {
  const btn =
    'grid size-8 shrink-0 place-items-center rounded-full border border-line text-ink transition-colors hover:border-ink disabled:opacity-35 disabled:hover:border-line'
  return (
    <Field label={label}>
      <div className="field-control">
        {Icon && <Icon size={18} strokeWidth={1.5} className="shrink-0 text-gold-deep" />}
        <span className="flex-1 truncate" aria-live="polite">
          {value} {unit}
        </span>
        <button type="button" className={btn} aria-label={`Giảm ${label}`} disabled={value <= min} onClick={() => onChange(value - 1)}>
          <Minus size={14} />
        </button>
        <button type="button" className={btn} aria-label={`Tăng ${label}`} disabled={value >= max} onClick={() => onChange(value + 1)}>
          <Plus size={14} />
        </button>
      </div>
    </Field>
  )
}

export function TextField({ label, icon: Icon, error, multiline, ...props }) {
  const Tag = multiline ? 'textarea' : 'input'
  return (
    <label className="block min-w-0">
      <span className="field-label">{label}</span>
      <span className={`field-control ${multiline ? 'items-start py-4' : ''}`} data-invalid={Boolean(error)}>
        {Icon && <Icon size={18} strokeWidth={1.5} className={`shrink-0 text-gold-deep ${multiline ? 'mt-1' : ''}`} />}
        <Tag {...props} aria-invalid={Boolean(error)} rows={multiline ? 3 : undefined} className={multiline ? 'resize-none' : ''} />
      </span>
      {error && <span className="mt-2 block text-[13px] font-normal text-wine">{error}</span>}
    </label>
  )
}
