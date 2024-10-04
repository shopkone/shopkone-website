import { Checkbox } from 'antd'

import SRender from '@/components/s-render'
import { VariantType } from '@/constant/product'
import { Variant } from '@/pages/mange/product/product/product-change/variants/state'

import styles from './index.module.less'

export interface ColumnTitleProps {
  expands: number[]
  setExpands: (expands: number[]) => void
  variants: Variant[]
  variantType: VariantType
}

export default function ColumnTitle (props: ColumnTitleProps) {
  const { expands, setExpands, variants, variantType } = props

  const isAllExpanded = variants.every(v => expands.includes(v.id))

  const hasChild = variants.some(v => v.children?.length)

  const onExpandAll = () => {
    console.log(expands, variants.map(v => v.id))
    setExpands(isAllExpanded ? [] : variants.map(v => v.id))
  }

  return (
    <>
      <SRender render={variantType === VariantType.Multiple}>
        <Checkbox style={{ marginLeft: -8 }} />
      </SRender>
      <span style={{ marginLeft: 16 }}>Variants</span>
      <SRender render={!isAllExpanded && hasChild}>
        <span style={{ margin: '0 8px' }}>·</span>
        <span onClick={onExpandAll} className={styles.link}>expand all</span>
      </SRender>
      <SRender render={isAllExpanded ? hasChild : null}>
        <span style={{ margin: '0 8px' }}>·</span>
        <span className={styles.link} onClick={() => { setExpands([]) }}>
          collapse all
        </span>
      </SRender>
    </>
  )
}
