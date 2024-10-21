import { Card, Checkbox, Flex, Form, Radio } from 'antd'

import Page from '@/components/page'
import Seo from '@/components/seo'
import { useInventoryPolicyOptions, VariantStatus } from '@/constant/product'
import BaseInfo from '@/pages/mange/product/gift-card/product-change/base-info'
import Denominations from '@/pages/mange/product/gift-card/product-change/denominations'
import Status from '@/pages/mange/product/gift-card/product-change/status'
import styles from '@/pages/mange/product/product/product-change/variants-settings/index.module.less'
import { genId } from '@/utils/random'

export default function ProductChange () {
  const tackOptions = useInventoryPolicyOptions()
  const [form] = Form.useForm()

  const initValues = {
    status: VariantStatus.Published,
    denominations: [{ id: genId(), denomination: 0, selling_price: 0 }]
  }

  return (
    <Page type={'product'} isChange back={'/products/gift_cards'} width={950} title={'Create gift card product'}>
      <Form initialValues={initValues} form={form} className={'fit-width'} layout={'vertical'}>
        <Flex className={'fit-width'} gap={16}>
          <Flex vertical flex={1} gap={16}>
            <BaseInfo />
            <Denominations />
          </Flex>
          <Flex vertical gap={16} style={{ width: 320 }}>
            <Status />
            <Card title={'Inventory management'}>
              <Form.Item style={{ marginBottom: 8 }} name={'variant_type'}>
                <Checkbox>Require images</Checkbox>
              </Form.Item>
              <Form.Item name={'inventory_tracking'} valuePropName={'checked'}>
                <Checkbox>Inventory tracking</Checkbox>
              </Form.Item>
              <Form.Item name={'inventory_policy'} style={{ marginBottom: 0, marginTop: -12 }}>
                <Radio.Group className={styles.group} options={tackOptions} />
              </Form.Item>
            </Card>
            <Seo />
          </Flex>
        </Flex>
      </Form>
    </Page>
  )
}
