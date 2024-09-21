import { Card, Flex } from 'antd'

import Page from '@/components/page'
import STable from '@/components/s-table'

export default function Domains () {
  return (
    <Page title={'Domains'} width={800} bottom={48}>
      <Flex vertical gap={16}>
        <Card title={'Primary domain'}>
          <div className={'tips'} style={{ marginBottom: 12 }}>
            Traffic generated from all store domains will be redirected to the registered default domain once activated.
          </div>
          <STable
            borderless
            style={{
              border: '1px solid #d0d3d6',
              borderRadius: 12,
              overflow: 'hidden'
            }}
            columns={[]}
            data={[]}
          />
        </Card>
        <Card title={'Domain list'}>
          <div
            className={'tips'} style={{ marginBottom: 12 }}
          >
            <div>
              Your root domain is the highest level of domain in any domain naming system. We strongly suggest linking to a domain in the form of www.domain.com.
            </div>
            <div style={{ marginTop: 4 }}>
              Domains with suffix of ".fun" are not supported in Shopkone.
            </div>
          </div>
          <STable
            borderless
            className={'table-border'}
            columns={[]}
            data={[]}
          />
        </Card>
        <Card title={'IP blocking'}>
          <div
            className={'tips'} style={{

              marginBottom: 12
            }}
          >
            Once enabled, you can block visitors from specific countries/regions
          </div>
          <STable
            borderless
            style={{ border: '1px solid #d0d3d6', borderRadius: 12, overflow: 'hidden' }}
            columns={[]}
            data={[]}
          />
        </Card>
      </Flex>
    </Page>
  )
}
