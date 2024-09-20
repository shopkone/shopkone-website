import { useNavigate } from 'react-router-dom'
import { Button, Card, Flex } from 'antd'

import Page from '@/components/page'
import STable from '@/components/s-table'

export default function Collections () {
  const nav = useNavigate()
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
                <Button
                  onClick={() => { nav('change') }}
                  type={'primary'}
                >
                  Create collection
                </Button>
              </Flex>
            )
          }}
        />
      </Card>
    </Page>
  )
}
