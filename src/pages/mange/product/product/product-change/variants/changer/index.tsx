import { IconX } from '@tabler/icons-react'
import { Button, Drawer, Flex, Form } from 'antd'

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
            (fields, { add }) => (
              <div>
                {
                  fields.map(item => (
                    <Item key={item.key} />
                  ))
                }
                <Button onClick={() => { add() }} block style={{ marginTop: 20 }}>
                  Add another option
                </Button>
              </div>
            )
          }
        </Form.List>
      </Form>
    </Drawer>
  )
}
