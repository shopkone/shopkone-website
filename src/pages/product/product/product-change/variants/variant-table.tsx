import { AddPicture, Delete, FullScreen, HamburgerButton } from '@icon-park/react'
import { BaseTableProps } from 'ali-react-table'
import { Button, Flex, InputNumber } from 'antd'
import { nanoid } from 'nanoid'

import STable from '@/components/s-table'
import TableFilter from '@/components/table-plugin/table-filter'

import styles from './index.module.less'

export default function VariantTable () {
  const columns: BaseTableProps['columns'] = [
    {
      title: 'Variant',
      name: 'variant',
      code: 'variant',
      render: () => (
        <Flex align={'center'} gap={16}>
          <Flex align={'center'} justify={'center'} className={styles['add-img']}>
            <AddPicture fill={'#3471ff'} size={15} style={{ position: 'relative', top: 2 }} />
          </Flex>
          <div>asd</div>
        </Flex>
      ),
      width: 200,
      lock: true
    },
    {
      title: 'Price',
      name: 'price',
      code: 'price',
      render: () => (
        <InputNumber

          min={0}
          maxLength={16}
          precision={2}
          controls={false}
          suffix={'USD'}
        />
      ),
      width: 120
    },
    {
      title: 'Compare at price',
      name: 'compare_at_price',
      code: 'compare_at_price',
      render: () => (
        <InputNumber
          min={0}
          maxLength={16}
          precision={2}
          controls={false}
          suffix={'USD'}

        />
      ),
      width: 150
    },
    {
      title: 'Cost per item',
      name: 'cost_per_item',
      code: 'cost_per_item',
      render: () => (
        <InputNumber
          min={0}
          maxLength={16}
          precision={2}
          controls={false}
          suffix={'USD'}

        />
      ),
      width: 150
    },
    {
      title: 'Inventory',
      name: 'inventory',
      code: 'inventory',
      render: () => (
        <InputNumber
          min={0}
          precision={0}
          maxLength={16}

          controls={false}
        />
      ),
      width: 120
    },
    {
      title: 'Weight',
      name: 'weight',
      code: 'weight',
      render: () => (
        <InputNumber
          min={0}
          maxLength={16}
          precision={2}
          controls={false}
          style={{ width: 80 }}

        />
      ),
      width: 120
    },
    {
      title: 'SKU',
      name: 'sku',
      code: 'sku',
      render: () => (
        <InputNumber
          className={'fit-width'}
          min={0}
          maxLength={16}
          precision={2}
          controls={false}
        />
      ),
      width: 150
    },
    {
      title: 'Barcode',
      name: 'barcode',
      code: 'barcode',
      render: () => (
        <InputNumber
          className={'fit-width'}
          min={0}
          maxLength={16}
          precision={2}
          controls={false}
        />
      ),
      width: 150
    },
    {
      title: '',
      name: 'action',
      code: 'action',
      render: () => (
        <Button type={'text'} style={{ height: 24, width: 24, padding: 0, borderRadius: 5 }}>
          <Delete size={14} style={{ position: 'relative', top: 1 }} />
        </Button>
      ),
      lock: true,
      width: 50,
      align: 'center'
    }
  ]

  return (
    <div className={styles['variant-table']}>
      <Flex justify={'space-between'}>
        <Flex gap={6} align={'center'} style={{ marginBottom: 8 }}>
          <TableFilter>Style: Iphone 14 Pro</TableFilter>

          <TableFilter >Color: Blue</TableFilter>

          <Button style={{ fontWeight: 400 }} size={'small'} type={'text'}>
            Clear All
          </Button>
        </Flex>

        <Flex gap={16}>
          <Button style={{ height: 24, width: 24, padding: 0, borderRadius: 5 }}>
            <HamburgerButton size={14} style={{ position: 'relative', top: 1 }} />
          </Button>

          <Button style={{ height: 24, width: 24, padding: 0, borderRadius: 5 }}>
            <FullScreen size={14} style={{ position: 'relative', top: 1 }} />
          </Button>
        </Flex>
      </Flex>

      <STable
        rowSelection={{}}
        style={{ margin: '0 -16px' }}
        width={612}
        columns={columns}
        data={Array(500).fill(1).map(i => ({ id: nanoid() }))}
      />
    </div>
  )
}
