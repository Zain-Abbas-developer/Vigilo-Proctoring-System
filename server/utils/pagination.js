export function getPagination(query = {}, { defaultLimit = 20, maxLimit = 100 } = {}) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(maxLimit, Math.max(1, parseInt(query.limit, 10) || defaultLimit));
  return { page, limit, skip: (page - 1) * limit };
}
export function getSort(query = {}, fallback = { createdAt: -1 }) {
  if (!query.sort) return fallback;
  const direction = String(query.order || 'desc').toLowerCase() === 'asc' ? 1 : -1;
  return { [query.sort]: direction };
}
export function paginated(items, total, page, limit) {
  return { items, pagination: {
    total, page, limit,
    totalPages: Math.ceil(total / limit) || 1,
    hasNext: page * limit < total,
    hasPrev: page > 1,
  }};
}
