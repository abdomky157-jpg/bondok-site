import { z } from "zod/v4";

// ─── Product Validation ──────────────────────────────────────────
export const sizeSchema = z.array(
  z.object({
    label: z.string(),
    volume: z.string(),
    price: z.number().int().min(0).max(100000),
  })
);

export const productCreateSchema = z.object({
  name: z.string().min(1, "اسم المنتج مطلوب").max(200),
  ar: z.string().min(1, "الاسم العربي مطلوب").max(200),
  brand: z.string().min(1, "الماركة مطلوبة").max(100),
  gender: z.enum(["men", "women", "unisex"]).default("men"),
  type: z.string().max(50).default("fresh"),
  sizes: sizeSchema.default([]),
  image: z.string().max(50000, "الصورة كبيرة جداً").default(""),
  badge: z.string().max(50).default(""),
  longevity: z.number().int().min(1).max(10).default(7),
  sillage: z.number().int().min(1).max(10).default(7),
  topNotes: z.array(z.string()).default([]),
  heartNotes: z.array(z.string()).default([]),
  baseNotes: z.array(z.string()).default([]),
  occasions: z.array(z.string()).default([]),
  seasons: z.array(z.string()).default([]),
  desc: z.string().max(5000).default(""),
  top: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
  active: z.boolean().default(true),
});

export const productUpdateSchema = productCreateSchema.partial();

// ─── Bundle Validation ───────────────────────────────────────────
export const bundleCreateSchema = z.object({
  name: z.string().min(1, "اسم الباقة مطلوب").max(200),
  icon: z.string().max(100).default(""),
  price: z.number().int().min(0).max(1000000),
  desc: z.string().max(2000).default(""),
  items: z.array(z.string()).default([]),
  order: z.number().int().min(0).default(0),
  active: z.boolean().default(true),
});

export const bundleUpdateSchema = bundleCreateSchema.partial();

// ─── Settings Validation ──────────────────────────────────────────
export const settingSchema = z.object({
  key: z.string().min(1).max(100),
  value: z.string().max(10000),
});

export const settingsBatchSchema = z.record(
  z.string().min(1).max(100),
  z.string().max(10000)
);

// ─── Order Validation ───────────────────────────────────────────
export const orderItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  size: z.string().min(1),
  price: z.number().min(0).max(100000),
  qty: z.number().int().min(1).max(100),
});

export const orderCreateSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب").max(200),
  phone: z.string().min(10, "رقم التليفون غير صحيح").max(20),
  address: z.string().min(5, "العنوان مطلوب").max(500),
  notes: z.string().max(2000).default(""),
  items: z.array(orderItemSchema).min(1, "الطلب يحتوي على منتج واحد على الأقل"),
  discountCode: z.string().max(50).optional().nullable(),
  payment: z.enum(["cash", "vodafone", "bank", "card"]).default("cash"),
});

// ─── Auth Validation ────────────────────────────────────────────
export const authSchema = z.object({
  password: z.string().min(1, "كلمة المرور مطلوبة").max(200),
});

// ─── Helper: validate and return error or parsed data ────────────
export function validateBody<T>(schema: z.ZodType<T>, body: unknown): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(body);
  if (!result.success) {
    const firstError = result.error.issues?.[0];
    const message = firstError ? firstError.message : "بيانات غير صحيحة";
    return { success: false, error: message };
  }
  return { success: true, data: result.data };
}
