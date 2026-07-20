"use client";

import React from "react";
import { useApp } from "../../context/AppContext";
import { Compass } from "lucide-react";

export default function About() {
  const { t } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-32 w-full flex-grow space-y-16">
      {/* Page Title & Intro */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight">
          {t("aboutTitle")}
        </h1>
        <p className="text-lg leading-relaxed font-semibold">
          {t("aboutIntro")}
        </p>
      </div>

      {/* History Section */}
      <section
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-t border-slate-300 dark:border-white pt-12"
      >
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-2xl font-black">
            {t("aboutHistoryTitle")}
          </h2>
          <p className="text-base leading-relaxed font-medium">
            {t("aboutHistoryText1")}
          </p>
          <p className="text-base leading-relaxed font-medium">
            {t("aboutHistoryText2")}
          </p>
          <p className="text-base leading-relaxed font-medium">
            {t("aboutHistoryText3")}
          </p>
        </div>

        {/* Photo */}
        <div className="lg:col-span-5 aspect-[4/3] w-full rounded-3xl relative overflow-hidden shadow-lg">
          <img
            src="/ambiental.jpg"
            alt="Zii Laser - Ambiente de trabalho"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-4 left-0 right-0 text-center text-white space-y-1">
            <div className="flex items-center justify-center gap-2">
              <Compass className="h-5 w-5 opacity-80" />
              <span className="font-extrabold text-base tracking-wide">DESDE 2026</span>
            </div>
            <p className="text-[10px] uppercase tracking-widest text-amber-200">LISBOA — PORTUGAL</p>
          </div>
        </div>
      </section>
    </div>
  );
}
