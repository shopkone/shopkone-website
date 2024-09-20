import { DeleteFour } from '@icon-park/react'
import { useMemoizedFn } from 'ahooks'
import { Button, Flex } from 'antd'
import { cloneDeep } from 'lodash'

import SRender from '@/components/s-render'
import SSelect from '@/components/s-select'
import { conditions } from '@/pages/mange/product/collections/change/get-conditions'

export interface ConditionItemProps {
  value?: { id: number, action: string, value: string | number, key: string }
  onChange?: (value: ConditionItemProps['value']) => void
  onClick?: () => void
}

export default function ConditionItem (props: ConditionItemProps) {
  const { value, onClick } = props
  const { id, action, value: v, key } = value || {}
  const item = conditions.find(i => i.key === key)

  const onChange = useMemoizedFn((k: 'action' | 'value' | 'key', vv?: string | number) => {
    const newValue: any = { ...value, [k]: vv }
    if (k === 'key' && v !== vv) {
      newValue.value = undefined
      newValue.action = item?.actions[0]
    }
    props.onChange?.(cloneDeep(newValue))
  })

  return (
    <Flex gap={8} align={'center'}>
      <SSelect
        virtual={false}
        fieldNames={{ value: 'key' }}
        value={key}
        options={conditions}
        className={'flex1'}
        onChange={v => { onChange('key', v) }}
        listHeight={300}
      />
      <SSelect
        onChange={v => { onChange('action', v) }}
        value={action}
        options={item?.actions}
        className={'flex1'}
        dropdownStyle={{ width: 150 }}
      />
      {item?.component({ value: v, onChange: v => { onChange('value', v) } })}
      <SRender render={onClick}>
        <Button onClick={onClick} style={{ width: 28, height: 28, padding: 0, marginLeft: 4 }}>
          <DeleteFour size={14} style={{ position: 'relative', top: 1 }} />
        </Button>
      </SRender>
    </Flex>
  )
}
