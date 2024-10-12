import { IconPlus } from '@tabler/icons-react'
import { Button, Flex, Form, Radio } from 'antd'

import SCard from '@/components/s-card'
import ConditionItem from '@/pages/mange/product/collections/change/condition-item'
import { MatchModeType } from '@/pages/mange/product/collections/change/index'
import styles from '@/pages/mange/product/collections/change/index.module.less'
import { genId } from '@/utils/random'

export default function Conditions () {
  const matchModeOptions = [
    { label: 'all conditions', value: MatchModeType.All },
    { label: 'any condition', value: MatchModeType.Any }
  ]

  const form = Form.useFormInstance()
  const conditions = Form.useWatch('conditions', form)

  return (
    <SCard title={'Conditions'}>
      <Flex style={{ marginBottom: 16 }} gap={20} align={'center'}>
        <div>Products must match:</div>
        <Form.Item name={'match_mode'} className={'mb0'}>
          <Radio.Group options={matchModeOptions} />
        </Form.Item>
      </Flex>
      <Form.List name={'conditions'}>
        {
            (fields, { add, remove }) => (
              <div>
                {
                  fields.map(({ name }) => (
                    <Form.Item key={name} style={{ marginBottom: 8 }} name={[name, 'item']}>
                      <ConditionItem onClick={conditions?.length > 1 ? () => { remove(name) } : undefined} />
                    </Form.Item>
                  ))
                }
                <Button onClick={() => { add({ item: { id: genId(), action: 'eq', value: undefined, key: 'tag' } }) }}>
                  <Flex align={'center'} gap={4} className={styles['add-btn']}>
                    <IconPlus size={13} className={styles['plus-icon']} />
                    <div>Add another condition</div>
                  </Flex>
                </Button>
              </div>
            )
          }
      </Form.List>
    </SCard>
  )
}
