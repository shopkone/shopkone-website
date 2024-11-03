import { useTranslation } from 'react-i18next'
import { IconTrash } from '@tabler/icons-react'
import { Button, Flex, Form, FormListFieldData, Input, Select } from 'antd'

import { ZoneListOut } from '@/api/base/countries'
import { CollectionOptionsRes } from '@/api/collection/options'
import { BaseCustomerTax, BaseCustomerTaxZone, CustomerTaxType } from '@/api/tax/info'
import IconButton from '@/components/icon-button'
import SInputNumber from '@/components/s-input-number'
import SRender from '@/components/s-render'
import STable, { STableProps } from '@/components/s-table'
import { UseOpenType } from '@/hooks/useOpen'
import { AddModalData } from '@/pages/mange/settings/taxes/taxes/info/add-modal'
import { genId } from '@/utils/random'

import styles from './index.module.less'

export interface CustomerItemProps {
  fields: FormListFieldData[]
  add: (value: any) => void
  remove: (index: number) => void
  remove1: (index: number) => void
  name: number
  onUpdate: () => void
  collections: CollectionOptionsRes[]
  countryOptions: Array<{ label: string, value: string }>
  openInfo: UseOpenType<AddModalData>
}

export default function CustomerItem (props: CustomerItemProps) {
  const { fields, add, name: tableName, onUpdate, collections, countryOptions, remove, remove1, openInfo } = props
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

  const onEdit = () => {
    const customer = getCustomer()
    if (!customer) return
    const zone: BaseCustomerTaxZone = customer.zones?.[0]
    if (!zone) return
    const item: AddModalData = {
      id: customer.id,
      collection_id: customer.collection_id,
      type: customer.type,
      name: zone.name,
      tax_rate: zone.tax_rate,
      zone_id: zone.id,
      area_code: zone.area_code
    }
    openInfo.edit(item)
  }

  const columns: STableProps['columns'] = [
    {
      title: t('区域'),
      name: 'name',
      code: 'name',
      render: (name: number) => {
        const zones: BaseCustomerTaxZone[] | undefined = getCustomer()?.zones
        const options = countryOptions?.filter(i => !zones?.find(ii => ii.area_code === i.value) || i.value === zones?.[name]?.area_code)
        return (
          <SRender render={options?.length}>
            <Form.Item
              rules={[{ required: true, message: t('请选择区域') }]}
              className={'mb0'}
              name={[name, 'area_code']}
            >
              <Select
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
          </SRender>
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
    },
    {
      title: '',
      name: 'name',
      code: 'name',
      render: (name: number) => {
        const zones: BaseCustomerTaxZone[] | undefined = getCustomer()?.zones
        if (zones?.length === 1) return null
        return (
          <Flex justify={'center'}>
            <IconButton type={'text'} size={24}>
              <IconTrash size={15} onClick={() => { remove1(name) }} />
            </IconButton>
          </Flex>
        )
      },
      align: 'center',
      width: getCustomer()?.zones?.length === 1 ? 0 : 50
    }
  ]

  return (
    <div className={styles.item}>
      <Flex className={styles.title} align={'center'} justify={'space-between'}>
        {getTitle()}
        <Flex gap={8} align={'center'}>
          <Button
            onClick={onEdit}
            type={'link'} size={'small'}
          >
            {t('编辑')}
          </Button>
          <Button danger onClick={() => { remove(tableName) }} type={'link'} size={'small'}>{t('删除')}</Button>
        </Flex>
      </Flex>
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
