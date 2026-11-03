export const PHONE = '+971 4 379 7128'
export const PHONE_LINK = 'tel:+97143797128'
export const WHATSAPP = 'https://wa.me/971502236842'

// Arabic company name (single source; render with .brand-ar).
export const COMPANY_NAME_AR = 'أرتيك للكمبيوتر ش.ذ.م.م'

// WhatsApp link with a pre-filled message. Built from WHATSAPP so the number stays in one place.
export const whatsappLink = (text) => `${WHATSAPP}?text=${encodeURIComponent(String(text ?? ''))}`