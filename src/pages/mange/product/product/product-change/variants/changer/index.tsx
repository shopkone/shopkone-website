import { useEffect, useState } from 'react'
import { IconGripVertical, IconPhotoPlus, IconPlus, IconTrash, IconX } from '@tabler/icons-react'
import { Button, Drawer, Flex, Input } from 'antd'
import classNames from 'classnames'

import SLoading from '@/components/s-loading'
import SRender from '@/components/s-render'
import { UseOpenType } from '@/hooks/useOpen'
import { Option, Variant } from '@/pages/mange/product/product/product-change/variants/state'
import { genId } from '@/utils/random'

import styles from './index.module.less'
// @ts-expect-error
import Handle from './options-handle?worker'
// @ts-expect-error
import ReserveHandle from './reserve-handle?worker'

export interface ChangerProps {
  info: UseOpenType<Variant[]>
  onChange: (data: Variant[], options: Option[]) => void
  onChangeLoading: (loading: boolean) => void
}

export default function Changer (props: ChangerProps) {
  const { info, onChange, onChangeLoading } = props
  const [options, setOptions] = useState<Option[]>([])
  const [errors, setErrors] = useState<Array<{ id: number, msg: string }>>([])
  const [loading, setLoading] = useState(false)

  const getItem = () => ({
    name: '',
    values: [{ value: '', id: genId() }],
    id: genId(),
    isDone: false
  })

  const onAdd = () => {
    const item = getItem()
    setOptions([...options, item])
  }

  const onDelete = (id: number) => {
    setOptions(options.filter(item => item.id !== id))
  }

  const onChangeValue = (optionId: number, value: string, index: number) => {
    let option = options.find(item => item.id === optionId)
    if (!option) return
    const nextOptionValue = option.values[index + 1]
    if (!nextOptionValue) {
      const newValue = { value: '', id: genId() }
      option.values.push(newValue)
    }
    option = { ...option, values: option.values.map((item, id) => index === id ? { ...item, value } : item) }
    const newOptions = options.map(item => item.id === optionId ? option : item)
    setOptions(newOptions as Option[])
  }

  const onChangeName = (id: number, name: string) => {
    setOptions(options.map(item => item.id === id ? { ...item, name } : item))
  }

  const onRemoveValue = (optionId: number, id: number) => {
    const newOptions: Option[] = options.map(option => {
      if (option.id !== optionId) return option
      return { ...option, values: option.values.filter(v => v.id !== id) }
    })
    setOptions(newOptions)
  }

  const getErrorMsg = (id: number) => {
    return errors.find(item => item.id === id)?.msg
  }

  const onOk = () => {
    if (errors.length) return
    onChangeLoading(true)
    info.close()
    const worker: Worker = new Handle()
    worker.postMessage({ options, variants: info.data })
    worker.onmessage = (e) => {
      onChangeLoading(false)
      onChange(e.data, options)
    }
  }

  useEffect(() => {
    const errs: Array<{ id: number, msg: string }> = []
    options.forEach(option => {
      if (!option.name) {
        errs.push({ id: option.id, msg: 'Option name is required' })
      }
      if (options.find(item => item.name === option.name && item.id !== option.id)) {
        errs.push({ id: option.id, msg: 'Option name must be unique' })
      }
      option.values.forEach((v, index) => {
        const isLast = index === option.values.length - 1
        if (isLast) return
        if (!v.value) {
          errs.push({ id: v.id, msg: 'Option value is required' })
        }
        if (option.values.find(v2 => v2.value === v.value && v2.id !== v.id)) {
          errs.push({ id: v.id, msg: 'Option value must be unique' })
        }
      })
    })
    setErrors(errs)
  }, [options])

  useEffect(() => {
    if (!info.open) return
    if (info.data?.length) {
      setLoading(true)
      const worker: Worker = new ReserveHandle()
      worker.postMessage({ variants: info.data })
      worker.onmessage = (e) => {
        setLoading(false)
        setOptions(e.data)
      }
    } else {
      setOptions([getItem()])
    }
  }, [info.open])

  return (
    <Drawer
      width={420}
      open={info.open}
      onClose={info.close}
      title={
        <Flex align={'center'} justify={'space-between'}>
          <span>Edit options</span>
          <Button
            style={{ width: 24 }}
            onClick={info.close}
            type={'text'} size={'small'}
          >
            <IconX style={{ position: 'relative', left: -5 }} size={16} />
          </Button>
        </Flex>
      }
      maskClosable={false}
      closeIcon={null}
      footer={
        <Flex justify={'flex-end'}>
          <Button onClick={onOk} type={'primary'}>
            Done
          </Button>
        </Flex>
      }
    >
      <SLoading loading={loading} />
      {
          options?.map((option, index) => (
            <div key={option.id} className={styles.item}>
              <Flex className={styles.header} justify={'space-between'} align={'center'}>
                <Flex gap={4} align={'center'}>
                  <Button className={styles.actionBtn} type={'text'} size={'small'}>
                    <IconGripVertical size={15} />
                  </Button>
                  <div className={styles.title}>{option.name || `Option ${index + 1}`}</div>
                </Flex>
                <Flex gap={4} align={'center'}>
                  <SRender render={options.length > 1}>
                    <Button
                      onClick={() => { onDelete(option.id) }} danger size={'small'} type={'text'}
                    >
                      Delete
                    </Button>
                  </SRender>
                  <Button size={'small'} type={'text'} className={'primary-text'}>
                    Done
                  </Button>
                </Flex>
              </Flex>
              <div className={styles.content}>
                <div className={styles.label}>Option name</div>
                <Input
                  value={option.name}
                  className={classNames({ [styles.errInput]: getErrorMsg(option.id) })}
                  onChange={e => {
                    onChangeName(option.id, e.target.value)
                  }}
                  autoComplete={'off'}
                />
                <div
                  style={{ marginLeft: 2 }}
                  className={getErrorMsg(option.id) ? styles.err : styles.errNo}
                >
                  {getErrorMsg(option.id)}
                </div>
                <div className={styles.label} style={{ marginTop: 6 }}>Option values</div>
                <Flex vertical gap={4}>
                  {
                    option.values?.map((value, index) => {
                      const isLast = index === option.values.length - 1
                      return (
                        <div key={value.id}>
                          <Flex align={'center'}>
                            <Button
                              style={{ marginRight: 8 }}
                              type={'text'}
                              size={'small'}
                              className={classNames({ [styles.hidden]: isLast }, styles.actionBtn)}
                            >
                              <IconGripVertical size={15} />
                            </Button>
                            <Input
                              value={value.value}
                              className={classNames({ [styles.errInput]: getErrorMsg(value.id) })}
                              autoComplete={'off'}
                              onChange={e => {
                                onChangeValue(option.id, e.target.value, index)
                              }}
                              suffix={
                                <SRender render={!isLast}>
                                  <Button
                                    onClick={(e) => { e.stopPropagation(); onRemoveValue(option.id, value.id) }}
                                    className={styles.deleteBtn}
                                    type={'text'}
                                    size={'small'}
                                  >
                                    <IconTrash size={15} />
                                  </Button>
                                </SRender>
                              }
                            />
                            <Button
                              style={{ marginLeft: 8 }}
                              type={'text'}
                              size={'small'}
                              className={classNames({ [styles.hidden]: isLast }, styles.actionBtn)}
                            >
                              <IconPhotoPlus size={15} />
                            </Button>
                          </Flex>
                          <div className={getErrorMsg(value.id) ? styles.err : styles.errNo}>
                            {getErrorMsg(value.id)}
                          </div>
                        </div>
                      )
                    })
                  }
                </Flex>
              </div>
            </div>
          ))
        }
      <SRender render={options.length < 3}>
        <Button style={{ background: '#f7f7f7' }} onClick={onAdd} block>
          <Flex style={{ position: 'relative', top: -2 }} align={'center'} justify={'center'} gap={8}>
            <IconPlus size={13} style={{ position: 'relative', top: -1 }} />
            <div>Add another option</div>
          </Flex>
        </Button>
      </SRender>
      <div style={{ height: 80 }} />
    </Drawer>
  )
}
