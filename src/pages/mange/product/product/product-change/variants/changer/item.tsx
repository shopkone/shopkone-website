import { IconGripVertical, IconPlus } from '@tabler/icons-react'
import { Button, Flex, Form, Input } from 'antd'

import SRender from '@/components/s-render'
import ItemValues from '@/pages/mange/product/product/product-change/variants/changer/item-values'

import styles from './index.module.less'

export interface ItemProps {
  onRemove?: () => void
  name: number
}

export default function Item (props: ItemProps) {
  const { onRemove, name } = props

  return (
    <div className={styles.item}>
      <Flex gap={4} className={styles.header} align={'center'}>
        <Button className={styles.dragBtn} type={'text'} size={'small'}>
          <IconGripVertical className={styles.dragIcon} size={15} />
        </Button>
        <div className={styles.title}>
          Option 1
        </div>
        <Flex flex={1} justify={'flex-end'} gap={4}>
          <SRender render={onRemove}>
            <Button size={'small'} type={'text'} danger onClick={onRemove}>
              Delete
            </Button>
          </SRender>
          <Button size={'small'} type={'text'} className={'primary-text'}>Done</Button>
        </Flex>
      </Flex>
      <Form.Item name={[name, 'name']} className={styles.optionName} label={'Option name'}>
        <Input className={styles.optionNameInput} />
      </Form.Item>
      <Form.Item style={{ marginBottom: 0 }} className={styles.optionValues} label={'Option values'}>
        <ItemValues />
      </Form.Item>
      <Button
        style={{ position: 'relative', left: 28, marginTop: 8 }}
        className={'primary-text'}
        type={'text'}
        size={'small'}
      >
        <Flex align={'center'} gap={4}>
          <IconPlus size={13} style={{ position: 'relative', top: -1 }} />
          <div>Add another value</div>
        </Flex>
      </Button>
    </div>
  )
}
