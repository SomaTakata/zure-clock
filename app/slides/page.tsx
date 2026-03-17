"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

function pad2(value: number): string {
  return value.toString().padStart(2, "0");
}

function formatTime12(date: Date): { hh: string; mm: string; ampm: string } {
  const h24 = date.getHours();
  const h12 = h24 % 12 || 12;
  return {
    hh: `${h12}`,
    mm: pad2(date.getMinutes()),
    ampm: h24 >= 12 ? "PM" : "AM",
  };
}

export default function SlidesPage() {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const real = useMemo(() => formatTime12(now), [now]);
  const zure = useMemo(() => {
    const shifted = new Date(now.getTime() + 14 * 60 * 1000);
    return formatTime12(shifted);
  }, [now]);

  return (
    <main className="pitch-deck h-dvh snap-y snap-mandatory overflow-y-auto bg-white text-black font-['Helvetica_Neue',Helvetica,Arial,sans-serif]">
      <button
        type="button"
        onClick={() => window.print()}
        className="no-print fixed top-4 left-4 z-50 border border-black bg-white px-3 py-1 text-[10px] font-bold tracking-[0.18em] uppercase transition-colors hover:bg-black hover:text-white md:text-xs"
      >
        Export PDF
      </button>

      <section className="pitch-slide relative flex min-h-dvh snap-start flex-col items-center justify-center gap-8 px-6 py-10">
        <div className="text-center">
          <p className="text-xs font-bold tracking-[0.45em]">ZURE-CLOCK</p>
        </div>

        <div className="w-full max-w-5xl border-2 border-black bg-white p-6 md:p-8">
          <div className="mb-6 flex items-end justify-between border-b border-black pb-4">
            <p className="text-sm font-bold tracking-[0.25em]">PRIMARY CHRONOMETER</p>
            <p className="text-xs font-bold tracking-[0.2em]">SYSTEM LOCAL REFERENCE</p>
          </div>

          <div className="flex flex-col items-start gap-2">
            <div className="-ml-1 flex items-baseline text-[clamp(88px,16vw,200px)] leading-[0.9] font-bold tracking-[-0.08em]">
              <span>{real.hh}</span>
              <span className="animate-colon-blink">:</span>
              <span>{real.mm}</span>
            </div>
            <p className="ml-2 text-lg font-bold tracking-[0.25em]">{real.ampm}</p>
          </div>

          <div className="mt-8 h-px w-full bg-black" />
          <div className="mt-6 grid grid-cols-3 gap-3 text-[10px] font-bold tracking-[0.2em] md:text-xs">
            <p>DATE</p>
            <p>OFFSET</p>
            <p className="text-right">SECONDS TRACK</p>
          </div>
        </div>

        <div className="no-print absolute right-4 bottom-6 flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] md:right-6">
          <span>SCROLL</span>
          <ChevronDown size={14} />
        </div>
      </section>

      <section className="pitch-slide flex min-h-dvh snap-start flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-5xl border-2 border-black p-6 md:p-10">
          <h2 className="text-[clamp(30px,6vw,64px)] leading-[1.02] font-bold tracking-[-0.03em]">
            This clock is not real time.
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="border border-black p-6">
              <p className="text-xs font-bold tracking-[0.25em]">REAL TIME</p>
              <p className="mt-4 text-6xl font-bold tracking-[-0.05em]">10:00</p>
            </div>
            <div className="border border-black bg-black p-6 text-white">
              <p className="text-xs font-bold tracking-[0.25em]">ZURE-CLOCK</p>
              <p className="mt-4 text-6xl font-bold tracking-[-0.05em]">10:14</p>
            </div>
          </div>

          <p className="mt-8 text-base leading-relaxed md:text-lg">
            実はこの時計、本当の時間ではありません。<br />
            ランダムに10〜20分進んだ時間を表示しています。
          </p>
        </div>
      </section>

      <section className="pitch-slide flex min-h-dvh snap-start items-center justify-center px-6 py-12">
        <div className="w-full max-w-5xl border-2 border-black p-6 md:p-10">
          <h2 className="text-[clamp(28px,5.4vw,58px)] leading-[1.06] font-bold tracking-[-0.03em]">
            なぜ時計を進めても遅刻はなくならないのか
          </h2>

          <div className="mt-10 space-y-4 text-[clamp(20px,3.2vw,36px)] font-bold tracking-[-0.02em]">
            <p>時計 +5分</p>
            <p className="text-2xl">↓</p>
            <p>脳が慣れる</p>
            <p className="text-2xl">↓</p>
            <p>結局ギリギリ</p>
          </div>

          <div className="mt-10 inline-block border border-black bg-black px-4 py-2 text-xl font-bold text-white">
            人はズレに慣れる
          </div>
        </div>
      </section>

      <section className="pitch-slide flex min-h-dvh snap-start items-center justify-center px-6 py-12">
        <div className="w-full max-w-5xl border-2 border-black p-6 md:p-10">
          <h2 className="text-[clamp(30px,5.8vw,62px)] leading-[1.06] font-bold tracking-[-0.03em]">
            人間はズレを補正する
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-[1fr_auto_1fr] md:items-center">
            <div className="border border-black p-5">
              <p className="text-xs font-bold tracking-[0.22em]">表示</p>
              <p className="mt-2 text-4xl font-bold">10:05</p>
            </div>

            <p className="text-center text-2xl font-bold">≠</p>

            <div className="border border-black p-5">
              <p className="text-xs font-bold tracking-[0.22em]">実際</p>
              <p className="mt-2 text-4xl font-bold">10:00</p>
            </div>
          </div>

          <div className="mt-6 border border-black p-5">
            <p className="text-xs font-bold tracking-[0.22em]">脳の反応</p>
            <p className="mt-2 text-2xl font-bold">「まだ大丈夫」</p>
          </div>

          <p className="mt-8 text-2xl leading-snug font-bold">
            問題は時間ではなく、<br className="md:hidden" />人の行動です。
          </p>
        </div>
      </section>

      <section className="pitch-slide flex min-h-dvh snap-start items-center justify-center px-6 py-12">
        <div className="w-full max-w-5xl border-2 border-black p-6 md:p-10">
          <h2 className="text-[clamp(32px,6.2vw,68px)] leading-[1.03] font-bold tracking-[-0.03em]">
            時間をハックする
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-5 text-center md:grid-cols-3 md:items-center">
            <div className="border border-black p-6">
              <p className="text-xs font-bold tracking-[0.22em]">REAL TIME</p>
            </div>
            <div className="p-2 text-4xl font-bold">+</div>
            <div className="border border-black p-6">
              <p className="text-xs font-bold tracking-[0.22em]">RANDOM OFFSET</p>
            </div>
          </div>

          <p className="my-6 text-center text-3xl font-bold">↓</p>

          <div className="border border-black bg-black p-7 text-center text-white">
            <p className="text-[clamp(26px,4vw,42px)] font-bold tracking-widest">ZURE-CLOCK</p>
          </div>

          <div className="mt-8 flex items-center gap-3 text-lg font-bold md:text-2xl">
            <span className="border border-black px-3 py-1">10〜20分</span>
            <span className="border border-black bg-black px-3 py-1 text-white">ランダム</span>
          </div>
        </div>
      </section>

      <section className="pitch-slide flex min-h-dvh snap-start items-center justify-center px-6 py-12">
        <div className="w-full max-w-5xl border-2 border-black p-6 md:p-10">
          <h2 className="text-[clamp(32px,6vw,66px)] leading-[1.05] font-bold tracking-[-0.03em]">
            人の行動が変わる
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="border border-black p-6">
              <p className="text-xs font-bold tracking-[0.22em]">普通の時計</p>
              <p className="mt-4 text-4xl font-bold">9:59 到着</p>
              <p className="mt-2 text-sm font-bold tracking-[0.16em]">集合 10:00</p>
            </div>
            <div className="border border-black bg-black p-6 text-white">
              <p className="text-xs font-bold tracking-[0.22em]">ZURE CLOCK</p>
              <p className="mt-4 text-4xl font-bold">9:50 到着</p>
              <p className="mt-2 text-sm font-bold tracking-[0.16em]">集合 10:00</p>
            </div>
          </div>

          <div className="mt-8 space-y-2 text-2xl font-bold leading-tight">
            <p>「もう10時かもしれない」</p>
            <p>↓</p>
            <p>早く家を出る</p>
          </div>
        </div>
      </section>

      <section className="pitch-slide flex min-h-dvh snap-start items-center justify-center bg-black px-6 py-12 text-white">
        <div className="w-full max-w-4xl text-center">
          <p className="text-[clamp(40px,10vw,120px)] leading-none font-bold tracking-[0.12em]">ZURE-CLOCK</p>
          <p className="mt-10 text-[clamp(26px,4.8vw,58px)] leading-tight font-bold">
            時間ではなく<br />
            行動を変える時計
          </p>
          <p className="mt-12 text-sm font-bold tracking-[0.35em] uppercase opacity-90">Hack Your Time</p>
        </div>
      </section>

      <div className="no-print pointer-events-none fixed top-4 right-4 z-40 border border-black bg-white/90 px-3 py-1 text-[10px] font-bold tracking-[0.18em] md:text-xs">
        90s PITCH / 7 SLIDES
      </div>

      <div className="no-print pointer-events-none fixed left-4 bottom-4 z-40 border border-black bg-white/90 px-3 py-1 text-[10px] font-bold tracking-[0.15em] md:text-xs">
        LIVE NOW {real.hh}:{real.mm} {real.ampm} / ZURE {zure.hh}:{zure.mm}
      </div>
    </main>
  );
}