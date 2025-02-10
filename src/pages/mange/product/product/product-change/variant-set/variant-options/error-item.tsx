import { ErrorObj } from '@/pages/mange/product/product/product-change/variant-set/variant-options/error-handle'

import styles from './index.module.less'

export interface ErrorItemProps {
  errors: ErrorObj[]
  id: number
  isLabel: boolean
}

export default function ErrorItem (props: ErrorItemProps) {
  const { errors, id, isLabel } = props

  const err = errors.find(item => item.id === id && item.isLabel === isLabel)

  if (!err) return null

  return (
    <div className={styles.err}>{err.msg}</div>
  )
}
