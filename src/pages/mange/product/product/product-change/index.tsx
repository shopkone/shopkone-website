import { useEffect } from 'react'
import { Button, Flex, Form } from 'antd'

import Page from '@/components/page'
import Seo from '@/components/seo'
import BaseInfo from '@/pages/product/product/product-change/base-info'
import ProductOrganization from '@/pages/product/product/product-change/product-organization'
import Status from '@/pages/product/product/product-change/status'
import Variants from '@/pages/product/product/product-change/variants'
import VariantsSettings from '@/pages/product/product/product-change/variants-settings'

import styles from './index.module.less'

const INIT_DATA = {
  status: 2,
  requires_shipping: true,
  taxable: true,
  inventory_tracking: true,
  inventory_policy: 2,
  variant_type: 1
}

export default function ProductChange () {
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue(INIT_DATA)
  }, [])

  return (
    <Page
      title={'Add product'}
      back={'/products'}
      width={950}
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
      <Form className={styles.container} form={form} layout={'vertical'}>
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
            <Variants />
          </Flex>
        </Flex>
      </Form>
    </Page>
  )
}
