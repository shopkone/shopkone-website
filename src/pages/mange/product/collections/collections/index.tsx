import { Button, Card, Flex } from 'antd'

import Page from '@/components/page'
import STable from '@/components/s-table'

export default function Collections () {
  return (
    <Page title={'Collections'}>
      <Card>
        <STable
          columns={[]}
          data={[]}
          empty={{
            title: 'Group your products into categories',
            desc: 'Use collections to organize your products into categories and galleries for your online store.',
            actions: (
              <Flex gap={8}>
                <Button type={'primary'}>Create Collection</Button>
              </Flex>
            )
          }}
        />
      </Card>
    </Page>
  )
}
