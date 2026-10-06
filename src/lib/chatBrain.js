import { addDays, format, nextFriday, startOfToday } from 'date-fns'
import { contact, decoration, getRoom, rateTypes, rooms } from '../data/site'
import { formatDate, formatVND, quote } from './pricing'

const iso = (d) => format(d, 'yyyy-MM-dd')
const plain = (s) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')

const menuChips = [
  { label: 'Xem phòng & giá', action: { kind: 'rooms' } },
  { label: 'Tính giá đặt phòng', action: { kind: 'quote' } },
  { label: 'Trang trí lãng mạn', action: { kind: 'decor' } },
  { label: 'Địa chỉ & liên hệ', action: { kind: 'contact' } },
]

export const welcome = {
  from: 'bot',
  text: 'Xin chào! Mình là trợ lý của AN Hotel & Residence. Mình có thể giới thiệu phòng, tính giá theo ngày bạn chọn và hướng dẫn đặt phòng. Bạn cần gì ạ?',
  chips: menuChips,
}

const roomChips = () => rooms.map((r) => ({ label: r.short, action: { kind: 'pickRoom', id: r.id } }))

function roomDetail(room) {
  const { day, overnight, hourly, extraHour } = room.rates
  return {
    from: 'bot',
    text: `${room.name} · ${room.area} m² · ${room.bed}.\n${room.description}`,
    rows: [
      { label: 'Cả ngày (15:00 – 11:00)', value: `${formatVND(day[0])} – ${formatVND(day[1])}` },
      { label: 'Qua đêm (22:00 – 11:00)', value: `${formatVND(overnight[0])} – ${formatVND(overnight[1])}` },
      { label: '2 tiếng đầu', value: `${formatVND(hourly[0])} – ${formatVND(hourly[1])}` },
      { label: 'Mỗi giờ thêm', value: formatVND(extraHour) },
    ],
    note: 'Giá trong tuần (T2–T5) – cuối tuần (T6–CN).',
    links: [{ label: 'Xem chi tiết phòng', to: `/rooms/${room.id}` }],
    chips: [{ label: 'Tính giá phòng này', action: { kind: 'pickRoom', id: room.id } }],
  }
}

