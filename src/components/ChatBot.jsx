import { AnimatePresence, motion } from 'motion/react'
import { ArrowUp, ArrowUpRight, Phone, BotMessageSquare, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { contact, rooms } from '../data/site'
import { OPEN_EVENT } from '../lib/chat'
import { respond, welcome } from '../lib/chatBrain'
import { formatVND, fromPrice } from '../lib/pricing'
import { MessengerIcon, ZaloIcon } from './BrandIcons'

const ease = [0.2, 0.7, 0.2, 1]
function Message({ m, onChip, onNavigate, last }) {
  if (m.from === 'user') {
    return (
      <motion.div className="flex justify-end" initial={{ opacity: 0, y: 10, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.3, ease }}>
        <p className="max-w-[82%] rounded-[20px] rounded-br-md bg-ink px-4 py-2.5 text-[14.5px] text-white">{m.text}</p>
      </motion.div>
    )
  }
  return (
    <motion.div className="space-y-2.5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease }}>
      <div className="max-w-[90%] rounded-[20px] rounded-bl-md bg-white px-4 py-3 text-[14.5px] leading-relaxed">
        <p className="whitespace-pre-line">{m.text}</p>

        {m.rooms && (
          <ul className="mt-3 space-y-2">
            {rooms.map((r) => (
              <li key={r.id}>
                <button type="button" onClick={() => onChip({ label: r.short, action: { kind: 'pickRoom', id: r.id } })} className="group flex w-full items-center gap-3 rounded-2xl bg-paper p-2 text-left transition-colors hover:bg-ivory">
                  <img src={r.cover} alt="" className="size-14 shrink-0 rounded-xl object-cover" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14.5px] font-medium">{r.short}</span>
                    <span className="block text-[12.5px] text-mute">
                      {r.area} m² · từ {formatVND(fromPrice(r))}
                    </span>
                  </span>
                  <ArrowUpRight size={16} strokeWidth={1.6} className="mr-1 shrink-0 text-mute transition-transform group-hover:rotate-45" />
                </button>
              </li>
            ))}
          </ul>
        )}

        {m.rows && (
          <dl className="mt-3 divide-y divide-line rounded-2xl bg-paper px-3.5">
            {m.rows.map((r) => (
              <div key={r.label} className="flex items-baseline justify-between gap-4 py-2.5">
                <dt className={`text-[13px] ${r.strong ? 'font-medium' : 'text-mute'}`}>{r.label}</dt>
                <dd className={`shrink-0 tabular-nums ${r.strong ? 'text-[18px] font-semibold tracking-[-0.02em]' : 'text-[13.5px] font-medium'}`}>{r.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {m.note && <p className="mt-2.5 text-[12.5px] text-mute">{m.note}</p>}

        {m.contact && (
          <div className="mt-3 grid grid-cols-3 gap-2 text-[13px] font-medium">
            <a href={contact.zalo} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1.5 rounded-2xl bg-paper py-3 transition-colors hover:bg-ivory">
              <ZaloIcon size={22} /> Zalo
            </a>
            <a href={contact.messenger} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1.5 rounded-2xl bg-paper py-3 transition-colors hover:bg-ivory">
              <MessengerIcon size={20} /> Messenger
            </a>
            <a href={contact.phoneHref} className="flex flex-col items-center gap-1.5 rounded-2xl bg-paper py-3 transition-colors hover:bg-ivory">
              <Phone size={19} strokeWidth={1.6} /> Gọi
            </a>
          </div>
        )}

        {m.links?.map((l) => (
          <Link key={l.to} to={l.to} onClick={onNavigate} className={`btn mt-3 min-h-11! w-full text-[14px]! ${l.primary ? 'btn-gold' : 'btn-outline'}`}>
            {l.label} <ArrowUpRight size={15} strokeWidth={1.6} />
          </Link>
        ))}
      </div>

      {last && m.chips && (
        <div className="flex flex-wrap gap-2">
          {m.chips.map((c) => (
            <button key={c.label} type="button" onClick={() => onChip(c)} className="rounded-full border border-ink/25 bg-white/60 px-3.5 py-2 text-[13.5px] font-medium transition-colors hover:border-ink hover:bg-ink hover:text-white">
              {c.label}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([welcome])
  const [draft, setDraft] = useState({})
  const [typing, setTyping] = useState(false)
  const [input, setInput] = useState('')
  const listRef = useRef(null)
  const inputRef = useRef(null)
  const timer = useRef(null)

  useEffect(() => {
    const onOpen = () => setOpen(true)
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener(OPEN_EVENT, onOpen)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener(OPEN_EVENT, onOpen)
      window.removeEventListener('keydown', onKey)
      clearTimeout(timer.current)
    }
  }, [])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, typing, open])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  const send = (payload, label) => {
    if (typing) return
    const { reply, draft: nextDraft } = respond(payload, draft)
    setMessages((m) => [...m, { from: 'user', text: label }])
    if (nextDraft) setDraft(nextDraft)
    setTyping(true)
    timer.current = setTimeout(() => {
      setMessages((m) => [...m, reply])
      setTyping(false)
    }, 650)
  }

  const submit = (e) => {
    e.preventDefault()
    const text = input.trim()
    if (!text) return
    setInput('')
    send({ text }, text)
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.section
            role="dialog"
            aria-label="Trợ lý AN Hotel"
            className="fixed right-3 bottom-3 z-50 flex h-[min(520px,calc(100dvh-108px))] w-[min(350px,calc(100vw-24px))] origin-bottom-right flex-col overflow-hidden rounded-[26px] border border-white/60 bg-paper shadow-pop sm:right-6 sm:bottom-6 sm:h-[min(680px,calc(100dvh-48px))] sm:w-[410px] sm:rounded-[28px]"
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.35, ease }}
          >
            <header className="flex items-center gap-3 bg-ink px-3.5 py-2.5 text-white sm:px-4 sm:py-3.5">
              <span className="relative grid size-11 shrink-0 place-items-center rounded-full bg-gold text-night">
                <BotMessageSquare size={22} strokeWidth={1.6} />
                <span className="absolute right-0 bottom-0 size-3 rounded-full border-2 border-ink bg-emerald-500" />
              </span>
              <div className="min-w-0 flex-1 leading-tight">
                <p className="text-[15.5px] font-medium">Trợ lý AN</p>
                <p className="truncate text-[12.5px] text-white/65">Tư vấn phòng & tính giá · 24/7</p>
              </div>
              <a href={contact.phoneHref} aria-label={`Gọi ${contact.phone}`} className="grid size-10 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20">
                <Phone size={17} strokeWidth={1.6} />
              </a>
              <button type="button" aria-label="Đóng trợ lý" onClick={() => setOpen(false)} className="grid size-10 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20">
                <X size={18} strokeWidth={1.6} />
              </button>
            </header>

            <div ref={listRef} aria-live="polite" className="flex-1 space-y-3 overflow-y-auto [scrollbar-width:none] px-3 py-4 sm:space-y-3.5 sm:px-4 sm:py-5 [&::-webkit-scrollbar]:hidden">
              {messages.map((m, i) => (
                <Message key={i} m={m} last={i === messages.length - 1 && !typing} onNavigate={() => setOpen(false)} onChip={(c) => send({ action: c.action }, c.label)} />
              ))}
              {typing && (
                <div className="flex w-16 items-center justify-center gap-1.5 rounded-[20px] rounded-bl-md bg-white py-4" aria-label="Trợ lý đang trả lời">
                  {[0, 1, 2].map((i) => (
                    <motion.span key={i} className="size-1.5 rounded-full bg-mute" animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }} transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }} />
                  ))}
                </div>
              )}
            </div>

            <form onSubmit={submit} className="flex items-center gap-2 border-t border-line bg-white p-2.5 sm:p-3">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Hỏi về phòng, giá, dịch vụ…"
                aria-label="Nhập câu hỏi"
                className="h-12 min-w-0 flex-1 rounded-full bg-paper px-5 text-[15px] outline-none placeholder:text-[#8b98a1] focus:ring-2 focus:ring-gold"
              />
              <button type="submit" aria-label="Gửi" disabled={!input.trim() || typing} className="grid size-12 shrink-0 place-items-center rounded-full bg-ink text-white transition-all hover:bg-gold-deep disabled:opacity-35">
                <ArrowUp size={19} strokeWidth={2} />
              </button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!open && (
          <motion.button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Mở trợ lý AN Hotel"
            className="group fixed right-4 bottom-4 z-30 flex h-14 items-center gap-0 rounded-full bg-ink pr-1.5 pl-1.5 text-white shadow-pop md:right-6 md:bottom-6"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.35, ease }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span aria-hidden className="absolute inset-0 animate-ping-slow rounded-full bg-ink/35" />
            <span className="relative grid size-11 place-items-center rounded-full bg-gold text-night">
              <BotMessageSquare size={22} strokeWidth={1.6} />
            </span>
            <span className="relative max-w-0 overflow-hidden text-[14.5px] font-medium whitespace-nowrap transition-all duration-500 group-hover:max-w-40 group-hover:px-3">Hỏi trợ lý AN</span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}
