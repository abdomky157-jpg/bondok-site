/**
 * Global event bus for add-to-cart animations.
 * Components call `triggerAddToCartEvent()` after adding to cart,
 * and the `AddToCartFlyer` component listens for the event to show animations.
 */

export interface CartAnimationPayload {
  /** Product image URL (used for the flying thumbnail) */
  productImg: string;
  /** Starting position of the button that was clicked (viewport coordinates) */
  startX: number;
  startY: number;
  /** Product name for the toast */
  productName: string;
  /** Product size for the toast */
  productSize: string;
  /** Product price for the toast */
  productPrice: number;
}

const listeners = new Set<(payload: CartAnimationPayload) => void>();

export function onAddToCartEvent(listener: (payload: CartAnimationPayload) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function triggerAddToCartEvent(payload: CartAnimationPayload) {
  listeners.forEach((fn) => fn(payload));
}
