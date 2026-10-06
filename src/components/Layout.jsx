import { AnimatePresence, MotionConfig, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { ArrowUpRight, BedDouble, CalendarDays, ChevronDown, Compass, House, Images, Mail, MapPin, Menu, MessageCircle, Phone, Sparkles, Star, X } from 'lucide-react'
import { useEffect, useLayoutEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { contact, nav, otas } from '../data/site'
import { FacebookIcon, MessengerIcon, ZaloIcon } from './BrandIcons'
import ChatBot from './ChatBot'
import { Reveal } from './ui'

const year = new Date().getFullYear()
const ease = [0.2, 0.7, 0.2, 1]

// Thanh điều hướng chỉ giữ 4 mục chính; các trang còn lại nằm trong menu mở rộng
const primaryNav = ['/rooms', '/services', '/gallery', '/contact'].map((to) => nav.find((n) => n.to === to))

// Icon và mô tả ngắn cho từng trang trong menu mở rộng
const menuMeta = {
  '/': { icon: House, hint: 'Tổng quan AN Hotel & Residence' },
  '/rooms': { icon: BedDouble, hint: '3 hạng phòng và bảng giá chi tiết' },
  '/services': { icon: Sparkles, hint: 'Trang trí phòng lãng mạn' },
  '/gallery': { icon: Images, hint: 'Hình ảnh thực tế của khách sạn' },
  '/reviews': { icon: Star, hint: 'Khách lưu trú nói gì về chúng tôi' },
  '/attractions': { icon: Compass, hint: 'Điểm đến quanh Hồ Tây' },
  '/contact': { icon: MessageCircle, hint: 'Địa chỉ, hotline, bản đồ chỉ đường' },
}

// Menu trên điện thoại: các trang phụ nằm trong "Xem thêm"
const moreNav = ['/reviews', '/attractions', '/contact']
const groupLabel = 'px-3 pt-3 pb-1.5 text-[11px] font-semibold tracking-[0.1em] text-mute uppercase'
const rowBase = 'flex items-center gap-3.5 rounded-2xl px-2.5 py-2 text-[15.5px] font-medium transition-colors hover:bg-paper'
const rowIcon = 'grid size-10 shrink-0 place-items-center rounded-full bg-paper text-gold-deep'

function MenuRow({ item, onClick }) {
  const { icon: Icon } = menuMeta[item.to]
  return (
    <NavLink to={item.to} end={item.to === '/'} onClick={onClick} className={({ isActive }) => `${rowBase} ${isActive ? 'bg-paper text-gold-deep' : ''}`}>
      {({ isActive }) => (
        <>
          <span className={`grid size-10 shrink-0 place-items-center rounded-full text-gold-deep ${isActive ? 'bg-white' : 'bg-paper'}`}>
            <Icon size={19} strokeWidth={1.6} />
          </span>
          {item.label}
        </>
      )}
    </NavLink>
  )
}

function Logo({ onClick }) {
  return (
    <Link to="/" onClick={onClick} className="flex shrink-0 items-center gap-3 whitespace-nowrap" aria-label="AN Hotel & Residence — Trang chủ">
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-ink">
        <img src="/images/logo-mark.png" alt="" className="size-[22px]" />
      </span>
      <span className="text-[17px] font-semibold tracking-[-0.03em] text-ink">
        AN Hotel <span className="font-normal text-mute">& Residence</span>
      </span>
    </Link>
  )
}

function Header() {
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const [more, setMore] = useState(false)
  const { pathname } = useLocation()
  const { scrollY } = useScroll()

  // Ẩn khi cuộn xuống, hiện lại khi cuộn lên
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setHidden(y > prev && y > 320)
  })

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-40 px-3 pt-4 md:px-6"
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: hidden && !open ? -110 : 0, opacity: 1 }}
        transition={{ duration: 0.6, ease }}
      >
        <div className="mx-auto flex w-full max-w-full items-center justify-between gap-4 rounded-full whitespace-nowrap lg:w-fit lg:gap-8 border border-white/60 bg-white/85 py-2 pr-2 pl-3 shadow-soft backdrop-blur-xl">
          <Logo onClick={() => setOpen(false)} />

          <nav aria-label="Điều hướng chính" className="hidden items-center gap-1 lg:flex">
            {primaryNav.map((item) => {
              const active = pathname.startsWith(item.to)
              return (
                <NavLink key={item.to} to={item.to} className={`relative rounded-full px-4 py-2.5 text-[14.5px] font-medium transition-colors duration-300 ${active ? 'text-white' : 'text-ink/75 hover:text-ink'}`}>
                  {active && <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                  <span className="relative">{item.label}</span>
                </NavLink>
              )
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <a href={contact.phoneHref} className="hidden items-center gap-2 rounded-full px-3 py-2.5 text-[14.5px] font-medium text-ink hover:text-gold-deep xl:flex">
              <Phone size={16} strokeWidth={1.6} />
              {contact.phone}
            </a>
            <Link to="/booking" onClick={() => setOpen(false)} className="btn btn-gold hidden min-h-11! px-5! sm:inline-flex">
              Đặt phòng <ArrowUpRight size={16} strokeWidth={1.6} />
            </Link>
            <button
              type="button"
              className="grid size-11 place-items-center rounded-full bg-ivory text-ink transition-colors hover:bg-ink hover:text-white"
              aria-label={open ? 'Đóng menu' : 'Mở menu'}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={open ? 'x' : 'm'} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  {open ? <X size={19} strokeWidth={1.6} /> : <Menu size={19} strokeWidth={1.6} />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-30 bg-night/65 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="fixed top-[84px] right-3 z-40 max-h-[calc(100dvh-100px)] w-[min(310px,calc(100vw-24px))] origin-top-right overflow-y-auto rounded-[26px] border border-line bg-white p-2 shadow-pop lg:inset-x-6 lg:top-[88px] lg:mx-auto lg:w-auto lg:max-w-[980px] lg:origin-top lg:rounded-[32px] lg:border-white/60 lg:bg-paper lg:p-3"
              initial={{ opacity: 0, y: -18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.4, ease }}
            >
              {/* Điện thoại: danh sách gọn chia nhóm */}
              <div className="lg:hidden">
                <div className="px-3 pt-2 pb-3">
                  <p className="text-[15.5px] font-semibold tracking-[-0.02em]">AN Hotel & Residence</p>
                  <p className="text-[12.5px] text-mute">West Lake · Hà Nội · Lễ tân 24/7</p>
                </div>

                <p className={groupLabel}>Khám phá</p>
                <nav aria-label="Trang chính">
                  {nav.filter((n) => !moreNav.includes(n.to)).map((item) => (
                    <MenuRow key={item.to} item={item} onClick={() => setOpen(false)} />
                  ))}
                </nav>

                <p className={groupLabel}>Đặt phòng</p>
                <Link to="/booking" onClick={() => setOpen(false)} className={`${rowBase} text-gold-deep`}>
                  <span className={rowIcon}>
                    <CalendarDays size={19} strokeWidth={1.6} />
                  </span>
                  Đặt phòng ngay
                </Link>
                <a href={contact.phoneHref} className={rowBase}>
                  <span className={rowIcon}>
                    <Phone size={18} strokeWidth={1.6} />
                  </span>
                  {contact.phone}
                </a>

                <div className="mt-2 border-t border-line pt-2">
                  <button type="button" aria-expanded={more} onClick={() => setMore((v) => !v)} className={`${rowBase} w-full text-mute`}>
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-paper text-ink/70">
                      <ChevronDown size={18} strokeWidth={1.8} className={`transition-transform duration-300 ${more ? 'rotate-180' : ''}`} />
                    </span>
                    {more ? 'Thu gọn' : 'Xem thêm'}
                  </button>
                  <AnimatePresence initial={false}>
                    {more && (
                      <motion.nav aria-label="Trang khác" className="overflow-hidden" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease }}>
                        {nav.filter((n) => moreNav.includes(n.to)).map((item) => (
                          <MenuRow key={item.to} item={item} onClick={() => setOpen(false)} />
                        ))}
                      </motion.nav>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Desktop: lưới ô + thẻ ảnh */}
              <div className="hidden gap-3 lg:grid lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
                <nav aria-label="Tất cả trang" className="grid gap-2 sm:grid-cols-2">
                  {nav.map((item, i) => {
                    const { icon: Icon, hint } = menuMeta[item.to]
                    return (
                      <motion.div key={item.to} className="sm:last:col-span-2" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.06 + i * 0.04, ease }}>
                        <NavLink
                          to={item.to}
                          end={item.to === '/'}
                          onClick={() => setOpen(false)}
                          className={({ isActive }) =>
                            `group flex h-full items-center gap-3.5 rounded-3xl border bg-white p-2.5 transition-colors sm:gap-4 sm:p-3.5 duration-300 hover:border-ink hover:bg-ink hover:text-white ${isActive ? 'border-ink' : 'border-transparent'}`
                          }
                        >
                          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-paper text-gold-deep transition-colors duration-300 group-hover:bg-white/15 group-hover:text-gold-soft">
                            <Icon size={21} strokeWidth={1.5} />
                          </span>
                          <span className="min-w-0 flex-1 leading-tight">
                            <span className="block text-[16.5px] font-medium tracking-[-0.02em]">{item.label}</span>
                            <span className="mt-1 block truncate text-[13px] text-mute transition-colors duration-300 group-hover:text-white/60">{hint}</span>
                          </span>
                          <ArrowUpRight size={18} strokeWidth={1.5} className="mr-1 shrink-0 text-mute transition-all duration-300 group-hover:rotate-45 group-hover:text-white" />
                        </NavLink>
                      </motion.div>
                    )
                  })}
                </nav>

                <motion.div
                  className="relative isolate flex min-h-[230px] flex-col justify-end overflow-hidden rounded-3xl p-5 text-snow lg:min-h-[300px] lg:p-6"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2, ease }}
                >
                  <img src="/images/rooms/suite/dsc00397-hdr-1.jpg" alt="" className="absolute inset-0 -z-20 size-full object-cover" />
                  <div className="absolute inset-0 -z-10 bg-linear-to-t from-black/80 via-black/30 to-black/10" />
                  <p className="text-[13px] text-snow/75">Phòng từ 800.000 ₫ / đêm</p>
                  <p className="mt-1 text-[clamp(17px,1.9vw,22px)] leading-tight font-medium tracking-[-0.03em] whitespace-nowrap">Đặt phòng trực tiếp với lễ tân</p>
                  <p className="mt-3 flex items-start gap-2 text-[13.5px] text-snow/80">
                    <MapPin size={15} strokeWidth={1.6} className="mt-0.5 shrink-0" />
                    {contact.address}
                  </p>
                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <Link to="/booking" onClick={() => setOpen(false)} className="btn btn-white px-4!">
                      Đặt phòng <ArrowUpRight size={16} strokeWidth={1.6} />
                    </Link>
                    <a href={contact.phoneHref} className="btn btn-outline-light px-4!">
                      <Phone size={16} strokeWidth={1.6} /> {contact.phone}
                    </a>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

