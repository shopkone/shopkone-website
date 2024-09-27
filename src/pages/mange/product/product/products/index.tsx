import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconDownload, IconPlus } from '@tabler/icons-react'
import { Button, Card, Flex, Input } from 'antd'

import Page from '@/components/page'
import SRender from '@/components/s-render'
import STable, { STableProps } from '@/components/s-table'
import TableFilter from '@/components/table-filter'

import styles from './index.module.less'

export default function Products () {
  const nav = useNavigate()

  const columns: STableProps['columns'] = [
    { title: 'asd', code: 'asd', name: 'asd' }
  ]

  const [list] = useState([])

  return (
    <Page
      header={
        <SRender render={list?.length}>
          <Flex gap={8}>
            <Button type={'text'}>Export</Button>
            <Button type={'text'}>Import</Button>
            <Button type={'text'}>More actions</Button>
            <Button onClick={() => { nav('/products/change') }} type={'primary'}>Add product</Button>
          </Flex>
        </SRender>
      }
      title={'Products'}
    >
      <Card styles={{ body: { padding: 0 } }}>
        <SRender render={list?.length}>
          asd
        </SRender>
        <SRender render={list?.length}>
          <Flex align={'center'} justify={'space-between'} style={{ margin: '6px 8px' }}>
            <Input
              className={styles.search}
              placeholder={'Searching all products'}
              size={'small'}
              variant={'filled'}
            />
            <div>
              123
            </div>
          </Flex>
          <div style={{ margin: 0, width: '100%' }} className={'line'} />
          <Flex gap={8} style={{ padding: '6px 8px' }}>
            <TableFilter radio={{ options: [] }}>
              asd
            </TableFilter>
            <TableFilter radio={{ options: [] }}>
              asd
            </TableFilter>
          </Flex>
        </SRender>
        <STable
          empty={{
            title: 'Add your products',
            desc: 'Start by stocking your store with products your customers will love',
            actions: (
              <Flex gap={12}>
                <Button>
                  <Flex gap={6} align={'center'} style={{ position: 'relative', top: -2 }}>
                    <IconDownload size={15} />
                    <div>Import</div>
                  </Flex>
                </Button>
                <Button>
                  <Flex gap={6} align={'center'} style={{ position: 'relative', top: -2 }}>
                    <IconDownload size={15} />
                    <div>Import by Shopify</div>
                  </Flex>
                </Button>
                <Button onClick={() => { nav('change') }} type={'primary'}>
                  <Flex gap={4} align={'center'} style={{ position: 'relative', top: -2 }}>
                    <IconPlus size={14} />
                    <div>Add products</div>
                  </Flex>
                </Button>
              </Flex>
            )
          }}
          columns={columns}
          data={[]}
        />
      </Card>
    </Page>
  )
}
