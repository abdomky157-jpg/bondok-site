import type { Metadata } from "next";
import { db } from "@/lib/db";
import { SITE_URL, LOGO_URL } from "@/lib/constants";
import ProductPageClient from "./ProductPageClient";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const productId = parseInt(id, 10);

  let product = null;
  try {
    product = await db.siteProduct.findUnique({ where: { id: productId } });
  } catch {
    // DB might not be available during build
  }

  if (!product) {
    return {
      title: "منتج غير موجود | Bondok Perfumes",
      description: "المنتج المطلوب غير موجود",
    };
  }

  const title = `${product.name} - ${product.ar} | Bondok Perfumes`;
  const description = `${product.ar} من ${product.brand} — ${product.desc || "عطر فاخر أصلي بأفضل الأسعار في مصر"}. اطلب الآن من بوندوك.`;
  const url = `${SITE_URL}/product/${product.id}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: "website",
      locale: "ar_EG",
      images: [
        {
          url: product.image || LOGO_URL,
          width: 600,
          height: 600,
          alt: `${product.name} - ${product.ar}`,
        },
      ],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [product.image || LOGO_URL],
    },
    alternates: {
      canonical: url,
    },
  };
}

export default function ProductPage({ params }: Props) {
  return <ProductPageClient params={params} />;
}
