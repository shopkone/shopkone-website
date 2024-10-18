export const sum = (...args: Array<number | undefined>) => {
  return args.reduce((pre, cur) => (pre || 0) + (cur || 0), 0)
}

export const reduce = (...args: Array<number | undefined>) => {
  const count = args.reduce((pre, cur) => (pre || 0) - (cur || 0), Number(args?.[0] || 0))
  return Number(count) + Number(args?.[0] || 0)
}
