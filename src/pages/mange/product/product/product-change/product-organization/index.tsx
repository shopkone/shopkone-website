import { Button, Card, Checkbox, Form, Input, Select } from 'antd'

import Categories from '@/components/categories'
import SSelect from '@/components/s-select'
import { useOpen } from '@/hooks/useOpen'

import styles from './index.module.less'

export default function ProductOrganization () {
  const selectCategoriesInfo = useOpen<number>()

  const onSelectCategories = (data: number) => {
  }

  return (
    <Card title={'Product organization'}>
      <Form.Item
        name={'requires_shipping'}
        valuePropName={'checked'}
        style={{ marginBottom: 8 }}
      >
        <Checkbox>Requires shipping</Checkbox>
      </Form.Item>
      <Form.Item
        name={'charge_tax_on_this_product'}
        valuePropName={'checked'}
      >
        <Checkbox>Charge tax on this product</Checkbox>
      </Form.Item>
      <div className={styles.line} />
      <Form.Item label={'Category'}>
        <Button
          onClick={() => { selectCategoriesInfo.edit(111) }}
          className={'primary-text'}
          style={{ marginLeft: -7 }}
          type={'text'}
          size={'small'}
        >
          Select category
        </Button>
      </Form.Item>
      <div className={styles.line} />
      <Form.Item name={'spu'} label={'Spu'}>
        <Input autoComplete={'off'} />
      </Form.Item>
      <Form.Item name={'vendor'} label={'Vendor'}>
        <Input autoComplete={'off'} />
      </Form.Item>
      <Form.Item name={'collections'} label={'Collections'}>
        <SSelect />
      </Form.Item>
      <Form.Item name={'tags'} className={'mb0'} label={'Tags'}>
        <Select
          open={false}
          mode={'tags'}
          suffixIcon={null}
        />
      </Form.Item>
      <Categories onConfirm={onSelectCategories} info={selectCategoriesInfo} />
    </Card>
  )
}
