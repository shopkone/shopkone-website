import { Button, Card, Flex } from 'antd'

import Page from '@/components/page'
import STable from '@/components/s-table'

export default function GiftCard () {
  return (
    <Page title={'Gift cards'}>
      <Card>
        <STable
          columns={[]}
          data={[]}
          empty={{
            title: 'Start selling gift cards',
            desc: 'Add gift card products to sell or create gift cards and send them directly to your customers..',
            actions: (
              <Flex gap={8}>
                <Button>Create gift card</Button>
                <Button type={'primary'}>Add gift card product</Button>
              </Flex>
            )
          }}
        />
      </Card>
    </Page>
  )
}
