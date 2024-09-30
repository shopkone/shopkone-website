import { useEffect, useState } from 'react'
import { IconPlus, IconX } from '@tabler/icons-react'
import { useDebounceFn } from 'ahooks'
import { Button, Drawer, Flex } from 'antd'

import SRender from '@/components/s-render'
import { UseOpenType } from '@/hooks/useOpen'
import { genId } from '@/utils/random'

import { Option, Variant } from '../state'

// @ts-expect-error
import OptionsHandle from './handle?worker'
import styles from './index.module.less'
import Item, { ItemProps } from './item'

export interface ChangerProps {
  onChangeOptions: (options: Option[]) => void
  onChangeVariants?: (variants: Variant[]) => void
  openInfo: UseOpenType<Variant[]>
}

export default function Changer (props: ChangerProps) {
  const { onChangeVariants, openInfo, onChangeOptions } = props
  const [errors, setErrors] = useState<ItemProps['errors']>([])
  const [variants, setVariants] = useState<Variant[]>([])
  const [options, setOptions] = useState<Option[]>([])

  const getItem = (): Option => {
    return { id: genId(), name: '', values: [{ value: '', id: genId() }] }
  }

  const onRemove = (id: number) => {
    const newOptions = options.filter(option => option.id !== id)
    setOptions(newOptions)
  }

  const onAdd = () => {
    const item = getItem()
    setOptions([...options, item])
  }

  const onChange = (option: Option) => {
    setOptions(options.map(item => item.id === option.id ? option : item))
  }

  const onSetVariants = useDebounceFn((options: Option[]) => {
    if (!openInfo.open) return
    const worker: Worker = new OptionsHandle()
    worker.postMessage({ options, variants: openInfo.data || [] })
    worker.onmessage = (e) => {
      setVariants(e.data)
    }
  }, { wait: 300 }).run

  const WatchErrors = () => {
    const errors: ItemProps['errors'] = []
    options?.forEach(item => {
      if (!item.name && !item?.values?.[0]?.value) return
      if (!item.name) {
        errors.push({ id: item.id, msg: 'Name is required' })
      }
      if (options.filter(o => o.name === item.name).length > 1) {
        errors.push({ id: item.id, msg: 'Name must be unique' })
      }
      item.values?.forEach((value, index) => {
        const Last = item.values.length - 1
        if ((index === Last) && index !== 0) return
        if (!value.value) {
          errors.push({ id: value.id, msg: 'Value is required' })
        }
        if (item.values.filter(o => o.value === value.value).length > 1) {
          errors.push({ id: value.id, msg: 'Value must be unique' })
        }
      })
    })
    return errors
  }

  const onOk = () => {
    onChangeVariants?.(variants)
    onChangeOptions(options)
    openInfo.close()
  }

  useEffect(() => {
    if (!openInfo.open) return
    if (openInfo.data) {
      const options: Option[] = []
      openInfo.data?.forEach(item => {
        item.name.forEach(name => {
          let option = options.find(o => o.name === name.label)
          if (!option) {
            options.push({ name: name.label, values: [], isDone: false, id: genId() })
          }
          option = options.find(o => o.name === name.label)
          if (!option?.values) return
          if (option.values?.find(v => v.value === name.value)) return
          option?.values?.push({ value: name.value, id: genId() })
        })
      })
      setOptions((options || []).map(option => ({ ...option, values: [...option.values, { id: genId(), value: '' }] })))
    } else {
      setOptions([getItem()])
    }
  }, [openInfo.open])

  useEffect(() => {
    const errors = WatchErrors()
    setErrors(errors)
    if (errors?.length) {
      return
    }
    onSetVariants(options)
  }, [options])

  return (
    <Drawer
      footer={
        <Flex align={'center'} justify={'space-between'}>
          <div>Will generate {variants?.length} variants</div>
          <Button onClick={onOk} type={'primary'}>Done</Button>
        </Flex>
      }
      title={
        <Flex align={'center'} justify={'space-between'}>
          <div>Edit Options</div>
          <Button onClick={openInfo.close} style={{ padding: 0, width: 27 }} type={'text'}>
            <IconX size={17} />
          </Button>
        </Flex>
      }
      maskClosable={false}
      closable={false}
      className={styles.container}
      width={450}
      open={openInfo.open}
    >
      {
        options.map((option, index) => (
          <Item
            errors={errors}
            key={option.id}
            value={option}
            name={option.name || `Option ${index + 1}`}
            onRemove={options.length > 1 ? onRemove : undefined}
            onChange={onChange}
          />
        ))
      }
      <SRender render={options?.length !== 3}>
        <Button style={{ marginTop: -8 }} onClick={onAdd}>
          <Flex align={'center'} gap={4}>
            <IconPlus size={13} />
            <div>Add another option</div>
          </Flex>
        </Button>
      </SRender>

      <div style={{ marginBottom: 64 }} />
    </Drawer>
  )
}
