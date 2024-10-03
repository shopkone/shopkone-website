import isEqual from 'lodash/isEqual'

export const isEqualHandle = (a: any, b: any) => {
  if (typeof a !== 'object') return a === b
  const everySame = Object.keys(a).every(key => {
    return isEqual(a[key], b[key])
  })
  return everySame
}
