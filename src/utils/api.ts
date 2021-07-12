export function destructureNumberQuery(
  query: string | string[] | undefined,
  defaultQuery: number = 0
): number {
  return query === undefined
    ? defaultQuery
    : typeof query === "string"
    ? Number(query)
    : Number(query[0]);
}
