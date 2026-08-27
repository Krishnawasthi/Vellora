import React from 'react';
import { Feather, Shield, BookOpen } from 'lucide-react';
import { Logo } from '../../components/Logo';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <Logo size="lg" />
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-chocolate-950 dark:text-cream-50">
          About Vellora
        </h1>
        <p className="font-noto-serif-devanagari font-serif text-lg sm:text-xl text-chocolate-800 dark:text-cream-200 italic max-w-xl mx-auto">
          “यहाँ मैं अपने विचार, कहानियाँ और अनुभव साझा करता हूँ”
        </p>
      </div>

      {/* Narrative Section - English Flow */}
      <div className="space-y-5 leading-relaxed font-serif text-chocolate-900 dark:text-cream-100 text-base sm:text-lg">
        <p>
          In a digital landscape dominated by algorithmic feeds, notifications, and endless metrics, <strong>Vellora</strong> was created as a peaceful antidote.
        </p>
        <p>
          This website is a personal digital journal. There are no social media like buttons, no follower counts, no comment threads, and no pop-ups asking for emails. It is simply a quiet corner of the internet where stories can live naturally.
        </p>
        <p>
          Here, writing takes whatever form feels true—whether it is a short reflection on morning filter coffee, a longer essay on craft and attention, or a story written in Hindi (हिंदी) or Hinglish about a spontaneous weekend road trip.
        </p>
      </div>

      {/* Narrative Section - Hindi Flow (Unboxed Clean Paragraph Flow) */}
      <div className="space-y-5 leading-relaxed font-noto-serif-devanagari font-serif text-chocolate-900 dark:text-cream-100 text-base sm:text-lg pt-4 border-t border-cream-300/40 dark:border-chocolate-800/40">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-chocolate-950 dark:text-cream-50">
          अपनी कहानियाँ, विचार और अनुभव साझा करने की एक जगह
        </h2>
        <p>
          <strong>Vellora</strong> एक personal writing space है जहाँ मैं अपनी कहानियाँ, विचार, यादें और जीवन के अनुभव लिखता और साझा करता हूँ।
        </p>
        <p>
          यहाँ मैं अपनी पसंद के अनुसार हिंदी, English या Hinglish में लिख सकता हूँ। कुछ बातें सिर्फ अपने लिए Private रखी जा सकती हैं, जबकि पसंदीदा कहानियों और विचारों को Public करके दूसरों के साथ साझा किया जा सकता है।
        </p>
        <p>
          यह जगह मेरे लिखे हुए शब्दों, तस्वीरों और यादों को एक साथ सुरक्षित रखने के लिए है—ताकि जब चाहूँ, उन्हें दोबारा पढ़ सकूँ और दूसरों के साथ साझा कर सकूँ।
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
        <div className="p-6 rounded-2xl bg-cream-100/80 dark:bg-chocolate-900/60 border border-cream-300 dark:border-chocolate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cream-200 dark:bg-chocolate-800 flex items-center justify-center text-chocolate-900 dark:text-cream-100">
            <Feather className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-lg font-bold text-chocolate-950 dark:text-cream-50">
            Quiet Writing
          </h3>
          <p className="text-xs text-chocolate-700 dark:text-cream-300 leading-relaxed">
            Distraction-free typography designed for comfortable 10-minute long reads in both English and Hindi.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-cream-100/80 dark:bg-chocolate-900/60 border border-cream-300 dark:border-chocolate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cream-200 dark:bg-chocolate-800 flex items-center justify-center text-chocolate-900 dark:text-cream-100">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-lg font-bold text-chocolate-950 dark:text-cream-50">
            Owner Controlled
          </h3>
          <p className="text-xs text-chocolate-700 dark:text-cream-300 leading-relaxed">
            Only the site author can publish or manage stories. Public visitors browse freely with zero account hassle.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-cream-100/80 dark:bg-chocolate-900/60 border border-cream-300 dark:border-chocolate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cream-200 dark:bg-chocolate-800 flex items-center justify-center text-chocolate-900 dark:text-cream-100">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-lg font-bold text-chocolate-950 dark:text-cream-50">
            Pure Content
          </h3>
          <p className="text-xs text-chocolate-700 dark:text-cream-300 leading-relaxed">
            No advertisements, no tracking scripts, no commercial pressure—just pure words and memories.
          </p>
        </div>
      </div>

    </div>
  );
};
