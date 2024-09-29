import { useEffect } from 'react'
import { IconPlus, IconX } from '@tabler/icons-react'
import { Button, Drawer, Flex, Form } from 'antd'

import SRender from '@/components/s-render'
import { UseOpenType } from '@/hooks/useOpen'
import { Options } from '@/pages/mange/product/product/product-change/state'
import Item from '@/pages/mange/product/product/product-change/variants/changer/item'
import { genId } from '@/utils/random'

export interface ChangerProps {
  info: UseOpenType<unknown>
}

export default function Changer (props: ChangerProps) {
  const { info } = props
  const [form] = Form.useForm()

  const getItem = () => {
    const item: Options = {
      name: '',
      values: [{ value: '', id: genId() }],
      isDone: false,
      id: genId()
    }
    return item
  }

  useEffect(() => {
    if (info.open) {
      form.setFieldsValue({ options: [getItem()] })
    }
  }, [info.open])

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
          <div>Will generate 2 variants</div>
          <Button type={'primary'}>
            Done
          </Button>
        </Flex>
      }
    >
      <Form form={form} layout={'vertical'} style={{ paddingBottom: 48 }}>
        <Form.List name={'options'}>
          {
            (fields, { add, remove }) => (
              <div>
                {
                  fields.map(item => (
                    <Item
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
