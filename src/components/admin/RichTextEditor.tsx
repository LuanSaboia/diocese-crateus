import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Bold, Italic, List, ListOrdered, Heading2, Heading3, Undo, Redo } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface RichTextEditorProps {
  content: string
  onChange: (html: string) => void
  placeholder?: string
}

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert max-w-none min-h-[160px] p-3 focus:outline-none text-xs leading-relaxed',
      },
    },
  })

  if (!editor) {
    return null
  }

  return (
    <div className="border border-[#e4e4e7] dark:border-[#27272a] rounded-lg overflow-hidden bg-[#ffffff] dark:bg-[#18181b] focus-within:border-[#2563eb] transition-all">
      {/* Barra de Ferramentas de Formatação */}
      <div className="flex flex-wrap items-center gap-1 p-1.5 border-b border-[#e4e4e7] dark:border-[#27272a] bg-[#f4f4f5] dark:bg-[#27272a]">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`h-7 w-7 p-0 ${editor.isActive('bold') ? 'bg-[#e4e4e7] dark:bg-[#3f3f46] text-[#09090b] dark:text-[#fafafa]' : 'text-[#71717a]'}`}
        >
          <Bold className="w-3.5 h-3.5" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`h-7 w-7 p-0 ${editor.isActive('italic') ? 'bg-[#e4e4e7] dark:bg-[#3f3f46] text-[#09090b] dark:text-[#fafafa]' : 'text-[#71717a]'}`}
        >
          <Italic className="w-3.5 h-3.5" />
        </Button>

        <div className="h-4 w-px bg-[#e4e4e7] dark:bg-[#3f3f46] mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`h-7 w-7 p-0 ${editor.isActive('heading', { level: 2 }) ? 'bg-[#e4e4e7] dark:bg-[#3f3f46] text-[#09090b] dark:text-[#fafafa]' : 'text-[#71717a]'}`}
        >
          <Heading2 className="w-3.5 h-3.5" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`h-7 w-7 p-0 ${editor.isActive('heading', { level: 3 }) ? 'bg-[#e4e4e7] dark:bg-[#3f3f46] text-[#09090b] dark:text-[#fafafa]' : 'text-[#71717a]'}`}
        >
          <Heading3 className="w-3.5 h-3.5" />
        </Button>

        <div className="h-4 w-px bg-[#e4e4e7] dark:bg-[#3f3f46] mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`h-7 w-7 p-0 ${editor.isActive('bulletList') ? 'bg-[#e4e4e7] dark:bg-[#3f3f46] text-[#09090b] dark:text-[#fafafa]' : 'text-[#71717a]'}`}
        >
          <List className="w-3.5 h-3.5" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`h-7 w-7 p-0 ${editor.isActive('orderedList') ? 'bg-[#e4e4e7] dark:bg-[#3f3f46] text-[#09090b] dark:text-[#fafafa]' : 'text-[#71717a]'}`}
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </Button>

        <div className="h-4 w-px bg-[#e4e4e7] dark:bg-[#3f3f46] mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="h-7 w-7 p-0 text-[#71717a]"
        >
          <Undo className="w-3.5 h-3.5" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="h-7 w-7 p-0 text-[#71717a]"
        >
          <Redo className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Área de Edição */}
      <EditorContent editor={editor} />
    </div>
  )
}