import { Button, Card, Checkbox, Form } from 'antd'

import Page from '@/components/page'
import STable, { STableProps } from '@/components/s-table'

export default function Taxes () {
  const columns: STableProps['columns'] = [
    { title: 'Country / Region', code: 'region', name: 'region' },
    { title: 'Number of regions', code: 'region', name: 'region' },
    { title: 'Sales tax rate', code: 'region', name: 'region' },
    { title: 'Shipping tax rate', code: 'region', name: 'region' }
  ]
  return (
    <Page width={800} title={'Taxes'}>
      <Card
        extra={
          <Button size={'small'} type={'text'}>Select region</Button>
        }
        title={'Regional settings'}
      >
        <div className={'tips'} style={{ marginBottom: 12 }}>
          Create a shipping zone in the region(s) you want to collect tax in. Then, find the region in this list and select it to manage its tax settings. If you’re unsure about where you’re liable, check with a tax professional.
        </div>
        <STable
          className={'table-border'}
          columns={columns}
          data={[]}
          borderless
        />
      </Card>

      <Card style={{ marginTop: 16 }} title={'Global settings'}>
        <Form.Item
          extra={
            <div className={'tips'} style={{ marginTop: -8, marginLeft: 24 }}>
              Automatically calculated for Canada, European Union, and United States
            </div>
          }
        >
          <Checkbox>
            Charge sales tax on shipping
          </Checkbox>
        </Form.Item>
      </Card>
    </Page>
  )
}
