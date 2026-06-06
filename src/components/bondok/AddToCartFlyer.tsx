"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { onAddToCartEvent, type CartAnimationPayload } from "@/lib/cart-events";

/**
 * Renders the "fly to cart" animation + particle burst + toast notification.
 * Mount this component once in the root layout (it listens globally).
 */
export default function AddToCartFlyer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [flyingItem, setFlyingItem] = useState<CartAnimationPayload | null>(null);
  const [toasts, setToasts] = useState<
    { id: number; name: string; size: string; price: number }[]
  >([]);
  const toastIdRef = useRef(0);

  const handleEvent = useCallback((payload: CartAnimationPayload) => {
    setFlyingItem(payload);

    // Auto-cleanup the flying item after animation
    setTimeout(() => setFlyingItem(null), 800);

    // Add toast
    const id = ++toastIdRef.current;
    setToasts((prev) => [
      { id, name: payload.productName, size: payload.productSize, price: payload.productPrice },
      ...prev.slice(0, 2), // Keep max 3
    ]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);

    // Bounce the cart badge
    const badge = document.getElementById("cart-badge");
    if (badge) {
      badge.classList.remove("cart-badge-bounce");
      // Force reflow
      void badge.offsetWidth;
      badge.classList.add("cart-badge-bounce");
    }
  }, []);

  useEffect(() => {
    const unsub = onAddToCartEvent(handleEvent);
    return unsub;
  }, [handleEvent]);

  if (!flyingItem && toasts.length === 0) return null;

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-[9999]" aria-hidden="true">
      {/* Flying product image */}
      {flyingItem && <FlyingImage payload={flyingItem} />}

      {/* Particle burst at destination */}
      {flyingItem && <ParticleBurst />}

      {/* Success toast */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-[9999]">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="cart-toast px-5 py-3 rounded-2xl flex items-center gap-3 whitespace-nowrap"
            style={{
              background: "rgba(26, 15, 10, 0.95)",
              border: "1px solid rgba(212, 164, 76, 0.4)",
              backdropFilter: "blur(20px)",
              boxShadow:
                "0 8px 32px rgba(0,0,0,0.4), 0 0 20px rgba(212,164,76,0.15), inset 0 1px 0 rgba(212,164,76,0.1)",
            }}
          >
            {/* Checkmark circle */}
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-lg">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <div className="flex flex-col">
              <span className="text-gold-200 text-xs font-semibold">{toast.name}</span>
              <span className="text-gold-400/60 text-[10px]">
                {toast.size} &middot; {toast.price.toLocaleString()} ج.م
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Flies a small product image thumbnail from the button to the cart icon */
function FlyingImage({ payload }: { payload: CartAnimationPayload }) {
  const cartEl = document.getElementById("cart-icon-btn");
  const targetX = cartEl
    ? cartEl.getBoundingClientRect().left + cartEl.offsetWidth / 2
    : window.innerWidth - 40;
  const targetY = cartEl ? cartEl.getBoundingClientRect().top + cartEl.offsetHeight / 2 : 20;

  // Clamp start position so the image doesn't go off-screen
  const startX = Math.max(20, Math.min(window.innerWidth - 20, payload.startX));
  const startY = Math.max(20, Math.min(window.innerHeight - 20, payload.startY));

  // Random slight curve for organic feel
  const curveOffset = (Math.random() - 0.5) * 60;

  return (
    <img
      src={payload.productImg}
      alt=""
      className="fly-to-cart"
      style={{
        "--fly-start-x": `${startX}px`,
        "--fly-start-y": `${startY}px`,
        "--fly-end-x": `${targetX}px`,
        "--fly-end-y": `${targetY}px`,
        "--fly-curve": `${curveOffset}px`,
      } as React.CSSProperties}
    />
  );
}

/** Burst of gold sparkle particles at the cart icon */
function ParticleBurst() {
  const cartEl = document.getElementById("cart-icon-btn");
  if (!cartEl) return null;

  const rect = cartEl.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  // Generate random particles
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    angle: (Math.PI * 2 * i) / 12 + Math.random() * 0.3,
    distance: 20 + Math.random() * 40,
    size: 2 + Math.random() * 4,
    delay: Math.random() * 0.1,
    duration: 0.4 + Math.random() * 0.3,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden">
      {particles.map((p) => {
        const endX = cx + Math.cos(p.angle) * p.distance;
        const endY = cy + Math.sin(p.angle) * p.distance;
        return (
          <span
            key={p.id}
            className="cart-particle"
            style={{
              "--p-x": `${endX}px`,
              "--p-y": `${endY}px`,
              "--p-cx": `${cx}px`,
              "--p-cy": `${cy}px`,
              "--p-size": `${p.size}px`,
              "--p-delay": `${p.delay}s`,
              "--p-dur": `${p.duration}s`,
            } as React.CSSProperties}
          />
        );
      })}
    </div>
  );
}
