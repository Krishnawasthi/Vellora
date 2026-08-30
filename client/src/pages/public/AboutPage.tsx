import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen text-chocolate-950 dark:text-cream-50 font-inter antialiased">
      
      {/* ─────────────────────────────────────────────────────────────
          SINGLE UNIFIED 1100px EDITORIAL CONTAINER
      ────────────────────────────────────────────────────────────── */}
      <div className="max-w-[1100px] mx-auto px-6 sm:px-8 lg:px-12 py-10 sm:py-16">
        
        {/* ───────────────────────────────────────────────────────────
            1. HERO SECTION (Left-Aligned, Compact, Connected)
        ──────────────────────────────────────────────────────────── */}
        <section className="space-y-5 text-left pb-10 sm:pb-12">
          
          {/* Label */}
          <div className="text-[11px] font-sans font-bold tracking-[0.25em] text-amber-700 dark:text-amber-400 uppercase">
            ABOUT / VELLORA
          </div>

          {/* Headline Level 1 (64-76px on desktop) */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-[4.25rem] font-bold tracking-tight text-chocolate-950 dark:text-cream-50 leading-[1.1] max-w-4xl">
            A quiet place for thoughts that deserve to stay.
          </h1>

          {/* Hindi Tagline */}
          <p className="font-noto-serif-devanagari font-serif text-lg sm:text-2xl text-chocolate-800/90 dark:text-cream-200/90 italic leading-relaxed max-w-2xl pt-1">
            “यहाँ मैं अपने विचार, कहानियाँ और अनुभव साझा करता हूँ”
          </p>

          {/* Small Gold Decorative Line */}
          <div className="w-16 h-0.5 bg-amber-600/80 dark:bg-amber-400/80 rounded-full pt-1" />

        </section>

        {/* ───────────────────────────────────────────────────────────
            2. HORIZONTAL DIVIDER WITH CENTER GOLD MARK
        ──────────────────────────────────────────────────────────── */}
        <div className="relative flex items-center justify-center my-8 sm:my-10">
          <div className="w-full h-px bg-cream-300/80 dark:bg-chocolate-800/80" />
          <span className="absolute px-3 bg-cream-50 dark:bg-chocolate-950 text-amber-600 dark:text-amber-400 text-xs select-none">
            ✦
          </span>
        </div>

        {/* ───────────────────────────────────────────────────────────
            3. SECTION 01 — THE IDEA (12-Column Grid: 3 col / 7 col)
        ──────────────────────────────────────────────────────────── */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 py-8 sm:py-10 items-start">
          
          {/* Left Column: 3 cols */}
          <div className="md:col-span-3 space-y-1">
            <div className="text-[12px] font-sans font-bold tracking-[0.25em] text-amber-700 dark:text-amber-400 uppercase">
              01
            </div>
            <div className="text-[12px] font-sans font-bold tracking-[0.2em] text-chocolate-600 dark:text-cream-400 uppercase">
              THE IDEA
            </div>
          </div>

          {/* Right Column: 7 cols */}
          <div className="md:col-span-7 space-y-4">
            <p className="font-serif text-xl sm:text-2xl lg:text-[1.65rem] leading-[1.6] text-chocolate-950 dark:text-cream-50 font-normal antialiased">
              <span className="font-serif text-4xl sm:text-5xl font-bold text-chocolate-950 dark:text-cream-50 mr-2 float-left leading-none">
                I
              </span>
              n a digital landscape dominated by algorithmic feeds, notifications, and endless metrics, <strong className="font-semibold text-chocolate-950 dark:text-cream-50">Vellora</strong> was created as a peaceful antidote.
            </p>
            <p className="font-serif text-base sm:text-lg leading-[1.85] text-chocolate-900/90 dark:text-cream-100/90 antialiased">
              Most of the modern internet is built for rapid consumption—fleeting posts designed to vanish into feeds within hours. Vellora is intentionally built in reverse: a slow, distraction-free sanctuary where reflections, ideas, and stories are allowed to linger and be rediscovered at an unhurried pace.
            </p>
          </div>

          {/* Remaining 2 cols: Natural Whitespace */}
          <div className="hidden md:block md:col-span-2" />

        </section>

        {/* Divider */}
        <div className="w-full h-px bg-cream-300/60 dark:bg-chocolate-800/60 my-6 sm:my-8" />

        {/* ───────────────────────────────────────────────────────────
            4. SECTION 02 — THE JOURNAL (12-Column Grid: 3 col / 7 col)
        ──────────────────────────────────────────────────────────── */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 py-8 sm:py-10 items-start">
          
          {/* Left Column: 3 cols */}
          <div className="md:col-span-3 space-y-1">
            <div className="text-[12px] font-sans font-bold tracking-[0.25em] text-amber-700 dark:text-amber-400 uppercase">
              02
            </div>
            <div className="text-[12px] font-sans font-bold tracking-[0.2em] text-chocolate-600 dark:text-cream-400 uppercase">
              THE JOURNAL
            </div>
          </div>

          {/* Right Column: 7 cols */}
          <div className="md:col-span-7 space-y-5">
            <p className="font-serif text-base sm:text-lg leading-[1.85] text-chocolate-900 dark:text-cream-100 antialiased">
              This website is a personal digital journal. There are no social media like buttons, no follower counts, no comment threads, and no pop-ups asking for emails. It is simply a quiet corner of the internet where stories can live naturally.
            </p>

            {/* Hindi Reflection Block */}
            <div className="pt-4 space-y-2 border-l-2 border-amber-600/40 dark:border-amber-400/40 pl-5">
              <h2 className="font-noto-serif-devanagari font-serif text-lg sm:text-xl font-bold text-chocolate-950 dark:text-cream-50 leading-snug">
                अपनी कहानियाँ, विचार और अनुभव साझा करने की एक जगह
              </h2>
              <p className="font-noto-serif-devanagari font-serif text-base sm:text-[1.05rem] leading-[2.0] text-chocolate-900/90 dark:text-cream-100/90 antialiased">
                <strong className="font-semibold text-chocolate-950 dark:text-cream-50">Vellora</strong> एक personal writing space है जहाँ मैं अपनी कहानियाँ, विचार, यादें और जीवन के अनुभव लिखता और साझा करता हूँ। यहाँ मैं अपनी पसंद के अनुसार हिंदी, English या Hinglish में लिख सकता हूँ—यह जगह मेरे लिखे हुए शब्दों और यादों को एक साथ सुरक्षित रखने के लिए है।
              </p>
            </div>
          </div>

          {/* Remaining 2 cols */}
          <div className="hidden md:block md:col-span-2" />

        </section>

        {/* Divider */}
        <div className="w-full h-px bg-cream-300/60 dark:bg-chocolate-800/60 my-6 sm:my-8" />

        {/* ───────────────────────────────────────────────────────────
            5. SECTION 03 — THE PHILOSOPHY (12-Column Grid: 3 col / 7 col)
        ──────────────────────────────────────────────────────────── */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 py-8 sm:py-10 items-start">
          
          {/* Left Column: 3 cols */}
          <div className="md:col-span-3 space-y-1">
            <div className="text-[12px] font-sans font-bold tracking-[0.25em] text-amber-700 dark:text-amber-400 uppercase">
              03
            </div>
            <div className="text-[12px] font-sans font-bold tracking-[0.2em] text-chocolate-600 dark:text-cream-400 uppercase">
              THE PHILOSOPHY
            </div>
          </div>

          {/* Right Column: 7 cols */}
          <div className="md:col-span-7 space-y-6">
            <p className="font-serif text-base sm:text-lg leading-[1.85] text-chocolate-900 dark:text-cream-100 antialiased">
              Here, writing takes whatever form feels true—whether it is a short reflection on morning filter coffee, a longer essay on craft and attention, or a story written in Hindi (हिंदी) or Hinglish about a spontaneous weekend road trip.
            </p>

            {/* Three Quiet Principles */}
            <div className="space-y-4 pt-2">
              <div className="space-y-1">
                <h3 className="font-serif text-base sm:text-lg font-bold text-chocolate-950 dark:text-cream-50 flex items-center gap-2">
                  <span className="text-amber-600 dark:text-amber-400 text-xs">◆</span>
                  <span>Quiet Writing</span>
                </h3>
                <p className="text-sm sm:text-base text-chocolate-800/90 dark:text-cream-200/90 font-serif leading-relaxed pl-4">
                  Distraction-free typography designed for comfortable 10-minute long reads in both English and Hindi.
                </p>
              </div>

              <div className="space-y-1">
                <h3 className="font-serif text-base sm:text-lg font-bold text-chocolate-950 dark:text-cream-50 flex items-center gap-2">
                  <span className="text-amber-600 dark:text-amber-400 text-xs">◆</span>
                  <span>Owner Controlled</span>
                </h3>
                <p className="text-sm sm:text-base text-chocolate-800/90 dark:text-cream-200/90 font-serif leading-relaxed pl-4">
                  Only the site author can publish or manage stories. Public visitors browse freely with zero account hassle.
                </p>
              </div>

              <div className="space-y-1">
                <h3 className="font-serif text-base sm:text-lg font-bold text-chocolate-950 dark:text-cream-50 flex items-center gap-2">
                  <span className="text-amber-600 dark:text-amber-400 text-xs">◆</span>
                  <span>Pure Content</span>
                </h3>
                <p className="text-sm sm:text-base text-chocolate-800/90 dark:text-cream-200/90 font-serif leading-relaxed pl-4">
                  No advertisements, no tracking scripts, no commercial pressure—just pure words and memories.
                </p>
              </div>
            </div>
          </div>

          {/* Remaining 2 cols */}
          <div className="hidden md:block md:col-span-2" />

        </section>

        {/* Divider */}
        <div className="w-full h-px bg-cream-300/60 dark:bg-chocolate-800/60 my-6 sm:my-8" />

        {/* ───────────────────────────────────────────────────────────
            6. CLOSING STATEMENT & CALL TO ACTION
        ──────────────────────────────────────────────────────────── */}
        <section className="py-10 sm:py-14 text-left space-y-6">
          <blockquote className="max-w-2xl space-y-2">
            <p className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-chocolate-950 dark:text-cream-50 leading-tight">
              “Not everything needs to be shared quickly. Some thoughts deserve time.”
            </p>
          </blockquote>

          <div className="pt-2">
            <Link
              to="/stories"
              className="inline-flex items-center gap-2 text-sm sm:text-base font-serif font-bold text-chocolate-950 dark:text-cream-50 border-b border-chocolate-950 dark:border-cream-50 pb-0.5 hover:text-amber-700 dark:hover:text-amber-300 hover:border-amber-700 dark:hover:border-amber-300 transition-colors group"
            >
              <span>Explore the stories</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>

      </div>

    </div>
  );
};
