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

export function getCoinGeckoAssetPlatform(chainId: number): string {
  if (chainId === 1) {
    return "ethereum";
  } else {
    return "ethereum";
  }
}
