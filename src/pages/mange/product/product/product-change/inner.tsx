import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDebounceFn, useRequest } from 'ahooks'
import { Button, Flex, Form } from 'antd'

import { ProductCreateApi } from '@/api/product/create'
import { ProductInfoApi } from '@/api/product/info'
import Page from '@/components/page'
import Seo from '@/components/seo'
import { VariantType } from '@/constant/product'
import BaseInfo from '@/pages/mange/product/product/product-change/base-info'
import ProductOrganization from '@/pages/mange/product/product/product-change/product-organization'
import Status from '@/pages/mange/product/product/product-change/status'
import Variants from '@/pages/mange/product/product/product-change/variants'
import { Variant } from '@/pages/mange/product/product/product-change/variants/state'
import VariantsSettings from '@/pages/mange/product/product/product-change/variants-settings'
import { isEqualHandle } from '@/utils/is-equal-handle'

import styles from './index.module.less'

const INIT_DATA = {
  status: 2,
  requires_shipping: true,
  taxable: true,
  inventory_tracking: true,
  inventory_policy: 2,
  spu: '',
  vendor: '',
  tags: [],
  title: '',
  description: '',
  variant_type: VariantType.Single,
  seo: {
    page_title: '',
    meta_description: '',
    url_handle: '',
    follow: true
  },
  collections: undefined
}
export interface ProductChangeInnerProps {
  onFresh: (id: number) => void
}

export default function ProductChangeInner (props: ProductChangeInnerProps) {
  const [form] = Form.useForm()

  const [isChange, setIsChange] = useState(false)
  const [isVariantChange, setIsVariantChange] = useState(false)
  const [resetFlag, setResetFlag] = useState(0)
  const [resetLoading, setResetLoading] = useState(false)
  const [remoteVariants, setRemoteVariants] = useState<Variant[]>([])
  const init = useRef<any>()
  const create = useRequest(ProductCreateApi, { manual: true })
  const info = useRequest(ProductInfoApi, { manual: true })
  const { id } = useParams()

  const onOK = async () => {
    await form.validateFields()
    const values = form.getFieldsValue()
    const variants: Variant[] = []
    values?.variants?.forEach((variant: Variant) => {
      if (variant.children?.length) {
        variants.push(...variant.children)
      } else {
        variants.push(variant)
      }
    })
    values.variants = variants
    if (id) {
      console.log(values.variants)
    } else {
      const ret = await create.runAsync(values)
      props.onFresh(ret.id)
      form.resetFields()
      onCancel()
    }
  }

  const onValuesChange = useDebounceFn(() => {
    if (!init.current) return
    const values = form.getFieldsValue()
    let noInitSeo = init.current?.seo?.follow && (init.current?.seo?.page_title !== init?.current?.title)
    noInitSeo = noInitSeo || (!init.current?.seo?.follow && !init.current?.seo?.page_title)
    if (!init.current?.variants?.length || noInitSeo) {
      init.current = values
      return
    }
    const newValues = { ...values, variants: undefined, options: undefined, seo: { ...values.seo, id: 0 } }
    const oldValues = { ...init.current, variants: undefined, options: undefined, seo: { ...init.current.seo, id: 0 } }
    const isSame = isEqualHandle(newValues, oldValues)
    setIsChange(!isSame)
  }, { wait: 100 }).run

  const onCancel = () => {
    form.setFieldsValue(init.current)
    setResetFlag(resetFlag + 1)
    setIsChange(false)
  }

  useEffect(() => {
    if (!info.data && id) return
    if (info.data) {
      form.setFieldsValue(info.data)
      init.current = info.data
      setRemoteVariants(info.data.variants)
    } else {
      form.setFieldsValue(INIT_DATA)
      init.current = form.getFieldsValue()
    }
  }, [info.data])

  useEffect(() => {
    if (!id) return
    info.run({ id: Number(id) })
  }, [id])

  return (
    <Page
      resetLoading={resetLoading}
      loading={info.loading}
      onOk={onOK}
      onCancel={onCancel}
      isChange={isChange || isVariantChange}
      title={id ? (info?.data?.title || '--') : 'Add product'}
      back={'/products/products'}
      width={950}
      bottom={48}
      header={
        <Flex gap={8}>
          <Button type={'text'}>Duplicate</Button>
          <Button type={'text'}>Preview</Button>
          <Button type={'text'}>Share</Button>
          <Button type={'text'}>More actions</Button>
        </Flex>
      }
      footer={
        <Flex gap={8}>
          <Button type={'primary'} danger>Delete Product</Button>
        </Flex>
      }
    >
      <Form onValuesChange={onValuesChange} className={styles.container} form={form} layout={'vertical'}>
        <Flex gap={16}>
          <Flex vertical gap={16} flex={1}>
            <Flex gap={16}>
              <Flex vertical gap={16}>
                <BaseInfo />
                <VariantsSettings />
              </Flex>
              <Flex vertical style={{ width: 320 }} gap={16}>
                <Status />
                <ProductOrganization />
                <Form.Item className={'mb0'} name={'seo'}>
                  <Seo />
                </Form.Item>
              </Flex>
            </Flex>
            <Form.Item name={'variants'}>
              <Variants
                onResetLoading={setResetLoading}
                remoteVariants={remoteVariants}
                resetFlag={resetFlag}
                setIsChange={setIsVariantChange}
              />
            </Form.Item>
          </Flex>
        </Flex>
      </Form>
    </Page>
  )
}
