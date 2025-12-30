import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import { Button } from './ui/button'
import { 
  Bold, Italic, List, ListOrdered, 
  Quote, Underline as UnderlineIcon, Link2 
} from 'lucide-react'

interface EditorProps {
  content: string
  onChange: (content: string) => void
}

export function RichTextEditor({ content, onChange }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  if (!editor) return null

  const toggleLink = () => {
    const url = window.prompt('URL do Link:')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  return (
    <div className="border rounded-md overflow-hidden bg-white dark:bg-zinc-950">
      {/* Barra de Ferramentas */}
      <div className="flex flex-wrap gap-1 p-2 border-b bg-zinc-50 dark:bg-zinc-900">
        <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'bg-zinc-200' : ''}>
          <Bold className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'bg-zinc-200' : ''}>
          <Italic className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive('underline') ? 'bg-zinc-200' : ''}>
          <UnderlineIcon className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={toggleLink} className={editor.isActive('link') ? 'bg-zinc-200' : ''}>
          <Link2 className="w-4 h-4" />
        </Button>
        <div className="w-px h-6 bg-zinc-300 mx-1 self-center" />
        <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'bg-zinc-200' : ''}>
          <List className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'bg-zinc-200' : ''}>
          <ListOrdered className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editor.isActive('blockquote') ? 'bg-zinc-200' : ''}>
          <Quote className="w-4 h-4" />
        </Button>
      </div>

      {/* Área de Texto */}
      <EditorContent 
        editor={editor} 
        className="prose prose-sm dark:prose-invert max-w-none p-4 min-h-[300px] focus:outline-none" 
      />
    </div>
  )
}