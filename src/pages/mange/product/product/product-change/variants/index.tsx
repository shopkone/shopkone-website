import { useEffect, useRef, useState } from 'react'
import { Button, Card, Flex, Form } from 'antd'
import cloneDeep from 'lodash/cloneDeep'

import { useOpen } from '@/hooks/useOpen'
import Changer, { Option } from '@/pages/mange/product/product/product-change/variants/changer'
import Table from '@/pages/mange/product/product/product-change/variants/table'
import { Variant } from '@/pages/mange/product/product/product-change/variants/variant-table'
import { isEqualHandle } from '@/utils/is-equal-handle'

// @ts-expect-error
import ReserveHandle from './changer/reserve-handle?worker'
import styles from './index.module.less'

export interface VariantsProps {
  setIsChange: (isChange: boolean) => void
  resetFlag: number
  remoteVariants: Variant[]
  onResetLoading: (isLoading: boolean) => void
}

export default function Variants (props: VariantsProps) {
  const { remoteVariants, setIsChange, resetFlag, onResetLoading } = props
  const form = Form.useFormInstance()
  const [variants, setVariants] = useState<Variant[]>([])
  const [options, setOptions] = useState<Option[]>([])
  const [loading, setLoading] = useState(false)

  const init = useRef<Variant[]>()

  const onChange = (data: Variant[]) => {
    setVariants(data)
  }
  const openInfo = useOpen<Variant[]>([])

  const onReverseVariants = async (variants: Variant[]) => await new Promise(resolve => {
    const worker: Worker = new ReserveHandle()
    worker.postMessage({ variants })
    worker.onmessage = (e) => {
      setOptions(e.data)
      setTimeout(() => {
        resolve(e.data)
      })
    }
  })

  const onIsChange = (v: Variant[], force?: boolean) => {
    const list: Variant[] = []
    v?.forEach(i => {
      if (i.children) {
        list.push(...i.children)
      } else {
        list.push(i)
      }
    })
    if (!init.current?.length || force) {
      init.current = list
    }
    const isSame = list.every(item => {
      const find = init.current?.find(i => i.id === item.id)
      if (!find) return false
      return isEqualHandle(find, item)
    })
    console.log(isSame, list, init.current)
    setIsChange(!isSame)
  }

  useEffect(() => {
    setVariants(remoteVariants)
    onReverseVariants(remoteVariants).then(() => {
      onIsChange(remoteVariants, true)
    })
  }, [remoteVariants])

  useEffect(() => {
    if (!resetFlag) return
    onResetLoading(true)
    onReverseVariants(init.current || []).then(res => {
      setVariants(cloneDeep(init.current || []))
      onResetLoading(false)
    })
  }, [resetFlag])

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
      <Table
        onChange={onIsChange}
        loading={loading}
        variants={variants}
        options={options}
      />
    </Card>
  )
}
