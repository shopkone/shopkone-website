import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IconTrash } from '@tabler/icons-react'
import { Button, Flex, Form } from 'antd'

import IconButton from '@/components/icon-button'
import SInputNumber from '@/components/s-input-number'
import SRender from '@/components/s-render'
import STable, { STableProps } from '@/components/s-table'
import { formatPrice } from '@/utils/num'
import { genId } from '@/utils/random'

export interface FeesProps {
  name: number
}

export default function Fees (props: FeesProps) {
  const { name } = props
  const { t } = useTranslation('settings', { keyPrefix: 'shipping' })
  const [forceUpdate, setForceUpdate] = useState(0)
  const form = Form.useFormInstance()

  const onUpdate = () => {
    setTimeout(() => {
      setForceUpdate(forceUpdate + 1)
    })
  }

  const columns = (remove: (i: number) => void): STableProps['columns'] => [
    {
      title: t('最小订单金额'),
      name: 'name',
      code: 'name',
      render: (n: number) => (
        <Form.Item
          rules={[{
            validator: async (_, value) => {
              const last = form.getFieldValue('areas')[name]?.fees?.[n - 1]?.condition
              if (last === undefined) { await Promise.resolve(); return }
              if (value <= last) {
                await Promise.reject(t('最小订单金额不能小于', { x: last }))
              }
              await Promise.resolve()
            }
          }]}
          name={[n, 'condition']}
          className={'mb0'}
        >
          <SInputNumber
            required
            onChange={() => {
              onUpdate()
              form.validateFields({ dirty: true })
            }}
            style={{ width: 150 }} money
          />
        </Form.Item>
      ),
      width: 150
    },
    {
      title: t('最大订单金额'),
      name: 'name',
      code: 'name',
      render: (n: number) => {
        const condition = form.getFieldValue('areas')[name]?.fees?.[n + 1]?.condition
        return (
          <Flex gap={12} style={{ position: 'relative', left: -20 }}>
            <div>-</div>
            <div>
              {condition ? formatPrice(condition - 0.01) : t('无上限')}
            </div>
          </Flex>
        )
      },
      width: 150
    },
    {
      title: t('配送费用'),
      name: 'name',
      code: 'name',
      render: (name: number) => (
        <Form.Item name={[name, 'fee']} className={'mb0'}>
          <SInputNumber required money />
        </Form.Item>
      ),
      width: 150
    },
    {
      title: '',
      name: 'name',
      code: 'name',
      render: (n: number) => (
        <SRender render={form.getFieldValue('areas')[name]?.fees?.length !== 1}>
          <Flex justify={'center'}>
            <IconButton onClick={() => { remove(n); onUpdate() }} size={24} type={'text'}>
              <IconTrash size={15} />
            </IconButton>
          </Flex>
        </SRender>
      ),
      width: 50,
      align: 'center',
      lock: true
    }
  ]

  return (
    <div>
      <div style={{ marginBottom: 8 }}>{t('配送费用')}</div>
      <Form.List name={[name, 'fees']}>
        {
          (fields, { add, remove }) => (
            <div>
              <STable
                borderless
                className={'table-border'}
                init
                data={fields}
                columns={columns(remove)}
              />
              <SRender render={fields.length < 5}>
                <Button
                  onClick={() => { add({ id: genId(), fee: 0 }) }}
                  style={{ marginTop: 8 }}
                  type={'link'}
                  size={'small'}
                >
                  添加条件
                </Button>
              </SRender>
            </div>
          )
        }

      </Form.List>
    </div>
  )
}
