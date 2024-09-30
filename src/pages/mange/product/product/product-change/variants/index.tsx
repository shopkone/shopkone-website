import { useRef } from 'react'
import { Button, Card, Flex } from 'antd'

import { useOpen } from '@/hooks/useOpen'
import Changer from '@/pages/mange/product/product/product-change/variants/changer'
import { Options } from '@/pages/mange/product/product/product-change/variants/changer/item'
import Tables from '@/pages/mange/product/product/product-change/variants/tables'
import { Variant } from '@/pages/mange/product/product/product-change/variants/variant-table'

import styles from './index.module.less'

export interface VariantsProps {
  value?: Variant[]
  onChange?: (variants: Variant[]) => void
}

export default function Variants (props: VariantsProps) {
  const { value, onChange } = props
  const openInfo = useOpen<Variant[]>([])
  const optionsRef = useRef<Options[]>([])

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
      <Tables
        options={optionsRef.current}
        value={value}
        onChange={onChange}
      />
      <Changer
        onChangeOptions={options => { optionsRef.current = options }}
        onChangeVariants={onChange}
        info={openInfo}
      />
    </Card>
  )
}
