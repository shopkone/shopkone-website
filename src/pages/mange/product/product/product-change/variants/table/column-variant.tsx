import { IconChevronDown, IconPlus } from '@tabler/icons-react'
import { Button, Checkbox, Flex } from 'antd'

import SRender from '@/components/s-render'

import { Variant } from '../state'

export interface ColumnVariantProps {
  item: Variant
  groupName: string
  expands: number[]
}

export default function ColumnVariant (props: ColumnVariantProps) {
  const { item, groupName, expands } = props

  return (
    <div>
      <SRender render={item.isParent}>
        <Flex align={'center'}>
          <Flex onClick={e => { e.stopPropagation() }} align={'center'} style={{ height: 48, paddingLeft: 8, paddingRight: 12, cursor: 'default' }}>
            <Checkbox />
          </Flex>
          <Button onClick={e => { e.stopPropagation() }} style={{ height: 48, width: 48, borderStyle: 'dashed' }}>
            <IconPlus size={14} />
          </Button>
          <div style={{ marginLeft: 16 }}>
            {item?.name?.[0]?.value}
            <Flex gap={8} align={'center'}>
              <div className={'tips'} style={{ fontSize: 13 }}>{item.children?.length} variants</div>
              <IconChevronDown style={{ transform: `rotate(${expands.includes(item.id) ? -180 : 0}deg)`, transition: 'all 0.2s' }} color={'#646a73'} size={13} />
            </Flex>
          </div>
        </Flex>
      </SRender>
      <SRender render={!item.isParent}>
        <Flex style={{ marginLeft: groupName ? 8 : -8 }} align={'center'}>
          <Flex onClick={e => { e.stopPropagation() }} align={'center'} style={{ height: 42, paddingLeft: 8, paddingRight: 12 }}>
            <Checkbox />
          </Flex>
          <Button onClick={e => { e.stopPropagation() }} style={{ height: 42, width: 42, borderStyle: 'dashed' }}>
            <IconPlus size={13} />
          </Button>
          <div style={{ marginLeft: 16 }}>
            {item?.name?.filter(i => i.label !== groupName)?.map(n => <div key={n.id}>{n.value}</div>)}
          </div>
        </Flex>
      </SRender>
    </div>
  )
}
