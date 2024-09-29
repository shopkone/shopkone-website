import { IconGripVertical, IconPhotoPlus, IconPlus, IconTrash } from '@tabler/icons-react'
import { Button, Flex, Form, Input, Tooltip } from 'antd'

import SRender from '@/components/s-render'

import styles from './index.module.less'

export interface ItemProps {
  onRemove?: () => void
}

export default function Item (props: ItemProps) {
  const { onRemove } = props
  return (
    <div className={styles.item}>
      <Form.Item
        style={{
          marginBottom: 8,
          marginLeft: 8,
          marginRight: 8
        }}
        label={'Option name'}
      >
        <Input />
        <div style={{ position: 'absolute', right: 0, top: -26 }}>
          <Button
            style={{
              width: 24,
              height: 24,
              position: 'relative',
              top: -1
            }}
            type={'text'}
            size={'small'}
          >
            <IconGripVertical style={{ position: 'relative', left: -4 }} size={14} />
          </Button>
        </div>
      </Form.Item>
      <Form.Item
        style={{
          marginLeft: 8,
          marginRight: 8
        }}
        className={'mb0'}
        label={'Option  values'}
      >
        <Flex vertical gap={8}>
          {
            [1, 2, 3, 4, 5].map(i => (
              <Flex key={i} align={'center'} gap={4}>
                <Button
                  style={{
                    width: 24,
                    height: 24,
                    position: 'relative',
                    top: -1
                  }}
                  type={'text'}
                  size={'small'}
                >
                  <IconGripVertical style={{ position: 'relative', left: -4 }} size={14} />
                </Button>
                <Input
                  suffix={
                    <Button
                      style={{
                        width: 24,
                        height: 24,
                        position: 'absolute',
                        right: 8
                      }}
                      type={'text'}
                      size={'small'}
                      onClick={e => {
                        e.stopPropagation()
                      }}
                    >
                      <IconTrash
                        style={{
                          position: 'relative',
                          left: -4
                        }} size={15}
                      />
                    </Button>
                  }
                />
                <Tooltip title={'Add option image'}>
                  <Button
                    style={{
                      width: 24,
                      height: 24
                    }}
                    type={'text'}
                    size={'small'}
                    onClick={e => {
                      e.stopPropagation()
                    }}
                  >
                    <IconPhotoPlus
                      style={{
                        position: 'relative',
                        left: -4
                      }} size={15}
                    />
                  </Button>
                </Tooltip>
              </Flex>
            ))
          }
        </Flex>
      </Form.Item>
      <Flex className={styles.footer} justify={'space-between'} align={'center'}>
        <Button type={'text'} size={'small'}>
          <Flex align={'center'} gap={4}>
            <IconPlus
              size={13}
              style={{
                position: 'relative',
                top: -1
              }}
            />
            <div>Add another value</div>
          </Flex>
        </Button>
        <Flex justify={'flex-end'} gap={4}>
          <SRender render={onRemove}>
            <Button size={'small'} type={'text'} danger onClick={onRemove}>
              Delete
            </Button>
          </SRender>
          <Button size={'small'} type={'text'} className={'primary-text'}>Done</Button>
        </Flex>
      </Flex>
    </div>
  )
}
