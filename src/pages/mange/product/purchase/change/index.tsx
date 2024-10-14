import { Button, Card, Empty, Flex } from 'antd'

import Page from '@/components/page'
import SSelect from '@/components/s-select'
import SelectVariants from '@/components/select-variants'
import { useOpen } from '@/hooks/useOpen'

import styles from './index.module.less'

export default function Change () {
  const openInfo = useOpen<number[]>([])

  return (
    <Page
      width={950}
      title={'Create purchase order'}
      back={'/products/purchase_orders'}
    >
      <Flex className={styles.card}>
        <div className={styles.item}>
          <div className={styles.title}>Supplier</div>
          <SSelect placeholder={'Select supplier'} className={styles.select} variant={'borderless'} />
        </div>
        <div className={styles.item}>
          <div className={styles.title}>Destination</div>
          <SSelect placeholder={'Shop location'} className={styles.select} variant={'borderless'} />
        </div>
      </Flex>

      <Card title={'Products'} className={'fit-width'}>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ padding: '32px 0' }}
          description={(
            <Flex style={{ marginTop: 16 }} vertical gap={12}>
              <div>
                Only items with inventory tracking settings can be selected.
              </div>
              <div>
                <Button onClick={() => { openInfo.edit() }}>
                  Select products
                </Button>
              </div>
            </Flex>
          )}
        />
      </Card>

      <SelectVariants info={openInfo} />
    </Page>
  )
}
