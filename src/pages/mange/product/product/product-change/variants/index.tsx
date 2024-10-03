import { useEffect, useState } from 'react'
import { Button, Card, Flex, Form } from 'antd'

import { useOpen } from '@/hooks/useOpen'
import Changer, { Option } from '@/pages/mange/product/product/product-change/variants/changer'
import Table from '@/pages/mange/product/product/product-change/variants/table'
import { Options } from '@/pages/mange/product/product/product-change/variants/variant-changer'
import { Variant } from '@/pages/mange/product/product/product-change/variants/variant-table'

import styles from './index.module.less'

export interface VariantsProps {
  onIsChange: (isChange: boolean) => void
  resetFlag: number
  remoteVariants: Variant[]
  remoteOptions: Options[]
}

export default function Variants (props: VariantsProps) {
  const { remoteOptions, remoteVariants } = props
  const form = Form.useFormInstance()
  const [variants, setVariants] = useState<Variant[]>([])
  const [options, setOptions] = useState<Option[]>([])
  const [loading, setLoading] = useState(false)

  const onChange = (data: Variant[]) => {
    setVariants(data)
  }
  const openInfo = useOpen<Variant[]>([])

  useEffect(() => {
    setOptions(remoteOptions)
    setVariants(remoteVariants)
  }, [remoteOptions])

  return (
    <Card
      bordered
      className={styles.container}
      title={'Variants'}
      extra={
        <Flex gap={8}>
          <Button
            onClick={() => { openInfo.edit() }}
            type={'text'}
            size={'small'}
          >
            调整列
          </Button>
          <Button
            onClick={() => { openInfo.edit(form.getFieldValue('variants')) }}
            type={'text'}
            size={'small'}
            className={'primary-text'}
          >
            编辑变体
          </Button>
        </Flex>
      }
    >
      <Changer
        onChangeLoading={setLoading}
        onChange={(v, o) => { onChange(v); setOptions(o) }}
        info={openInfo}
      />
      <Table loading={loading} variants={variants} options={options} />
    </Card>
  )
}
