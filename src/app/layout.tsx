import type { Metadata } from "next";
import { Tajawal, Playfair_Display, Amiri } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { LOGO_URL, SITE_URL, DEFAULT_WHATSAPP } from "@/lib/constants";

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bondok Perfumes | عطور فاخرة أصلية - أفضل الأسعار في مصر",
  description:
    "Bondok Perfumes - وجهتك المثالية لعالم العطور الفاخرة. أكثر من 500 عطر أصلي من أشهر الماركات العالمية بأفضل الأسعار. التوصيل لجميع محافظات مصر. كاش عند الاستلام.",
  keywords: [
    "عطور",
    "برفانات",
    "عطور فاخرة",
    "عطور أصلية",
    "Bondok Perfumes",
    "عطور رجالي",
    "عطور نسائي",
    "أفضل عطور",
    "عطور مصر",
    "تسوق عطور",
    "برفانات أصلية",
    "عطور فرنسية",
    "عطور الماركات",
  ],
  authors: [{ name: "Bondok Perfumes" }],
  creator: "Bondok Perfumes",
  publisher: "Bondok Perfumes",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: LOGO_URL,
    apple: LOGO_URL,
  },
  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: SITE_URL,
    siteName: "Bondok Perfumes",
    title: "Bondok Perfumes | عطور فاخرة أصلية",
    description:
      "وجهتك المثالية لعالم العطور الفاخرة. أكثر من 500 عطر أصلي بأفضل الأسعار في مصر.",
    images: [
      {
        url: LOGO_URL,
        width: 200,
        height: 200,
        alt: "Bondok Perfumes Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Bondok Perfumes | عطور فاخرة",
    description: "أكثر من 500 عطر أصلي بأفضل الأسعار. التوصيل لجميع محافظات مصر.",
    images: [LOGO_URL],
  },
  alternates: {
    canonical: SITE_URL,
  },
  category: "Shopping",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "Bondok Perfumes",
    description: "وجهتك المثالية لعالم العطور الفاخرة",
    url: SITE_URL,
    logo: LOGO_URL,
    telephone: DEFAULT_WHATSAPP,
    address: {
      "@type": "PostalAddress",
      addressLocality: "الاسكندرية",
      addressCountry: "EG",
    },
    priceRange: "EGP",
    currency: "EGP",
    paymentAccepted: "Cash, Vodafone Cash, Bank Transfer",
    areaServed: {
      "@type": "Country",
      name: "مصر",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "عطور فاخرة",
      description: "تشكيلة واسعة من العطور الأصلية",
    },
  };

  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#1A0F0A" />
        <meta name="color-scheme" content="dark" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${tajawal.variable} ${playfair.variable} ${amiri.variable} antialiased`}
        style={{ fontFamily: "'Tajawal', sans-serif", background: "#1a0f0a", color: "#FAEBD7" }}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
