import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { IconMaximize, IconMinimize, IconPencil } from '@tabler/icons-react'
import { Flex, Form, Tooltip } from 'antd'
import cloneDeep from 'lodash/cloneDeep'

import IconButton from '@/components/icon-button'
import SCard from '@/components/s-card'
import SRender from '@/components/s-render'
import { VariantType } from '@/constant/product'
import { useI18n } from '@/hooks/use-lang'
import { useOpen } from '@/hooks/useOpen'
import Changer from '@/pages/mange/product/product/product-change/variants/changer'
import { Option, useProductChange, Variant } from '@/pages/mange/product/product/product-change/variants/state'
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
  onValueChange: () => void
  setLoaded: () => void
}

export default function Variants (props: VariantsProps) {
  const { remoteVariants, setIsChange, resetFlag, onResetLoading, onValueChange, setLoaded } = props
  const form = Form.useFormInstance()
  const [variants, setVariants] = useState<Variant[]>([])
  const [options, setOptions] = useState<Option[]>([])
  const [loading, setLoading] = useState(false)
  const { id } = useParams()
  const init = useRef<Variant[]>()
  const variantType: VariantType = Form.useWatch('variant_type', form)
  const [isFull, setIsFull] = useState(false)

  const onChange = (data: Variant[]) => {
    setVariants(data)
  }
  const openInfo = useOpen<Variant[]>([])

  const info = useProductChange(state => state.info)
  const t = useI18n()

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
      const oldItem = { ...item, hidden: undefined, parentId: undefined }
      const newItem = { ...find, hidden: undefined, parentId: undefined }
      return isEqualHandle(oldItem, newItem)
    })
    setIsChange(!isSame || (init.current?.length !== list?.length))
  }

  useEffect(() => {
    if (!remoteVariants?.length) return
    setVariants(remoteVariants)
    onReverseVariants(remoteVariants).then(() => {
      onIsChange(remoteVariants, true)
    })
  }, [remoteVariants])

  useEffect(() => {
    if (id && !info?.variants?.length) return
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
        inventories: [],
        shipping_required: true,
        tax_required: true
      }
      if (info?.variant_type === VariantType.Single) {
        setVariants(remoteVariants)
      } else {
        setVariants([init.current?.[0] || item])
      }
      setOptions([])
      return
    }
    if (variantType === VariantType.Multiple) {
      if (info?.variant_type === VariantType.Multiple) {
        setVariants(remoteVariants)
        onReverseVariants(remoteVariants)
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
    <div className={isFull ? styles.global : ''}>
      <SCard
        bordered
        className={styles.container}
        style={{ margin: isFull ? '16px 24px' : undefined }}
        title={
          <Flex gap={8} align={'center'}>
            <div>{t('款式')}</div>
            <div style={{ fontWeight: 400, fontSize: 12, position: 'relative', top: 1 }}>
              {variants?.length > 1 ? `(${variants?.length} ${t('条记录')})` : ''}
            </div>
          </Flex>
        }
        extra={
          <Flex gap={12}>
            <SRender render={variantType === VariantType.Multiple && !!variants?.length}>
              <Tooltip title={t('编辑选项')}>
                <IconButton
                  onClick={() => { openInfo.edit(form.getFieldValue('variants')) }}
                  type={'text'}
                  size={25}
                  className={'primary-text'}
                >
                  <IconPencil size={16} />
                </IconButton>
              </Tooltip>
            </SRender>
            <SRender render={variants?.length} style={{ width: 24, height: 24 }} />
            <SRender render={variants?.length}>
              <SRender render={!isFull}>
                <Tooltip title={t('最大化')}>
                  <IconButton
                    onClick={() => { setIsFull(!isFull) }}
                    type={'text'}
                    size={25}
                  >
                    <IconMaximize size={15} />
                  </IconButton>
                </Tooltip>
              </SRender>
              <SRender render={isFull}>
                <Tooltip title={t('最小化')}>
                  <IconButton
                    onClick={() => { setIsFull(!isFull) }}
                    type={'text'}
                    size={25}
                  >
                    <IconMinimize size={15} />
                  </IconButton>
                </Tooltip>
              </SRender>
            </SRender>
          </Flex>
        }
      >
        <Changer
          onChangeLoading={setLoading}
          onChange={(v, o) => { onChange(v); setOptions(o); onValueChange() }}
          info={openInfo}
        />
        <Table
          setLoaded={setLoaded}
          settingsStyle={{ display: variants?.length ? 'unset' : 'none', right: variantType === VariantType.Single ? 36 : 36 }}
          forceChange={onChange}
          onOpenOptions={() => { openInfo.edit() }}
          onChangeGroupVariants={onIsChange}
          loading={loading}
          variants={variants}
          options={options}
          isFull={isFull}
        />
      </SCard>
    </div>
  )
}
