import { useState, useMemo } from "react"

interface UsePaginationOptions<T> {
  data: T[]
  itemsPerPage?: number
}

export function usePagination<T>({ data, itemsPerPage = 8 }: UsePaginationOptions<T>) {
  const [currentPage, setCurrentPage] = useState(1)

  // Total de páginas
  const totalPages = Math.ceil(data.length / itemsPerPage) || 1

  // Ajusta a página caso o filtro reduza o total de itens
  const validPage = Math.min(currentPage, totalPages)

  // fatiar os dados da página atual
  const paginatedData = useMemo(() => {
    const start = (validPage - 1) * itemsPerPage
    return data.slice(start, start + itemsPerPage)
  }, [data, validPage, itemsPerPage])

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const nextPage = () => goToPage(validPage + 1)
  const prevPage = () => goToPage(validPage - 1)

  return {
    paginatedData,
    currentPage: validPage,
    totalPages,
    totalItems: data.length,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage: validPage < totalPages,
    hasPrevPage: validPage > 1,
  }
}