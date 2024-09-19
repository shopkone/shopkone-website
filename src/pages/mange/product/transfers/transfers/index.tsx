import { Button, Card, Flex } from 'antd'

import Page from '@/components/page'
import STable from '@/components/s-table'

export default function Transfers () {
  return (
    <Page title={'Transfers'}>
      <Card>
        <STable
          columns={[]}
          data={[]}
          empty={{
            title: 'Move inventory between locations',
            desc: 'Move and track inventory between your business locations.',
            actions: (
              <Flex gap={8}>
                <Button type={'primary'}>Create transfer</Button>
              </Flex>
            )
          }}
        />
      </Card>
    </Page>
  )
}
