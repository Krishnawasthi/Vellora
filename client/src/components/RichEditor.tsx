import React, { useRef, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Image as ImageIcon,
  Minus,
  Undo,
  Redo,
  Highlighter
} from 'lucide-react';
import { AdminService } from '../services/api';

interface RichEditorProps {
  value: string;
  onChange: (html: string) => void;
  fontClass?: string;
}

export const RichEditor: React.FC<RichEditorProps> = ({ value, onChange, fontClass = 'font-georgia' }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  // Sync value to DOM content editable innerHTML when value changes externally
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const exec = (command: string, val: string | undefined = undefined) => {
    document.execCommand(command, false, val);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const formatBlock = (tag: string) => {
    exec('formatBlock', tag);
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const setLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      exec('createLink', url);
    }
  };

  const addImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      if (input.files && input.files[0]) {
        try {
          const res = await AdminService.uploadImage(input.files[0]);
          exec('insertImage', res.url);
        } catch (err) {
          alert('Failed to upload image');
        }
      }
    };
    input.click();
  };

  return (
    <div 
      onClick={() => {
        if (editorRef.current) {
          editorRef.current.focus();
        }
      }}
      className={`rounded-2xl border border-cream-300 dark:border-chocolate-800 bg-cream-100/90 dark:bg-chocolate-900/60 shadow-sm overflow-hidden min-h-[480px] flex flex-col cursor-text ${fontClass}`}
    >
      {/* Toolbar */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="flex flex-wrap items-center gap-1 p-2 bg-cream-200/90 dark:bg-chocolate-950/90 border-b border-cream-300 dark:border-chocolate-800 sticky top-16 z-30 backdrop-blur-md"
      >
        {/* Headings */}
        <button type="button" onClick={() => formatBlock('<h1>')} className="p-2 rounded-lg text-chocolate-800 dark:text-cream-200 hover:bg-cream-300/60 dark:hover:bg-chocolate-800" title="Heading 1"><Heading1 className="w-4 h-4" /></button>
        <button type="button" onClick={() => formatBlock('<h2>')} className="p-2 rounded-lg text-chocolate-800 dark:text-cream-200 hover:bg-cream-300/60 dark:hover:bg-chocolate-800" title="Heading 2"><Heading2 className="w-4 h-4" /></button>
        <button type="button" onClick={() => formatBlock('<h3>')} className="p-2 rounded-lg text-chocolate-800 dark:text-cream-200 hover:bg-cream-300/60 dark:hover:bg-chocolate-800" title="Heading 3"><Heading3 className="w-4 h-4" /></button>
        <button type="button" onClick={() => formatBlock('<p>')} className="px-2.5 py-1 rounded-lg text-xs font-bold text-chocolate-800 dark:text-cream-200 hover:bg-cream-300/60 dark:hover:bg-chocolate-800" title="Paragraph">Paragraph</button>

        <div className="w-px h-5 bg-cream-300 dark:bg-chocolate-700 mx-1" />

        {/* Formatting */}
        <button type="button" onClick={() => exec('bold')} className="p-2 rounded-lg text-chocolate-800 dark:text-cream-200 hover:bg-cream-300/60 dark:hover:bg-chocolate-800" title="Bold (Ctrl+B)"><Bold className="w-4 h-4" /></button>
        <button type="button" onClick={() => exec('italic')} className="p-2 rounded-lg text-chocolate-800 dark:text-cream-200 hover:bg-cream-300/60 dark:hover:bg-chocolate-800" title="Italic (Ctrl+I)"><Italic className="w-4 h-4" /></button>
        <button type="button" onClick={() => exec('underline')} className="p-2 rounded-lg text-chocolate-800 dark:text-cream-200 hover:bg-cream-300/60 dark:hover:bg-chocolate-800" title="Underline (Ctrl+U)"><Underline className="w-4 h-4" /></button>
        <button type="button" onClick={() => exec('strikeThrough')} className="p-2 rounded-lg text-chocolate-800 dark:text-cream-200 hover:bg-cream-300/60 dark:hover:bg-chocolate-800" title="Strikethrough"><Strikethrough className="w-4 h-4" /></button>
        <button type="button" onClick={() => exec('hiliteColor', '#FEF08A')} className="p-2 rounded-lg text-chocolate-800 dark:text-cream-200 hover:bg-cream-300/60 dark:hover:bg-chocolate-800" title="Highlight"><Highlighter className="w-4 h-4" /></button>

        <div className="w-px h-5 bg-cream-300 dark:bg-chocolate-700 mx-1" />

        {/* Structure */}
        <button type="button" onClick={() => formatBlock('blockquote')} className="p-2 rounded-lg text-chocolate-800 dark:text-cream-200 hover:bg-cream-300/60 dark:hover:bg-chocolate-800" title="Quote"><Quote className="w-4 h-4" /></button>
        <button type="button" onClick={() => exec('insertUnorderedList')} className="p-2 rounded-lg text-chocolate-800 dark:text-cream-200 hover:bg-cream-300/60 dark:hover:bg-chocolate-800" title="Bullet List"><List className="w-4 h-4" /></button>
        <button type="button" onClick={() => exec('insertOrderedList')} className="p-2 rounded-lg text-chocolate-800 dark:text-cream-200 hover:bg-cream-300/60 dark:hover:bg-chocolate-800" title="Numbered List"><ListOrdered className="w-4 h-4" /></button>
        <button type="button" onClick={() => exec('insertHorizontalRule')} className="p-2 rounded-lg text-chocolate-800 dark:text-cream-200 hover:bg-cream-300/60 dark:hover:bg-chocolate-800" title="Divider"><Minus className="w-4 h-4" /></button>

        <div className="w-px h-5 bg-cream-300 dark:bg-chocolate-700 mx-1" />

        {/* Alignment */}
        <button type="button" onClick={() => exec('justifyLeft')} className="p-2 rounded-lg text-chocolate-800 dark:text-cream-200 hover:bg-cream-300/60 dark:hover:bg-chocolate-800" title="Align Left"><AlignLeft className="w-4 h-4" /></button>
        <button type="button" onClick={() => exec('justifyCenter')} className="p-2 rounded-lg text-chocolate-800 dark:text-cream-200 hover:bg-cream-300/60 dark:hover:bg-chocolate-800" title="Align Center"><AlignCenter className="w-4 h-4" /></button>
        <button type="button" onClick={() => exec('justifyRight')} className="p-2 rounded-lg text-chocolate-800 dark:text-cream-200 hover:bg-cream-300/60 dark:hover:bg-chocolate-800" title="Align Right"><AlignRight className="w-4 h-4" /></button>
        <button type="button" onClick={() => exec('justifyFull')} className="p-2 rounded-lg text-chocolate-800 dark:text-cream-200 hover:bg-cream-300/60 dark:hover:bg-chocolate-800" title="Justify"><AlignJustify className="w-4 h-4" /></button>

        <div className="w-px h-5 bg-cream-300 dark:bg-chocolate-700 mx-1" />

        {/* Inserts */}
        <button type="button" onClick={setLink} className="p-2 rounded-lg text-chocolate-800 dark:text-cream-200 hover:bg-cream-300/60 dark:hover:bg-chocolate-800" title="Insert Link"><LinkIcon className="w-4 h-4" /></button>
        <button type="button" onClick={addImage} className="p-2 rounded-lg text-chocolate-800 dark:text-cream-200 hover:bg-cream-300/60 dark:hover:bg-chocolate-800" title="Insert Image"><ImageIcon className="w-4 h-4" /></button>

        <div className="w-px h-5 bg-cream-300 dark:bg-chocolate-700 mx-1" />

        {/* History */}
        <button type="button" onClick={() => exec('undo')} className="p-2 rounded-lg text-chocolate-800 dark:text-cream-200 hover:bg-cream-300/60 dark:hover:bg-chocolate-800" title="Undo (Ctrl+Z)"><Undo className="w-4 h-4" /></button>
        <button type="button" onClick={() => exec('redo')} className="p-2 rounded-lg text-chocolate-800 dark:text-cream-200 hover:bg-cream-300/60 dark:hover:bg-chocolate-800" title="Redo (Ctrl+Y)"><Redo className="w-4 h-4" /></button>
      </div>

      {/* Pure ContentEditable Surface - 100% Reliable Input */}
      <div
        ref={editorRef}
        contentEditable={true}
        onInput={handleInput}
        suppressContentEditableWarning={true}
        className="flex-1 p-6 outline-none min-h-[420px] text-chocolate-950 dark:text-cream-50 font-medium text-base sm:text-lg leading-relaxed prose max-w-none cursor-text focus:outline-none focus:ring-0"
        data-placeholder="Start writing your story here..."
      />
    </div>
  );
};
