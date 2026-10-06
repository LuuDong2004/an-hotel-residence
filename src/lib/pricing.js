import { addDays, differenceInCalendarDays, format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { decoration } from '../data/site'

export const formatVND = (n) => `${n.toLocaleString('vi-VN')} ₫`

export const formatDate = (d, pattern = 'EEE, dd/MM/yyyy') =>
  d ? format(d, pattern, { locale: vi }) : ''

// Giá cuối tuần áp dụng T6 – CN
export const isWeekend = (d) => [5, 6, 0].includes(d.getDay())

const rateFor = (pair, d) => pair[isWeekend(d) ? 1 : 0]

export const fromPrice = (room) => room.rates.overnight[0]

/**
 * Tính tạm tính cho một yêu cầu đặt phòng.
 * Trả về null khi chưa đủ thông tin (chưa chọn phòng / ngày).
 */
export function quote({ room, type, range, date, extraHours = 0, withDecoration = false }) {
  if (!room) return null
  const lines = []

  if (type === 'hourly') {
    if (!date) return null
    lines.push({ label: `2 tiếng đầu · ${isWeekend(date) ? 'cuối tuần' : 'trong tuần'}`, amount: rateFor(room.rates.hourly, date) })
    if (extraHours > 0) {
      lines.push({ label: `Giờ thêm × ${extraHours}`, amount: extraHours * room.rates.extraHour })
    }
  } else {
    if (!range?.from || !range?.to) return null
    const nights = differenceInCalendarDays(range.to, range.from)
    if (nights < 1) return null
    let weekday = 0
    let weekend = 0
    for (let i = 0; i < nights; i++) {
      if (isWeekend(addDays(range.from, i))) weekend++
      else weekday++
    }
    const [wk, we] = room.rates[type]
    if (weekday) lines.push({ label: `${weekday} đêm trong tuần × ${formatVND(wk)}`, amount: weekday * wk })
    if (weekend) lines.push({ label: `${weekend} đêm cuối tuần × ${formatVND(we)}`, amount: weekend * we })
  }

  if (withDecoration) {
    lines.push({ label: `Trang trí ${decoration.name}`, amount: decoration.price })
  }

  return { lines, total: lines.reduce((sum, l) => sum + l.amount, 0) }
}
