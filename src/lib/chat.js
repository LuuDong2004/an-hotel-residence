export const OPEN_EVENT = 'an-chat-open'

/** Mở khung chat từ bất kỳ đâu trên trang */
export const openChat = () => window.dispatchEvent(new Event(OPEN_EVENT))
