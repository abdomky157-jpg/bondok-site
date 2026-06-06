"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Save, Plus, Trash2, Upload, ChevronDown, ChevronUp, Loader2, Image, Palette, Type, Package, Settings, ShoppingBag, Users, Phone, Mail, MapPin, Calendar, Search, Edit3, UserPlus, TrendingUp, DollarSign, ShoppingCart, Clock, MessageSquare, Star, Crown } from "lucide-react";
import { useSiteData } from "@/context/SiteContext";

// ===== Admin Panel Component =====
export default function AdminPanel({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState("products");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const tabs = [
    { id: "orders", label: "الطلبات", icon: <ShoppingBag size={16} /> },
    { id: "customers", label: "العملاء", icon: <Users size={16} /> },
    { id: "products", label: "المنتجات", icon: <Package size={16} /> },
    { id: "bundles", label: "الباقات", icon: <Package size={16} /> },
    { id: "settings", label: "النصوص", icon: <Type size={16} /> },
    { id: "images", label: "الصور", icon: <Image size={16} /> },
    { id: "colors", label: "الألوان", icon: <Palette size={16} /> },
    { id: "general", label: "عام", icon: <Settings size={16} /> },
  ];

  const [refreshKey, setRefreshKey] = useState(0);
  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  return (
    <div className="fixed inset-0 z-[2000] flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full max-w-4xl ml-auto flex flex-col" style={{ background: "#1A0F0A", borderLeft: "2px solid rgba(212,164,76,.3)" }}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gold-500/20">
          <h2 className="font-playfair text-xl font-bold gold-shimmer">لوحة التحكم السرية</h2>
          <button onClick={onClose} className="text-gold-400 hover:text-gold-200 transition"><X size={24} /></button>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-gold-500/20 px-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm whitespace-nowrap border-b-2 transition ${
                tab === t.id ? "border-gold-500 text-gold-400" : "border-transparent text-gold-300/60 hover:text-gold-300"
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6" key={tab + refreshKey}>
          {tab === "orders" && <OrdersTab />}
          {tab === "customers" && <CustomersTab />}
          {tab === "products" && <ProductsTab onRefresh={refresh} />}
          {tab === "bundles" && <BundlesTab onRefresh={refresh} />}
          {tab === "settings" && <SettingsTab type="text" />}
          {tab === "images" && <SettingsTab type="image" />}
          {tab === "colors" && <SettingsTab type="color" />}
          {tab === "general" && <GeneralTab />}
        </div>
      </div>
    </div>
  );
}

// ===== Auth Token Helper =====
// Token is now stored as httpOnly cookie - browser sends it automatically.
// No need to read from localStorage or set Authorization header.
function adminHeaders(): Record<string, string> {
  return { "Content-Type": "application/json" };
}

function adminHeadersFormData(): Record<string, string> {
  return {};
}

// ===== Shared Upload Helper =====
async function uploadFile(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", headers: adminHeadersFormData(), body: fd });
  if (!res.ok) throw new Error("فشل رفع الصورة");
  const data = await res.json();
  return data.url || "";
}

// ===== Parse JSON string fields from API =====
function safeParse(str: any, fallback: any = []) {
  if (Array.isArray(str)) return str;
  if (typeof str === "string") { try { return JSON.parse(str); } catch { return fallback; } }
  return fallback;
}

function parseProduct(p: any) {
  return {
    ...p,
    sizes: safeParse(p.sizes),
    topNotes: safeParse(p.topNotes),
    heartNotes: safeParse(p.heartNotes),
    baseNotes: safeParse(p.baseNotes),
    occasions: safeParse(p.occasions),
    seasons: safeParse(p.seasons),
  };
}

function parseBundle(b: any) {
  return { ...b, items: safeParse(b.items) };
}

// ===== Products Tab =====
function ProductsTab({ onRefresh }: { onRefresh: () => void }) {
  const { refresh } = useSiteData();
  const [products, setProducts] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products", { headers: adminHeaders() });
      const data = await res.json();
      if (data.error === "Unauthorized") { setProducts([]); return; }
      setProducts(Array.isArray(data) ? data.map(parseProduct) : []);
    } catch {
      setProducts([]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async (data: any) => {
    setSaving(true);
    try {
      if (data.id) {
        await fetch(`/api/admin/products/${data.id}`, { method: "PUT", headers: adminHeaders(), body: JSON.stringify(data) });
      } else {
        await fetch("/api/admin/products", { method: "POST", headers: adminHeaders(), body: JSON.stringify(data) });
      }
      await load();
      setEditing(null);
      setShowForm(false);
      refresh();
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: number) => {
    if (!confirm("متأكد من الحذف؟")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE", headers: adminHeaders() });
    load();
    refresh();
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-gold-400" size={32} /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-gold-300">{products.length} منتج</span>
        <button onClick={() => { setEditing({ sizes: [{ s: "100ml", p: 2000 }], topNotes: [], heartNotes: [], baseNotes: [], occasions: [], seasons: [], longevity: 7, sillage: 7 }); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold" style={{ background: "linear-gradient(135deg,#D4A44C,#A07020)", color: "#1A0F0A" }}>
          <Plus size={16} /> منتج جديد
        </button>
      </div>

      {/* List */}
      <div className="space-y-2 mb-4">
        {products.map((p: any) => (
          <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl border border-gold-500/20" style={{ background: "rgba(45,27,17,.5)" }}>
            <img src={p.image} className="w-12 h-12 rounded-lg object-cover shrink-0" alt={p.name} />
            <div className="flex-1 min-w-0">
              <p className="font-playfair text-gold-300 text-sm font-semibold truncate">{p.name}</p>
              <p className="text-gold-100/40 text-xs">{p.ar} · {p.brand}</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="hidden sm:inline text-gold-400 text-[10px] px-1.5 py-0.5 rounded bg-gold-500/10">{p.gender === "men" ? "رجالي" : p.gender === "women" ? "نسائي" : "مشترك"}</span>
              <button onClick={() => { setEditing(parseProduct(p)); setShowForm(true); }} className="text-gold-400 hover:text-gold-200 text-xs px-2 py-1 border border-gold-500/20 rounded">تعديل</button>
              <button onClick={() => del(p.id)} className="text-red-400 hover:text-red-300 p-1"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Form */}
      {showForm && editing && (
        <ProductForm product={editing} saving={saving} onSave={save} onCancel={() => { setShowForm(false); setEditing(null); }} />
      )}
    </div>
  );
}

function ProductForm({ product, saving, onSave, onCancel }: { product: any; saving: boolean; onSave: (d: any) => void; onCancel: () => void }) {
  const [form, setForm] = useState({ ...product });
  const [imgUploading, setImgUploading] = useState(false);

  const set = (k: string, v: any) => setForm({ ...form, [k]: v });

  const handleImgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgUploading(true);
    const url = await uploadFile(file);
    set("image", url);
    setImgUploading(false);
  };

  // Size management
  const addSize = () => set("sizes", [...form.sizes, { s: "100ml", p: 2000 }]);
  const removeSize = (i: number) => set("sizes", form.sizes.filter((_: any, idx: number) => idx !== i));
  const updateSize = (i: number, k: string, v: any) => {
    const ns = [...form.sizes];
    ns[i] = { ...ns[i], [k]: k === "p" ? Number(v) : v };
    set("sizes", ns);
  };

  // Array field management (notes, occasions, seasons)
  const addToArray = (field: string) => set(field, [...form[field], ""]);
  const removeFromArray = (field: string, i: number) => set(field, form[field].filter((_: any, idx: number) => idx !== i));
  const updateArray = (field: string, i: number, v: string) => {
    const arr = [...form[field]];
    arr[i] = v;
    set(field, arr);
  };

  return (
    <div className="fixed inset-0 z-[2100] flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 border border-gold-500/30" style={{ background: "#1A0F0A" }}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-playfair text-lg font-bold text-gold-400">{form.id ? "تعديل منتج" : "منتج جديد"}</h3>
          <button onClick={onCancel} className="text-gold-400"><X size={20} /></button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="الاسم (EN)" value={form.name} onChange={(v) => set("name", v)} />
          <Field label="الاسم (AR)" value={form.ar} onChange={(v) => set("ar", v)} />
          <Field label="الماركة" value={form.brand} onChange={(v) => set("brand", v)} />
          <div>
            <label className="block text-gold-400 text-xs mb-1">النوع</label>
            <select value={form.gender} onChange={(e) => set("gender", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-wood-950/50 border border-gold-500/20 text-gold-100 text-sm">
              <option value="men">رجالي</option>
              <option value="women">نسائي</option>
              <option value="unisex">مشترك</option>
            </select>
          </div>
          <div>
            <label className="block text-gold-400 text-xs mb-1">العائلة العطرية</label>
            <select value={form.type} onChange={(e) => set("type", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-wood-950/50 border border-gold-500/20 text-gold-100 text-sm">
              {["woody", "floral", "oriental", "fresh", "spicy", "sweet"].map((t) => (
                <option key={t} value={t}>{({ woody: "خشبي", floral: "زهري", oriental: "شرقي", fresh: "منعش", spicy: "حار", sweet: "حلو" }[t])}</option>
              ))}
            </select>
          </div>
          <Field label="البادج" value={form.badge || ""} onChange={(v) => set("badge", v)} placeholder="الأكثر مبيعاً" />
          <Field label="الوصف" value={form.desc || ""} onChange={(v) => set("desc", v)} />
          <div className="flex gap-4">
            <Field label="الثبات" value={String(form.longevity)} onChange={(v) => set("longevity", Number(v))} />
            <Field label="الفوحانة" value={String(form.sillage)} onChange={(v) => set("sillage", Number(v))} />
          </div>
        </div>

        {/* Image */}
        <div className="mt-4">
          <label className="block text-gold-400 text-xs mb-1">صورة المنتج</label>
          <div className="flex items-center gap-3">
            <input type="text" value={form.image || ""} onChange={(e) => set("image", e.target.value)} className="flex-1 px-3 py-2 rounded-lg bg-wood-950/50 border border-gold-500/20 text-gold-100 text-sm" placeholder="URL الصورة" />
            <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gold-500/20 text-gold-400 text-sm cursor-pointer hover:bg-gold-500/10">
              <Upload size={14} />
              {imgUploading ? "جاري..." : "رفع"}
              <input type="file" accept="image/*" onChange={handleImgUpload} className="hidden" />
            </label>
          </div>
          {form.image && <img src={form.image} className="w-20 h-20 rounded-lg object-cover mt-2" alt="preview" />}
        </div>

        {/* Sizes */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-gold-400 text-xs">الأحجام والأسعار</label>
            <button onClick={addSize} className="text-gold-400 text-xs flex items-center gap-1"><Plus size={12} /> حجم</button>
          </div>
          {form.sizes?.map((sz: any, i: number) => (
            <div key={i} className="flex gap-2 mb-2">
              <input value={sz.s} onChange={(e) => updateSize(i, "s", e.target.value)} className="flex-1 px-2 py-1.5 rounded bg-wood-950/50 border border-gold-500/20 text-gold-100 text-xs" placeholder="100ml" />
              <input type="number" value={sz.p} onChange={(e) => updateSize(i, "p", e.target.value)} className="w-24 px-2 py-1.5 rounded bg-wood-950/50 border border-gold-500/20 text-gold-100 text-xs" placeholder="2500" />
              <button onClick={() => removeSize(i)} className="text-red-400"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>

        {/* Array fields */}
        <ArrayField label="نوتات علوية" items={form.topNotes} field="topNotes" set={set} />
        <ArrayField label="نوتات قلبية" items={form.heartNotes} field="heartNotes" set={set} />
        <ArrayField label="نوتات أساسية" items={form.baseNotes} field="baseNotes" set={set} />
        <ArrayField label="المناسبات" items={form.occasions} field="occasions" set={set} />
        <ArrayField label="المواسم" items={form.seasons} field="seasons" set={set} />

        {/* Toggles */}
        <div className="flex items-center gap-4 mt-4">
          <label className="flex items-center gap-2 text-gold-300 text-sm">
            <input type="checkbox" checked={form.top} onChange={(e) => set("top", e.target.checked)} className="w-4 h-4 accent-gold-500" />
            Top 10
          </label>
          <label className="flex items-center gap-2 text-gold-300 text-sm">
            <input type="checkbox" checked={form.active !== false} onChange={(e) => set("active", e.target.checked)} className="w-4 h-4 accent-gold-500" />
            فعال
          </label>
        </div>

        {/* Save */}
        <div className="flex gap-3 mt-6">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-lg border border-gold-500/20 text-gold-300 text-sm">إلغاء</button>
          <button onClick={() => onSave(form)} disabled={saving} className="flex-1 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2" style={{ background: "linear-gradient(135deg,#D4A44C,#A07020)", color: "#1A0F0A" }}>
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            حفظ
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== Bundles Tab =====
function BundlesTab({ onRefresh }: { onRefresh: () => void }) {
  const { refresh } = useSiteData();
  const [bundles, setBundles] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/bundles", { headers: adminHeaders() });
      const data = await res.json();
      if (data.error === "Unauthorized") { setBundles([]); return; }
      setBundles(Array.isArray(data) ? data.map(parseBundle) : []);
    } catch {
      setBundles([]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async (data: any) => {
    setSaving(true);
    try {
      if (data.id) {
        await fetch(`/api/admin/bundles/${data.id}`, { method: "PUT", headers: adminHeaders(), body: JSON.stringify(data) });
      } else {
        await fetch("/api/admin/bundles", { method: "POST", headers: adminHeaders(), body: JSON.stringify(data) });
      }
      await load();
      setEditing(null);
      setShowForm(false);
      refresh();
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: number) => {
    if (!confirm("متأكد من الحذف؟")) return;
    await fetch(`/api/admin/bundles/${id}`, { method: "DELETE", headers: adminHeaders() });
    load();
    refresh();
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-gold-400" size={32} /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-gold-300">{bundles.length} باقة</span>
        <button onClick={() => { setEditing({ items: [] }); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold" style={{ background: "linear-gradient(135deg,#D4A44C,#A07020)", color: "#1A0F0A" }}>
          <Plus size={16} /> باقة جديدة
        </button>
      </div>

      <div className="space-y-2 mb-4">
        {bundles.map((b: any) => (
          <div key={b.id} className="flex items-center gap-3 p-3 rounded-xl border border-gold-500/20" style={{ background: "rgba(45,27,17,.5)" }}>
            <div className="flex-1 min-w-0">
              <p className="font-playfair text-gold-300 text-sm font-semibold truncate">{b.name}</p>
              <p className="text-gold-400 text-xs">{b.price?.toLocaleString()} ج.م</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button onClick={() => { setEditing(parseBundle(b)); setShowForm(true); }} className="text-gold-400 hover:text-gold-200 text-xs px-2 py-1 border border-gold-500/20 rounded">تعديل</button>
              <button onClick={() => del(b.id)} className="text-red-400 hover:text-red-300 p-1"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      {showForm && editing && (
        <BundleForm bundle={editing} saving={saving} onSave={save} onCancel={() => { setShowForm(false); setEditing(null); }} />
      )}
    </div>
  );
}

function BundleForm({ bundle, saving, onSave, onCancel }: { bundle: any; saving: boolean; onSave: (d: any) => void; onCancel: () => void }) {
  const [form, setForm] = useState({ ...bundle });
  const set = (k: string, v: any) => setForm({ ...form, [k]: v });

  return (
    <div className="fixed inset-0 z-[2100] flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-lg rounded-2xl p-6 border border-gold-500/30" style={{ background: "#1A0F0A" }}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-playfair text-lg font-bold text-gold-400">{form.id ? "تعديل باقة" : "باقة جديدة"}</h3>
          <button onClick={onCancel} className="text-gold-400"><X size={20} /></button>
        </div>

        <div className="space-y-4">
          <Field label="اسم الباقة" value={form.name} onChange={(v) => set("name", v)} />
          <Field label="الوصف" value={form.desc || ""} onChange={(v) => set("desc", v)} />
          <Field label="السعر" value={String(form.price || 0)} onChange={(v) => set("price", Number(v))} />
          <Field label="الأيقونة" value={form.icon || ""} onChange={(v) => set("icon", v)} />

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-gold-400 text-xs">المحتويات</label>
              <button onClick={() => set("items", [...(form.items || []), ""])} className="text-gold-400 text-xs flex items-center gap-1"><Plus size={12} /> عنصر</button>
            </div>
            {(form.items || []).map((item: string, i: number) => (
              <div key={i} className="flex gap-2 mb-2">
                <input value={item} onChange={(e) => {
                  const arr = [...form.items];
                  arr[i] = e.target.value;
                  set("items", arr);
                }} className="flex-1 px-3 py-2 rounded-lg bg-wood-950/50 border border-gold-500/20 text-gold-100 text-sm" />
                <button onClick={() => set("items", form.items.filter((_: string, idx: number) => idx !== i))} className="text-red-400"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-lg border border-gold-500/20 text-gold-300 text-sm">إلغاء</button>
          <button onClick={() => onSave(form)} disabled={saving} className="flex-1 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2" style={{ background: "linear-gradient(135deg,#D4A44C,#A07020)", color: "#1A0F0A" }}>
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            حفظ
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== Settings Tab (Text, Image, Color) =====
function SettingsTab({ type }: { type: "text" | "image" | "color" }) {
  const { refresh } = useSiteData();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changed, setChanged] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/admin/settings", { headers: adminHeaders() }).then((r) => r.json()).then((data) => {
      setSettings(typeof data === "object" && !Array.isArray(data) ? data : {});
      setLoading(false);
    }).catch(() => {
      setSettings({});
      setLoading(false);
    });
  }, []);

  const set = (key: string, value: string) => {
    setChanged((prev) => ({ ...prev, [key]: value }));
  };

  const saveAll = async () => {
    setSaving(true);
    await fetch("/api/admin/settings", { method: "PUT", headers: adminHeaders(), body: JSON.stringify(changed) });
    setSettings((prev) => ({ ...prev, ...changed }));
    setChanged({});
    setSaving(false);
    refresh();
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-gold-400" size={32} /></div>;

  const groups: Record<string, Record<string, string>> = {
    text: {
      "العنوان": "siteName",
      "العنوان (عربي)": "siteNameAr",
      "عنوان الهيرو": "heroSubtitle",
      "زر الهيرو 1": "heroBtn1",
      "زر الهيرو 2": "heroBtn2",
      "عنوان المناسبات": "occTitle",
      "وصف المناسبات": "occDesc",
      "عنوان التصنيفات": "catTitle",
      "عنوان المنتجات": "prodTitle",
      "عنوان الباقات": "bunTitle",
      "عنوان Top 10": "t10Title",
      "عنوان من نحن": "aboutTitle",
      "وصف من نحن": "aboutDesc",
      "إحصائية 1": "aboutStat1",
      "عنوان إحصائية 1": "aboutStat1Label",
      "إحصائية 2": "aboutStat2",
      "عنوان إحصائية 2": "aboutStat2Label",
      "إحصائية 3": "aboutStat3",
      "عنوان إحصائية 3": "aboutStat3Label",
      "عنوان تواصل": "contactTitle",
      "عنوان الفرع": "contactAddress",
      "الهاتف": "contactPhone",
      "واتساب": "contactWhatsapp",
      "نص الفوتر": "footerText",
    },
    image: {
      "صورة اللوجو": "logoUrl",
      "صورة من نحن": "aboutImage",
    },
    color: {
      "اللون الرئيسي": "primaryColor",
      "لون الخلفية": "bgColor",
    },
  };

  const items = groups[type] || {};

  return (
    <div>
      <div className="space-y-4">
        {Object.entries(items).map(([label, key]) => (
          <div key={key}>
            <label className="block text-gold-400 text-xs mb-1">{label}</label>
            {type === "color" ? (
              <div className="flex gap-2">
                <input type="color" value={changed[key] ?? settings[key] ?? "#D4A44C"} onChange={(e) => set(key, e.target.value)} className="w-12 h-10 rounded border border-gold-500/20 cursor-pointer" />
                <input type="text" value={changed[key] ?? settings[key] ?? ""} onChange={(e) => set(key, e.target.value)} className="flex-1 px-3 py-2 rounded-lg bg-wood-950/50 border border-gold-500/20 text-gold-100 text-sm font-mono" />
              </div>
            ) : type === "image" ? (
              <div className="flex gap-2">
                <input type="text" value={changed[key] ?? settings[key] ?? ""} onChange={(e) => set(key, e.target.value)} className="flex-1 px-3 py-2 rounded-lg bg-wood-950/50 border border-gold-500/20 text-gold-100 text-sm" />
                <ImageUploadButton onUploaded={(url) => set(key, url)} />
              </div>
            ) : (
              <input type="text" value={changed[key] ?? settings[key] ?? ""} onChange={(e) => set(key, e.target.value)} className="w-full px-3 py-2 rounded-lg bg-wood-950/50 border border-gold-500/20 text-gold-100 text-sm" />
            )}
          </div>
        ))}
      </div>

      {Object.keys(changed).length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 z-10" style={{ background: "#1A0F0A", borderTop: "1px solid rgba(212,164,76,.3)" }}>
          <button onClick={saveAll} disabled={saving} className="w-full py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2" style={{ background: "linear-gradient(135deg,#D4A44C,#A07020)", color: "#1A0F0A" }}>
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            حفظ التغييرات ({Object.keys(changed).length})
          </button>
        </div>
      )}
    </div>
  );
}

// ===== Customers Tab =====
function CustomersTab() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sortBy, setSortBy] = useState<"newest" | "mostOrders" | "mostSpent">("newest");

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/customers", { headers: adminHeaders() });
      const data = await res.json();
      if (data.error === "Unauthorized") { setCustomers([]); return; }
      setCustomers(Array.isArray(data.customers) ? data.customers : Array.isArray(data) ? data : []);
    } catch {
      setCustomers([]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  // Filter and sort
  const filtered = customers
    .filter((c: any) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.phone.includes(q) || (c.email || "").toLowerCase().includes(q) || (c.governorate || "").includes(q);
    })
    .sort((a: any, b: any) => {
      if (sortBy === "mostOrders") return (b.totalOrders || 0) - (a.totalOrders || 0);
      if (sortBy === "mostSpent") return (b.totalSpent || 0) - (a.totalSpent || 0);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  // Stats
  const totalCustomers = customers.length;
  const totalRevenue = customers.reduce((sum: number, c: any) => sum + (c.totalSpent || 0), 0);
  const avgSpent = totalCustomers > 0 ? Math.round(totalRevenue / totalCustomers) : 0;
  const repeatCustomers = customers.filter((c: any) => (c.totalOrders || 0) > 1).length;

  const saveCustomer = async (data: any) => {
    setSaving(true);
    try {
      if (data.id) {
        const res = await fetch(`/api/admin/customers/${data.id}`, {
          method: "PUT",
          headers: adminHeaders(),
          body: JSON.stringify(data),
        });
        if (res.status === 409) {
          alert("رقم التليفون مسجل بالفعل عند عميل آخر");
          setSaving(false);
          return;
        }
      } else {
        const res = await fetch("/api/admin/customers", {
          method: "POST",
          headers: adminHeaders(),
          body: JSON.stringify(data),
        });
        if (res.status === 409) {
          alert("رقم التليفون مسجل بالفعل");
          setSaving(false);
          return;
        }
      }
      await load();
      setEditingCustomer(null);
      setShowAddForm(false);
    } finally {
      setSaving(false);
    }
  };

  const deleteCustomer = async (id: number, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف العميل "${name}"؟\nالعمل لن يتم حذفه.`)) return;
    await fetch(`/api/admin/customers/${id}`, { method: "DELETE", headers: adminHeaders() });
    load();
  };

  const formatDate = (date: string | null) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("ar-EG", { year: "numeric", month: "short", day: "numeric" });
  };

  const formatDateTime = (date: string | null) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("ar-EG", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-gold-400" size={32} /></div>;

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="p-3 rounded-xl border border-gold-500/20 text-center" style={{ background: "rgba(45,27,17,.5)" }}>
          <Users size={20} className="text-gold-400 mx-auto mb-1" />
          <p className="text-gold-400 font-bold text-lg">{totalCustomers}</p>
          <p className="text-gold-100/40 text-xs">إجمالي العملاء</p>
        </div>
        <div className="p-3 rounded-xl border border-gold-500/20 text-center" style={{ background: "rgba(45,27,17,.5)" }}>
          <DollarSign size={20} className="text-green-400 mx-auto mb-1" />
          <p className="text-green-400 font-bold text-lg">{totalRevenue.toLocaleString()}</p>
          <p className="text-gold-100/40 text-xs">إجمالي المبيعات (ج.م)</p>
        </div>
        <div className="p-3 rounded-xl border border-gold-500/20 text-center" style={{ background: "rgba(45,27,17,.5)" }}>
          <TrendingUp size={20} className="text-blue-400 mx-auto mb-1" />
          <p className="text-blue-400 font-bold text-lg">{avgSpent.toLocaleString()}</p>
          <p className="text-gold-100/40 text-xs">متوسط الإنفاق</p>
        </div>
        <div className="p-3 rounded-xl border border-gold-500/20 text-center" style={{ background: "rgba(45,27,17,.5)" }}>
          <Crown size={20} className="text-purple-400 mx-auto mb-1" />
          <p className="text-purple-400 font-bold text-lg">{repeatCustomers}</p>
          <p className="text-gold-100/40 text-xs">عملاء متكررين</p>
        </div>
      </div>

      {/* Search + Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gold-400/50" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث بالاسم، رقم التليفون، المحافظة..."
            className="w-full pr-9 pl-3 py-2.5 rounded-xl bg-wood-950/50 border border-gold-500/20 text-gold-100 text-sm placeholder-gold-100/30 focus:border-gold-500/50 focus:outline-none"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2.5 rounded-xl bg-wood-950/50 border border-gold-500/20 text-gold-100 text-sm focus:border-gold-500/50 focus:outline-none"
          >
            <option value="newest">الأحدث</option>
            <option value="mostOrders">الأكثر طلبات</option>
            <option value="mostSpent">الأكثر إنفاقاً</option>
          </select>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap"
            style={{ background: "linear-gradient(135deg,#D4A44C,#A07020)", color: "#1A0F0A" }}
          >
            <UserPlus size={14} /> عميل جديد
          </button>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-gold-300 text-sm">{filtered.length} عميل{filtered.length !== 1 ? "" : ""}</span>
        {search && <button onClick={() => setSearch("")} className="text-gold-400/50 text-xs hover:text-gold-400">مسح البحث</button>}
      </div>

      {/* Customer List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Users size={56} className="text-gold-500/20 mx-auto mb-4" />
          <p className="text-gold-100/30 text-lg font-playfair mb-2">
            {customers.length === 0 ? "لا يوجد عملاء بعد" : "لا توجد نتائج للبحث"}
          </p>
          <p className="text-gold-100/20 text-sm">
            {customers.length === 0 ? "العملاء هيتسجلو تلقائياً لما يعملوا طلب" : "جرب كلمة بحث تانية"}
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((customer: any) => {
            const isExpanded = expandedId === customer.id;
            const isRepeat = (customer.totalOrders || 0) > 1;
            const isVip = (customer.totalSpent || 0) >= 5000;
            const isTop = (customer.totalOrders || 0) >= 5;

            return (
              <div
                key={customer.id}
                className="rounded-xl border border-gold-500/20 overflow-hidden transition-all"
                style={{
                  background: isExpanded ? "rgba(212,164,76,.08)" : "rgba(45,27,17,.5)",
                  borderColor: isExpanded ? "rgba(212,164,76,.35)" : "rgba(212,164,76,.2)",
                }}
              >
                {/* Customer Header */}
                <div className="p-4 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : customer.id)}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {/* Avatar */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold ${
                        isVip ? "bg-purple-500/20 text-purple-400 border border-purple-500/30" :
                        isRepeat ? "bg-gold-500/20 text-gold-400 border border-gold-500/30" :
                        "bg-wood-950 text-gold-100/40 border border-gold-500/20"
                      }`}>
                        {isVip ? <Crown size={16} /> : customer.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-playfair text-gold-300 font-bold text-sm">{customer.name}</span>
                          {isVip && <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">VIP</span>}
                          {isRepeat && !isVip && <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-gold-500/20 text-gold-400 border border-gold-500/30">متكرر</span>}
                          {isTop && <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30">Top</span>}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-gold-100/40 text-xs flex items-center gap-1" dir="ltr">
                            <Phone size={10} /> {customer.phone}
                          </span>
                          {customer.governorate && (
                            <span className="text-gold-100/30 text-xs flex items-center gap-1">
                              <MapPin size={10} /> {customer.governorate}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className="text-gold-400 font-bold text-sm">{(customer.totalSpent || 0).toLocaleString()} ج.م</span>
                      <div className="flex items-center gap-3 text-xs text-gold-100/30">
                        <span className="flex items-center gap-1"><ShoppingCart size={10} /> {customer.totalOrders || 0} طلب</span>
                        {isExpanded ? <ChevronUp size={14} className="text-gold-400/50" /> : <ChevronDown size={14} className="text-gold-400/50" />}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-gold-500/10 p-4 space-y-4">
                    {/* Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <InfoItem icon={<Phone size={13} />} label="التليفون" value={customer.phone} dir="ltr" />
                      {customer.email && <InfoItem icon={<Mail size={13} />} label="البريد" value={customer.email} />}
                      {customer.governorate && <InfoItem icon={<MapPin size={13} />} label="المحافظة" value={customer.governorate} />}
                      {customer.address && <InfoItem icon={<MapPin size={13} />} label="العنوان" value={customer.address} />}
                      <InfoItem icon={<ShoppingCart size={13} />} label="عدد الطلبات" value={`${customer.totalOrders || 0} طلب`} />
                      <InfoItem icon={<DollarSign size={13} />} label="إجمالي الإنفاق" value={`${(customer.totalSpent || 0).toLocaleString()} ج.م`} />
                      <InfoItem icon={<Calendar size={13} />} label="تاريخ التسجيل" value={formatDate(customer.createdAt)} />
                      <InfoItem icon={<Clock size={13} />} label="آخر طلب" value={formatDateTime(customer.lastOrderAt)} />
                    </div>

                    {/* Notes */}
                    {customer.notes && (
                      <div className="p-3 rounded-lg border border-gold-500/10" style={{ background: "rgba(45,27,17,.3)" }}>
                        <div className="flex items-center gap-1 text-gold-400/60 text-xs mb-1">
                          <MessageSquare size={11} /> ملاحظات
                        </div>
                        <p className="text-gold-100/50 text-sm">{customer.notes}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2 border-t border-gold-500/10">
                      <button
                        onClick={(e) => { e.stopPropagation(); setEditingCustomer({ ...customer }); }}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs border border-gold-500/20 text-gold-400 hover:bg-gold-500/10 transition"
                      >
                        <Edit3 size={12} /> تعديل
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteCustomer(customer.id, customer.name); }}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs border border-red-500/20 text-red-400 hover:bg-red-500/10 transition"
                      >
                        <Trash2 size={12} /> حذف
                      </button>
                      {customer.phone && (
                        <a
                          href={`https://wa.me/${customer.phone.replace(/^0/, "20")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs border border-green-500/20 text-green-400 hover:bg-green-500/10 transition mr-auto"
                        >
                          <Phone size={12} /> واتساب
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Customer Modal */}
      {(showAddForm || editingCustomer) && (
        <CustomerForm
          customer={editingCustomer || { name: "", phone: "", email: "", address: "", governorate: "", notes: "" }}
          saving={saving}
          onSave={saveCustomer}
          onCancel={() => { setShowAddForm(false); setEditingCustomer(null); }}
        />
      )}
    </div>
  );
}

function InfoItem({ icon, label, value, dir }: { icon: React.ReactNode; label: string; value: string; dir?: string }) {
  return (
    <div className="flex items-center gap-2 p-2 rounded-lg" style={{ background: "rgba(45,27,17,.3)" }}>
      <span className="text-gold-400/50">{icon}</span>
      <div className="min-w-0">
        <p className="text-gold-100/30 text-[10px]">{label}</p>
        <p className="text-gold-200/70 text-xs truncate" dir={dir as any}>{value || "—"}</p>
      </div>
    </div>
  );
}

function CustomerForm({ customer, saving, onSave, onCancel }: { customer: any; saving: boolean; onSave: (d: any) => void; onCancel: () => void }) {
  const [form, setForm] = useState({ ...customer });
  const set = (k: string, v: any) => setForm({ ...form, [k]: v });

  return (
    <div className="fixed inset-0 z-[2100] flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-lg rounded-2xl p-6 border border-gold-500/30" style={{ background: "#1A0F0A" }}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-playfair text-lg font-bold text-gold-400">
            {form.id ? "تعديل بيانات العميل" : "إضافة عميل جديد"}
          </h3>
          <button onClick={onCancel} className="text-gold-400 hover:text-gold-200"><X size={20} /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-gold-400 text-xs mb-1">الاسم *</label>
            <input
              type="text"
              value={form.name || ""}
              onChange={(e) => set("name", e.target.value)}
              placeholder="اسم العميل"
              className="w-full px-3 py-2.5 rounded-lg bg-wood-950/50 border border-gold-500/20 text-gold-100 text-sm focus:border-gold-500/50 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gold-400 text-xs mb-1">رقم التليفون *</label>
            <input
              type="text"
              value={form.phone || ""}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="01xxxxxxxxx"
              dir="ltr"
              className="w-full px-3 py-2.5 rounded-lg bg-wood-950/50 border border-gold-500/20 text-gold-100 text-sm focus:border-gold-500/50 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gold-400 text-xs mb-1">البريد الإلكتروني</label>
            <input
              type="email"
              value={form.email || ""}
              onChange={(e) => set("email", e.target.value)}
              placeholder="email@example.com"
              dir="ltr"
              className="w-full px-3 py-2.5 rounded-lg bg-wood-950/50 border border-gold-500/20 text-gold-100 text-sm focus:border-gold-500/50 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gold-400 text-xs mb-1">المحافظة</label>
            <input
              type="text"
              value={form.governorate || ""}
              onChange={(e) => set("governorate", e.target.value)}
              placeholder="القاهرة"
              className="w-full px-3 py-2.5 rounded-lg bg-wood-950/50 border border-gold-500/20 text-gold-100 text-sm focus:border-gold-500/50 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gold-400 text-xs mb-1">العنوان</label>
            <input
              type="text"
              value={form.address || ""}
              onChange={(e) => set("address", e.target.value)}
              placeholder="تفاصيل العنوان"
              className="w-full px-3 py-2.5 rounded-lg bg-wood-950/50 border border-gold-500/20 text-gold-100 text-sm focus:border-gold-500/50 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gold-400 text-xs mb-1">ملاحظات</label>
            <textarea
              value={form.notes || ""}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="ملاحظات عن العميل..."
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg bg-wood-950/50 border border-gold-500/20 text-gold-100 text-sm focus:border-gold-500/50 focus:outline-none resize-none"
            />
          </div>

          {/* Read-only stats when editing */}
          {form.id && (
            <div className="p-3 rounded-lg border border-gold-500/10" style={{ background: "rgba(45,27,17,.3)" }}>
              <p className="text-gold-400/60 text-xs mb-2">إحصائيات العميل</p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-gold-400 font-bold">{form.totalOrders || 0}</p>
                  <p className="text-gold-100/30 text-[10px]">طلبات</p>
                </div>
                <div>
                  <p className="text-gold-400 font-bold">{(form.totalSpent || 0).toLocaleString()}</p>
                  <p className="text-gold-100/30 text-[10px]">ج.م مجموع</p>
                </div>
                <div>
                  <p className="text-gold-400 font-bold">{formatDateSimple(form.lastOrderAt)}</p>
                  <p className="text-gold-100/30 text-[10px]">آخر طلب</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-lg border border-gold-500/20 text-gold-300 text-sm">إلغاء</button>
          <button
            onClick={() => {
              if (!form.name.trim() || !form.phone.trim()) {
                alert("الاسم ورقم التليفون مطلوبين");
                return;
              }
              onSave(form);
            }}
            disabled={saving}
            className="flex-1 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg,#D4A44C,#A07020)", color: "#1A0F0A" }}
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {form.id ? "حفظ التعديلات" : "إضافة العميل"}
          </button>
        </div>
      </div>
    </div>
  );
}

function formatDateSimple(date: string | null): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("ar-EG", { month: "short", day: "numeric" });
}

// ===== Orders Tab =====
function OrdersTab() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders", { headers: adminHeaders() });
      const data = await res.json();
      if (data.error === "Unauthorized") { setOrders([]); return; }
      setOrders(Array.isArray(data.orders) ? data.orders : Array.isArray(data) ? data : []);
    } catch {
      setOrders([]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: number, status: string) => {
    setUpdatingId(id);
    try {
      await fetch(`/api/admin/orders/${id}`, {
        method: "PUT",
        headers: adminHeaders(),
        body: JSON.stringify({ status }),
      });
      await load();
    } catch {
      // ignore
    } finally {
      setUpdatingId(null);
    }
  };

  const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
    new: { label: "جديد", color: "text-blue-400", bg: "bg-blue-500/15 border-blue-500/30" },
    preparing: { label: "قيد التحضير", color: "text-yellow-400", bg: "bg-yellow-500/15 border-yellow-500/30" },
    shipped: { label: "تم الشحن", color: "text-purple-400", bg: "bg-purple-500/15 border-purple-500/30" },
    delivered: { label: "تم التوصيل", color: "text-green-400", bg: "bg-green-500/15 border-green-500/30" },
    cancelled: { label: "ملغي", color: "text-red-400", bg: "bg-red-500/15 border-red-500/30" },
  };

  const PAYMENT_MAP: Record<string, string> = {
    cash: "كاش",
    vodafone: "فودافون كاش",
    bank: "تحويل بنكي",
    card: "بطاقة",
  };

  const parseItems = (items: string) => {
    try {
      return typeof items === "string" ? JSON.parse(items) : items;
    } catch {
      return [];
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-gold-400" size={32} /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-gold-300">{orders.length} طلب</span>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBag size={48} className="text-gold-500/20 mx-auto mb-3" />
          <p className="text-gold-100/30">لا توجد طلبات بعد</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order: any) => {
            const items = parseItems(order.items);
            const statusInfo = STATUS_MAP[order.status] || STATUS_MAP.new;
            const isExpanded = expandedId === order.id;

            return (
              <div key={order.id} className="rounded-xl border border-gold-500/20 overflow-hidden" style={{ background: "rgba(45,27,17,.5)" }}>
                {/* Order Header */}
                <div className="p-4 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : order.id)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-playfair text-gold-400 font-bold text-sm">#{order.id}</span>
                      <span className="text-gold-300 text-sm font-semibold">{order.name}</span>
                      <span className="text-gold-100/40 text-xs" dir="ltr">{order.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gold-400 font-bold text-sm">{order.total.toLocaleString()} ج.م</span>
                      {isExpanded ? <ChevronUp size={16} className="text-gold-400/50" /> : <ChevronDown size={16} className="text-gold-400/50" />}
                    </div>
                  </div>

                  {/* Items preview */}
                  <div className="mt-2 text-gold-100/40 text-xs truncate">
                    {items.map((it: any) => `${it.name} (${it.size}) x${it.qty}`).join(" · ")}
                  </div>

                  {/* Date + Payment */}
                  <div className="flex items-center gap-3 mt-2 text-xs text-gold-100/30">
                    <span>{new Date(order.createdAt).toLocaleDateString("ar-EG", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                    <span>·</span>
                    <span>{PAYMENT_MAP[order.payment] || order.payment}</span>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-gold-500/10 p-4 space-y-3">
                    {/* Full Items List */}
                    <div className="space-y-1.5">
                      {items.map((it: any, idx: number) => (
                        <div key={idx} className="flex justify-between text-xs">
                          <span className="text-gold-100/60">
                            {it.name} ({it.size}) × {it.qty}
                          </span>
                          <span className="text-gold-300">{(it.price * it.qty).toLocaleString()} ج.م</span>
                        </div>
                      ))}
                      <div className="border-t border-gold-500/10 pt-1.5 mt-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-gold-100/40">المجموع</span>
                          <span className="text-gold-300">{order.subtotal.toLocaleString()} ج.م</span>
                        </div>
                        {order.discount > 0 && (
                          <div className="flex justify-between text-xs">
                            <span className="text-green-400">الخصم</span>
                            <span className="text-green-400">-{order.discount.toLocaleString()} ج.م</span>
                          </div>
                        )}
                        <div className="flex justify-between font-bold text-sm">
                          <span className="text-gold-400">الإجمالي</span>
                          <span className="text-gold-400">{order.total.toLocaleString()} ج.م</span>
                        </div>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="text-xs text-gold-100/40">
                      <span className="text-gold-400">📍 العنوان:</span> {order.address}
                    </div>

                    {/* Notes */}
                    {order.notes && (
                      <div className="text-xs text-gold-100/40">
                        <span className="text-gold-400">📝 ملاحظات:</span> {order.notes}
                      </div>
                    )}

                    {/* Status Selector */}
                    <div className="flex items-center gap-3 pt-2 border-t border-gold-500/10">
                      <span className="text-gold-400 text-xs font-semibold">الحالة:</span>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(STATUS_MAP).map(([key, info]) => {
                          const isActive = order.status === key;
                          return (
                            <button
                              key={key}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!isActive) updateStatus(order.id, key);
                              }}
                              disabled={updatingId === order.id}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                                isActive
                                  ? `${info.bg} ${info.color} border-current`
                                  : "border-gold-500/10 text-gold-100/30 hover:border-gold-500/30 hover:text-gold-100/50"
                              }`}
                            >
                              {updatingId === order.id && !isActive ? (
                                <Loader2 size={12} className="animate-spin inline" />
                              ) : (
                                info.label
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Status Badge (always visible) */}
                <div className="px-4 pb-3">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${statusInfo.bg} ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ===== General Tab =====
function GeneralTab() {
  const { refresh } = useSiteData();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/stats", { headers: adminHeaders() })
      .then((r) => r.json())
      .then((data) => { setStats(data); setLoading(false); })
      .catch(() => { setStats(null); setLoading(false); });
  }, []);

  const handleSeed = async () => {
    setSeeding(true);
    setSeedMsg("");
    try {
      const res = await fetch("/api/admin/stats", { method: "POST", headers: adminHeaders() });
      const data = await res.json();
      if (data.success) {
        setSeedMsg("✅ تمت تعبئة البيانات بنجاح!");
        // Refresh stats
        const statsRes = await fetch("/api/admin/stats", { headers: adminHeaders() });
        const statsData = await statsRes.json();
        setStats(statsData);
        refresh();
      } else {
        setSeedMsg("❌ " + (data.error || "فشل في تعبئة البيانات"));
      }
    } catch {
      setSeedMsg("❌ حدث خطأ");
    }
    setSeeding(false);
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-gold-400" size={32} /></div>;

  const dbEmpty = stats && stats.total === 0;
  const dbConnected = stats && stats.connected;

  return (
    <div className="space-y-6">
      {/* Database Status Card */}
      <div className={`p-4 rounded-xl border ${dbConnected ? "border-gold-500/20" : "border-red-500/30"}`} style={{ background: dbConnected ? "rgba(45,27,17,.5)" : "rgba(60,20,20,.3)" }}>
        <div className="flex items-center gap-2 mb-3">
          <Settings size={18} className={dbConnected ? "text-gold-400" : "text-red-400"} />
          <h3 className="font-playfair text-gold-300 font-bold text-sm">حالة قاعدة البيانات</h3>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${dbConnected ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
            {dbConnected ? "متصل ✓" : "غير متصل ✗"}
          </span>
        </div>

        {dbConnected && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-gold-400 font-bold text-lg">{stats?.products || 0}</p>
              <p className="text-gold-100/40 text-xs">منتجات</p>
            </div>
            <div className="text-center">
              <p className="text-gold-400 font-bold text-lg">{stats?.bundles || 0}</p>
              <p className="text-gold-100/40 text-xs">باقات</p>
            </div>
            <div className="text-center">
              <p className="text-gold-400 font-bold text-lg">{stats?.settings || 0}</p>
              <p className="text-gold-100/40 text-xs">إعدادات</p>
            </div>
            <div className="text-center">
              <p className="text-gold-400 font-bold text-lg">{stats?.orders || 0}</p>
              <p className="text-gold-100/40 text-xs">طلبات</p>
            </div>
            <div className="text-center">
              <p className="text-gold-400 font-bold text-lg">{stats?.customers || 0}</p>
              <p className="text-gold-100/40 text-xs">عملاء</p>
            </div>
            <div className="text-center">
              <p className="text-gold-400 font-bold text-lg">{stats?.turso ? "Turso ☁" : "محلي 📁"}</p>
              <p className="text-gold-100/40 text-xs">نوع القاعدة</p>
            </div>
          </div>
        )}

        {!dbConnected && stats?.error && (
          <p className="text-red-400/70 text-xs mt-2">خطأ: {stats.error}</p>
        )}
      </div>

      {/* Empty DB Warning + Seed Button */}
      {dbEmpty && (
        <div className="p-4 rounded-xl border border-yellow-500/30" style={{ background: "rgba(60,50,10,.3)" }}>
          <div className="flex items-center gap-2 mb-2">
            <Star size={18} className="text-yellow-400" />
            <h3 className="text-yellow-400 font-bold text-sm">قاعدة البيانات فاضية!</h3>
          </div>
          <p className="text-gold-100/50 text-sm mb-4">
            الموقع بيستخدم بيانات مُ presets من الكود. لو عايز تتحكم في البيانات من اللوحة دي،
            لازم تعبّئ قاعدة البيانات الأول.
          </p>
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="w-full py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg,#D4A44C,#A07020)", color: "#1A0F0A" }}
          >
            {seeding ? <Loader2 size={14} className="animate-spin" /> : <Package size={14} />}
            {seeding ? "جاري تعبئة البيانات..." : "تعبئة قاعدة البيانات بالبيانات الأساسية"}
          </button>
          {seedMsg && (
            <p className={`text-sm mt-2 ${seedMsg.startsWith("✅") ? "text-green-400" : "text-red-400"}`}>{seedMsg}</p>
          )}
        </div>
      )}

      {/* Force Re-seed (always available) */}
      {!dbEmpty && (
        <div className="p-4 rounded-xl border border-gold-500/20" style={{ background: "rgba(45,27,17,.5)" }}>
          <h3 className="font-playfair text-gold-300 font-bold text-sm mb-2">إعادة تعبئة البيانات</h3>
          <p className="text-gold-100/40 text-xs mb-3">
            هذا هيحذف كل البيانات الحالية ويعيدها تاني من البيانات الأساسية.
          </p>
          <button
            onClick={async () => {
              if (!confirm("متأكد؟ هيتم حذف كل البيانات وإعادة تعبئتها")) return;
              setSeeding(true);
              try {
                const res = await fetch("/api/admin/stats", { method: "POST", headers: adminHeaders() });
                const data = await res.json();
                if (data.success) {
                  const statsRes = await fetch("/api/admin/stats", { headers: adminHeaders() });
                  setStats(await statsRes.json());
                  refresh();
                  setSeedMsg("✅ تمت إعادة التعبئة بنجاح!");
                } else {
                  setSeedMsg("❌ فشل");
                }
              } catch {
                setSeedMsg("❌ حدث خطأ");
              }
              setSeeding(false);
            }}
            disabled={seeding}
            className="px-4 py-2 rounded-lg text-sm border border-gold-500/20 text-gold-400 hover:bg-gold-500/10 transition flex items-center gap-2"
          >
            {seeding ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            إعادة تعبئة
          </button>
          {seedMsg && (
            <p className={`text-sm mt-2 ${seedMsg.startsWith("✅") ? "text-green-400" : "text-red-400"}`}>{seedMsg}</p>
          )}
        </div>
      )}

      {/* Info */}
      <div className="p-4 rounded-xl border border-gold-500/10" style={{ background: "rgba(45,27,17,.3)" }}>
        <h3 className="font-playfair text-gold-300 font-bold text-sm mb-2">معلومات</h3>
        <div className="space-y-1 text-gold-100/40 text-xs">
          <p>• البيانات في لوحة التحكم بتتم جلبها من قاعدة البيانات</p>
          <p>• لو قاعدة البيانات فاضية، الموقع بيستخدم بيانات مُ presets من الكود</p>
          <p>• أي تغيير في الترسو بيظهر فوراً على الموقع</p>
          <p>• كلمة السر: الافتراضية 160835 (تقدر تغيرها من متغيرات البيئة)</p>
        </div>
      </div>
    </div>
  );
}

// ===== Reusable Components =====
function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-gold-400 text-xs mb-1">{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full px-3 py-2 rounded-lg bg-wood-950/50 border border-gold-500/20 text-gold-100 text-sm focus:border-gold-500/50 focus:outline-none" />
    </div>
  );
}

function ArrayField({ label, items, field, set }: { label: string; items: string[]; field: string; set: (k: string, v: any) => void }) {
  return (
    <div className="mt-3">
      <div className="flex items-center justify-between mb-1">
        <label className="text-gold-400 text-xs">{label}</label>
        <button onClick={() => set(field, [...items, ""])} className="text-gold-400 text-xs flex items-center gap-1"><Plus size={12} /></button>
      </div>
      <div className="flex flex-wrap gap-1">
        {items.map((item: string, i: number) => (
          <div key={i} className="flex items-center gap-1">
            <input value={item} onChange={(e) => {
              const arr = [...items];
              arr[i] = e.target.value;
              set(field, arr);
            }} className="w-20 px-2 py-1 rounded bg-wood-950/50 border border-gold-500/20 text-gold-100 text-xs" />
            <button onClick={() => set(field, items.filter((_: string, idx: number) => idx !== i))} className="text-red-400/50 hover:text-red-400"><X size={10} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ImageUploadButton({ onUploaded }: { onUploaded: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  return (
    <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gold-500/20 text-gold-400 text-sm cursor-pointer hover:bg-gold-500/10">
      <Upload size={14} />
      {uploading ? "..." : "رفع"}
      <input type="file" accept="image/*" onChange={async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        const url = await uploadFile(file);
        onUploaded(url);
        setUploading(false);
      }} className="hidden" />
    </label>
  );
}
