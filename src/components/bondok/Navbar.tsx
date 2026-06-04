"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  Heart,
  Shuffle,
  Loader2,
  Lock,
  PackageSearch,
} from "lucide-react";
import { TYPE_AR, GENDER_AR } from "@/data/products";
import { useSiteData } from "@/context/SiteContext";
import { useBondokStore } from "@/store/bondok";
import AdminPanel from "./AdminPanel";
import { useScrollLock } from "@/hooks/useScrollLock";
import { LOGO_URL } from "@/lib/constants";

export default function Navbar() {
  const { products, settings } = useSiteData();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  // Secret admin panel state
  const [adminOpen, setAdminOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authPw, setAuthPw] = useState("");
  const [authErr, setAuthErr] = useState("");

  // Scroll lock for modals
  useScrollLock(authOpen || adminOpen);

  // Secret: Keyboard shortcut Alt+Shift+K to open admin login
  // Also accessible via #admin URL hash
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Support both English 'K' and Arabic 'ك' key
      if (e.altKey && e.shiftKey && (e.key === "K" || e.key === "k" || e.key === "ك")) {
        e.preventDefault();
        setAuthOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Secret: Check for #admin hash in URL (reacts to hash changes too)
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === "#admin") {
        setAuthOpen(true);
        window.history.replaceState(null, "", window.location.pathname);
      }
    };
    checkHash(); // Check on mount
    window.addEventListener("hashchange", checkHash);
    return () => window.removeEventListener("hashchange", checkHash);
  }, []);

  const [authLoading, setAuthLoading] = useState(false);

  const handleAuth = async () => {
    if (!authPw.trim()) {
      setAuthErr("ادخل كلمة السر");
      return;
    }
    setAuthLoading(true);
    setAuthErr("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: authPw }),
      });
      const data = await res.json();
      if (res.status === 429) {
        const mins = Math.ceil((data.lockedUntil - Date.now()) / 60000);
        setAuthErr(`تم تجاوز عدد المحاولات. حاول بعد ${mins} دقيقة`);
      } else if (data.success) {
        // Token is now set as httpOnly cookie by server - no localStorage needed
        setAuthOpen(false);
        setAdminOpen(true);
        setAuthPw("");
        setAuthErr("");
      } else {
        const remaining = data.remainingAttempts;
        setAuthErr(`كلمة السر غلط! ${remaining !== undefined ? `(${remaining} محاولات متبقية)` : ""}`);
      }
    } catch {
      setAuthErr("حدث خطأ، حاول مرة أخرى");
    } finally {
      setAuthLoading(false);
    }
  };

  const cartCount = useBondokStore((s) => s.getCartCount());
  const toggleCart = useBondokStore((s) => s.toggleCart);
  const toggleWishlistOpen = useBondokStore((s) => s.toggleWishlistOpen);
  const wishlist = useBondokStore((s) => s.wishlist);
  const setQuizOpen = useBondokStore((s) => s.setQuizOpen);
  const setSpinOpen = useBondokStore((s) => s.setSpinOpen);
  const setSurpriseOpen = useBondokStore((s) => s.setSurpriseOpen);
  const setSelectedProduct = useBondokStore((s) => s.setSelectedProduct);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const searchResults = searchVal.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchVal.toLowerCase()) ||
            p.ar.includes(searchVal) ||
            p.br.toLowerCase().includes(searchVal.toLowerCase()) ||
            TYPE_AR[p.t]?.includes(searchVal) ||
            GENDER_AR[p.g]?.includes(searchVal)
        )
        .slice(0, 6)
    : [];

  return (
    <>
    <nav
      className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${
        scrolled ? "nsc" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <img
              src={settings.logoUrl || LOGO_URL}
              className="h-12 w-12 object-contain rounded-full"
              style={{ filter: "drop-shadow(0 0 8px rgba(212,164,76,.4))" }}
              alt="Bondok"
            />
            <div>
              <h1 className="font-playfair text-xl font-bold gold-shimmer">
                Bondok
              </h1>
              <p className="font-playfair text-xs tracking-[0.2em] text-gold-400 -mt-1">
                PERFUMES
              </p>
            </div>
          </Link>

          {/* Search */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8 relative">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="ابحث عن عطر..."
                className="w-full px-5 py-2.5 pr-11 rounded-full bg-wood-950/60 border border-gold-500/20 text-gold-100 placeholder:text-gold-100/30 focus:border-gold-500/50 focus:outline-none transition text-sm"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gold-500/50" size={20} />
              {searchOpen && searchResults.length > 0 && (
                <div className="absolute top-full mt-2 right-0 left-0 bg-wood-900/95 border border-gold-500/20 rounded-xl overflow-hidden z-50 max-h-80 overflow-y-auto">
                  {searchResults.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center gap-3 p-3 hover:bg-gold-500/10 cursor-pointer transition border-b border-gold-500/10"
                      onMouseDown={() => {
                        setSelectedProduct(p);
                        setSearchVal("");
                      }}
                    >
                      <img src={p.img} className="w-10 h-10 rounded-lg object-cover" alt={p.name} />
                      <div className="flex-1 min-w-0">
                        <p className="font-playfair text-gold-300 text-sm font-semibold truncate">
                          {p.name}
                        </p>
                        <p className="text-subtle text-xs">
                          {p.br} · {TYPE_AR[p.t]}
                        </p>
                      </div>
                      <span className="text-gold-400 text-sm font-bold">
                        {p.sz[0].p.toLocaleString()} ج
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {searchOpen && searchVal.trim() && searchResults.length === 0 && (
                <div className="absolute top-full mt-2 right-0 left-0 bg-wood-900/95 border border-gold-500/20 rounded-xl p-4 text-center text-subtle text-sm z-50">
                  لا توجد نتائج
                </div>
              )}
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6">
            <a href="#occ" className="text-gold-100 hover:text-gold-400 transition text-sm">
              المناسبات
            </a>
            <a href="#prod" className="text-gold-100 hover:text-gold-400 transition text-sm">
              المنتجات
            </a>
            <a href="#bun" className="text-gold-100 hover:text-gold-400 transition text-sm">
              الباقات
            </a>
            <a href="#t10" className="text-gold-100 hover:text-gold-400 transition text-sm">
              Top 10
            </a>
            <button
              onClick={() => setQuizOpen(true)}
              className="text-gold-400 hover:text-gold-200 transition text-sm"
            >
              اكتشف عطرك
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => toggleWishlistOpen()}
              aria-label="المفضلة"
              className="relative text-gold-400 hover:text-gold-200 transition"
            >
              <Heart size={22} />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </button>
            <button
              onClick={() => { window.location.hash = "#track"; }}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full border border-gold-500/30 text-gold-400 text-xs hover:bg-gold-500/10 transition"
              title="تتبع طلبك"
            >
              <PackageSearch size={14} />
              تتبع الطلب
            </button>
            <button
              onClick={() => setSpinOpen(true)}
              aria-label="عجلة الحظ"
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full border border-gold-500/30 text-gold-400 text-xs hover:bg-gold-500/10 transition"
            >
              <Loader2 size={14} />
              عجلة الحظ
            </button>
            <button
              onClick={() => setSurpriseOpen(true)}
              aria-label="فاجئني"
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-l from-gold-500 to-gold-700 text-wood-950 font-bold text-xs transition"
            >
              <Shuffle size={14} />
              فاجئني
            </button>
            <button onClick={toggleCart} aria-label="السلة" className="relative text-gold-400 hover:text-gold-200 transition">
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold-500 text-wood-950 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              className="lg:hidden text-gold-400"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="القائمة"
            >
              {mobileOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden wood-bg border-t border-gold-500/20 px-6 py-4 space-y-3 mobile-menu-enter">
          {/* Mobile Search */}
          <div className="relative mb-2">
            <input
              type="text"
              placeholder="ابحث عن عطر..."
              className="w-full px-4 py-2.5 pr-10 rounded-full bg-wood-950/60 border border-gold-500/20 text-gold-100 placeholder:text-gold-100/30 focus:border-gold-500/50 focus:outline-none transition text-sm"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              onFocus={() => setSearchOpen(true)}
              onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gold-500/50" size={18} />
            {searchOpen && searchResults.length > 0 && (
              <div className="absolute top-full mt-2 right-0 left-0 bg-wood-900/95 border border-gold-500/20 rounded-xl overflow-hidden z-50 max-h-60 overflow-y-auto">
                {searchResults.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 p-3 hover:bg-gold-500/10 cursor-pointer transition border-b border-gold-500/10"
                    onMouseDown={() => {
                      setSelectedProduct(p);
                      setSearchVal("");
                      setMobileOpen(false);
                    }}
                  >
                    <img src={p.img} className="w-10 h-10 rounded-lg object-cover" alt={p.name} />
                    <div className="flex-1 min-w-0">
                      <p className="font-playfair text-gold-300 text-sm font-semibold truncate">{p.name}</p>
                      <p className="text-subtle text-xs">{p.br} · {TYPE_AR[p.t]}</p>
                    </div>
                    <span className="text-gold-400 text-sm font-bold">{p.sz[0].p.toLocaleString()} ج</span>
                  </div>
                ))}
              </div>
            )}
            {searchOpen && searchVal.trim() && searchResults.length === 0 && (
              <div className="absolute top-full mt-2 right-0 left-0 bg-wood-900/95 border border-gold-500/20 rounded-xl p-4 text-center text-subtle text-sm z-50">لا توجد نتائج</div>
            )}
          </div>
          <a href="#occ" className="block text-gold-100 py-2" onClick={() => setMobileOpen(false)}>المناسبات</a>
          <a href="#prod" className="block text-gold-100 py-2" onClick={() => setMobileOpen(false)}>المنتجات</a>
          <a href="#bun" className="block text-gold-100 py-2" onClick={() => setMobileOpen(false)}>الباقات</a>
          <a href="#t10" className="block text-gold-100 py-2" onClick={() => setMobileOpen(false)}>Top 10</a>
          <button onClick={() => { setQuizOpen(true); setMobileOpen(false); }} className="block text-gold-400 py-2">
            اكتشف عطرك
          </button>
          <button onClick={() => { setSpinOpen(true); setMobileOpen(false); }} className="block text-gold-400 py-2">
            عجلة الحظ
          </button>
          <button onClick={() => { setSurpriseOpen(true); setMobileOpen(false); }} className="block text-gold-400 py-2">
            فاجئني يلا
          </button>
          <button onClick={() => { toggleWishlistOpen(); setMobileOpen(false); }} className="block text-gold-400 py-2">
            المفضلة
          </button>
          <button onClick={() => { window.location.hash = "#track"; setMobileOpen(false); }} className="block text-gold-400 py-2">
            تتبع الطلب
          </button>
        </div>
      )}
    </nav>

      {/* Auth Modal */}
      {authOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80">
          <div className="p-6 rounded-2xl border border-gold-500/30 w-80" style={{ background: "#1A0F0A" }}>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Lock size={20} className="text-gold-400" />
              <h3 className="font-playfair text-lg font-bold text-gold-400">الدخول</h3>
            </div>
            <input
              type="password"
              value={authPw}
              onChange={(e) => setAuthPw(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAuth()}
              className="w-full px-4 py-3 rounded-lg bg-wood-950/50 border border-gold-500/20 text-gold-100 placeholder:text-gold-100/30 focus:border-gold-500/50 focus:outline-none text-sm text-center mb-2"
              placeholder="كلمة السر"
              autoFocus
            />
            {authErr && <p className="text-red-400 text-xs text-center mb-2">{authErr}</p>}
            <div className="flex gap-2">
              <button onClick={() => { setAuthOpen(false); setAuthPw(""); setAuthErr(""); }} className="flex-1 py-2 rounded-lg border border-gold-500/20 text-gold-300 text-sm">إلغاء</button>
              <button onClick={handleAuth} disabled={authLoading} className="flex-1 py-2 rounded-lg font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed gold-gradient">
              {authLoading ? "..." : "دخول"}
            </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Panel */}
      {adminOpen && <AdminPanel onClose={() => setAdminOpen(false)} />}
    </>
  );
}
