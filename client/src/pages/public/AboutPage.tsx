import React from 'react';
import { Feather, Shield, BookOpen, Quote } from 'lucide-react';
import { Logo } from '../../components/Logo';

export const AboutPage: React.FC = () => {
  return (
    <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16 sm:space-y-20 overflow-hidden">
      
      {/* Subtle Background Glows */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[28rem] h-[28rem] bg-amber-500/5 dark:bg-amber-400/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-chocolate-500/5 dark:bg-cream-100/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Centered Header Section */}
      <header className="text-center space-y-5 max-w-2xl mx-auto">
        <div className="flex justify-center">
          <Logo size="lg" />
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-chocolate-950 dark:text-cream-50 tracking-tight">
          About Vellora
        </h1>

        <p className="font-noto-serif-devanagari font-serif text-base sm:text-lg text-chocolate-800/90 dark:text-cream-200/90 italic max-w-lg mx-auto leading-relaxed">
          “यहाँ मैं अपने विचार, कहानियाँ और अनुभव साझा करता हूँ”
        </p>

        {/* Decorative Divider with Quote Icon */}
        <div className="flex items-center justify-center gap-3 pt-1">
          <span className="w-12 sm:w-16 h-px bg-gradient-to-r from-transparent to-cream-400 dark:to-chocolate-700" />
          <Quote className="w-3.5 h-3.5 text-amber-600/80 dark:text-amber-400/80 rotate-180" />
          <span className="w-12 sm:w-16 h-px bg-gradient-to-l from-transparent to-cream-400 dark:to-chocolate-700" />
        </div>
      </header>

      {/* Main Narrative Container (Ideal 58-62ch reading line-length) */}
      <main className="max-w-[62ch] mx-auto space-y-14 sm:space-y-16">
        
        {/* English Narrative Section */}
        <section className="space-y-6 text-left">
          {/* Section Pill Divider */}
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-cream-300 dark:via-chocolate-800 to-transparent" />
            <span className="px-3 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-cream-200/90 dark:bg-chocolate-800/90 text-chocolate-800 dark:text-cream-200 border border-cream-300 dark:border-chocolate-700/80 shadow-2xs font-sans">
              ENGLISH
            </span>
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-cream-300 dark:via-chocolate-800 to-transparent" />
          </div>

          <p className="font-serif text-base sm:text-[1.075rem] leading-[1.85] text-chocolate-900 dark:text-cream-100 tracking-normal antialiased first-letter:font-serif first-letter:text-4xl sm:first-letter:text-5xl first-letter:font-bold first-letter:text-chocolate-950 dark:first-letter:text-cream-50 first-letter:mr-2.5 first-letter:float-left first-letter:leading-none">
            In a digital landscape dominated by algorithmic feeds, notifications, and endless metrics, <strong className="font-semibold text-chocolate-950 dark:text-cream-50">Vellora</strong> was created as a peaceful antidote.
          </p>
          <p className="font-serif text-base sm:text-[1.075rem] leading-[1.85] text-chocolate-900 dark:text-cream-100 tracking-normal antialiased">
            This website is a personal digital journal. There are no social media like buttons, no follower counts, no comment threads, and no pop-ups asking for emails. It is simply a quiet corner of the internet where stories can live naturally.
          </p>
          <p className="font-serif text-base sm:text-[1.075rem] leading-[1.85] text-chocolate-900 dark:text-cream-100 tracking-normal antialiased">
            Here, writing takes whatever form feels true—whether it is a short reflection on morning filter coffee, a longer essay on craft and attention, or a story written in Hindi (हिंदी) or Hinglish about a spontaneous weekend road trip.
          </p>
        </section>

        {/* Hindi Narrative Section */}
        <section className="space-y-6 text-left">
          {/* Section Pill Divider */}
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-cream-300 dark:via-chocolate-800 to-transparent" />
            <span className="px-3 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-cream-200/90 dark:bg-chocolate-800/90 text-chocolate-800 dark:text-cream-200 border border-cream-300 dark:border-chocolate-700/80 shadow-2xs font-sans">
              हिंदी
            </span>
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-cream-300 dark:via-chocolate-800 to-transparent" />
          </div>

          <h2 className="font-noto-serif-devanagari font-serif text-xl sm:text-2xl font-bold text-chocolate-950 dark:text-cream-50 leading-snug tracking-tight pb-1">
            अपनी कहानियाँ, विचार और अनुभव साझा करने की एक जगह
          </h2>
          <p className="font-noto-serif-devanagari font-serif text-[1.025rem] sm:text-[1.125rem] leading-[2.1] text-chocolate-900 dark:text-cream-100 antialiased">
            <strong className="font-semibold text-chocolate-950 dark:text-cream-50">Vellora</strong> एक personal writing space है जहाँ मैं अपनी कहानियाँ, विचार, यादें और जीवन के अनुभव लिखता और साझा करता हूँ।
          </p>
          <p className="font-noto-serif-devanagari font-serif text-[1.025rem] sm:text-[1.125rem] leading-[2.1] text-chocolate-900 dark:text-cream-100 antialiased">
            यहाँ मैं अपनी पसंद के अनुसार हिंदी, English या Hinglish में लिख सकता हूँ। कुछ बातें सिर्फ अपने लिए Private रखी जा सकती हैं, जबकि पसंदीदा कहानियों और विचारों को Public करके दूसरों के साथ साझा किया जा सकता है।
          </p>
          <p className="font-noto-serif-devanagari font-serif text-[1.025rem] sm:text-[1.125rem] leading-[2.1] text-chocolate-900 dark:text-cream-100 antialiased">
            यह जगह मेरे लिखे हुए शब्दों, तस्वीरों और यादों को एक साथ सुरक्षित रखने के लिए है—ताकि जब चाहूँ, उन्हें दोबारा पढ़ सकूँ और दूसरों के साथ साझा कर सकूँ।
          </p>
        </section>

      </main>

      {/* Core Principles Grid */}
      <section className="max-w-3xl mx-auto space-y-6 pt-4">
        <div className="text-center space-y-1">
          <p className="font-serif italic text-sm sm:text-base text-chocolate-700 dark:text-cream-300">
            Three quiet principles that shape how this space works.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
          
          {/* Card 1: Quiet Writing */}
          <div className="group p-5 sm:p-6 rounded-2xl bg-cream-100/90 dark:bg-chocolate-900/60 border border-cream-300 dark:border-chocolate-800 shadow-2xs space-y-3.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-chocolate-900 via-chocolate-800 to-chocolate-950 dark:from-cream-100 dark:via-cream-200 dark:to-cream-50 flex items-center justify-center text-cream-50 dark:text-chocolate-950 shadow-xs group-hover:scale-105 transition-transform duration-300">
              <Feather className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base sm:text-lg font-bold text-chocolate-950 dark:text-cream-50">
              Quiet Writing
            </h3>
            <p className="text-xs sm:text-[13px] text-chocolate-700 dark:text-cream-300 leading-relaxed font-sans">
              Distraction-free typography designed for comfortable 10-minute long reads in both English and Hindi.
            </p>
          </div>

          {/* Card 2: Owner Controlled */}
          <div className="group p-5 sm:p-6 rounded-2xl bg-cream-100/90 dark:bg-chocolate-900/60 border border-cream-300 dark:border-chocolate-800 shadow-2xs space-y-3.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-chocolate-900 via-chocolate-800 to-chocolate-950 dark:from-cream-100 dark:via-cream-200 dark:to-cream-50 flex items-center justify-center text-cream-50 dark:text-chocolate-950 shadow-xs group-hover:scale-105 transition-transform duration-300">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base sm:text-lg font-bold text-chocolate-950 dark:text-cream-50">
              Owner Controlled
            </h3>
            <p className="text-xs sm:text-[13px] text-chocolate-700 dark:text-cream-300 leading-relaxed font-sans">
              Only the site author can publish or manage stories. Public visitors browse freely with zero account hassle.
            </p>
          </div>

          {/* Card 3: Pure Content */}
          <div className="group p-5 sm:p-6 rounded-2xl bg-cream-100/90 dark:bg-chocolate-900/60 border border-cream-300 dark:border-chocolate-800 shadow-2xs space-y-3.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-chocolate-900 via-chocolate-800 to-chocolate-950 dark:from-cream-100 dark:via-cream-200 dark:to-cream-50 flex items-center justify-center text-cream-50 dark:text-chocolate-950 shadow-xs group-hover:scale-105 transition-transform duration-300">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base sm:text-lg font-bold text-chocolate-950 dark:text-cream-50">
              Pure Content
            </h3>
            <p className="text-xs sm:text-[13px] text-chocolate-700 dark:text-cream-300 leading-relaxed font-sans">
              No advertisements, no tracking scripts, no commercial pressure—just pure words and memories.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
};
