import React, { useRef, useMemo, useCallback, useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Languages } from 'lucide-react';
import { AdminService } from '../services/api';

interface QuillEditorProps {
  value: string;
  onChange: (html: string) => void;
  fontClass?: string;
}

export const QuillEditor: React.FC<QuillEditorProps> = ({ value, onChange, fontClass = 'font-georgia' }) => {
  const quillRef = useRef<ReactQuill | null>(null);
  const [isTranslitEnabled, setIsTranslitEnabled] = useState<boolean>(false);

  const isTranslitEnabledRef = useRef<boolean>(false);
  isTranslitEnabledRef.current = isTranslitEnabled;

  const isTransliteratingRef = useRef<boolean>(false);
  const translitCache = useRef<Map<string, string>>(new Map());

  // Transliteration helper using Google Input Tools API
  const transliterateWord = useCallback(async (word: string): Promise<string | null> => {
    const cleanWord = word.trim();
    if (!cleanWord || !/^[a-zA-Z]+$/.test(cleanWord)) return null;

    const lower = cleanWord.toLowerCase();
    if (translitCache.current.has(lower)) {
      return translitCache.current.get(lower) || null;
    }

    try {
      const url = `https://inputtools.google.com/request?text=${encodeURIComponent(cleanWord)}&itc=hi-t-i0-und&num=1&cp=0&cs=1&ie=utf-8&oe=utf-8`;
      const response = await fetch(url);
      if (!response.ok) return null;
      const data = await response.json();
      if (
        data &&
        Array.isArray(data) &&
        data[0] === 'SUCCESS' &&
        Array.isArray(data[1]) &&
        data[1][0] &&
        Array.isArray(data[1][0][1]) &&
        data[1][0][1][0]
      ) {
        const result: string = data[1][0][1][0];
        translitCache.current.set(lower, result);
        return result;
      }
    } catch {
      // Fail silently without disrupting user typing
    }
    return null;
  }, []);

  // Set up live transliteration listener on Quill instance
  useEffect(() => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    const handleTextChange = async (delta: any, _oldDelta: any, source: string) => {
      if (!isTranslitEnabledRef.current || isTransliteratingRef.current || source !== 'user') {
        return;
      }

      // Trigger only when user inserts whitespace (space or newline)
      const ops = delta?.ops;
      if (!ops || !Array.isArray(ops) || ops.length === 0) return;
      const lastOp = ops[ops.length - 1];
      if (!lastOp || typeof lastOp.insert !== 'string' || !/[\s\n]/.test(lastOp.insert)) {
        return;
      }

      const selection = quill.getSelection();
      if (!selection) return;

      const cursorIndex = selection.index;
      const lookbackLength = 60;
      const startOffset = Math.max(0, cursorIndex - lookbackLength);
      const textBefore = quill.getText(startOffset, cursorIndex - startOffset);

      // Match Latin word preceding space/newline, preserving any trailing punctuation
      const match = textBefore.match(/([a-zA-Z]+)([\.,!?;\:'"“”‘’\)\}\]]*)\s$/);
      if (!match) return;

      const matchString = match[0];
      const matchIndexInLookback = textBefore.lastIndexOf(matchString);
      if (matchIndexInLookback === -1) return;

      const latinWord = match[1];
      const wordStartIndex = startOffset + matchIndexInLookback;
      const wordLength = latinWord.length;

      // Verify the word in the editor matches before making network request
      if (quill.getText(wordStartIndex, wordLength) !== latinWord) return;

      const devanagari = await transliterateWord(latinWord);
      if (!devanagari || devanagari === latinWord) return;

      // Ensure the text at target position hasn't been edited by the user in the meantime
      if (quill.getText(wordStartIndex, wordLength) !== latinWord) return;

      try {
        isTransliteratingRef.current = true;
        const curSel = quill.getSelection();
        quill.deleteText(wordStartIndex, wordLength, 'api');
        quill.insertText(wordStartIndex, devanagari, 'api');
        if (curSel) {
          const lengthDiff = devanagari.length - wordLength;
          quill.setSelection(Math.max(0, curSel.index + lengthDiff), 0);
        }
        onChange(quill.root.innerHTML);
      } catch {
        // Fail silently
      } finally {
        isTransliteratingRef.current = false;
      }
    };

    quill.on('text-change', handleTextChange);
    return () => {
      quill.off('text-change', handleTextChange);
    };
  }, [onChange, transliterateWord]);

  // Custom image upload handler for Quill
  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      if (input.files && input.files[0]) {
        const file = input.files[0];
        try {
          const res = await AdminService.uploadImage(file);
          const quill = quillRef.current?.getEditor();
          if (quill) {
            const range = quill.getSelection(true);
            quill.insertEmbed(range.index, 'image', res.url);
            quill.setSelection(range.index + 1, 0);
          }
        } catch (err) {
          alert('Failed to upload image. Please try again.');
        }
      }
    };
  }, []);

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        ['blockquote', 'code-block'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    }
  }), [imageHandler]);

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'blockquote', 'code-block',
    'list', 'bullet',
    'align',
    'link', 'image', 'video'
  ];

  return (
    <div className={`quill-editor-wrapper rounded-2xl border border-cream-300 dark:border-chocolate-800 bg-cream-100/90 dark:bg-chocolate-900/60 shadow-sm overflow-hidden ${fontClass}`}>
      {/* Transliteration Control Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-cream-200/70 dark:bg-chocolate-950/70 border-b border-cream-300 dark:border-chocolate-800 text-xs">
        <div className="flex items-center gap-1.5 text-chocolate-700 dark:text-cream-300 font-medium">
          <Languages className="w-3.5 h-3.5 text-chocolate-500 dark:text-cream-400" />
          <span className="text-[11px] font-sans">Hindi Typing Tool:</span>
        </div>
        <button
          type="button"
          onClick={() => setIsTranslitEnabled((prev) => !prev)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all duration-200 shadow-2xs ${
            isTranslitEnabled
              ? 'bg-amber-600 text-white dark:bg-amber-500 dark:text-chocolate-950 ring-1 ring-amber-600/50'
              : 'bg-cream-100 dark:bg-chocolate-900 text-chocolate-600 dark:text-cream-300 border border-cream-300 dark:border-chocolate-700 hover:bg-cream-300/60 dark:hover:bg-chocolate-800'
          }`}
          title="Type phonetically in English (e.g., 'namaste') and press Space to convert to Devanagari ('नमस्ते')"
        >
          <span className="font-serif">अ/A</span>
          <span>{isTranslitEnabled ? 'Hinglish → हिंदी: ON' : 'Hinglish → हिंदी: OFF'}</span>
          <span className={`w-1.5 h-1.5 rounded-full ${isTranslitEnabled ? 'bg-white dark:bg-chocolate-950 animate-pulse' : 'bg-chocolate-400 dark:text-cream-400'}`} />
        </button>
      </div>

      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder="Start writing your story here..."
      />
    </div>
  );
};
