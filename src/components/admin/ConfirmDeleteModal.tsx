import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ConfirmDeleteModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  title?: string
  description?: string
  loading?: boolean
}

export function ConfirmDeleteModal({
  open,
  onOpenChange,
  onConfirm,
  title = "Confirmar exclusão?",
  description = "Esta ação não pode ser desfeita. O registro será permanentemente removido da base de dados.",
  loading = false,
}: ConfirmDeleteModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base font-bold text-[#09090b] dark:text-[#fafafa]">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs text-[#71717a] dark:text-[#a1a1aa]">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="pt-2">
          <AlertDialogCancel disabled={loading} className="text-xs">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              onConfirm()
            }}
            disabled={loading}
            className="text-xs bg-red-600 hover:bg-red-700 text-white font-semibold"
          >
            {loading ? "Excluindo..." : "Excluir permanentemente"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}