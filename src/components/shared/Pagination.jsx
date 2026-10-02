import { Button } from "@/components/ui/button";
export function Pagination({ pagination, onPageChange, disabled = false }) {
  if (!pagination || (pagination.totalPages <= 1 && pagination.page <= 1)) return null;
  const { page } = pagination;
  const totalPages = Math.max(1, pagination.totalPages);
  return <nav aria-label="Sahifalash" className="mt-4 flex items-center justify-center gap-3">
    <Button type="button" variant="outline" disabled={disabled || page <= 1} onClick={() => onPageChange(page - 1)}>Oldingi</Button>
    <span className="text-sm">{page} / {totalPages}</span>
    <Button type="button" variant="outline" disabled={disabled || page >= totalPages} onClick={() => onPageChange(page + 1)}>Keyingi</Button>
  </nav>;
}
