export const roundPrice = (value: number): number => {
  if (!value) return 0
  const price = Math.round((value || 0) * 100) / 100
  if (price < 0) return 0
  return price
}

export function formatPrice (x?: string | number) {
  if (typeof x === 'undefined' || x === '') return ''
  // 千分位
  const str = x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  // 两位小数点
  const arr = str.split('.')
  if (arr?.length === 1) {
    return str + '.00'
  }
  return arr[0] + '.' + arr[1].padEnd(2, '0')
}

export function getPriceString (prices?: Array<number | undefined>) {
  // @ts-expect-error
  const list: number[] = prices?.filter(i => typeof i === 'number') || []
  if (!list?.length) return '$ 0.00'
  const max = Math.max(...list)
  const min = Math.min(...list)
  return max === min ? `$ ${formatPrice(max)}` : `$ ${formatPrice(min)} - $ ${formatPrice(max)}`
}
