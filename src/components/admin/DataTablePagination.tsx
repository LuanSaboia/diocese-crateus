import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface DataTablePaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  onPrevPage: () => void
  onNextPage: () => void
  hasPrevPage: boolean
  hasNextPage: boolean
}

export function DataTablePagination({
  currentPage,
  totalPages,
  totalItems,
  onPrevPage,
  onNextPage,
  hasPrevPage,
  hasNextPage,
}: DataTablePaginationProps) {
  if (totalItems === 0) return null

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-[#e4e4e7] dark:border-[#27272a] bg-[#ffffff] dark:bg-[#18181b] text-xs text-[#71717a]">
      <div>
        <span>Total de <strong>{totalItems}</strong> registro(s)</span>
      </div>

      <div className="flex items-center gap-4">
        <span>
          Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
        </span>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={onPrevPage}
            disabled={!hasPrevPage}
            className="h-7 w-7 p-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onNextPage}
            disabled={!hasNextPage}
            className="h-7 w-7 p-0"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}