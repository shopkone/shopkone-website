import { useNavigate } from 'react-router-dom'
import { Button, Flex } from 'antd'

import Page from '@/components/page'
import STable from '@/components/s-table'
import SCard from '@/components/s-card'

export default function GiftCard () {
  const nav = useNavigate()
  return (
    <Page title={'Gift cards'}>
      <SCard >
        <STable
          init
          columns={[]}
          data={[]}
          empty={{
            title: 'Start selling gift cards',
            desc: 'Add gift card products to sell or create gift cards and send them directly to your customers..',
            actions: (
              <Flex gap={8}>
                <Button onClick={() => { nav('change') }}>Create gift card</Button>
                <Button onClick={() => { nav('/products/gift_cards/product_change') }} type={'primary'}>Add gift card product</Button>
              </Flex>
            )
          }}
        />
      </SCard>
    </Page>
  )
}
