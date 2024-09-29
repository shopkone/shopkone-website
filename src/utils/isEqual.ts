import isEqual from 'lodash/isEqual'

export const isEqualHandle = (v1: any, v2: any) => {
  const equal = isEqual(v1, v2)
  if (!equal) {
    return Object.keys(v1).every(key => {
      return isEqual(v1?.[key], v2?.[key])
    })
  }
  return equal
}
