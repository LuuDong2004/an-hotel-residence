// Biểu tượng thương hiệu (lucide không cung cấp icon thương hiệu)
const base = (size) => ({ width: size, height: size, viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': true })

export function MessengerIcon({ size = 20, ...props }) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.15.26.35.27.57l.05 1.78a.8.8 0 0 0 1.12.71l1.99-.88a.8.8 0 0 1 .53-.04c.91.25 1.89.39 2.9.39 5.64 0 10-4.13 10-9.7S17.64 2 12 2Zm6 7.46-2.94 4.66a1.5 1.5 0 0 1-2.17.4l-2.33-1.75a.6.6 0 0 0-.72 0l-3.16 2.4c-.42.32-.97-.19-.69-.63l2.94-4.66a1.5 1.5 0 0 1 2.17-.4l2.33 1.75a.6.6 0 0 0 .72 0l3.16-2.4c.42-.32.97.19.69.63Z" />
    </svg>
  )
}

export function FacebookIcon({ size = 20, ...props }) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
    </svg>
  )
}

export function ZaloIcon({ size = 20, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden {...props}>
      <rect x="1.5" y="3" width="21" height="18" rx="5" fill="currentColor" />
      <text
        x="12"
        y="15.2"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="7.6"
        fontWeight="700"
        fill="var(--zalo-ink, var(--color-paper))"
        style={{ letterSpacing: 0, textTransform: "none" }}
      >
        Zalo
      </text>
    </svg>
  )
}
