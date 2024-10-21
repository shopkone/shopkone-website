import { Card, Form, Input, Select } from 'antd'

import SSelect from '@/components/s-select'
import { useI18n } from '@/hooks/use-lang'
import SelectCategory from '@/pages/mange/product/product/product-change/product-organization/select-category'

export default function ProductOrganization () {
  const t = useI18n()
  return (
    <Card title={t('商品分类组织')}>
      <Form.Item name={'category'} label={t('商品分类')}>
        <SelectCategory />
      </Form.Item>
      <Form.Item name={'spu'} label={t('商品SPU')}>
        <Input autoComplete={'off'} />
      </Form.Item>
      <Form.Item name={'vendor'} label={t('供应商')}>
        <Input autoComplete={'off'} />
      </Form.Item>
      <Form.Item name={'collections'} label={t('商品系列')}>
        <SSelect />
      </Form.Item>
      <Form.Item name={'tags'} className={'mb0'} label={t('标签')}>
        <Select
          open={false}
          mode={'tags'}
          suffixIcon={null}
        />
      </Form.Item>
    </Card>
  )
}
