import { useTranslation } from 'react-i18next'
import { useRequest } from 'ahooks'
import { Card, Form, Input, Select } from 'antd'

import { CollectionOptionsApi } from '@/api/collection/options'
import SSelect from '@/components/s-select'
import SelectCategory from '@/pages/mange/product/product/product-change/product-organization/select-category'

export default function ProductOrganization () {
  const options = useRequest(CollectionOptionsApi)
  const { t } = useTranslation('product')

  return (
    <Card title={t('商品设置')}>
      <Form.Item name={'category'} label={t('分类')}>
        <SelectCategory />
      </Form.Item>
      <Form.Item tooltip={t('spu提示')} name={'spu'} label={t('SPU')}>
        <Input autoComplete={'off'} />
      </Form.Item>
      <Form.Item name={'vendor'} label={t('供应商')}>
        <Input autoComplete={'off'} />
      </Form.Item>
      <Form.Item name={'collections'} label={t('系列')}>
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