/** Trả lời một lượt: nhận hành động (bấm gợi ý) hoặc câu gõ tự do */
export function respond({ action, text }, draft) {
  if (action) {
    switch (action.kind) {
      case 'rooms':
        return { reply: { from: 'bot', text: 'AN Hotel có 3 hạng phòng, giá qua đêm từ:', rooms: true, chips: [{ label: 'Tính giá đặt phòng', action: { kind: 'quote' } }] } }
      case 'quote':
        return { reply: { from: 'bot', text: 'Bạn muốn ở hạng phòng nào?', chips: roomChips() }, draft: {} }
      case 'pickRoom':
        return {
          draft: { roomId: action.id },
          reply: {
            from: 'bot',
            text: `${getRoom(action.id).name} — bạn thuê theo hình thức nào?`,
            chips: rateTypes.map((t) => ({ label: `${t.label} · ${t.hint}`, action: { kind: 'pickType', id: t.id } })),
          },
        }
      case 'pickType': {
        const today = startOfToday()
        const days = [
          { label: 'Hôm nay', d: today },
          { label: 'Ngày mai', d: addDays(today, 1) },
          { label: 'Thứ 6 này', d: nextFriday(today) },
        ]
        return {
          draft: { ...draft, type: action.id },
          reply: {
            from: 'bot',
            text: action.id === 'hourly' ? 'Bạn thuê vào ngày nào?' : 'Bạn nhận phòng ngày nào?',
            chips: days.map(({ label, d }) => ({ label: `${label} (${formatDate(d, 'dd/MM')})`, action: { kind: 'pickDate', date: iso(d) } })),
          },
        }
      }
      case 'pickDate':
        if (draft.type === 'hourly') return result({ ...draft, date: action.date, nights: 0 })
        return {
          draft: { ...draft, date: action.date },
          reply: { from: 'bot', text: 'Bạn ở mấy đêm?', chips: [1, 2, 3, 5].map((n) => ({ label: `${n} đêm`, action: { kind: 'pickNights', n } })) },
        }
      case 'pickNights':
        return result({ ...draft, nights: action.n })
      case 'decor':
        return {
          reply: {
            from: 'bot',
            text: `Gói trang trí ${decoration.name} giá ${formatVND(decoration.price)}, gồm:\n${decoration.groups.map((g) => `• ${g.title}: ${g.items.join(', ')}`).join('\n')}`,
            note: decoration.note,
            links: [{ label: 'Xem ảnh trang trí', to: '/services' }],
            chips: menuChips.slice(0, 2),
          },
        }
      case 'contact':
        return { reply: { from: 'bot', text: `Địa chỉ: ${contact.address}.\nHotline 24/7: ${contact.phone}.`, contact: true, chips: menuChips.slice(0, 2) } }
      default:
        return { reply: welcome }
    }
  }

  const q = plain(text)
  const room = rooms.find((r) => q.includes(plain(r.short)) || (r.id === 'suite' && q.includes('suite')) || (r.id === 'standard-king' && q.includes('king')) || (r.id === 'standard-queen' && q.includes('queen')))
  if (room) return { reply: roomDetail(room) }
  if (/(dat phong|tinh gia|bao nhieu|booking|con phong|phong trong)/.test(q)) return respond({ action: { kind: 'quote' } }, draft)
  if (/(trang tri|lang man|sinh nhat|ky niem|valentine|hoa|nen)/.test(q)) return respond({ action: { kind: 'decor' } }, draft)
  if (/(dia chi|o dau|duong|ban do|map|lien he|zalo|messenger|dien thoai|hotline|sdt|goi)/.test(q)) return respond({ action: { kind: 'contact' } }, draft)
  if (/(gio|check.?in|check.?out|nhan phong|tra phong|qua dem|theo gio)/.test(q))
    return {
      reply: {
        from: 'bot',
        text: 'Khung giờ thuê tại AN Hotel:\n• Cả ngày: nhận 15:00, trả 11:00 hôm sau\n• Qua đêm: nhận 22:00, trả 11:00 hôm sau\n• Theo giờ: 2 tiếng đầu, thêm giờ tùy chọn\nLễ tân hỗ trợ 24/7.',
        chips: menuChips.slice(0, 2),
      },
    }
  if (/(phong|gia|rate|price|room)/.test(q)) return respond({ action: { kind: 'rooms' } }, draft)
  if (/(tien nghi|wifi|bep|bon tam|may giat|tv|may chieu)/.test(q))
    return { reply: { from: 'bot', text: 'Mọi phòng đều có điều hòa, TV thông minh, loa bluetooth, lò sưởi điện, bếp, WiFi tốc độ cao và két an toàn. Phòng Suite có thêm phòng khách riêng, bồn tắm nằm, màn chiếu phim và máy giặt.', chips: roomChips() } }
  if (/(chao|hello|hi\b|alo)/.test(q)) return { reply: welcome }
  return {
    reply: {
      from: 'bot',
      text: 'Mình chưa có thông tin cho câu này. Bạn chọn một mục bên dưới, hoặc nhắn trực tiếp lễ tân qua Zalo/Messenger để được hỗ trợ ngay nhé.',
      contact: true,
      chips: menuChips,
    },
  }
}

function result({ roomId, type, date, nights }) {
  const room = getRoom(roomId)
  const from = new Date(`${date}T00:00:00`)
  const to = addDays(from, nights || 1)
  const q = quote({ room, type, range: { from, to }, date: from })
  const params = new URLSearchParams({ room: roomId, type, from: date })
  if (type !== 'hourly') params.set('to', iso(to))
  return {
    draft: {},
    reply: {
      from: 'bot',
      text: `${room.name} · ${rateTypes.find((t) => t.id === type).label}\n${type === 'hourly' ? formatDate(from) : `${formatDate(from)} → ${formatDate(to)}`}`,
      rows: [...q.lines.map((l) => ({ label: l.label, value: formatVND(l.amount) })), { label: 'Tạm tính', value: formatVND(q.total), strong: true }],
      note: 'Giá tạm tính theo bảng giá niêm yết; lễ tân xác nhận phòng trống và giá cuối cùng.',
      links: [{ label: 'Tiếp tục đặt phòng', to: `/booking?${params}`, primary: true }],
      chips: [{ label: 'Tính lại', action: { kind: 'quote' } }],
    },
  }
}
