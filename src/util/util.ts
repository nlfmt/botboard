type ConditionalClass = [string, unknown]
/** Combines classes into a single string */
export function classes(...classNames: (string | ConditionalClass | undefined | null)[]) {
  return classNames.map(c => (
    Array.isArray(c)) ? c[1] ? c[0] : "" : c
  ).filter(Boolean).join(" ")
}

export function nTimes(count: number, fn: (i: number) => React.ReactNode) {
  return Array.from({ length: count }, (_, i) => fn(i))
}