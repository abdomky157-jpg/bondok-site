export default function ProductLoading() {
  return (
    <div
      className="min-h-screen flex items-center justify-center pt-20"
      style={{ background: "#1A0F0A" }}
    >
      <div className="text-center">
        <div
          className="w-10 h-10 border-3 rounded-full mx-auto mb-4 animate-spin"
          style={{ borderColor: "rgba(212,164,76,.2)", borderTopColor: "#D4A44C" }}
        />
        <p className="text-sm" style={{ color: "rgba(250,235,215,0.5)" }}>
          جاري تحميل المنتج...
        </p>
      </div>
    </div>
  );
}