function Footer() {
  const heading = 'font-sans! text-[12.5px] font-medium tracking-normal! text-mute'
  const social = 'grid size-11 place-items-center rounded-full border border-line text-ink transition-all duration-300 hover:-translate-y-1 hover:border-ink hover:bg-ink hover:text-white hover:[--zalo-ink:var(--color-ink)]'
  const link = 'transition-colors hover:text-gold-deep'
  return (
    <footer>
      <div className="bg-white">
        <div className="container-x grid gap-12 pt-14 pb-10 md:pt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:gap-20">
          <Reveal>
            <Logo />
            <p className="mt-8 font-serif text-[34px] leading-[1.15] text-ink italic md:text-[42px]">
              AN — Peace,
              <br />
              <span className="text-gold-deep">Inside Out</span>
            </p>
            <p className="mt-5 max-w-sm text-[15px] text-mute">Khách sạn boutique phong cách cổ điển châu Âu, yên tĩnh bên Hồ Tây, Hà Nội.</p>
            <div className="mt-7 flex flex-wrap items-center gap-2.5">
              <Link to="/booking" className="btn btn-gold min-h-11! px-5!">
                Đặt phòng <ArrowUpRight size={16} strokeWidth={1.6} />
              </Link>
              <a href={contact.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className={social}>
                <FacebookIcon size={18} />
              </a>
              <a href={contact.messenger} target="_blank" rel="noreferrer" aria-label="Messenger" className={social}>
                <MessengerIcon size={18} />
              </a>
              <a href={contact.zalo} target="_blank" rel="noreferrer" aria-label="Zalo" className={social}>
                <ZaloIcon size={22} />
              </a>
            </div>
          </Reveal>

          <div className="grid gap-10 sm:grid-cols-3 sm:gap-8">
            <Reveal delay={80}>
              <h2 className={heading}>Khám phá</h2>
              <ul className="mt-4 space-y-2.5 text-[15px] font-medium">
                {nav.map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} className={link}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={160}>
              <h2 className={heading}>Liên hệ</h2>
              <ul className="mt-4 space-y-3.5 text-[15px]">
                <li className="flex gap-3">
                  <MapPin size={17} strokeWidth={1.6} className="mt-1 shrink-0 text-gold-deep" />
                  <a href={contact.directions} target="_blank" rel="noreferrer" className={link}>
                    {contact.address}
                  </a>
                </li>
                <li className="flex gap-3">
                  <Phone size={17} strokeWidth={1.6} className="mt-1 shrink-0 text-gold-deep" />
                  <a href={contact.phoneHref} className={`font-medium ${link}`}>
                    {contact.phone}
                  </a>
                </li>
                <li className="flex gap-3">
                  <Mail size={17} strokeWidth={1.6} className="mt-1 shrink-0 text-gold-deep" />
                  <a href={`mailto:${contact.email}`} className={`break-all ${link}`}>
                    {contact.email}
                  </a>
                </li>
              </ul>
            </Reveal>

            <Reveal delay={240}>
              <h2 className={heading}>Đặt phòng trên</h2>
              <ul className="mt-2 divide-y divide-line">
                {otas.map((o) => (
                  <li key={o.name}>
                    <a href={o.href} target="_blank" rel="noreferrer" className="group flex items-center justify-between py-3 text-[15px] font-medium transition-colors hover:text-gold-deep">
                      {o.name}
                      <ArrowUpRight size={17} strokeWidth={1.6} className="text-mute transition-all duration-300 group-hover:rotate-45 group-hover:text-gold-deep" />
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>

        <div className="container-x flex flex-col gap-2 pb-10 text-[13px] text-mute md:flex-row md:items-center md:justify-between">
          <p>© {year} AN Hotel & Residence. Bảo lưu mọi quyền.</p>
          <p className="flex gap-6">
            <a href="https://www.anhotelresidence.com/privacy" className={link}>Chính sách bảo mật</a>
            <a href="https://www.anhotelresidence.com/terms" className={link}>Điều khoản sử dụng</a>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default function Layout() {
  const { pathname } = useLocation()
  // Sang trang khác thì nhảy thẳng về đầu trang (không cuộn mượt, để không bị dừng giữa chừng)
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])

  // Bấm vào liên kết của chính trang đang xem (logo, menu, footer) thì cuộn về đầu trang
  useEffect(() => {
    const onClick = (e) => {
      const link = e.target.closest?.('a[href]')
      if (!link || link.target === '_blank' || link.origin !== window.location.origin) return
      if (link.pathname === window.location.pathname && link.search === window.location.search && !link.hash) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-gold focus:px-4 focus:py-2 focus:text-night">
        Bỏ qua điều hướng
      </a>
      <Header />
      <motion.main id="main" key={pathname} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
        <Outlet />
      </motion.main>
      <Footer />
      <ChatBot />
    </MotionConfig>
  )
}
