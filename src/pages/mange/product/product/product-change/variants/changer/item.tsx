import { IconGripVertical } from '@tabler/icons-react'
import { useMemoizedFn } from 'ahooks'
import { Button, Flex, Form, Input, Typography } from 'antd'

import SRender from '@/components/s-render'
import ItemValues from '@/pages/mange/product/product/product-change/variants/changer/item-values'

import styles from './index.module.less'

export interface Options {
  name: string
  values: Array<{ value: string, id: number }>
  id: number
  isDone: boolean
}

export interface ItemProps {
  onRemove?: () => void
  name: number
  item: Options
  errors?: Array<{ id: number, msg: string }>
}

export default function Item (props: ItemProps) {
  const { onRemove, name, item, errors } = props

  const NameInputRender = useMemoizedFn((props: any) => {
    const error = errors?.find(e => e.id === item.id)
    return (
      <div>
        <Input {...props} autoComplete={'off'} />
        <div className={styles.error}>{error?.msg}</div>
      </div>
    )
  })

  return (
    <div className={styles.item}>
      <Flex gap={4} className={styles.header} align={'center'}>
        <Button className={styles.dragBtn} type={'text'} size={'small'}>
          <IconGripVertical className={styles.dragIcon} size={15} />
        </Button>
        <Typography.Text ellipsis={true} className={styles.title}>
          {item.name || `Option ${name + 1}`}
        </Typography.Text>
        <Flex style={{ position: 'relative', top: -1 }} flex={1} justify={'flex-end'} gap={4}>
          <SRender render={onRemove}>
            <Button size={'small'} type={'text'} danger onClick={onRemove}>
              Delete
            </Button>
          </SRender>
          <Button size={'small'} type={'text'} className={'primary-text'}>Done</Button>
        </Flex>
      </Flex>
      <Form.Item style={{ marginBottom: 8 }} name={[name, 'name']} className={styles.optionName} label={'Option name'}>
        <NameInputRender className={styles.optionNameInput} />
      </Form.Item>
      <Form.Item style={{ marginBottom: 8 }} name={[name, 'values']} className={styles.optionValues} label={'Option values'}>
        <ItemValues errors={errors} />
      </Form.Item>
    </div>
  )
}
