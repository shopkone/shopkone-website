import { useRef } from 'react'
import { Button, Card, Flex } from 'antd'

import { useOpen } from '@/hooks/useOpen'
import Table from '@/pages/mange/product/product/product-change/variants/table'

import Changer from './changer'
import styles from './index.module.less'
import { Option, Variant } from './state'

export interface VariantsProps {
  value?: Variant[]
  onChange?: (variants: Variant[]) => void
}

export default function Variants (props: VariantsProps) {
  const { value, onChange } = props
  const openInfo = useOpen<Variant[]>()
  const optionsRef = useRef<Option[]>([])

  return (
    <Card
      bordered
      className={styles.container}
      title={'Variants'}
      extra={
        <Flex gap={8}>
          <Button style={{ padding: '0 6px', height: 24 }} type={'text'} size={'small'}>
            Set columns
          </Button>
          <Button onClick={() => { openInfo.edit(value) }} size={'small'} className={'primary-text'} type={'text'}>
            Edit options
          </Button>
        </Flex>
      }
    >
      <Table value={value} onChange={onChange} />
      <Changer
        onChangeOptions={(options) => { optionsRef.current = options }}
        openInfo={openInfo}
        onChangeVariants={onChange}
      />
    </Card>
  )
}
