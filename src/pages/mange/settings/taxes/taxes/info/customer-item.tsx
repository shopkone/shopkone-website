import { useTranslation } from 'react-i18next'
import { Button, Form, FormListFieldData, Input } from 'antd'

import { ZoneListOut } from '@/api/base/countries'
import { CollectionOptionsRes } from '@/api/collection/options'
import { BaseCustomerTax, BaseCustomerTaxZone, CustomerTaxType } from '@/api/tax/info'
import SInputNumber from '@/components/s-input-number'
import SSelect from '@/components/s-select'
import STable, { STableProps } from '@/components/s-table'
import { genId } from '@/utils/random'

import styles from './index.module.less'

export interface CustomerItemProps {
  fields: FormListFieldData[]
  add: (value: any) => void
  name: number
  onUpdate: () => void
  collections: CollectionOptionsRes[]
  countryOptions: Array<{ label: string, value: string }>
}

export default function CustomerItem (props: CustomerItemProps) {
  const { fields, add, name: tableName, onUpdate, collections, countryOptions } = props
  const { t } = useTranslation('settings', { keyPrefix: 'tax' })
  const form = Form.useFormInstance()
  const getCustomer = (): BaseCustomerTax | undefined => form.getFieldValue('customers')?.[tableName]
  const getTitle = () => {
    const customer = getCustomer()
    if (!customer) return '--'
    if (customer?.type === CustomerTaxType.CustomerTaxTypeDelivery) {
      return t('运费')
    }
    if (!customer.collection_id) return '--'
    return collections?.find(i => customer?.collection_id === i.value)?.label
  }

  const columns: STableProps['columns'] = [
    {
      title: t('区域'),
      name: 'name',
      code: 'name',
      render: (name: number) => {
        const zones: BaseCustomerTaxZone[] | undefined = getCustomer()?.zones
        const options = countryOptions?.filter(i => !zones?.find(ii => ii.area_code === i.value))
        return (
          <Form.Item
            rules={[{ required: true, message: t('请选择区域') }]}
            className={'mb0'}
            name={[name, 'area_code']}
          >
            <SSelect
              options={options}
              onBlur={onUpdate}
              onFocus={onUpdate}
              showSearch
              optionFilterProp={'label'}
              placeholder={t('选择区域')}
              allowClear
              optionLabelProp={'label'}
            />
          </Form.Item>
        )
      }
    },
    {
      title: t('税名'),
      name: 'name',
      code: 'name',
      render: (name: number, row: ZoneListOut) => (
        <Form.Item
          rules={[{ required: true, message: t('请输入税名') }]}
          className={'mb0'}
          name={[name, 'name']}
        >
          <Input autoComplete={'off'} />
        </Form.Item>
      )
    },
    {
      title: t('税率'),
      name: 'name',
      code: 'name',
      render: (name: number, row: ZoneListOut) => (
        <Form.Item className={'mb0'} name={[name, 'tax_rate']}>
          <SInputNumber required min={0} suffix={'%'} precision={4} />
        </Form.Item>
      )
    }
  ]

  return (
    <div className={styles.item}>
      <div className={styles.title}>{getTitle()}</div>
      <STable
        init
        data={fields}
        columns={columns}
      />
      <Button
        onClick={() => {
          add({ id: genId(), name: 'VAT', tax_rate: 0 })
          onUpdate()
        }}
        type={'link'}
        size={'small'}
        className={styles.itemAdd}
      >
        {t('添加区域')}
      </Button>
    </div>
  )
}
