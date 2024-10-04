import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Card, Flex, Form } from 'antd'
import cloneDeep from 'lodash/cloneDeep'

import SRender from '@/components/s-render'
import { VariantType } from '@/constant/product'
import { useOpen } from '@/hooks/useOpen'
import Changer from '@/pages/mange/product/product/product-change/variants/changer'
import { Option, Variant } from '@/pages/mange/product/product/product-change/variants/state'
import Table from '@/pages/mange/product/product/product-change/variants/table'
import { isEqualHandle } from '@/utils/is-equal-handle'
import { genId } from '@/utils/random'

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
  const { id } = useParams()
  const init = useRef<Variant[]>()
  const variantType: VariantType = Form.useWatch('variant_type', form)

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
    setIsChange(!isSame)
  }

  useEffect(() => {
    if (!remoteVariants?.length) return
    setVariants(remoteVariants)
    onReverseVariants(remoteVariants).then(() => {
      onIsChange(remoteVariants, true)
    })
  }, [remoteVariants])

  useEffect(() => {
    if (id && !init.current?.length) return
    if (!variantType) return
    if (variantType === VariantType.Single) {
      const item: Variant = {
        price: 0,
        cost_per_item: null,
        compare_at_price: null,
        weight_unit: 'g' as unknown as any,
        weight: null,
        sku: '',
        barcode: '',
        name: [],
        id: genId(),
        isParent: false,
        inventories: []
      }
      if (remoteVariants?.length && !remoteVariants?.[0]?.name?.length) {
        setVariants(remoteVariants)
      } else {
        setVariants([item])
      }
      return
    }
    if (variantType === VariantType.Multiple) {
      if (remoteVariants?.length && remoteVariants?.[0]?.name?.length) {
        setVariants(remoteVariants)
      } else {
        setVariants([])
      }
    }
  }, [variantType])

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
          <SRender render={variants?.length}>
            <Button
              onClick={() => { openInfo.edit() }}
              type={'text'}
              size={'small'}
            >
              Set columns
            </Button>
          </SRender>
          <SRender render={variantType === VariantType.Multiple && !!variants?.length}>
            <Button
              onClick={() => { openInfo.edit(form.getFieldValue('variants')) }}
              type={'text'}
              size={'small'}
              className={'primary-text'}
            >
              Edit options
            </Button>
          </SRender>
        </Flex>
      }
    >
      <Changer
        onChangeLoading={setLoading}
        onChange={(v, o) => { onChange(v); setOptions(o) }}
        info={openInfo}
      />
      <Table
        onOpenOptions={() => { openInfo.edit() }}
        onChangeGroupVariants={onIsChange}
        loading={loading}
        variants={variants}
        options={options}
      />
    </Card>
  )
}
