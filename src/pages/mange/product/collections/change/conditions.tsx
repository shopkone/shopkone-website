import { useTranslation } from 'react-i18next'
import { IconPlus } from '@tabler/icons-react'
import { Button, Flex, Form, Radio } from 'antd'

import SCard from '@/components/s-card'
import ConditionItem from '@/pages/mange/product/collections/change/condition-item'
import { MatchModeType } from '@/pages/mange/product/collections/change/index'
import { genId } from '@/utils/random'

export default function Conditions () {
  const { t } = useTranslation('product')

  const matchModeOptions = [
    { label: t('满足以下全部条件'), value: MatchModeType.All },
    { label: t('满足其中一个条件'), value: MatchModeType.Any }
  ]

  const form = Form.useFormInstance()
  const conditions = Form.useWatch('conditions', form)

  return (
    <SCard title={t('条件')}>
      <Flex style={{ marginBottom: 16 }} gap={20} align={'center'}>
        <div>{t('满足条件：')}</div>
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
                  <IconPlus size={13} />
                  {t('添加条件')}
                </Button>
              </div>
            )
          }
      </Form.List>
    </SCard>
  )
}
