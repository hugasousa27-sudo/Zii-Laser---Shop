"use client";

import React from "react";
import { useApp } from "../../context/AppContext";
import { Award, Compass, Heart, Users, Target, Eye, ShieldCheck, Flame } from "lucide-react";

export default function About() {
  const { t } = useApp();

  const valuesList = [
    {
      icon: <Award className="h-6 w-6 text-indigo-500" />,
      titleKey: "value1Title",
      textKey: "value1Text"
    },
    {
      icon: <Flame className="h-6 w-6 text-indigo-500" />,
      titleKey: "value2Title",
      textKey: "value2Text"
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-indigo-500" />,
      titleKey: "value3Title",
      textKey: "value3Text"
    },
    {
      icon: <Users className="h-6 w-6 text-indigo-500" />,
      titleKey: "value4Title",
      textKey: "value4Text"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-grow space-y-16">
      {/* Page Title & Intro */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 dark:text-slate-50">
          {t("aboutTitle")}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">
          {t("aboutIntro")}
        </p>
      </div>

      {/* History Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-t border-slate-200 dark:border-slate-800/80 pt-12">
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-2xl font-black text-slate-950 dark:text-slate-50">
            {t("aboutHistoryTitle")}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {t("aboutHistoryText1")}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {t("aboutHistoryText2")}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {t("aboutHistoryText3")}
          </p>
        </div>
        
        {/* Mock Graphic Frame */}
        <div className="lg:col-span-5 aspect-[4/3] w-full bg-gradient-to-tr from-indigo-500 to-indigo-700 rounded-3xl relative overflow-hidden shadow-lg flex items-center justify-center p-8 select-none">
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative text-center text-white space-y-2">
            <Compass className="h-14 w-14 mx-auto animate-pulse-slow opacity-80" />
            <h3 className="font-extrabold text-xl">DESDE 2026</h3>
            <p className="text-[10px] uppercase tracking-widest text-indigo-200">LISBOA - PORTUGAL</p>
          </div>
        </div>
      </section>

      {/* Mission & Vision Row */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-200 dark:border-slate-800/80 pt-12">
        {/* Mission Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-sm space-y-4 hover:shadow-md transition-shadow">
          <div className="bg-indigo-50 dark:bg-slate-950 text-indigo-600 dark:text-indigo-400 w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner">
            <Target className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-950 dark:text-slate-50">
            {t("aboutMissionTitle")}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {t("aboutMissionText")}
          </p>
        </div>

        {/* Vision Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-sm space-y-4 hover:shadow-md transition-shadow">
          <div className="bg-indigo-50 dark:bg-slate-950 text-indigo-600 dark:text-indigo-400 w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner">
            <Eye className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-950 dark:text-slate-50">
            {t("aboutVisionTitle")}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {t("aboutVisionText")}
          </p>
        </div>
      </section>

      {/* Values Grid */}
      <section className="border-t border-slate-200 dark:border-slate-800/80 pt-12 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-slate-950 dark:text-slate-50">
            {t("aboutValuesTitle")}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-450 max-w-lg mx-auto">
            Guiamo-nos por pilares sólidos para proporcionar a melhor experiência possível a cada cliente.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {valuesList.map((val, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-1 transition-all duration-300 space-y-3"
            >
              <div className="bg-indigo-50/50 dark:bg-slate-950/50 p-2.5 rounded-xl w-fit">
                {val.icon}
              </div>
              <h3 className="font-extrabold text-sm text-slate-950 dark:text-slate-50">
                {t(val.titleKey)}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {t(val.textKey)}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
