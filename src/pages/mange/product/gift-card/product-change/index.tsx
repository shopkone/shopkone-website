import { useTranslation } from 'react-i18next'
import { Checkbox, Flex, Form, Radio } from 'antd'

import Page from '@/components/page'
import SCard from '@/components/s-card'
import Seo from '@/components/seo'
import { useInventoryPolicyOptions, VariantStatus } from '@/constant/product'
import BaseInfo from '@/pages/mange/product/gift-card/product-change/base-info'
import Denominations from '@/pages/mange/product/gift-card/product-change/denominations'
import Status from '@/pages/mange/product/gift-card/product-change/status'
import styles from '@/pages/mange/product/product/product-change/variants-settings/index.module.less'
import { genId } from '@/utils/random'

export default function ProductChange () {
  const { t } = useTranslation('product')
  const tackOptions = useInventoryPolicyOptions(t)
  const [form] = Form.useForm()

  const initValues = {
    status: VariantStatus.Published,
    denominations: [{ id: genId(), denomination: 0, selling_price: 0 }]
  }

  return (
    <Page isChange back={'/products/gift_cards'} width={950} title={t('创建礼品卡商品')}>
      <Form initialValues={initValues} form={form} className={'fit-width'} layout={'vertical'}>
        <Flex className={'fit-width'} gap={16}>
          <Flex vertical flex={1} gap={16}>
            <BaseInfo />
            <Denominations />
          </Flex>
          <Flex vertical gap={16} style={{ width: 320 }}>
            <Status />
            <SCard title={t('库存管理')}>
              <Form.Item style={{ marginBottom: 8 }} name={'variant_type'}>
                <Checkbox>{t('需要图片')}</Checkbox>
              </Form.Item>
              <Form.Item name={'inventory_tracking'} valuePropName={'checked'}>
                <Checkbox>{t('跟踪库存')}</Checkbox>
              </Form.Item>
              <Form.Item name={'inventory_policy'} style={{ marginBottom: 0, marginTop: -12 }}>
                <Radio.Group className={styles.group} options={tackOptions} />
              </Form.Item>
            </SCard>
            <Seo />
          </Flex>
        </Flex>
      </Form>
    </Page>
  )
}
