import { Plus } from '@icon-park/react'
import { Button, Card, Flex, Form, Radio } from 'antd'

import ConditionItem from '@/pages/mange/product/collections/change/condition-item'
import styles from '@/pages/mange/product/collections/change/index.module.less'
import { genId } from '@/utils/random'

export default function Conditions () {
  const matchModeOptions = [
    { label: 'all conditions', value: 'all' },
    { label: 'any condition', value: 'any' }
  ]

  return (
    <Card title={'Conditions'}>
      <Flex style={{ marginBottom: 16 }} gap={20} align={'center'}>
        <div>Products must match:</div>
        <Form.Item name={'match_mode'} className={'mb0'}>
          <Radio.Group options={matchModeOptions} />
        </Form.Item>
      </Flex>
      <Form.List name={'conditions'}>
        {
            (fields, { add }) => (
              <div>
                {
                  fields.map(({ key }) => (
                    <Form.Item style={{ marginBottom: 8 }} name={[key, 'item']} key={key}>
                      <ConditionItem key={key} />
                    </Form.Item>
                  ))
                }
                <Button onClick={() => { add({ item: { id: genId(), action: 'eq', value: undefined, key: 'tag' } }) }}>
                  <Flex align={'center'} gap={4} className={styles['add-btn']}>
                    <Plus size={14} className={styles['plus-icon']} />
                    <div>Add another condition</div>
                  </Flex>
                </Button>
              </div>
            )
          }
      </Form.List>
    </Card>
  )
}
