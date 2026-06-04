"use client";

import { useState } from "react";
import { X, Star } from "lucide-react";
import { quizQuestions, TYPE_DESCRIPTIONS } from "@/data/quiz";
import { products, TYPE_AR } from "@/data/products";
import { useBondokStore } from "@/store/bondok";
import { useScrollLock } from "@/hooks/useScrollLock";
export default function QuizModal() {
  const quizOpen = useBondokStore((s) => s.quizOpen);
  const setQuizOpen = useBondokStore((s) => s.setQuizOpen);
  const setCategoryFilter = useBondokStore((s) => s.setCategoryFilter);
  const setSelectedProduct = useBondokStore((s) => s.setSelectedProduct);
  useScrollLock(quizOpen);

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number[]>>({});
  const [selected, setSelected] = useState<number[]>([]);
  const [result, setResult] = useState<string | null>(null);

  const q = quizQuestions[step];

  const handleSelect = (idx: number) => {
    if (!q.m) {
      setSelected([idx]);
    } else {
      setSelected((prev) =>
        prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
      );
    }
  };

  const nextStep = () => {
    if (selected.length === 0) return;
    const newAnswers = { ...answers, [step]: selected.map((i) => q.o[i].v).flat() };
    setAnswers(newAnswers);
    setSelected([]);
    if (step < quizQuestions.length - 1) {
      setStep(step + 1);
    } else {
      // Calculate result
      const counts: Record<string, number> = {};
      Object.values(newAnswers)
        .flat()
        .forEach((v) => {
          if (["woody", "floral", "oriental", "fresh", "spicy", "sweet"].includes(v)) {
            counts[v] = (counts[v] || 0) + 1;
          }
        });
      const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
      setResult(sorted[0]?.[0] || "woody");
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
      const prevQ = quizQuestions[step - 1];
      const prevAns = answers[step - 1] || [];
      const prevSelected = prevQ.o.findIndex((o) => prevAns.includes(o.v[0]));
      setSelected(prevSelected >= 0 ? [prevSelected] : []);
    }
  };

  const resetQuiz = () => {
    setStep(0);
    setAnswers({});
    setSelected([]);
    setResult(null);
  };

  const handleClose = () => {
    setQuizOpen(false);
    resetQuiz();
  };

  if (!quizOpen) return null;

  const recommended = result
    ? products.filter((p) => p.t === result).slice(0, 3)
    : [];

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,.8)", backdropFilter: "blur(5px)" }}
      tabIndex={-1}
      onClick={handleClose}
      onKeyDown={(e) => { if (e.key === "Escape") { handleClose(); } }}
    >
      <div
        className="rounded-2xl max-w-[650px] w-full max-h-[90vh] overflow-y-auto p-8"
        style={{
          background: "linear-gradient(135deg,#2D1B11,#1A0F0A)",
          border: "1px solid rgba(212,164,76,.3)",
        }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="اختبار العطور"
      >
        {result ? (
          /* RESULT */
          <div className="text-center">
            <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: "linear-gradient(135deg,rgba(212,164,76,.2),rgba(160,112,32,.2))" }}>
              <Star size={40} className="text-gold-400" />
            </div>
            <h3 className="font-playfair text-2xl font-bold gold-shimmer mb-2">عائلتك العطرية:</h3>
            <h2 className="font-playfair text-4xl font-bold text-gold-400 mb-4">{TYPE_AR[result]}</h2>
            <p className="text-gold-100/60 text-sm mb-6">{TYPE_DESCRIPTIONS[result] || TYPE_DESCRIPTIONS.woody}</p>
            <div className="orn-div max-w-xs mx-auto mb-6">
              <span className="text-gold-500">✦</span>
            </div>
            <p className="font-playfair text-gold-300 font-semibold mb-4">🎯 العطور المقترحة:</p>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {recommended.map((p) => (
                <div
                  key={p.id}
                  onClick={() => { handleClose(); setSelectedProduct(p); }}
                  className="cursor-pointer rounded-xl gold-border overflow-hidden hover:shadow-[0_0_15px_rgba(212,164,76,.2)] transition-all"
                >
                  <img src={p.img} className="w-full aspect-square object-cover" alt={p.name} loading="lazy" />
                  <div className="p-2">
                    <p className="font-playfair text-gold-300 text-xs font-semibold truncate">{p.name}</p>
                    <p className="text-gold-400 text-[10px]">{p.sz[0].p.toLocaleString()} ج</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => { handleClose(); setCategoryFilter(result); setTimeout(() => document.getElementById("prod")?.scrollIntoView({ behavior: "smooth" }), 100); }}
              className="px-8 py-3 bg-gradient-to-l from-gold-500 to-gold-700 text-wood-950 font-bold rounded-full transition-all"
            >
              شوف كل عطور {TYPE_AR[result]}
            </button>
          </div>
        ) : (
          /* QUESTIONS */
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gold-400 text-xs">السؤال {step + 1} من {quizQuestions.length}</p>
              <button onClick={handleClose} className="text-gold-500/50 hover:text-gold-400">
                <X size={20} />
              </button>
            </div>
            <div className="w-full h-1 rounded-full bg-gold-500/10 mb-8">
              <div
                className="h-full rounded-full bg-gradient-to-l from-gold-500 to-gold-700 transition-all"
                style={{ width: `${(step / quizQuestions.length) * 100}%` }}
              />
            </div>
            <div className="text-center mb-8">
              <Star size={36} className="text-gold-400 mb-3 mx-auto" />
              <h3 className="font-playfair text-2xl font-bold text-gold-300">{q.q}</h3>
              {q.m && <p className="text-gold-100/40 text-xs mt-1">اختار أكتر من واحد</p>}
            </div>
            <div className="space-y-3 mb-8">
              {q.o.map((o, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  className={`qo w-full text-right p-4 rounded-xl border text-gold-200 transition-all ${
                    selected.includes(i)
                      ? "sel border-gold-500/50 bg-gold-500/15"
                      : "border-gold-500/20 hover:bg-gold-500/10 hover:border-gold-500/40"
                  }`}
                >
                  {o.t}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              {step > 0 && (
                <button
                  onClick={prevStep}
                  className="px-6 py-3 rounded-xl border border-gold-500/30 text-gold-400 hover:bg-gold-500/10 transition"
                >
                  السابق
                </button>
              )}
              <button
                onClick={nextStep}
                className="flex-1 py-3 bg-gradient-to-l from-gold-500 to-gold-700 text-wood-950 font-bold rounded-xl transition-all"
              >
                {step < quizQuestions.length - 1 ? "التالي" : "اعرف نتيجتك 🎯"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
