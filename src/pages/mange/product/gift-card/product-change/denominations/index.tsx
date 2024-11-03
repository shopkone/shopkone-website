import { Form } from 'antd'

import Table from '@/pages/mange/product/gift-card/product-change/denominations/table'
import SCard from '@/components/s-card'

export default function Denominations () {
  return (
    <SCard  title={'Denominations'}>
      <div style={{ marginTop: 8 }} className={'tips'}>
        Gift cards issued through purchasing gift card products are long-term valid by default. You can manage them through the gift card list.
      </div>

      <Form.Item name={'denominations'} style={{ marginTop: 20, marginBottom: 0 }}>
        <Table />
      </Form.Item>
    </SCard>
  )
}
