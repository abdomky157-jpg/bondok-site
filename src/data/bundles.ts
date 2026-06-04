export interface Bundle {
  id: number;
  name: string;
  icon: string;
  price: number;
  desc: string;
  items: string[];
}

export const bundles: Bundle[] = [
  {
    id: 1,
    name: "باقة الصحاب",
    icon: "mdi:account-group",
    price: 1500,
    desc: "3 عطور رجالية للإهداء",
    items: ["Versace Eros 30ml", "Dior Sauvage 30ml", "Bvlgari 30ml"],
  },
  {
    id: 2,
    name: "باقة العرايس",
    icon: "mdi:crown",
    price: 3500,
    desc: "عطر فاخر + لوشن + شمعة",
    items: ["Chanel No.5 50ml", "Body Lotion 200ml", "شمعة فاخرة"],
  },
  {
    id: 3,
    name: "باقة الجامعة",
    icon: "mdi:school",
    price: 1200,
    desc: "عطر منعش لليوم الدراسي",
    items: ["Acqua di Gio 30ml", "Light Blue 30ml"],
  },
  {
    id: 4,
    name: "باقة الديت",
    icon: "mdi:heart-multiple",
    price: 4000,
    desc: "رجالي + نسائي - الثنائي المثالي",
    items: ["Dior Sauvage 50ml", "YSL Libre 50ml"],
  },
  {
    id: 5,
    name: "باقة المكتب",
    icon: "mdi:office-building",
    price: 2200,
    desc: "عطور رسمية هادية للعمل",
    items: ["Bleu de Chanel 50ml", "Acqua di Gio 50ml"],
  },
  {
    id: 6,
    name: "باقة الشتاء",
    icon: "mdi:snowflake",
    price: 5000,
    desc: "عطور دافئة لليالي الشتاء",
    items: ["Oud Wood 50ml", "La Vie Est Belle 50ml"],
  },
];
