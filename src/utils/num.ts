export const roundPrice = (value: number): number => {
  if (!value) return 0
  const price = Math.round((value || 0) * 100) / 100
  if (price < 0) return 0
  return price
}

export function formatPrice (price?: string | number, symbol = '') {
  if (typeof price === 'undefined' || price === '') return ''
  const x = Number(price) / 100
  // 千分位
  const str = x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  // 两位小数点
  const arr = str.split('.')
  if (arr?.length === 1) {
    return symbol + str + '.00'
  }
  return symbol + arr[0] + '.' + arr[1].padEnd(2, '0')
}
