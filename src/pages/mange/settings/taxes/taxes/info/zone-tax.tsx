import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IconTrash } from '@tabler/icons-react'
import { Button, Flex, Form, Input } from 'antd'

import { ZoneListOut } from '@/api/base/countries'
import { BaseCustomerTaxZone, BaseTaxZone } from '@/api/tax/info'
import IconButton from '@/components/icon-button'
import SInputNumber from '@/components/s-input-number'
import SRender from '@/components/s-render'
import SSelect from '@/components/s-select'
import STable, { STableProps } from '@/components/s-table'
import { genId } from '@/utils/random'

export interface ZoneTaxProps {
  zones: ZoneListOut[]
}

export default function ZoneTax (props: ZoneTaxProps) {
  const { zones } = props
  const form = Form.useFormInstance()
  const options = zones.map(zone => ({
    label: zone.name,
    value: zone.code
  }))
  const [update, setUpdate] = useState(0)
  const removeRef = useRef((index: number) => {})

  const { t } = useTranslation('settings', { keyPrefix: 'tax' })

  const onUpdate = () => {
    setUpdate(update + 1)
  }

  const columns: STableProps['columns'] = [
    {
      title: t('区域'),
      name: 'name',
      code: 'name',
      render: (name: number) => {
        const zones: BaseTaxZone[] = form.getFieldValue('zones')
        const opt = options?.filter(opt => !zones.find(i => i.zone_code === opt.value))
        return (
          <Form.Item
            rules={[{ required: true, message: t('请选择区域') }]}
            className={'mb0'}
            name={[name, 'zone_code']}
          >
            <SSelect
              onFocus={onUpdate}
              showSearch
              optionFilterProp={'label'}
              placeholder={t('选择区域')}
              allowClear
              optionLabelProp={'label'}
              options={opt}
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
    },
    {
      title: '',
      name: 'name',
      code: 'name',
      render: (name: number) => {
        const zones: BaseCustomerTaxZone[] | undefined = form.getFieldValue('zones')
        if (zones?.length === 1) return null
        return (
          <Flex justify={'center'}>
            <IconButton onClick={() => { removeRef?.current?.(name); onUpdate() }} type={'text'} size={24}>
              <IconTrash size={15} onClick={() => { }} />
            </IconButton>
          </Flex>
        )
      },
      align: 'center',
      width: form.getFieldValue('zones')?.length === 1 ? 0 : 50
    }
  ]

  console.log(form.getFieldValue('zones')?.length)

  if (!zones?.length) return null

  return (
    <div>
      <div className={'line'} />
      <div>{t('区域税率')}</div>
      <div style={{ marginTop: 2 }} className={'tips'}>
        {t('如果添加了州税率，将替代地方税率。')}
      </div>

      <Form.List name={'zones'}>
        {
          (fields, { add, remove }) => {
            removeRef.current = remove
            return (
              <div>
                <SRender render={fields?.length}>
                  <STable
                    borderless
                    className={'table-border'}
                    data={fields}
                    style={{ marginTop: 8 }}
                    columns={columns}
                    init
                  />
                </SRender>
                <Button
                  onClick={() => { add({ id: genId(), name: 'VAT', tax_rate: 0 }); onUpdate() }}
                  type={'link'}
                  size={'small'}
                  style={{ marginLeft: -8, marginTop: 8 }}
                >
                  {t('添加区域')}
                </Button>
              </div>
            )
          }
        }
      </Form.List>
    </div>
  )
}
