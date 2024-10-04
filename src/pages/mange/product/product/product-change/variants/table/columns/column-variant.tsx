import { IconChevronDown, IconPhotoPlus } from '@tabler/icons-react'
import { Button, Checkbox, Flex } from 'antd'

import SRender from '@/components/s-render'
import { Variant } from '@/pages/mange/product/product/product-change/variants/state'

import styles from './index.module.less'

export interface ColumnVariantProps {
  row: Variant
  groupName: string
  expands: number[]
}

export default function ColumnVariant (props: ColumnVariantProps) {
  const { row, groupName, expands } = props

  return (
    <Flex className={'fit-width flex1'} style={{ userSelect: 'none' }}>
      <SRender render={row.children}>
        <Flex onClick={e => { e.stopPropagation() }} style={{ cursor: 'pointer', paddingRight: 16 }}>
          <Checkbox />
        </Flex>
        <Flex flex={1} align={'center'} gap={16}>
          <Button className={styles.bigImg} size={'large'}>
            <IconPhotoPlus style={{ position: 'relative', top: 1 }} size={18} />
          </Button>
          <div className={styles.name}>
            <div className={styles.nameText}>
              {(row?.name?.find(i => i.label === groupName))?.value}
            </div>
            <Flex align={'center'} gap={8}>
              <div className={'secondary}'}>
                {row.children?.length} variants
              </div>
              <IconChevronDown
                className={styles.icon}
                style={{ transform: expands?.includes(row.id) ? 'rotate(-180deg)' : 'rotate(0deg)' }}
                color={'#646a73'}
                size={14}
              />
            </Flex>
          </div>
        </Flex>
      </SRender>
      <SRender render={!row.children}>
        <Flex align={'center'} gap={12} style={{ marginLeft: 12 }}>
          <Checkbox />
          <Button className={styles.smallImg} size={'large'}>
            <IconPhotoPlus size={16} />
          </Button>
          <div>
            {row?.name?.filter(i => i.label !== groupName).map(item => (
              <div key={item.id}>
                {item.value}
              </div>
            ))}
          </div>
        </Flex>
      </SRender>
    </Flex>
  )
}
