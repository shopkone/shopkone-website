import { Card, Flex } from 'antd'

import Page from '@/components/page'

export default function Change () {
  return (
    <Page width={700} title={'Create shipping profile'}>
      <Flex gap={16} vertical>
        <Card title={'Profile name'}>asd</Card>
        <Card title={'Products'}>asd</Card>
        <Card title={'Fulfillment locations'}>asd</Card>
        <Card title={'Shipping zones'}>asd</Card>
      </Flex>
    </Page>
  )
}
