import { useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface EmailEditorProps {
  subject: string;
  body: string;
  onSubjectChange: (subject: string) => void;
  onBodyChange: (body: string) => void;
  disabled?: boolean;
  keyValue?: string; // For forcing remount
}

export default function EmailEditor({
  subject,
  body,
  onSubjectChange,
  onBodyChange,
  disabled = false,
  keyValue,
}: EmailEditorProps) {
  const quillRef = useRef<any>(null);

  // Update ReactQuill content when body prop changes
  useEffect(() => {
    if (quillRef.current && quillRef.current.editor) {
      const editor = quillRef.current.editor;
      const currentContent = editor.root.innerHTML;
      if (currentContent !== body) {
        editor.clipboard.dangerouslyPasteHTML(body);
      }
    }
  }, [body, keyValue]);

  const handleChange = (content: string) => {
    onBodyChange(content);
  };

  const insertVariable = (variable: string) => {
    if (!quillRef.current || !quillRef.current.editor) return;
    
    const editor = quillRef.current.editor;
    const range = editor.getSelection(true);
    editor.insertText(range.index, variable, 'user');
    editor.setSelection(range.index + variable.length);
  };

  return (
    <>
      <div className="p-6 border-b border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Subject
        </label>
        <input
          type="text"
          value={subject}
          onChange={(e) => onSubjectChange(e.target.value)}
          placeholder="Email subject..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={disabled}
        />
      </div>

      <div className="p-6">
        <ReactQuill
          key={keyValue}
          ref={quillRef}
          theme="snow"
          value={body}
          onChange={handleChange}
          className="min-h-[400px] [&_.ql-editor]:text-black [&_.ql-editor]:text-lg"
          modules={{
            toolbar: [
              [{ 'header': [1, 2, 3, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              ['link'],
              ['clean']
            ],
            clipboard: {
              matchVisual: false
            }
          }}
          readOnly={disabled}
        />
      </div>
    </>
  );
}

// Export the insertVariable function for use by parent
export type { EmailEditorProps };
