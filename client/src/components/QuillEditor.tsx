import React, { useRef, useMemo, useCallback } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { AdminService } from '../services/api';

interface QuillEditorProps {
  value: string;
  onChange: (html: string) => void;
  fontClass?: string;
}

export const QuillEditor: React.FC<QuillEditorProps> = ({ value, onChange, fontClass = 'font-georgia' }) => {
  const quillRef = useRef<ReactQuill | null>(null);

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
