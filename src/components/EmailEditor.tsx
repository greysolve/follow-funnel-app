import { useEffect, useImperativeHandle, forwardRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Link as LinkIcon,
  Heading1,
  Heading2,
  Heading3,
  Eraser,
} from 'lucide-react';

interface EmailEditorProps {
  subject: string;
  body: string;
  onSubjectChange: (subject: string) => void;
  onBodyChange: (body: string) => void;
  disabled?: boolean;
  keyValue?: string;
}

export interface EmailEditorRef {
  insertVariable: (variable: string) => void;
}

const EmailEditor = forwardRef<EmailEditorRef, EmailEditorProps>(
  ({ subject, body, onSubjectChange, onBodyChange, disabled = false, keyValue }, ref) => {
    const editor = useEditor({
      immediatelyRender: false,
      shouldRerenderOnTransaction: true,
      extensions: [
        StarterKit.configure({
          heading: { levels: [1, 2, 3] },
        }),
        Underline,
        Link.configure({
          openOnClick: false,
          HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
        }),
      ],
      content: body || '',
      editable: !disabled,
      onUpdate: ({ editor: instance }) => {
        onBodyChange(instance.getHTML());
      },
    }, [keyValue]);

    useEffect(() => {
      if (!editor) return;
      editor.setEditable(!disabled);
    }, [editor, disabled]);

    useEffect(() => {
      if (!editor) return;
      const current = editor.getHTML();
      if (body !== current) {
        editor.commands.setContent(body || '', { emitUpdate: false });
      }
    }, [editor, body, keyValue]);

    useImperativeHandle(ref, () => ({
      insertVariable: (variable: string) => {
        if (!editor) return;
        editor.chain().focus().insertContent(variable).run();
      },
    }), [editor]);

    const setLink = () => {
      if (!editor) return;
      const previous = editor.getAttributes('link').href as string | undefined;
      const url = window.prompt('Link URL', previous || 'https://');
      if (url === null) return;
      if (url === '') {
        editor.chain().focus().extendMarkRange('link').unsetLink().run();
        return;
      }
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    const buttonClass = (active: boolean) =>
      `p-2 rounded-md transition ${
        active ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      } disabled:opacity-40 disabled:cursor-not-allowed`;

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
          <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
            <div className="flex flex-wrap items-center gap-1 px-2 py-2 border-b border-gray-200 bg-gray-50">
              <button type="button" disabled={disabled} onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} className={buttonClass(!!editor?.isActive('heading', { level: 1 }))} title="Heading 1">
                <Heading1 className="w-4 h-4" />
              </button>
              <button type="button" disabled={disabled} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} className={buttonClass(!!editor?.isActive('heading', { level: 2 }))} title="Heading 2">
                <Heading2 className="w-4 h-4" />
              </button>
              <button type="button" disabled={disabled} onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} className={buttonClass(!!editor?.isActive('heading', { level: 3 }))} title="Heading 3">
                <Heading3 className="w-4 h-4" />
              </button>
              <span className="w-px h-5 bg-gray-200 mx-1" />
              <button type="button" disabled={disabled} onClick={() => editor?.chain().focus().toggleBold().run()} className={buttonClass(!!editor?.isActive('bold'))} title="Bold">
                <Bold className="w-4 h-4" />
              </button>
              <button type="button" disabled={disabled} onClick={() => editor?.chain().focus().toggleItalic().run()} className={buttonClass(!!editor?.isActive('italic'))} title="Italic">
                <Italic className="w-4 h-4" />
              </button>
              <button type="button" disabled={disabled} onClick={() => editor?.chain().focus().toggleUnderline().run()} className={buttonClass(!!editor?.isActive('underline'))} title="Underline">
                <UnderlineIcon className="w-4 h-4" />
              </button>
              <button type="button" disabled={disabled} onClick={() => editor?.chain().focus().toggleStrike().run()} className={buttonClass(!!editor?.isActive('strike'))} title="Strikethrough">
                <Strikethrough className="w-4 h-4" />
              </button>
              <span className="w-px h-5 bg-gray-200 mx-1" />
              <button type="button" disabled={disabled} onClick={() => editor?.chain().focus().toggleOrderedList().run()} className={buttonClass(!!editor?.isActive('orderedList'))} title="Numbered list">
                <ListOrdered className="w-4 h-4" />
              </button>
              <button type="button" disabled={disabled} onClick={() => editor?.chain().focus().toggleBulletList().run()} className={buttonClass(!!editor?.isActive('bulletList'))} title="Bullet list">
                <List className="w-4 h-4" />
              </button>
              <button type="button" disabled={disabled} onClick={setLink} className={buttonClass(!!editor?.isActive('link'))} title="Link">
                <LinkIcon className="w-4 h-4" />
              </button>
              <button type="button" disabled={disabled} onClick={() => editor?.chain().focus().unsetAllMarks().clearNodes().run()} className={buttonClass(false)} title="Clear formatting">
                <Eraser className="w-4 h-4" />
              </button>
            </div>
            <EditorContent
              editor={editor}
              className="min-h-[400px] px-4 py-3 text-lg text-black [&_.tiptap]:outline-none [&_.tiptap]:min-h-[376px] [&_.tiptap_p]:my-2 [&_.tiptap_h1]:text-2xl [&_.tiptap_h1]:font-bold [&_.tiptap_h2]:text-xl [&_.tiptap_h2]:font-semibold [&_.tiptap_h3]:text-lg [&_.tiptap_h3]:font-semibold [&_.tiptap_a]:text-blue-600 [&_.tiptap_a]:underline [&_.tiptap_ul]:list-disc [&_.tiptap_ul]:pl-6 [&_.tiptap_ol]:list-decimal [&_.tiptap_ol]:pl-6"
            />
          </div>
        </div>
      </>
    );
  }
);

EmailEditor.displayName = 'EmailEditor';

export default EmailEditor;
export type { EmailEditorProps };
