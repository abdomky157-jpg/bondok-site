"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#1A0F0A" }}
    >
      <div className="text-center px-6">
        <p className="text-6xl mb-6">⚠️</p>
        <h1 className="font-playfair text-3xl font-bold mb-3" style={{ color: "#D4A44C" }}>
          حدث خطأ
        </h1>
        <p className="text-sm mb-2" style={{ color: "rgba(250,235,215,0.5)" }}>
          {error.message || "حصل مشكلة غير متوقعة"}
        </p>
        <p className="text-xs mb-6" style={{ color: "rgba(250,235,215,0.3)" }}>
          {error.digest && `Error ID: ${error.digest}`}
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-sm transition-all hover:scale-105 mr-2"
          style={{
            background: "linear-gradient(135deg, #D4A44C, #A07020)",
            color: "#1A0F0A",
          }}
        >
          حاول مرة تانية
        </button>
        <a
          href="/"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-sm transition-all hover:scale-105 border"
          style={{
            borderColor: "rgba(212,164,76,.3)",
            color: "#D4A44C",
          }}
        >
          الرجوع للرئيسية
        </a>
      </div>
    </div>
  );
}
