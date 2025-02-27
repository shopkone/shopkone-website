import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { Button, Flex, Form } from 'antd'
import dayjs, { Dayjs } from 'dayjs'

import { ProductCreateApi } from '@/api/product/create'
import { ProductInfoApi } from '@/api/product/info'
import { ProductUpdateApi } from '@/api/product/update'
import Page from '@/components/page'
import { sMessage } from '@/components/s-message'
import SRender from '@/components/s-render'
import Seo from '@/components/seo'
import { VariantType } from '@/constant/product'
import BaseInfo from '@/pages/mange/product/product/product-change/base-info'
import OtherSettings from '@/pages/mange/product/product/product-change/other-settings'
import ProductOrganization from '@/pages/mange/product/product/product-change/product-organization'
import Status from '@/pages/mange/product/product/product-change/status'
import VariantSet from '@/pages/mange/product/product/product-change/variant-set'
import { useProductChange, Variant } from '@/pages/mange/product/product/product-change/variant-set/state'
import { isEqualHandle } from '@/utils/is-equal-handle'

import styles from './index.module.less'

const INIT_DATA = {
  status: 2,
  inventory_tracking: true,
  inventory_policy: 1,
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
  collections: undefined,
  enabled_location_ids: []
}
export interface ProductChangeInnerProps {
  onFresh: (id: number) => void
}

export default function ProductChangeInner (props: ProductChangeInnerProps) {
  const [form] = Form.useForm()

  const [isChange, setIsChange] = useState(false)
  const init = useRef<any>()
  const create = useRequest(ProductCreateApi, { manual: true })
  const info = useRequest(ProductInfoApi, { manual: true })
  const update = useRequest(ProductUpdateApi, { manual: true })
  const setInfo = useProductChange(state => state.setInfo)
  const { id } = useParams()
  const { t } = useTranslation('product', { keyPrefix: 'product' })

  const onOK = async () => {
    await form.validateFields()
    const values = form.getFieldsValue()
    const variants: Variant[] = []
    if (values.scheduled_at) {
      values.scheduled_at = (values.scheduled_at as Dayjs).unix()
    }
    if (!values?.variants?.length) {
      sMessage.warning(t('请至少设置一个款式'))
      return
    }
    values?.variants?.forEach((variant: Variant, index: number) => {
      if (variant.children?.length) {
        variants.push(...variant.children)
      } else {
        variants.push(variant)
      }
    })
    values.variants = variants
    if (id) {
      await update.runAsync({ ...values, id: Number(id) })
      form.resetFields()
      onCancel()
      props.onFresh(Number(id))
      sMessage.success(t('商品更新成功'))
    } else {
      const ret = await create.runAsync(values)
      props.onFresh(ret.id)
      form.resetFields()
      onCancel()
      sMessage.success(t('商品添加成功'))
    }
  }

  const onValuesChange = () => {
    if (!init.current) return
    const values = form.getFieldsValue() || {}
    let noInitSeo = init.current?.seo?.follow && (init.current?.seo?.page_title !== init?.current?.title)
    noInitSeo = noInitSeo || (!init.current?.seo?.follow && !init.current?.seo?.page_title)
    if (!init.current?.variants?.length || noInitSeo) {
      if (!id) {
        init.current = { ...values, ...INIT_DATA }
      } else {
        init.current = values
      }
      return
    }
    const newValues = { ...values, seo: { ...values.seo, id: 0 } }
    const oldValues = { ...init.current, seo: { ...init.current.seo, id: 0 } }
    const isSame = isEqualHandle(newValues, oldValues)
    setIsChange(!isSame)
  }

  const onCancel = () => {
    form.setFieldsValue(init.current)
    setIsChange(false)
  }

  useEffect(() => {
    if (!info.data && id) return
    if (info.data) {
      const { scheduled_at, ...rest } = info.data
      const enabled_location_ids: number[] = []
      rest?.variants?.forEach(i => {
        i.inventories?.forEach(ii => {
          if (ii.location_id) {
            enabled_location_ids.push(ii.location_id)
          }
        })
      })
      const values = {
        ...rest,
        scheduled_at: scheduled_at ? dayjs.unix(scheduled_at) : undefined,
        enabled_location_ids: [...new Set(enabled_location_ids)]
      }
      form.setFieldsValue(values)
      init.current = values
    } else {
      form.setFieldsValue(INIT_DATA)
      init.current = form.getFieldsValue()
    }
    setInfo(info.data)
  }, [info.data])

  useEffect(() => {
    if (!id) return
    info.run({ id: Number(id) })
  }, [id])

  return (
    <Page
      loading={info.loading}
      onOk={onOK}
      onCancel={onCancel}
      isChange={isChange}
      title={id ? (info?.data?.title || '--') : t('添加商品')}
      back={'/products/products'}
      width={950}
      bottom={48}
      header={
        <SRender render={info?.data?.title}>
          <Flex gap={8}>
            <Button type={'text'}>{t('复制')}</Button>
            <Button type={'text'}>{t('预览')}</Button>
            <Button type={'text'}>{t('分享')}</Button>
          </Flex>
        </SRender>
      }
      footer={
        <SRender render={info?.data?.title}>
          <Flex gap={8}>
            <Button type={'primary'} danger>{t('删除商品')}</Button>
          </Flex>
        </SRender>
      }
    >
      <Form onValuesChange={onValuesChange} className={styles.container} form={form} layout={'vertical'}>
        <Flex gap={16}>
          <Flex vertical gap={16} flex={1}>
            <Flex gap={16}>
              <Flex vertical gap={16}>
                <BaseInfo />
                <OtherSettings />
              </Flex>
              <Flex vertical style={{ width: 320 }} gap={16}>
                <Status />
                <ProductOrganization />
                <Form.Item style={{ flex: 1 }} className={'mb0'} name={'seo'}>
                  <Seo />
                </Form.Item>
              </Flex>
            </Flex>
            <VariantSet />
          </Flex>
        </Flex>
      </Form>
    </Page>
  )
}
