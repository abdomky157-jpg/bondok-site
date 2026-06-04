"use client";

import { useEffect, useState, useRef } from "react";
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
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { TYPE_AR, GENDER_AR } from "@/data/products";
import { useSiteData } from "@/context/SiteContext";
import { useBondokStore } from "@/store/bondok";
import AdminPanel from "./AdminPanel";
import { useScrollLock } from "@/hooks/useScrollLock";
import { LOGO_URL } from "@/lib/constants";

const navLinks = [
  { id: "occ", label: "المناسبات" },
  { id: "prod", label: "المنتجات" },
  { id: "bun", label: "الباقات" },
  { id: "t10", label: "Top 10" },
];

export default function Navbar() {
  const { products, settings } = useSiteData();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authPw, setAuthPw] = useState("");
  const [authErr, setAuthErr] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useScrollLock(authOpen || adminOpen);

  // Track active section on scroll
  useEffect(() => {
    const sections = navLinks.map(l => l.id);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: "-100px 0px -50% 0px" }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Secret: Keyboard shortcut Alt+Shift+K to open admin login
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.shiftKey && (e.key === "K" || e.key === "k" || e.key === "ك")) {
        e.preventDefault();
        setAuthOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Secret: Check for #admin hash in URL
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === "#admin") {
        setAuthOpen(true);
        window.history.replaceState(null, "", window.location.pathname);
      }
    };
    checkHash();
    window.addEventListener("hashchange", checkHash);
    return () => window.removeEventListener("hashchange", checkHash);
  }, []);

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
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const h = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
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
      className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-500 ${
        scrolled ? "nsc" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 shrink-0">
            <img
              src={settings.logoUrl || LOGO_URL}
              className="h-10 w-10 sm:h-12 sm:w-12 object-contain rounded-full transition-transform duration-300 hover:scale-110"
              style={{ filter: "drop-shadow(0 0 10px rgba(212,164,76,.4))" }}
              alt="Bondok"
            />
            <div className="hidden sm:block">
              <h1 className="font-playfair text-lg sm:text-xl font-bold gold-shimmer leading-tight">
                Bondok
              </h1>
              <p className="font-playfair text-[9px] sm:text-xs tracking-[0.25em] text-gold-400 -mt-0.5">
                PERFUMES
              </p>
            </div>
          </Link>

          {/* Search */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-6 relative">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="ابحث عن عطر..."
                className="w-full px-5 py-2.5 pr-11 rounded-full bg-wood-950/50 border border-gold-500/15 text-gold-100 placeholder:text-gold-100/25 focus:border-gold-500/40 focus:bg-wood-950/70 focus:outline-none transition-all text-sm"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
              />
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gold-500/40" size={18} />
              {searchOpen && searchResults.length > 0 && (
                <div className="absolute top-full mt-2 right-0 left-0 rounded-xl overflow-hidden z-50 max-h-80 overflow-y-auto border border-gold-500/15" style={{ background: "rgba(26,15,10,.95)", backdropFilter: "blur(20px)" }}>
                  {searchResults.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center gap-3 p-3 hover:bg-gold-500/8 cursor-pointer transition border-b border-gold-500/8"
                      onMouseDown={() => {
                        setSelectedProduct(p);
                        setSearchVal("");
                      }}
                    >
                      <img src={p.img} className="w-10 h-10 rounded-lg object-cover" alt={p.name} />
                      <div className="flex-1 min-w-0">
                        <p className="font-playfair text-gold-200 text-sm font-semibold truncate">{p.name}</p>
                        <p className="text-subtle text-xs">{p.br} · {TYPE_AR[p.t]}</p>
                      </div>
                      <span className="text-gold-400 text-sm font-bold">{p.sz[0].p.toLocaleString()} ج</span>
                    </div>
                  ))}
                </div>
              )}
              {searchOpen && searchVal.trim() && searchResults.length === 0 && (
                <div className="absolute top-full mt-2 right-0 left-0 rounded-xl p-6 text-center text-subtle text-sm z-50 border border-gold-500/15" style={{ background: "rgba(26,15,10,.95)" }}>
                  لا توجد نتائج لـ &quot;{searchVal}&quot;
                </div>
              )}
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={`relative px-3 py-1.5 rounded-full text-sm transition-all duration-300 ${
                  activeSection === link.id
                    ? "text-gold-300 font-semibold"
                    : "text-gold-100/70 hover:text-gold-300"
                }`}
              >
                {link.label}
                {activeSection === link.id && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-gold-400" />
                )}
              </a>
            ))}
            <button
              onClick={() => setQuizOpen(true)}
              className="px-3 py-1.5 rounded-full text-sm text-gold-400 hover:text-gold-200 transition flex items-center gap-1"
            >
              <Sparkles size={14} />
              اكتشف عطرك
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => toggleWishlistOpen()}
              aria-label="المفضلة"
              className="relative text-gold-400/80 hover:text-gold-300 transition-all hover:scale-110 p-1.5"
            >
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </button>
            <button
              onClick={() => { window.location.hash = "#track"; }}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-gold-500/15 text-gold-400/80 text-[11px] hover:bg-gold-500/8 transition"
              title="تتبع طلبك"
            >
              <PackageSearch size={13} />
              تتبع
            </button>
            <button
              onClick={() => setSpinOpen(true)}
              aria-label="عجلة الحظ"
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-gold-500/15 text-gold-400/80 text-[11px] hover:bg-gold-500/8 transition"
            >
              <Loader2 size={13} />
              عجلة الحظ
            </button>
            <button
              onClick={() => setSurpriseOpen(true)}
              aria-label="فاجئني"
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-l from-gold-500 to-gold-700 text-wood-950 font-bold text-[11px] transition hover:shadow-[0_0_15px_rgba(212,164,76,.3)] hover:scale-105"
            >
              <Shuffle size={13} />
              فاجئني
            </button>
            <button onClick={toggleCart} aria-label="السلة" className="relative text-gold-400/80 hover:text-gold-300 transition-all hover:scale-110 p-1.5">
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-gold-500 text-wood-950 text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              className="lg:hidden text-gold-400/80 hover:text-gold-300 transition p-1"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="القائمة"
            >
              {mobileOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden wood-bg border-t border-gold-500/15 px-6 py-5 space-y-1 mobile-menu-enter" style={{ background: "rgba(26,15,10,.98)" }}>
          {/* Mobile Search */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="ابحث عن عطر..."
              className="w-full px-4 py-2.5 pr-10 rounded-full bg-wood-950/50 border border-gold-500/15 text-gold-100 placeholder:text-gold-100/25 focus:border-gold-500/40 focus:outline-none transition text-sm"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              onFocus={() => setSearchOpen(true)}
              onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gold-500/40" size={18} />
            {searchOpen && searchResults.length > 0 && (
              <div className="absolute top-full mt-2 right-0 left-0 rounded-xl overflow-hidden z-50 max-h-60 overflow-y-auto border border-gold-500/15" style={{ background: "rgba(26,15,10,.95)" }}>
                {searchResults.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 p-3 hover:bg-gold-500/8 cursor-pointer transition border-b border-gold-500/8"
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
          </div>
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={`block py-2.5 px-3 rounded-lg text-sm transition ${
                activeSection === link.id
                  ? "text-gold-300 font-semibold bg-gold-500/8"
                  : "text-gold-100/70 hover:text-gold-300 hover:bg-gold-500/5"
              }`}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="border-t border-gold-500/10 pt-2 mt-2 space-y-1">
            <button onClick={() => { setQuizOpen(true); setMobileOpen(false); }} className="flex items-center gap-2 block w-full py-2.5 px-3 rounded-lg text-sm text-gold-400 hover:bg-gold-500/5 transition">
              <Sparkles size={16} /> اكتشف عطرك
            </button>
            <button onClick={() => { setSpinOpen(true); setMobileOpen(false); }} className="flex items-center gap-2 block w-full py-2.5 px-3 rounded-lg text-sm text-gold-400 hover:bg-gold-500/5 transition">
              <Loader2 size={16} /> عجلة الحظ
            </button>
            <button onClick={() => { setSurpriseOpen(true); setMobileOpen(false); }} className="flex items-center gap-2 block w-full py-2.5 px-3 rounded-lg text-sm text-gold-400 hover:bg-gold-500/5 transition">
              <Shuffle size={16} /> فاجئني
            </button>
            <button onClick={() => { toggleWishlistOpen(); setMobileOpen(false); }} className="flex items-center gap-2 block w-full py-2.5 px-3 rounded-lg text-sm text-gold-400 hover:bg-gold-500/5 transition">
              <Heart size={16} /> المفضلة {wishlist.length > 0 && `(${wishlist.length})`}
            </button>
            <button onClick={() => { window.location.hash = "#track"; setMobileOpen(false); }} className="flex items-center gap-2 block w-full py-2.5 px-3 rounded-lg text-sm text-gold-400 hover:bg-gold-500/5 transition">
              <PackageSearch size={16} /> تتبع الطلب
            </button>
          </div>
        </div>
      )}
    </nav>

      {/* Auth Modal */}
      {authOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,.85)" }}>
          <div className="p-8 rounded-2xl w-80 gold-border" style={{ background: "#1A0F0A" }}>
            <div className="flex items-center justify-center gap-2 mb-6">
              <Lock size={22} className="text-gold-400" />
              <h3 className="font-playfair text-xl font-bold text-gold-400">الدخول</h3>
            </div>
            <input
              type="password"
              value={authPw}
              onChange={(e) => setAuthPw(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAuth()}
              className="w-full px-4 py-3 rounded-lg bg-wood-950/50 border border-gold-500/15 text-gold-100 placeholder:text-gold-100/25 focus:border-gold-500/40 focus:outline-none text-sm text-center mb-3 transition"
              placeholder="كلمة السر"
              autoFocus
            />
            {authErr && <p className="text-red-400 text-xs text-center mb-3">{authErr}</p>}
            <div className="flex gap-2">
              <button onClick={() => { setAuthOpen(false); setAuthPw(""); setAuthErr(""); }} className="flex-1 py-2.5 rounded-lg border border-gold-500/15 text-gold-300 text-sm transition hover:bg-gold-500/5">إلغاء</button>
              <button onClick={handleAuth} disabled={authLoading} className="flex-1 py-2.5 rounded-lg font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed gold-gradient transition hover:shadow-[0_0_15px_rgba(212,164,76,.3)]">
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
