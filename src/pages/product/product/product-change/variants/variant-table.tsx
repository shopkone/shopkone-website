import { useState } from 'react'
import { AddPicture, DeleteFour, FullScreen, HamburgerButton, OffScreen } from '@icon-park/react'
import { BaseTableProps } from 'ali-react-table'
import { Button, Flex, InputNumber } from 'antd'
import classNames from 'classnames'
import { nanoid } from 'nanoid'

import STable from '@/components/s-table'
import Index from '@/components/table-filter'

import styles from './index.module.less'

export default function VariantTable () {
  const [fullScreen, setFullScreen] = useState(false)

  const [filter, setFilter] = useState<number>()

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
      width: 200
    },
    {
      title: 'Price',
      name: 'price',
      code: 'price',
      render: () => (
        <InputNumber
          placeholder={'0.00'}
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
          placeholder={'0.00'}
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
          placeholder={'0.00'}
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
          placeholder={'0'}
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
          placeholder={'0.00'}
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
          <DeleteFour fill={'#1f2329e0'} size={15} style={{ position: 'relative', top: 1 }} />
        </Button>
      ),
      width: 50,
      align: 'center',
      lock: true
    }
  ]

  return (
    <div className={classNames(styles['variant-table'], { [styles['full-screen']]: fullScreen })}>
      <Flex justify={'space-between'}>
        <Flex gap={6} align={'center'} style={{ marginBottom: 8 }}>
          <Index
            radio={{
              options: [
                { label: 'Iphone15', value: 1 },
                { label: 'Iphone16', value: 2 },
                { label: 'Iphone17', value: 3 }
              ],
              value: filter,
              onChange: (v) => { setFilter(Number(v || 0)) }
            }}
          >
            Style
          </Index>

          <Index >Color: Blue</Index>

          <Button style={{ fontWeight: 400 }} size={'small'} type={'text'}>
            Clear all
          </Button>
        </Flex>

        <Flex gap={12}>
          <Button style={{ height: 24, width: 24, padding: 0, borderRadius: 5 }}>
            <HamburgerButton size={14} style={{ position: 'relative', top: 1 }} />
          </Button>

          <Button
            onClick={() => { setFullScreen(!fullScreen) }}
            style={{ height: 24, width: 24, padding: 0, borderRadius: 5 }}
          >
            {
                !fullScreen
                  ? (
                    <FullScreen size={13} style={{ position: 'relative', top: 1 }} />
                    )
                  : (
                    <OffScreen size={13} style={{ position: 'relative', top: 1 }} />
                    )
              }
          </Button>
        </Flex>
      </Flex>

      <STable
        rowSelection={{}}
        stickyTop={fullScreen ? -12 : undefined}
        style={{ margin: '0 -16px' }}
        width={fullScreen ? undefined : 612}
        columns={columns}
        data={Array(500).fill(1).map(i => ({ id: nanoid() }))}
      />
    </div>
  )
}
