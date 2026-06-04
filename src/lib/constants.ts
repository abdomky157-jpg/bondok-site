/** Shared constants used across multiple components */

export const LOGO_URL =
  "https://z-cdn-media.chatglm.cn/files/6c66da01-4443-40aa-bb7b-d6bd54a7c505.png?auth_key=1880267790-08e21141053d4e15b394e1d4cf01e594-0-affca78eef460c96a99ed6f34f2f8614";

export const SITE_URL = "https://bondok-perfumes.vercel.app";

export const DEFAULT_WHATSAPP = "+201010733294";

export function getWhatsAppNumber(raw?: string): string {
  return (raw || DEFAULT_WHATSAPP).replace(/[^0-9+]/g, "");
}
