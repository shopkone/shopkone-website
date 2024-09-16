import { useEffect } from 'react'
import { Flex, Form } from 'antd'

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
    <Form className={styles.container} form={form} layout={'vertical'}>
      <Flex gap={16} style={{ width: 950, margin: '24px auto' }}>
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
  )
}
