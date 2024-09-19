import { Button, Card, Flex } from 'antd'

import Page from '@/components/page'
import STable from '@/components/s-table'

export default function Inventory () {
  return (
    <Page title={'Inventory'}>
      <Card>
        <STable
          columns={[]}
          data={[]}
          empty={{
            title: 'Keep track of your inventory',
            desc: 'When you enable inventory tracking on your products, you can view and adjust their inventory counts here.',
            actions: (
              <Flex gap={8}>
                <Button type={'primary'}>Go to products</Button>
              </Flex>
            )
          }}
        />
      </Card>
    </Page>
  )
}
