/**
 * Single source of truth for discount codes.
 * Used by both client (Zustand store) and server (orders API).
 */
export const DISCOUNT_CODES: Record<string, number> = {
  BONDOK10: 10,
  SURPRISE20: 20,
};
