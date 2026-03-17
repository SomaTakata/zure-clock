"use client";

import { Option } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

const TICK_SPACING = 30;
const RANDOM_MIN_OFFSET = 10;
const RANDOM_MAX_OFFSET = 20;
const OFFSET_REFRESH_WINDOW_MS = 10 * 60 * 1000;
const RANDOM_AHEAD_ENABLED_STORAGE_KEY = "zure-clock:random-ahead-enabled";

function getRandomOffsetMinutes(): number {
  return Math.floor(Math.random() * (RANDOM_MAX_OFFSET - RANDOM_MIN_OFFSET + 1)) + RANDOM_MIN_OFFSET;
}

function formatUtcOffset(date: Date): string {
  const totalMinutes = -date.getTimezoneOffset();
  const sign = totalMinutes >= 0 ? "+" : "-";
  const absMinutes = Math.abs(totalMinutes);
  const hours = Math.floor(absMinutes / 60)
    .toString()
    .padStart(2, "0");
  const minutes = (absMinutes % 60).toString().padStart(2, "0");

  return `UTC${sign}${hours}:${minutes} Standard`;
}

export default function Home() {
  const [now, setNow] = useState<Date>(() => new Date());
  const [trackWidth, setTrackWidth] = useState(0);
  const [isOptionCardOpen, setIsOptionCardOpen] = useState(false);
  const [isRandomAheadEnabled, setIsRandomAheadEnabled] = useState<boolean>(() => {
    if (typeof window === "undefined") {
      return true;
    }

    try {
      const saved = window.localStorage.getItem(RANDOM_AHEAD_ENABLED_STORAGE_KEY);
      return saved === null ? true : saved === "enabled";
    } catch {
      return true;
    }
  });
  const [randomAheadMinutes, setRandomAheadMinutes] = useState<number>(() => getRandomOffsetMinutes());
  const lastWindowRef = useRef<number | null>(null);
  const optionCardWrapperRef = useRef<HTMLDivElement | null>(null);

  const handleToggleRandomAhead = () => {
    setIsRandomAheadEnabled((prev) => {
      const next = !prev;

      try {
        window.localStorage.setItem(
          RANDOM_AHEAD_ENABLED_STORAGE_KEY,
          next ? "enabled" : "disabled",
        );
      } catch {
        // Ignore storage errors (e.g. privacy mode restrictions).
      }

      return next;
    });
  };

  useEffect(() => {
    let frameId = 0;

    const loop = () => {
      setNow(new Date());
      frameId = requestAnimationFrame(loop);
    };

    loop();
    return () => cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    const updateTrackWidth = () => {
      setTrackWidth(window.innerWidth - 48);
    };

    updateTrackWidth();
    window.addEventListener("resize", updateTrackWidth);

    return () => window.removeEventListener("resize", updateTrackWidth);
  }, []);

  useEffect(() => {
    const syncOffsetWindow = () => {
      const windowKey = Math.floor(Date.now() / OFFSET_REFRESH_WINDOW_MS);

      if (lastWindowRef.current !== windowKey) {
        lastWindowRef.current = windowKey;
        setRandomAheadMinutes(getRandomOffsetMinutes());
      }
    };

    syncOffsetWindow();
    const intervalId = window.setInterval(syncOffsetWindow, 15_000);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const handleOutsidePointer = (event: MouseEvent | TouchEvent) => {
      if (!isOptionCardOpen) {
        return;
      }

      const wrapper = optionCardWrapperRef.current;
      const target = event.target as Node | null;

      if (wrapper && target && !wrapper.contains(target)) {
        setIsOptionCardOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsidePointer);
    document.addEventListener("touchstart", handleOutsidePointer);

    return () => {
      document.removeEventListener("mousedown", handleOutsidePointer);
      document.removeEventListener("touchstart", handleOutsidePointer);
    };
  }, [isOptionCardOpen]);

  const ticks = useMemo(() => {
    return Array.from({ length: 240 }, (_, idx) => {
      const second = idx % 60;
      return second.toString().padStart(2, "0");
    });
  }, []);

  const displayNow = useMemo(() => {
    if (!isRandomAheadEnabled) {
      return now;
    }

    return new Date(now.getTime() + randomAheadMinutes * 60 * 1000);
  }, [isRandomAheadEnabled, now, randomAheadMinutes]);

  const hours24 = displayNow.getHours();
  const minutes = displayNow.getMinutes().toString().padStart(2, "0");
  const hours12 = hours24 % 12 || 12;
  const ampm = hours24 >= 12 ? "PM" : "AM";

  const totalSeconds = displayNow.getSeconds() + displayNow.getMilliseconds() / 1000;
  const currentPos = -(totalSeconds * TICK_SPACING) + trackWidth / 2;

  const dateString = displayNow.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="h-dvh w-screen overflow-hidden bg-white p-6 pb-24 text-black font-['Helvetica_Neue',Helvetica,Arial,sans-serif]">
      <header className="flex items-center justify-between border-b-2 border-black pb-6">
        <div className="text-[42px] leading-none font-bold tracking-[-1.5px]">ZURE-CLOCK</div>
        <div ref={optionCardWrapperRef} className="group relative">
          <button
            type="button"
            aria-label="Random ahead clock options"
            aria-expanded={isOptionCardOpen}
            aria-haspopup="dialog"
            onClick={() => setIsOptionCardOpen((prev) => !prev)}
            className={`relative flex h-8 w-10 cursor-pointer items-center justify-center border transition-all duration-200 ${
              isRandomAheadEnabled
                ? "border-black bg-black text-white"
                : "border-transparent hover:border-black/20"
            }`}
          >
            <Option size={18} strokeWidth={2} />
            {isRandomAheadEnabled ? (
              <span
                className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full border border-white bg-black"
                aria-hidden="true"
              />
            ) : null}
          </button>

          <div
            className={`absolute top-10 right-0 z-30 w-90 border border-black bg-white p-4 transition-all duration-200 ${
              isOptionCardOpen
                ? "pointer-events-auto translate-y-0 opacity-100"
                : "pointer-events-none translate-y-1 opacity-0 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100"
            }`}
          >
            <p className="text-[11px] leading-[1.45]">
              You can use a clock that displays a time randomly set 10–20 minutes ahead of
              the actual time. The time offset changes randomly every 10 minutes, preventing
              users from getting used to it or calculating the real time, and naturally
              encouraging actions that help avoid being late.
            </p>

            <div className="my-3 h-px w-full bg-black" />

            <div className="space-y-2 text-[11px] leading-normal">
              <div>
                <p className="font-bold">ランダム進み時計</p>
                <p>表示される時刻は、実際の時間より10〜20分進んだ時間になります。</p>
              </div>
              <div>
                <p className="font-bold">自動ランダム更新</p>
                <p>進み幅は10分ごとにランダムで変更されます。</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 border-t border-black pt-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.45px]">
                {isRandomAheadEnabled
                  ? `In Use (+${randomAheadMinutes} min)`
                  : "この機能を使うことができる"}
              </p>
              <button
                type="button"
                onClick={handleToggleRandomAhead}
                className="border border-black px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.45px] transition-colors hover:bg-black hover:text-white"
              >
                {isRandomAheadEnabled ? "Disable" : "Enable"}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col pt-6">
        <div className="relative mb-6">
          <div className="-ml-1.5 flex items-baseline text-[clamp(90px,20vw,120px)] leading-[0.9] font-bold tracking-[-6px]">
            <span>{hours12}</span>
            <span className="animate-colon-blink">:</span>
            <span>{minutes}</span>
          </div>
          <div className="ml-3 text-base font-bold tracking-[0.5px] uppercase">{ampm}</div>
        </div>

        <div className="mb-6 h-px w-full origin-left bg-black" />

        <div className="mb-6 grid grid-cols-1 gap-4">
          <div className="flex flex-col gap-1">
            <div className="text-[13px] font-bold uppercase">Primary Chronometer</div>
            <div className="text-base leading-[1.4] font-normal">System Local Reference</div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-[13px] font-bold uppercase">Date:</div>
            <div className="text-base leading-[1.4] font-normal">{dateString}</div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-[13px] font-bold uppercase">Offset:</div>
            <div className="text-base leading-[1.4] font-normal">{formatUtcOffset(now)}</div>
          </div>
        </div>

        <div className="relative mb-6 h-20 w-full overflow-hidden border border-black">
          <div className="absolute top-1/2 left-1/2 z-10 h-full w-0.5 -translate-x-1/2 -translate-y-1/2 bg-black" />
          <div
            className="absolute top-1/2 left-0 flex w-[200%] -translate-y-1/2 items-center"
            style={{ transform: `translate(${currentPos}px, -50%)` }}
          >
            {ticks.map((sec, idx) => (
              <div key={`${sec}-${idx}`} className="relative mr-7.25 h-5 w-px bg-black">
                <span className="absolute top-1/2 -left-1.5 -translate-y-1/2 text-[10px] font-bold">
                  {sec}
                </span>
              </div>
            ))}
          </div>
        </div>
        <footer className="fixed right-0 bottom-0 left-0 z-20 flex justify-end border-t border-black bg-white px-6 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <Link
            href="/slides"
            className="group inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.45px] uppercase"
            aria-label="Open ZURE-CLOCK slides"
          >
            <span className="inline-block h-px w-6 bg-black transition-all duration-300 group-hover:w-9" />
            <span>ZURE-CLOCK Slides</span>
            <span className="text-[13px] leading-none transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
              ↗
            </span>
          </Link>
        </footer>

      </div>
    </div>
  );
}
