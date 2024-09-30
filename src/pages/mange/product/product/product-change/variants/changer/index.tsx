import { useEffect, useState } from 'react'
import { IconPlus, IconX } from '@tabler/icons-react'
import { useDebounceFn } from 'ahooks'
import { Button, Drawer, Flex, Form } from 'antd'

import SRender from '@/components/s-render'
import { UseOpenType } from '@/hooks/useOpen'
import { Options } from '@/pages/mange/product/product/product-change/state'
import Item, { ItemProps } from '@/pages/mange/product/product/product-change/variants/changer/item'
import { Variant } from '@/pages/mange/product/product/product-change/variants/variant-table'
import { genId } from '@/utils/random'

// @ts-expect-error
import OptionsHandle from './options-handle?worker'

export interface ChangerProps {
  info: UseOpenType<Variant[]>
  onChangeVariants?: (variants: Variant[]) => void
}

export default function Changer (props: ChangerProps) {
  const { info, onChangeVariants } = props
  const [form] = Form.useForm()
  const [errors, setErrors] = useState<ItemProps['errors']>([])
  const [variants, setVariants] = useState<Variant[]>([])

  const options: Options[] = Form.useWatch('options', form)

  const getItem = () => {
    const item: Options = {
      name: '',
      values: [{ value: '', id: genId() }],
      isDone: false,
      id: genId()
    }
    return item
  }

  const onOk = () => {
    onChangeVariants?.(variants)
    info.close()
  }

  const onSetVariants = useDebounceFn((options: Options[]) => {
    if (!info.open) return
    const worker: Worker = new OptionsHandle()
    worker.postMessage({ options, variants: info.data || [] })
    worker.onmessage = (e) => {
      setVariants(e.data)
    }
  }, { wait: 300 }).run

  useEffect(() => {
    if (info.open) {
      form.resetFields()
      form.setFieldsValue({ options: [getItem()] })
      if (!info?.data?.length) return
      const options: Options[] = []
      info.data?.forEach(item => {
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
      form.setFieldsValue({ options })
    }
  }, [info.open])

  useEffect(() => {
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
    setErrors(errors)
    if (errors?.length) {
      return
    }
    onSetVariants(options?.filter(i => i.name && i.values?.[0]?.value) || [])
  }, [options])

  return (
    <Drawer
      open={info.open}
      onClose={info.close}
      width={420}
      closeIcon={false}
      maskClosable={false}
      extra={
        <Button onClick={info.close} size={'small'} type={'text'}>
          <IconX size={18} />
        </Button>
      }
      title={'Edit options'}
      footer={
        <Flex justify={'space-between'}>
          <div>Will generate ({variants?.length}/500) variants</div>
          <Button onClick={onOk} type={'primary'}>
            Done
          </Button>
        </Flex>
      }
    >
      <Form form={form} layout={'vertical'} style={{ paddingBottom: 48, overflowX: 'hidden' }}>
        <Form.List name={'options'}>
          {
            (fields, { add, remove }) => (
              <div>
                {
                  fields.map(item => (
                    <Item
                      errors={errors}
                      item={options[item.name]}
                      name={item.name}
                      onRemove={fields.length > 1 ? () => { remove(item.name) } : undefined}
                      key={item.name}
                    />
                  ))
                }
                <SRender render={fields?.length !== 3}>
                  <Button
                    onClick={() => {
                      add(getItem())
                    }}
                    block
                    style={{ marginTop: fields?.length ? 20 : 0 }}
                  >
                    <Flex style={{ position: 'relative', top: -1 }} justify={'center'} align={'center'} gap={4}>
                      <IconPlus
                        size={13}
                        style={{
                          position: 'relative',
                          top: -1
                        }}
                      />
                      Add another option
                    </Flex>
                  </Button>
                </SRender>
              </div>
            )
          }
        </Form.List>
      </Form>
    </Drawer>
  )
}
