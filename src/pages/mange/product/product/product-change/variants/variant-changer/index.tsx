import { useEffect, useState } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { AddOne, DeleteFour, Drag } from '@icon-park/react'
import { IconPhotoPlus } from '@tabler/icons-react'
import { useMemoizedFn } from 'ahooks'
import { Button, Flex, Form, Input, Modal, Tooltip } from 'antd'
import classNames from 'classnames'

import { VariantType } from '@/constant/product'
import DoneItem from '@/pages/mange/product/product/product-change/variants/variant-changer/done-item'
import {
  errorCheck,
  ErrorResult
} from '@/pages/mange/product/product/product-change/variants/variant-changer/error-check'
import { genId } from '@/utils/random'

import styles from './index.module.less'

export interface Options {
  name: string
  values: Array<{ value: string, id: number }>
  id: number
  isDone: boolean
}

export interface VariantChangerProps {
  onChange: (options: Options[]) => void
}

export default function VariantChanger (props: VariantChangerProps) {
  const [options, setOptions] = useState<Options[]>([])
  const [err, setErr] = useState<ErrorResult>()
  const form = Form.useFormInstance()
  const variantType: VariantType = Form.useWatch('variant_type', form)

  const onChangeOptions = () => {
    const err = errorCheck(options)
    setErr(err)
    if (!err.noError) return
    setTimeout(() => {
      if (variantType === VariantType.Single) {
        props.onChange([])
        return
      }
      if (options.some(item => item.values?.every(i => !i.value))) {
        return
      }
      props.onChange(options)
    })
  }

  // 添加
  const onAdd = useMemoizedFn(() => {
    setOptions([...options, {
      name: '',
      values: [{ value: '', id: genId() }],
      id: genId(),
      isDone: false
    }])
  })

  // 删除
  const onRemove = useMemoizedFn((id: number) => {
    const item = options.find(item => item.id === id)
    if (!item?.name && !item?.values?.every(i => i.value)) {
      setOptions(options.filter(item => item.id !== id))
      return
    }
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
    setOptions(options.map(item => item.id === id
      ? {
          ...item,
          name
        }
      : item))
  })

  // 删除值
  const removeValue = useMemoizedFn((id: number, valueId: number) => {
    const newOptions = options.map(item => {
      if (item.id !== id) return item
      const values = item.values.filter(value => value.id !== valueId)
      return {
        ...item,
        values
      }
    })
    form.setFieldValue('options', newOptions)
    setOptions(newOptions)
  })

  // 更新值
  const onUpdateValue = useMemoizedFn((id: number, valueId: number, value: string, isLast: boolean) => {
    // 设置值
    let newOptions = options.map(option => {
      if (option.id !== id) return option
      const values = option.values.map((item) => {
        return item.id === valueId ? { ...item, value } : item
      })
      return { ...option, values }
    })
    // 自动添加下一行
    if (value && isLast) {
      newOptions = newOptions?.map(item => {
        if (item.id !== id) return item
        return {
          ...item,
          values: [...item.values, {
            value: '',
            id: genId()
          }]
        }
      })
    }
    setOptions(newOptions)
  })

  // 更新done
  const onUpdateDone = useMemoizedFn((id: number, done: boolean) => {
    setOptions(options.map(item => item.id === id
      ? {
          ...item,
          isDone: done
        }
      : item))
  })

  useEffect(() => {
    if (options.some(item => !item.name)) return
    onChangeOptions()
  }, [options])

  useEffect(() => {
    if (variantType === VariantType.Single) {
      setOptions([])
    } else {
      setOptions([{
        name: '',
        values: [{ value: '', id: genId() }],
        id: genId(),
        isDone: false
      }])
    }
  }, [variantType])

  if (variantType === VariantType.Single) {
    return null
  }

  if (!options?.length) {
    return (
      <div>
        <Button className={`primary-text ${styles['ml-10']}`} onClick={onAdd} type={'text'} size={'small'}>
          <Flex gap={5} align={'center'}>
            <AddOne className={styles['add-btn-icon']} size={13} />
            <div style={{ fontSize: 13 }}>Add options like size or color</div>
          </Flex>
        </Button>
      </div>
    )
  }

  return (
    <div className={styles['variant-changer']}>
      <TransitionGroup>
        {
          options?.map((option, index) => (
            <CSSTransition
              classNames={'fade'}
              timeout={300}
              key={option.id}
              unmountOnExit
            >
              <div key={option.id}>
                <Flex
                  className={option?.isDone
                    ? 'slide-in-blurred-left'
                    : 'slide-in-blurred-left1'}
                >
                  <div style={{ top: option.isDone ? 17 : undefined }} className={styles.handle}>
                    <div className={styles['handle-drag']}>
                      <Drag />
                    </div>
                  </div>
                  {
                    option?.isDone
                      ? (
                        <DoneItem
                          option={option} onClick={() => {
                            onUpdateDone(option.id, false)
                          }}
                        />
                        )
                      : (
                        <Flex flex={1} vertical className={styles.option}>
                          <Flex gap={4} vertical className={styles['option-name']}>
                            <div>Option name</div>
                            <Input
                              onBlur={onChangeOptions}
                              onChange={e => {
                                onUpdateName(e.target.value, option.id)
                              }}
                              value={option.name}
                              placeholder={'Add option name'}
                              className={err?.nameError?.find(i => i.id === option.id)?.message ? classNames(styles.errInput) : ''}
                            />
                            <div
                              style={{ height: err?.nameError?.find(i => i.id === option.id)?.message ? 16 : 0 }}
                              className={styles.error}
                            >
                              {err?.nameError?.find(i => i.id === option.id)?.message}
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
                                  <Flex
                                    key={value.id}
                                    className={styles.item}
                                    vertical
                                    gap={2}
                                  >
                                    <Flex align={'center'}>
                                      <div className={styles['handle-item']}>
                                        <div className={styles['handle-drag']}>
                                          <Drag />
                                        </div>
                                      </div>
                                      <Input
                                        value={value?.value}
                                        onChange={e => {
                                          onUpdateValue(option.id, value.id, e.target.value, i === option.values.length - 1)
                                        }}
                                        placeholder={'Add a value'}
                                        rootClassName={'fit-width'}
                                        className={err?.valueError?.find(i => i.id === value.id)?.message ? classNames(styles.errInput) : ''}
                                        suffix={
                                          <Button
                                            className={styles['delete-btn']}
                                            onClick={() => {
                                              removeValue(option.id, value.id)
                                            }}
                                            style={{ display: (option.values.length !== i + 1) && (option.values.length > 2) ? 'block' : 'none' }} size={'small'} type={'text'}
                                          >
                                            <DeleteFour fill={'#1f2329e0'} size={14} />
                                          </Button>
                                        }
                                      />
                                      <Tooltip title={'Add option value image'}>
                                        <Button className={'secondary'} style={{ padding: 4, marginLeft: 8 }} type={'text'}>
                                          <IconPhotoPlus style={{ position: 'relative', top: -1 }} size={16} />
                                        </Button>
                                      </Tooltip>
                                    </Flex>
                                    <div
                                      style={{ height: err?.valueError?.find(i => i.id === value.id)?.message ? 16 : 0 }}
                                      className={styles['err-msg']}
                                    >
                                      {err?.valueError?.find(i => i.id === value.id)?.message}
                                    </div>
                                  </Flex>
                                </CSSTransition>
                              ))
                            }
                          </TransitionGroup>
                          <Flex className={styles.footer} justify={'space-between'}>
                            <Button
                              danger
                              disabled={option.values.length < 2}
                              onClick={() => {
                                onRemove(option.id)
                              }}
                            >
                              Delete
                            </Button>
                            <Button
                              onClick={() => {
                                onUpdateDone(option.id, true)
                              }}
                              type={'primary'}
                              disabled={
                                !!err?.nameError?.find(i => i.id === option.id)?.message || (
                                  !!err?.valueError?.find(i => i.nameId === option.id) || (
                                    !option?.name || (
                                      option?.values?.every(i => !i.value)
                                    )
                                  )
                                )
                              }
                            >
                              Done
                            </Button>
                          </Flex>
                        </Flex>
                        )
                  }
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
        <div className={styles['add-btn']}>
          <Flex className={styles['add-btn-inner']} gap={5} align={'center'} onClick={onAdd}>
            <AddOne className={styles['add-btn-icon']} strokeWidth={5} size={13} />
            <div>Add another option</div>
          </Flex>
        </div>
      }
    </div>
  )
}
