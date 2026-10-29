/** Shared constants used across multiple components */

export const LOGO_URL = "/logo.png";

export const SITE_URL = "https://bondok-perfumes.vercel.app";

export const DEFAULT_WHATSAPP = "+201067278639";
export const DEFAULT_WHATSAPP_2 = "+201010733294";

export const DEFAULT_PHONE = "+201067278639";
export const DEFAULT_PHONE_2 = "+201217784049";

export function getWhatsAppNumber(raw?: string): string {
  return (raw || DEFAULT_WHATSAPP).replace(/[^0-9+]/g, "");
}

export function getWhatsAppNumber2(raw?: string): string {
  return (raw || DEFAULT_WHATSAPP_2).replace(/[^0-9+]/g, "");
}
