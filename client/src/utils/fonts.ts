import { FontType } from '../types';

export interface FontOption {
  id: FontType;
  name: string;
  category: 'English' | 'Hindi / Devanagari';
  fontClass: string;
}

export const FONT_OPTIONS: FontOption[] = [
  { id: 'inter', name: 'Inter (Clean Sans)', category: 'English', fontClass: 'font-inter' },
  { id: 'georgia', name: 'Georgia (Classic Editorial)', category: 'English', fontClass: 'font-georgia' },
  { id: 'merriweather', name: 'Merriweather (Book Serif)', category: 'English', fontClass: 'font-merriweather' },
  { id: 'lora', name: 'Lora (Literary Serif)', category: 'English', fontClass: 'font-lora' },
  { id: 'playfair', name: 'Playfair Display (Elegant Serif)', category: 'English', fontClass: 'font-playfair' },
  { id: 'noto-sans-devanagari', name: 'Noto Sans Devanagari (हिंदी / Clean)', category: 'Hindi / Devanagari', fontClass: 'font-noto-sans-devanagari' },
  { id: 'noto-serif-devanagari', name: 'Noto Serif Devanagari (हिंदी / Journal)', category: 'Hindi / Devanagari', fontClass: 'font-noto-serif-devanagari' },
  { id: 'mukta', name: 'Mukta (हिंदी / Modern)', category: 'Hindi / Devanagari', fontClass: 'font-mukta' },
  { id: 'hind', name: 'Hind (हिंदी / Compact)', category: 'Hindi / Devanagari', fontClass: 'font-hind' },
];

export const getFontClass = (fontFamily?: FontType): string => {
  const found = FONT_OPTIONS.find((f) => f.id === fontFamily);
  return found ? found.fontClass : 'font-georgia';
};
