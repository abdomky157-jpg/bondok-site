import { create } from "zustand";
import { persist } from "zustand/middleware";
import { products, type Product } from "@/data/products";
import { DISCOUNT_CODES } from "@/data/quiz";

export interface CartItem {
  id: number;
  name: string;
  size: string;
  price: number;
  img: string;
  qty: number;
}

interface StoreState {
  // Cart
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "qty">) => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, qty: number) => void;
  clearCart: () => void;

  // Discount
  discountPct: number;
  discountCode: string | null;
  applyDiscount: (code: string) => boolean;

  // Wishlist
  wishlist: number[];
  toggleWishlist: (id: number) => void;

  // Product filters
  categoryFilter: string;
  setCategoryFilter: (f: string) => void;
  priceFilter: string;
  setPriceFilter: (f: string) => void;
  seasonFilter: string;
  setSeasonFilter: (s: string) => void;

  // Modals
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  quizOpen: boolean;
  setQuizOpen: (v: boolean) => void;
  spinOpen: boolean;
  setSpinOpen: (v: boolean) => void;
  surpriseOpen: boolean;
  setSurpriseOpen: (v: boolean) => void;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  toggleCart: () => void;
  checkoutOpen: boolean;
  setCheckoutOpen: (v: boolean) => void;

  // Wishlist drawer
  wishlistOpen: boolean;
  setWishlistOpen: (v: boolean) => void;
  toggleWishlistOpen: () => void;

  // Computed
  getFilteredProducts: () => Product[];
  getTopProducts: () => Product[];
  getCartTotal: () => number;
  getCartSubtotal: () => number;
  getCartDiscount: () => number;
  getCartCount: () => number;
}

export const useBondokStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Cart
      cart: [],
      addToCart: (item) =>
        set((s) => {
          // Check if same product + size already in cart
          const existingIndex = s.cart.findIndex(
            (c) => c.id === item.id && c.size === item.size && c.name === item.name
          );
          if (existingIndex >= 0) {
            // Increment quantity
            const newCart = [...s.cart];
            newCart[existingIndex] = {
              ...newCart[existingIndex],
              qty: newCart[existingIndex].qty + 1,
            };
            return { cart: newCart };
          }
          // Add new item with qty 1
          return { cart: [...s.cart, { ...item, qty: 1 }] };
        }),
      removeFromCart: (index) =>
        set((s) => ({ cart: s.cart.filter((_, i) => i !== index) })),
      updateQuantity: (index, qty) =>
        set((s) => {
          if (qty <= 0) {
            return { cart: s.cart.filter((_, i) => i !== index) };
          }
          const newCart = [...s.cart];
          newCart[index] = { ...newCart[index], qty };
          return { cart: newCart };
        }),
      clearCart: () => set({ cart: [], discountPct: 0, discountCode: null }),

      // Discount
      discountPct: 0,
      discountCode: null as string | null,
      applyDiscount: (code) => {
        const upper = code.trim().toUpperCase();
        const pct = DISCOUNT_CODES[upper];
        if (pct && pct > get().discountPct) {
          set({ discountPct: pct, discountCode: upper });
          return true;
        }
        return false;
      },

      // Wishlist (stored as array for JSON serialization)
      wishlist: [],
      toggleWishlist: (id) =>
        set((s) => {
          const nw = [...s.wishlist];
          const idx = nw.indexOf(id);
          if (idx >= 0) nw.splice(idx, 1);
          else nw.push(id);
          return { wishlist: nw };
        }),

      // Filters
      categoryFilter: "all",
      setCategoryFilter: (f) => set({ categoryFilter: f }),
      priceFilter: "all",
      setPriceFilter: (f) => set({ priceFilter: f }),
      seasonFilter: "summer",
      setSeasonFilter: (s) => set({ seasonFilter: s }),

      // Modals
      selectedProduct: null,
      setSelectedProduct: (p) => set({ selectedProduct: p }),
      quizOpen: false,
      setQuizOpen: (v) => set({ quizOpen: v }),
      spinOpen: false,
      setSpinOpen: (v) => set({ spinOpen: v }),
      surpriseOpen: false,
      setSurpriseOpen: (v) => set({ surpriseOpen: v }),
      cartOpen: false,
      setCartOpen: (v) => set({ cartOpen: v }),
      toggleCart: () => set((s) => ({ cartOpen: !s.cartOpen })),
      checkoutOpen: false,
      setCheckoutOpen: (v) => set({ checkoutOpen: v }),

      // Wishlist drawer
      wishlistOpen: false,
      setWishlistOpen: (v) => set({ wishlistOpen: v }),
      toggleWishlistOpen: () => set((s) => ({ wishlistOpen: !s.wishlistOpen })),

      // Computed
      getFilteredProducts: () => {
        const { categoryFilter, priceFilter } = get();
        let filtered = [...products];
        if (categoryFilter !== "all") {
          filtered = filtered.filter(
            (p) => p.g === categoryFilter || p.t === categoryFilter
          );
        }
        if (priceFilter === "u3") filtered = filtered.filter((p) => p.sz[0].p < 3000);
        else if (priceFilter === "3-5")
          filtered = filtered.filter(
            (p) => p.sz[0].p >= 3000 && p.sz[0].p <= 5000
          );
        else if (priceFilter === "o5")
          filtered = filtered.filter((p) => p.sz[0].p > 5000);
        return filtered;
      },

      getTopProducts: () => products.filter((p) => p.top).slice(0, 10),

      getCartSubtotal: () => get().cart.reduce((a, c) => a + c.price * c.qty, 0),

      getCartDiscount: () => {
        const sub = get().getCartSubtotal();
        return Math.round((sub * get().discountPct) / 100);
      },

      getCartTotal: () => get().getCartSubtotal() - get().getCartDiscount(),

      getCartCount: () => get().cart.reduce((a, c) => a + c.qty, 0),
    }),
    {
      name: "bondok-store",
      // Only persist cart, discount, and wishlist
      partialize: (state) => ({
        cart: state.cart,
        discountPct: state.discountPct,
        discountCode: state.discountCode,
        wishlist: state.wishlist,
      }),
    }
  )
);
