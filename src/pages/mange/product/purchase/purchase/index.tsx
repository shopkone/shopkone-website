import { Button, Card, Flex } from 'antd'

import Page from '@/components/page'
import STable from '@/components/s-table'

export default function Purchase () {
  return (
    <Page title={'Purchase'}>
      <Card>
        <STable
          columns={[]}
          data={[]}
          empty={{
            title: 'Manage your purchase orders',
            desc: 'Track and receive inventory ordered from suppliers.',
            actions: (
              <Flex gap={8}>
                <Button type={'primary'}>Create purchase order</Button>
              </Flex>
            )
          }}
        />
      </Card>
    </Page>
  )
}
