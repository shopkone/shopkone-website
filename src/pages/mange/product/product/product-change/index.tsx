import { useEffect, useRef, useState } from 'react'
import { useDebounceFn } from 'ahooks'
import { Button, Flex, Form } from 'antd'

import Page from '@/components/page'
import Seo from '@/components/seo'
import { VariantType } from '@/constant/product'
import BaseInfo from '@/pages/mange/product/product/product-change/base-info'
import ProductOrganization from '@/pages/mange/product/product/product-change/product-organization'
import Status from '@/pages/mange/product/product/product-change/status'
import Variants from '@/pages/mange/product/product/product-change/variants'
import VariantsSettings from '@/pages/mange/product/product/product-change/variants-settings'
import { isEqualHandle } from '@/utils/isEqual'

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
  }
}

export default function ProductChange () {
  const [form] = Form.useForm()

  const [isChange, setIsChange] = useState(false)
  const init = useRef<any>()

  const onOK = async () => {
    await form.validateFields()
    console.log(form.getFieldsValue())
  }

  const onValuesChange = useDebounceFn(() => {
    if (!init.current) return
    const values = form.getFieldsValue()
    if (!init.current?.variants?.length) {
      init.current = values
      return
    }
    const isSame = isEqualHandle(init.current, values)
    setIsChange(!isSame)
  }, { wait: 300 }).run

  const onCancel = () => {
    form.setFieldsValue(init.current)
    setIsChange(false)
  }

  useEffect(() => {
    form.setFieldsValue(INIT_DATA)
    init.current = form.getFieldsValue()
  }, [])

  return (
    <Page
      onOk={onOK}
      onCancel={onCancel}
      isChange={isChange}
      title={'Add product'}
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
              <Variants />
            </Form.Item>
          </Flex>
        </Flex>
      </Form>
    </Page>
  )
}
