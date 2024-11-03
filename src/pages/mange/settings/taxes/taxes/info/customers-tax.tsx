import { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRequest } from 'ahooks'
import { Button, Flex, Form } from 'antd'

import { CountriesRes } from '@/api/base/countries'
import { CollectionOptionsApi } from '@/api/collection/options'
import { BaseCustomerTax } from '@/api/tax/info'
import SCard from '@/components/s-card'
import { useOpen } from '@/hooks/useOpen'
import AddModal, { AddModalData } from '@/pages/mange/settings/taxes/taxes/info/add-modal'
import CustomerItem from '@/pages/mange/settings/taxes/taxes/info/customer-item'

export interface CustomersTaxProps {
  country?: CountriesRes
}

export default function CustomersTax (props: CustomersTaxProps) {
  const { country } = props
  const openInfo = useOpen<AddModalData>()
  const { t } = useTranslation('settings', { keyPrefix: 'tax' })
  const addRef = useRef((item: any) => {})
  const [update, setUpdate] = useState(0)
  const form = Form.useFormInstance()
  const collectionOptions = useRequest(CollectionOptionsApi)
  const countryOptions = useMemo(() => {
    if (!country?.name) return []
    const zones = country?.zones?.map(zone => ({ label: zone.name, value: zone.code }))
    return [{ label: country.name, value: country.code }, ...zones]
  }, [country])

  const onUpdate = () => {
    setUpdate(update + 1)
  }

  const onConfirm = (tax: AddModalData) => {
    const item: BaseCustomerTax = {
      id: tax.id,
      type: tax.type,
      collection_id: tax.collection_id || 0,
      zones: [{ id: tax.zone_id, tax_rate: tax.tax_rate, name: tax.name, area_code: tax.area_code }]
    }
    addRef.current(item)
    onUpdate()
  }

  return (
    <SCard
      tips={t('发货到指定区域时，为特定产品系列自定义基于区域的税率或运费。')}
      title={t('自定义税费')}
      extra={<Button type={'link'} size={'small'} onClick={() => { openInfo.edit() }}>{t('添加自定义税费')}</Button>}
    >
      <Form.List name={'customers'}>
        {
          (fields, { add }) => {
            addRef.current = add
            return (
              <Flex vertical gap={20}>
                {
                  fields.map((field, index) => (
                    <Form.List key={field.key} name={[index, 'zones']}>
                      {
                        (fields1, { add: add1 }) => (
                          <CustomerItem
                            countryOptions={countryOptions || []}
                            onUpdate={onUpdate}
                            collections={collectionOptions.data || []}
                            name={field.name}
                            fields={fields1}
                            add={add1}
                          />
                        )
                      }
                    </Form.List>
                  ))
                }
              </Flex>
            )
          }
        }
      </Form.List>

      <AddModal
        collections={collectionOptions.data || []}
        onConfirm={onConfirm}
        countryOptions={countryOptions}
        openInfo={openInfo}
      />
    </SCard>
  )
}
