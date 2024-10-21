import { useRequest } from 'ahooks'
import { Card, Form, Input, Select } from 'antd'

import { CollectionOptionsApi } from '@/api/collection/options'
import SSelect from '@/components/s-select'
import { useI18n } from '@/hooks/use-lang'
import SelectCategory from '@/pages/mange/product/product/product-change/product-organization/select-category'

export default function ProductOrganization () {
  const options = useRequest(CollectionOptionsApi)
  const t = useI18n()
  return (
    <Card title={t('商品设置')}>
      <Form.Item name={'category'} label={t('分类')}>
        <SelectCategory />
      </Form.Item>
      <Form.Item tooltip={t('标准化产品单元，如：属性值、特性相同的商品可以称为一个 SPU')} name={'spu'} label={t('SPU')}>
        <Input autoComplete={'off'} />
      </Form.Item>
      <Form.Item name={'vendor'} label={t('供应商')}>
        <Input autoComplete={'off'} />
      </Form.Item>
      <Form.Item name={'collections'} label={t('专辑')}>
        <SSelect loading={options.loading} options={options.data || []} />
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
