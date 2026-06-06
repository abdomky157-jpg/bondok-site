/** Shared constants used across multiple components */

export const LOGO_URL = "/logo.png";

export const SITE_URL = "https://bondok-perfumes.vercel.app";

export const DEFAULT_WHATSAPP = "+201067278639";

export function getWhatsAppNumber(raw?: string): string {
  return (raw || DEFAULT_WHATSAPP).replace(/[^0-9+]/g, "");
}
