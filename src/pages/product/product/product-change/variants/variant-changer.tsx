import { useEffect, useState } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { AddOne, DeleteFour, Drag } from '@icon-park/react'
import { useMemoizedFn } from 'ahooks'
import { Button, Flex, Input, Modal } from 'antd'

import { genId } from '@/utils/random'

// @ts-expect-error
import CalculateOptionsWorker from './calculate-options?worker'
import styles from './index.module.less'

interface Options {
  name: string
  values: Array<{ value: string, id: number }>
  id: number
}

export default function VariantChanger () {
  const [options, setOptions] = useState<Options[]>([])
  const [valuesError, setValuesError] = useState<Array<{ id: number, message: string }>>([])
  const [err, setErr] = useState < Array<{ id: number, message: string }>>()

  // 添加
  const onAdd = useMemoizedFn(() => {
    setOptions([...options, { name: '', values: [{ value: '', id: genId() }], id: genId() }])
  })

  // 删除
  const onRemove = useMemoizedFn((id: number) => {
    Modal.confirm({
      title: 'Are you sure to delete this option?',
      onOk: () => {
        setOptions(options.filter(item => item.id !== id))
      },
      centered: true
    })
  })

  // 更新名称
  const onUpdateName = useMemoizedFn((name: string, id: number) => {
    setOptions(options.map(item => item.id === id ? { ...item, name } : item))
  })

  // 删除值
  const removeValue = useMemoizedFn((id: number, valueId: number) => {
    const newOptions = options.map(item => {
      if (item.id !== id) return item
      const values = item.values.filter(value => value.id !== valueId)
      return { ...item, values }
    })
    setOptions(newOptions)
  })

  // 更新值
  const onUpdateValue = useMemoizedFn((id: number, valueId: number, value: string, isLast: boolean) => {
    // 设置值
    let newOptions = options.map(option => {
      if (option.id !== id) return option
      const values = option.values.map((item) => item.id === valueId ? { ...item, value } : item)
      return { ...option, values }
    })
    // 自动添加下一行
    if (value && isLast) {
      newOptions = newOptions?.map(item => {
        if (item.id !== id) return item
        return { ...item, values: [...item.values, { value: '', id: genId() }] }
      })
    }
    setOptions(newOptions)
  })

  // 检查值错误
  const checkValueError = useMemoizedFn((options: Options[]) => {
    const err: Array<{ id: number, message: string }> = []
    options?.forEach(item => {
      const values = item.values.map(value => value.value)
      item.values.forEach((value, valueIndex) => {
        // 校验是否重复
        if ((values.indexOf(value.value) !== values.lastIndexOf(value.value)) && value.value) {
          err.push({ id: value.id, message: 'Duplicate value' })
        }
        // 校验是否为空
        if (!value.value && (valueIndex + 1 !== item.values.length)) {
          err.push({ id: value.id, message: 'Value cannot be empty' })
        }
      })
    })
    setValuesError(err)
    return !!err.length
  })

  // 检查错误
  const checkError = useMemoizedFn((options: Options[]) => {
    const err: Array<{ id: number, message: string }> = []
    const names = options?.map(item => item.name)
    options?.forEach((item, index) => {
      // 检查名称是否为空
      if (!item.name) {
        err.push({ id: item.id, message: 'Option name cannot be empty' })
      }
      // 检查值是否重复
      if (names.indexOf(item.name) !== names.lastIndexOf(item.name) && item.name) {
        err.push({ id: item.id, message: 'Duplicate option name' })
      }
    })
    setErr(err)
    return !!err.length
  })

  // 计算
  const onCalculate = useMemoizedFn(() => {
    const hasValueErr = checkValueError(options)
    const hasErr = checkError(options)
    if (hasErr || hasValueErr) return
    const worker: Worker = new CalculateOptionsWorker()
    worker.postMessage(options)
  })

  useEffect(() => {
    if (!err?.length && !valuesError?.length) return
    onCalculate()
  }, [err, valuesError])

  if (!options?.length) {
    return (
      <div>
        <Button className={'primary-text'} onClick={onAdd} style={{ marginLeft: -10 }} type={'text'} size={'small'}>
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
      <TransitionGroup >
        {
          options?.map((option, index) => (
            <CSSTransition
              classNames={'fade'}
              timeout={300}
              key={option.id}
              unmountOnExit
            >
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
                      <Input
                        onBlur={onCalculate}
                        onChange={e => {
                          onUpdateName(e.target.value, option.id)
                        }}
                        placeholder={'Add option name'}
                      />
                      <div
                        style={{
                          fontSize: 12,
                          marginTop: -4,
                          color: '#f54a45',
                          fontWeight: 450
                        }}
                      >
                        {err?.find(i => i.id === option.id)?.message}
                      </div>
                    </Flex>
                    <Flex align={'center'} className={styles['option-values']}>
                      Option values
                    </Flex>
                    <TransitionGroup>
                      {
                        option?.values?.map((value, i) => (
                          <CSSTransition
                            classNames={'fade'}
                            timeout={300}
                            key={value.id}
                            unmountOnExit
                          >
                            <Flex key={value.id} style={{ marginRight: 16, marginBottom: 12 }} vertical gap={8}>
                              <Flex align={'center'}>
                                <div className={styles['handle-item']}>
                                  <div className={styles['handle-drag']}>
                                    <Drag />
                                  </div>
                                </div>
                                <Input
                                  onBlur={onCalculate}
                                  value={value?.value}
                                  onChange={e => { onUpdateValue(option.id, value.id, e.target.value, i === option.values.length - 1) }}
                                  placeholder={'Add a value'}
                                  rootClassName={'fit-width'}
                                  suffix={
                                    <Button
                                      onClick={() => { removeValue(option.id, value.id) }}
                                      style={{
                                        height: 20,
                                        width: 24,
                                        padding: 0
                                      }} size={'small'} type={'text'}
                                    >
                                      <DeleteFour fill={'#1f2329e0'} size={14} />
                                    </Button>
                                  }
                                />
                              </Flex>
                              <div style={{ marginLeft: 20, marginTop: -8, color: '#f54a45', fontSize: 12, fontWeight: 450 }}>
                                {valuesError?.find(i => i.id === value.id)?.message}
                              </div>
                            </Flex>
                          </CSSTransition>
                        ))
                      }
                    </TransitionGroup>
                    <Flex className={styles.footer} justify={'space-between'}>
                      <Button
                        danger
                        onClick={() => {
                          onRemove(option.id)
                        }}
                      >Delete
                      </Button>
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
            </CSSTransition>
          ))
        }
      </TransitionGroup>
      {
        options?.length < 3 &&
        <div onClick={onAdd} className={styles['add-btn']}>
          <Flex gap={5} align={'center'}>
            <AddOne
              style={{
                position: 'relative',
                top: 2
              }}
              size={13}
            />
            <div>Add another option</div>
          </Flex>
        </div>
      }
    </div>
  )
}
