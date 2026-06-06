import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#1A0F0A" }}
    >
      <div className="text-center px-6">
        <p className="text-7xl mb-6">🧴</p>
        <h1 className="font-playfair text-4xl sm:text-5xl font-bold mb-3" style={{ color: "#D4A44C" }}>
          404
        </h1>
        <p
          className="text-lg sm:text-xl mb-2"
          style={{ color: "#FAEBD7" }}
        >
          الصفحة مش موجودة
        </p>
        <p className="text-sm mb-8" style={{ color: "rgba(250,235,215,0.5)" }}>
          الصفحة اللي بتدور عليها اتمسحت أو مش موجودة من الأساس
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-sm transition-all hover:scale-105"
          style={{
            background: "linear-gradient(135deg, #D4A44C, #A07020)",
            color: "#1A0F0A",
            boxShadow: "0 0 20px rgba(212,164,76,.3)",
          }}
        >
          الرجوع للرئيسية
        </Link>
      </div>
    </div>
  );
}
