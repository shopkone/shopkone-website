import { useState } from 'react'
import { AddOne, Drag, ReduceOne } from '@icon-park/react'
import { useMemoizedFn } from 'ahooks'
import { Button, Flex, Input } from 'antd'
import { nanoid } from 'nanoid'

import styles from './index.module.less'

interface Options {
  name: string
  values: string[]
  id: string
}

export default function VariantChanger () {
  const [options, setOptions] = useState<Options[]>([])

  const onAdd = useMemoizedFn(() => {
    setOptions([...options, { name: '', values: [], id: nanoid() }])
  })

  const onRemove = useMemoizedFn((id: string) => {
    setOptions(options.filter(item => item.id !== id))
  })

  if (!options?.length) {
    return (
      <div>
        <Button onClick={onAdd} style={{ marginLeft: -10 }} type={'text'} size={'small'}>
          <Flex gap={5} align={'center'}>
            <AddOne style={{ position: 'relative', top: 2 }} size={13} />
            <div>Add options like size or color</div>
          </Flex>
        </Button>
      </div>
    )
  }

  return (
    <div className={styles['variant-changer']}>
      {
        options?.map((option, index) => (
          <div key={option.id}>
            <Flex>
              <div className={styles.handle}>
                <div className={styles['handle-drag']}>
                  <Drag />
                </div>
              </div>
              <Flex flex={1} vertical className={styles.option}>
                <Flex gap={4} vertical className={styles['option-name']}>
                  <div>Option name</div>
                  <Input placeholder={'Add option name'} />
                </Flex>
                <Flex align={'center'} className={styles['option-values']}>
                  Option values
                </Flex>
                <Flex style={{ marginRight: 16 }} vertical gap={8}>
                  <Flex align={'center'}>
                    <div className={styles['handle-item']}>
                      <div className={styles['handle-drag']}>
                        <Drag />
                      </div>
                    </div>
                    <Input
                      placeholder={'Add a value'}
                      rootClassName={'fit-width'}
                      suffix={
                        <Button style={{ height: 20, width: 24, padding: 0 }} size={'small'} type={'text'} >
                          <ReduceOne size={14} />
                        </Button>
}
                    />
                  </Flex>
                </Flex>
                <Flex className={styles.footer} justify={'space-between'}>
                  <Button danger onClick={() => { onRemove(option.id) }}>Delete</Button>
                  <Button type={'primary'}>Done</Button>
                </Flex>
              </Flex>
            </Flex>
            {
              index !== 2 && (
              <div className={styles.line} />
              )
            }
          </div>
        ))
      }
      {
        options?.length < 3 &&
        <div onClick={onAdd} className={styles['add-btn']}>
          <Flex gap={5} align={'center'}>
            <AddOne style={{ position: 'relative', top: 2 }} size={13} />
            <div>Add another option</div>
          </Flex>
        </div>
      }
    </div>
  )
}
