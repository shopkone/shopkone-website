import { IconX } from '@tabler/icons-react'
import { Button, Drawer, Flex, Form } from 'antd'

import SRender from '@/components/s-render'
import Item from '@/pages/mange/product/product/product-change/variants/changer/item'

export default function Changer () {
  return (
    <Drawer
      width={420}
      closeIcon={false}
      maskClosable={false}
      extra={
        <Button size={'small'} type={'text'}>
          <IconX size={18} />
        </Button>
      }
      open
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
      <Form layout={'vertical'} style={{ paddingBottom: 48 }}>
        <Form.List name={'options'}>
          {
            (fields, { add, remove }) => (
              <div>
                {
                  fields.map(item => (
                    <Item
                      onRemove={fields.length > 1 ? () => { remove(item.name) } : undefined}
                      key={item.name}
                    />
                  ))
                }
                <SRender render={fields?.length !== 3}>
                  <Button onClick={() => { add() }} block style={{ marginTop: fields?.length ? 20 : 0 }}>
                    Add another option
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
