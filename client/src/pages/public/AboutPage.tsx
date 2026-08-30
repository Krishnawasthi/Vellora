import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Feather, Shield, BookOpen, Sparkles, Compass } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen text-chocolate-950 dark:text-cream-50 font-inter antialiased pb-24">
      
      {/* ─────────────────────────────────────────────────────────────
          1. HERO SECTION (Editorial Introduction ~45-50vh)
      ────────────────────────────────────────────────────────────── */}
      <section className="relative pt-12 sm:pt-20 pb-14 sm:pb-16 border-b border-cream-300/60 dark:border-chocolate-800/60 bg-gradient-to-b from-cream-100/40 via-transparent to-transparent dark:from-chocolate-900/30">
        
        {/* Ambient Warm Atmosphere */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[34rem] h-[16rem] bg-amber-500/5 dark:bg-amber-400/5 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl space-y-5 text-left">
            
            {/* Editorial Category Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream-200/80 dark:bg-chocolate-800/80 border border-cream-300 dark:border-chocolate-700/60 text-chocolate-700 dark:text-cream-300 text-[11px] font-sans font-semibold tracking-wider uppercase shadow-2xs">
              <Compass className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>The Journal & Philosophy</span>
            </div>

            {/* Main Editorial Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-chocolate-950 dark:text-cream-50 leading-[1.15]">
              A quiet place for thoughts that deserve to stay.
            </h1>

            {/* Subtitle / Hindi Tagline */}
            <p className="font-noto-serif-devanagari font-serif text-lg sm:text-xl text-chocolate-800/90 dark:text-cream-200/90 italic leading-relaxed pt-0.5">
              “यहाँ मैं अपने विचार, कहानियाँ और अनुभव साझा करता हूँ”
            </p>

          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. MAIN EDITORIAL CONTENT (Structured 2-Column Grid)
      ────────────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 space-y-16 sm:space-y-24">

        {/* ── SECTION 01: WHY VELLORA EXISTS ── */}
        <article className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-12 items-start">
          
          {/* Left Metadata Column */}
          <div className="md:col-span-4 lg:col-span-3 space-y-1.5 md:sticky md:top-28">
            <div className="text-[11px] font-sans font-bold tracking-widest text-amber-700 dark:text-amber-400 uppercase">
              01 / ORIGIN
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-chocolate-950 dark:text-cream-50">
              Why Vellora Exists
            </h2>
            <div className="w-10 h-0.5 bg-chocolate-400/40 dark:bg-cream-400/30 rounded-full mt-2" />
          </div>

          {/* Right Content Column */}
          <div className="md:col-span-8 lg:col-span-9 space-y-5 max-w-[62ch]">
            <p className="font-serif text-base sm:text-lg leading-[1.85] text-chocolate-900 dark:text-cream-100 antialiased">
              In a digital landscape dominated by algorithmic feeds, notifications, and endless metrics, <strong className="font-semibold text-chocolate-950 dark:text-cream-50">Vellora</strong> was created as a peaceful antidote.
            </p>
            <p className="font-serif text-base sm:text-lg leading-[1.85] text-chocolate-900/90 dark:text-cream-100/90 antialiased">
              Most of the modern internet is built for rapid consumption—fleeting posts designed to vanish into feeds within hours. Vellora is intentionally built in reverse: a slow, distraction-free sanctuary where reflections, ideas, and stories are allowed to linger and be rediscovered at an unhurried pace.
            </p>
          </div>

        </article>

        {/* ── SECTION 02: A PLACE FOR STORIES (Bilingual Flow) ── */}
        <article className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-12 items-start pt-10 border-t border-cream-300/60 dark:border-chocolate-800/60">
          
          {/* Left Metadata Column */}
          <div className="md:col-span-4 lg:col-span-3 space-y-1.5 md:sticky md:top-28">
            <div className="text-[11px] font-sans font-bold tracking-widest text-amber-700 dark:text-amber-400 uppercase">
              02 / ESSENCE
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-chocolate-950 dark:text-cream-50">
              A Place for Stories
            </h2>
            <p className="text-xs text-chocolate-600 dark:text-cream-400 font-serif italic">
              English & हिंदी
            </p>
            <div className="w-10 h-0.5 bg-chocolate-400/40 dark:bg-cream-400/30 rounded-full mt-2" />
          </div>

          {/* Right Content Column */}
          <div className="md:col-span-8 lg:col-span-9 space-y-6 max-w-[62ch]">
            <p className="font-serif text-base sm:text-lg leading-[1.85] text-chocolate-900 dark:text-cream-100 antialiased">
              Here, writing takes whatever form feels true—whether it is a short reflection on morning filter coffee, a longer essay on craft and attention, or a travel journal written in Hindi (हिंदी) or Hinglish about a spontaneous weekend road trip.
            </p>

            {/* Hindi Narrative Card */}
            <div className="p-6 sm:p-7 rounded-2xl bg-cream-100/90 dark:bg-chocolate-900/60 border border-cream-300/80 dark:border-chocolate-800 space-y-3.5 shadow-2xs">
              <h3 className="font-noto-serif-devanagari font-serif text-lg sm:text-xl font-bold text-chocolate-950 dark:text-cream-50 leading-snug">
                अपनी कहानियाँ, विचार और अनुभव साझा करने की एक जगह
              </h3>
              <p className="font-noto-serif-devanagari font-serif text-base sm:text-[1.075rem] leading-[2.05] text-chocolate-900/90 dark:text-cream-100/90 antialiased">
                <strong className="font-semibold text-chocolate-950 dark:text-cream-50">Vellora</strong> एक personal writing space है जहाँ मैं अपनी कहानियाँ, विचार, यादें और जीवन के अनुभव लिखता और साझा करता हूँ। यहाँ मैं अपनी पसंद के अनुसार हिंदी, English या Hinglish में लिख सकता हूँ—यह जगह मेरे लिखे हुए शब्दों और यादों को एक साथ सुरक्षित रखने के लिए है।
              </p>
            </div>
          </div>

        </article>

        {/* ── SECTION 03: SLOW INTERNET, MEANINGFUL WORDS ── */}
        <article className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-12 items-start pt-10 border-t border-cream-300/60 dark:border-chocolate-800/60">
          
          {/* Left Metadata Column */}
          <div className="md:col-span-4 lg:col-span-3 space-y-1.5 md:sticky md:top-28">
            <div className="text-[11px] font-sans font-bold tracking-widest text-amber-700 dark:text-amber-400 uppercase">
              03 / PHILOSOPHY
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-chocolate-950 dark:text-cream-50">
              Slow Internet
            </h2>
            <div className="w-10 h-0.5 bg-chocolate-400/40 dark:bg-cream-400/30 rounded-full mt-2" />
          </div>

          {/* Right Content Column */}
          <div className="md:col-span-8 lg:col-span-9 space-y-5 max-w-[62ch]">
            <p className="font-serif text-base sm:text-lg leading-[1.85] text-chocolate-900 dark:text-cream-100 antialiased">
              This website is a personal digital journal. There are no social media like buttons, no follower counts, no comment threads, and no pop-ups asking for emails. It is simply a quiet corner of the internet where stories can live naturally.
            </p>
            <p className="font-serif text-base sm:text-lg leading-[1.85] text-chocolate-900/90 dark:text-cream-100/90 antialiased">
              By removing the noise of algorithms, visitors can immerse themselves in words without commercial distraction, creating a calm space for genuine reading and contemplation.
            </p>
          </div>

        </article>

        {/* ── SECTION 04: WHAT VELLORA BELIEVES (Principles Grid) ── */}
        <article className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-12 items-start pt-10 border-t border-cream-300/60 dark:border-chocolate-800/60">
          
          {/* Left Metadata Column */}
          <div className="md:col-span-4 lg:col-span-3 space-y-1.5 md:sticky md:top-28">
            <div className="text-[11px] font-sans font-bold tracking-widest text-amber-700 dark:text-amber-400 uppercase">
              04 / BELIEF
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-chocolate-950 dark:text-cream-50">
              Quiet Principles
            </h2>
            <div className="w-10 h-0.5 bg-chocolate-400/40 dark:bg-cream-400/30 rounded-full mt-2" />
          </div>

          {/* Right Content Column: 3 Editorial Cards */}
          <div className="md:col-span-8 lg:col-span-9 space-y-6">
            <p className="font-serif italic text-base text-chocolate-800 dark:text-cream-200">
              Three quiet principles that shape how this space works:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
              
              {/* Card 1: Quiet Writing */}
              <div className="group p-5 rounded-2xl bg-cream-100/90 dark:bg-chocolate-900/60 border border-cream-300 dark:border-chocolate-800 shadow-2xs space-y-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-chocolate-900 via-chocolate-800 to-chocolate-950 dark:from-cream-100 dark:via-cream-200 dark:to-cream-50 flex items-center justify-center text-cream-50 dark:text-chocolate-950 shadow-xs group-hover:scale-105 transition-transform">
                  <Feather className="w-4 h-4" />
                </div>
                <h3 className="font-serif text-base font-bold text-chocolate-950 dark:text-cream-50">
                  Quiet Writing
                </h3>
                <p className="text-xs text-chocolate-700 dark:text-cream-300 leading-relaxed font-sans">
                  Distraction-free typography designed for comfortable 10-minute long reads in English & Hindi.
                </p>
              </div>

              {/* Card 2: Owner Controlled */}
              <div className="group p-5 rounded-2xl bg-cream-100/90 dark:bg-chocolate-900/60 border border-cream-300 dark:border-chocolate-800 shadow-2xs space-y-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-chocolate-900 via-chocolate-800 to-chocolate-950 dark:from-cream-100 dark:via-cream-200 dark:to-cream-50 flex items-center justify-center text-cream-50 dark:text-chocolate-950 shadow-xs group-hover:scale-105 transition-transform">
                  <Shield className="w-4 h-4" />
                </div>
                <h3 className="font-serif text-base font-bold text-chocolate-950 dark:text-cream-50">
                  Owner Controlled
                </h3>
                <p className="text-xs text-chocolate-700 dark:text-cream-300 leading-relaxed font-sans">
                  Only the site author can publish or manage stories. Public visitors browse freely with zero accounts.
                </p>
              </div>

              {/* Card 3: Pure Content */}
              <div className="group p-5 rounded-2xl bg-cream-100/90 dark:bg-chocolate-900/60 border border-cream-300 dark:border-chocolate-800 shadow-2xs space-y-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-chocolate-900 via-chocolate-800 to-chocolate-950 dark:from-cream-100 dark:via-cream-200 dark:to-cream-50 flex items-center justify-center text-cream-50 dark:text-chocolate-950 shadow-xs group-hover:scale-105 transition-transform">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h3 className="font-serif text-base font-bold text-chocolate-950 dark:text-cream-50">
                  Pure Content
                </h3>
                <p className="text-xs text-chocolate-700 dark:text-cream-300 leading-relaxed font-sans">
                  No advertisements, no tracking scripts, no commercial pressure—just pure words and memories.
                </p>
              </div>

            </div>
          </div>

        </article>

      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. CLOSING SECTION & INVITATION CALLOUT
      ────────────────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-14 text-center space-y-6 bg-gradient-to-b from-cream-100 via-cream-200/50 to-cream-100 dark:from-chocolate-900/90 dark:via-chocolate-950 dark:to-chocolate-900/90 border border-cream-300 dark:border-chocolate-800 shadow-sm">
          
          <div className="flex justify-center">
            <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>

          <blockquote className="space-y-2 max-w-xl mx-auto">
            <p className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-chocolate-950 dark:text-cream-50 leading-snug">
              “Not everything needs to be shared quickly. Some thoughts deserve time.”
            </p>
          </blockquote>

          <div className="pt-2">
            <Link
              to="/stories"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-chocolate-900 text-cream-50 dark:bg-cream-100 dark:text-chocolate-950 font-serif font-bold text-sm hover:scale-105 transition-all shadow-md group"
            >
              <span>Explore the stories</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
};
