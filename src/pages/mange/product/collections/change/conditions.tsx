import { Plus } from '@icon-park/react'
import { useMemoizedFn } from 'ahooks'
import { Button, Card, Flex, Form, Input, Radio } from 'antd'

import SSelect from '@/components/s-select'
import { getConditions } from '@/pages/mange/product/collections/change/get-conditions'

export default function Conditions () {
  const matchModeOptions = [
    { label: 'all conditions', value: 'all' },
    { label: 'any condition', value: 'any' }
  ]

  const form = Form.useFormInstance()
  const list = Form.useWatch('conditions', form)
  const conditions = getConditions()

  const getCurrentCondition = useMemoizedFn(() => {})

  return (
    <Card title={'Conditions'}>
      <Flex style={{ marginBottom: 16 }} gap={20} align={'center'}>
        <div>Products must match:</div>
        <Form.Item name={'match_mode'} className={'mb0'}>
          <Radio.Group options={matchModeOptions} />
        </Form.Item>
      </Flex>
      <Flex gap={8} vertical>
        <Form.List name={'conditions'}>
          {
            fields => fields.map(({ key }) => (
              <Flex key={key} gap={8}>
                <Form.Item name={[key, 'key']} className={'mb0'} style={{ flex: 1 }}>
                  <SSelect fieldNames={{ value: 'key' }} options={conditions} />
                </Form.Item>
                <Form.Item name={[key, 'action']} className={'mb0'} style={{ flex: 1 }}>
                  <SSelect />
                </Form.Item>
                <Form.Item className={'mb0'} style={{ flex: 1 }}>
                  <Input />
                </Form.Item>
              </Flex>
            ))
          }
        </Form.List>
        <div>
          <Button>
            <Flex align={'center'} gap={4} style={{ position: 'relative', top: -2 }}>
              <Plus size={14} style={{ position: 'relative', top: 1 }} />
              <div>Add another condition</div>
            </Flex>
          </Button>
        </div>
      </Flex>
    </Card>
  )
}
