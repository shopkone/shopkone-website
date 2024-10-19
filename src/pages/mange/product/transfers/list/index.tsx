import { useNavigate } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { Button, Flex } from 'antd'

import { LocationListApi } from '@/api/location/list'
import Page from '@/components/page'
import SCard from '@/components/s-card'
import SRender from '@/components/s-render'
import STable from '@/components/s-table'
import Filters from '@/pages/mange/product/transfers/list/filters'

export default function TransferList () {
  const locations = useRequest(async () => await LocationListApi({ active: true }))
  const nav = useNavigate()

  return (
    <Page type={'product'} title={'转移'}>
      <SCard styles={{ body: { padding: '8px 0' } }}>
        <Filters />
        <STable
          columns={[]}
          data={[]}
          empty={{
            desc: '在地点之间移动库存',
            title: '转移和跟踪您的各个业务地点的库存',
            actions: (
              <Flex align={'center'}>
                <SRender render={(locations?.data?.length || 0) < 2}>
                  若要创建转移，您需要多个地点,
                  <Button onClick={() => { nav('/settings/locations') }} style={{ fontSize: 13, marginLeft: -1, marginRight: -4 }} type={'link'} size={'small'}>
                    添加地点
                  </Button>。
                </SRender>

                <SRender render={(locations?.data?.length || 0) >= 2}>
                  <Button onClick={() => { nav('create') }} type={'primary'}>创建转移</Button>
                </SRender>
              </Flex>
            )
          }}
          init={!locations.loading}
        />
      </SCard>
    </Page>
  )
}
