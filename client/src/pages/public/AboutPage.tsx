import React from 'react';
import { Feather, Shield, BookOpen } from 'lucide-react';
import { Logo } from '../../components/Logo';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12 sm:space-y-16">
      
      {/* Header Section */}
      <header className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="flex justify-center">
          <Logo size="lg" />
        </div>
        <p className="font-noto-serif-devanagari font-serif text-base sm:text-lg text-chocolate-800/90 dark:text-cream-200/90 italic max-w-lg mx-auto leading-relaxed">
          “यहाँ मैं अपने विचार, कहानियाँ और अनुभव साझा करता हूँ”
        </p>
      </header>

      {/* Main Narrative Container (Ideal reading line-length ~65-75 chars) */}
      <main className="max-w-2xl mx-auto space-y-10 sm:space-y-12">
        
        {/* English Narrative Section */}
        <section className="space-y-6 text-left">
          <p className="font-serif text-base sm:text-[1.075rem] leading-[1.85] text-chocolate-900 dark:text-cream-100 tracking-normal antialiased">
            In a digital landscape dominated by algorithmic feeds, notifications, and endless metrics, <strong className="font-semibold text-chocolate-950 dark:text-cream-50">Vellora</strong> was created as a peaceful antidote.
          </p>
          <p className="font-serif text-base sm:text-[1.075rem] leading-[1.85] text-chocolate-900 dark:text-cream-100 tracking-normal antialiased">
            This website is a personal digital journal. There are no social media like buttons, no follower counts, no comment threads, and no pop-ups asking for emails. It is simply a quiet corner of the internet where stories can live naturally.
          </p>
          <p className="font-serif text-base sm:text-[1.075rem] leading-[1.85] text-chocolate-900 dark:text-cream-100 tracking-normal antialiased">
            Here, writing takes whatever form feels true—whether it is a short reflection on morning filter coffee, a longer essay on craft and attention, or a story written in Hindi (हिंदी) or Hinglish about a spontaneous weekend road trip.
          </p>
        </section>

        {/* Hindi Narrative Section with balanced Devanagari line-height */}
        <section className="space-y-6 pt-8 sm:pt-10 border-t border-cream-300/80 dark:border-chocolate-800/80 text-left">
          <h2 className="font-noto-serif-devanagari font-serif text-xl sm:text-2xl font-bold text-chocolate-950 dark:text-cream-50 leading-snug tracking-tight">
            अपनी कहानियाँ, विचार और अनुभव साझा करने की एक जगह
          </h2>
          <p className="font-noto-serif-devanagari font-serif text-[1.025rem] sm:text-[1.1rem] leading-[1.95] text-chocolate-900 dark:text-cream-100 antialiased">
            <strong className="font-semibold text-chocolate-950 dark:text-cream-50">Vellora</strong> एक personal writing space है जहाँ मैं अपनी कहानियाँ, विचार, यादें और जीवन के अनुभव लिखता और साझा करता हूँ।
          </p>
          <p className="font-noto-serif-devanagari font-serif text-[1.025rem] sm:text-[1.1rem] leading-[1.95] text-chocolate-900 dark:text-cream-100 antialiased">
            यहाँ मैं अपनी पसंद के अनुसार हिंदी, English या Hinglish में लिख सकता हूँ। कुछ बातें सिर्फ अपने लिए Private रखी जा सकती हैं, जबकि पसंदीदा कहानियों और विचारों को Public करके दूसरों के साथ साझा किया जा सकता है।
          </p>
          <p className="font-noto-serif-devanagari font-serif text-[1.025rem] sm:text-[1.1rem] leading-[1.95] text-chocolate-900 dark:text-cream-100 antialiased">
            यह जगह मेरे लिखे हुए शब्दों, तस्वीरों और यादों को एक साथ सुरक्षित रखने के लिए है—ताकि जब चाहूँ, उन्हें दोबारा पढ़ सकूँ और दूसरों के साथ साझा कर सकूँ।
          </p>
        </section>

      </main>

      {/* Core Principles Grid */}
      <section className="max-w-3xl mx-auto pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
          
          <div className="p-5 sm:p-6 rounded-2xl bg-cream-100/90 dark:bg-chocolate-900/60 border border-cream-300 dark:border-chocolate-800 shadow-2xs space-y-3 transition-all duration-200 hover:-translate-y-0.5">
            <div className="w-10 h-10 rounded-xl bg-cream-200 dark:bg-chocolate-800 flex items-center justify-center text-chocolate-900 dark:text-cream-100">
              <Feather className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base sm:text-lg font-bold text-chocolate-950 dark:text-cream-50">
              Quiet Writing
            </h3>
            <p className="text-xs sm:text-[13px] text-chocolate-700 dark:text-cream-300 leading-relaxed font-sans">
              Distraction-free typography designed for comfortable 10-minute long reads in both English and Hindi.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-cream-100/90 dark:bg-chocolate-900/60 border border-cream-300 dark:border-chocolate-800 shadow-2xs space-y-3 transition-all duration-200 hover:-translate-y-0.5">
            <div className="w-10 h-10 rounded-xl bg-cream-200 dark:bg-chocolate-800 flex items-center justify-center text-chocolate-900 dark:text-cream-100">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base sm:text-lg font-bold text-chocolate-950 dark:text-cream-50">
              Owner Controlled
            </h3>
            <p className="text-xs sm:text-[13px] text-chocolate-700 dark:text-cream-300 leading-relaxed font-sans">
              Only the site author can publish or manage stories. Public visitors browse freely with zero account hassle.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-cream-100/90 dark:bg-chocolate-900/60 border border-cream-300 dark:border-chocolate-800 shadow-2xs space-y-3 transition-all duration-200 hover:-translate-y-0.5">
            <div className="w-10 h-10 rounded-xl bg-cream-200 dark:bg-chocolate-800 flex items-center justify-center text-chocolate-900 dark:text-cream-100">
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
