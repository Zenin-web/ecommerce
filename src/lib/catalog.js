import { escapeSearch } from "./validation.js";
const SORTS = {
  new: { sortBy: "createdAt", sortOrder: "desc" },
  cheap: { sortBy: "price", sortOrder: "asc" },
  expensive: { sortBy: "price", sortOrder: "desc" },
  rating: { sortBy: "rating", sortOrder: "desc" },
};
export function buildCatalogQuery(searchParams, categoryId) {
  const page = Number(searchParams.get("page"));
  const params = { page: Number.isInteger(page) && page > 0 ? page : 1, limit: 12,
    ...SORTS[searchParams.get("sort")] || SORTS.new };
  const search = searchParams.get("search")?.trim();
  // The backend treats search as a regular expression; escape user text for literal matching.
  if (search) params.search = escapeSearch(search);
  if (categoryId) params.category = categoryId;
  for (const key of ["minPrice", "maxPrice"]) {
    const raw = searchParams.get(key);
    if (raw !== null && raw !== "" && Number.isFinite(Number(raw)) && Number(raw) >= 0) params[key] = Number(raw);
  }
  return params;
}
