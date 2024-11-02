import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IconTax } from '@tabler/icons-react'
import { Button, Empty, Flex, Form } from 'antd'

import { CountriesRes } from '@/api/base/countries'
import { BaseCustomerTax } from '@/api/tax/info'
import SCard from '@/components/s-card'
import SRender from '@/components/s-render'
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
      extra={!form.getFieldValue('customers')?.length
        ? null
        : <Button type={'link'} size={'small'} onClick={() => { openInfo.edit() }}>{t('添加自定义税费')}</Button>}
    >
      <SRender render={!form.getFieldValue('customers')?.length}>
        <Empty
          image={
            <div style={{ paddingTop: 24 }}>
              <IconTax size={64} color={'#ddd'} />
            </div>
          }
          description={(
            <div className={'secondary'}>
              {t('发货到指定区域时，为特定产品系列自定义基于区域的税率或运费。')}
            </div>
          )}
          style={{ paddingBottom: 32, marginTop: -12 }}
        >
          <Button onClick={() => { openInfo.edit() }}>
            {t('添加自定义税费')}
          </Button>
        </Empty>
      </SRender>

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
                          <CustomerItem fields={fields1} add={add1} />
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

      <AddModal onConfirm={onConfirm} country={country} openInfo={openInfo} />
    </SCard>
  )
}
