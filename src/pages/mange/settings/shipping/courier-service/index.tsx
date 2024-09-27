import { useNavigate } from 'react-router-dom'
import { IconArrowRight, IconChevronRight, IconMapPin, IconWorld } from '@tabler/icons-react'
import { Button, Card, Empty, Flex } from 'antd'

import SLocation from '@/components/s-location'

import styles from './index.module.less'

export default function CourierService () {
  const nav = useNavigate()

  return (
    <Flex vertical gap={16}>
      <Card
        extra={(
          <Button className={'extra-link'} size={'small'} type={'link'}>Change default location</Button>
      )}
        title={'Default location'}
      >
        <div style={{ marginBottom: 12 }} className={'tips'}>
          When the order cannot be routed through the shipping point to find the inventory that meets the shipping location, it will be assigned to that location by default.
        </div>
        <SLocation />
      </Card>

      <Card
        extra={<Button className={'extra-link'} size={'small'} type={'link'}>Set up</Button>}
        title={'Shipping point routing'}
      >
        <div className={'tips'}>
          When a new order is generated, according to this routing rule, the inventory will be automatically assigned to the order to meet the shipping location.
        </div>
      </Card>

      <Card
        extra={
          <Button onClick={() => { nav('courier-service/change') }} className={'extra-link'} size={'small'} type={'link'}>
            New profile
          </Button>
        }
        title={'Shipping'}
      >
        <div
          style={{
            marginBottom: 12,
            marginTop: -8
          }} className={'tips'}
        >
          Choose where you ship and how much you charge for shipping at checkout.
        </div>

        <div className={styles.table}>
          <div className={styles.title}>General shipping rates</div>
          <Flex vertical>
            <Flex align={'center'} className={styles.item}>
              <div className={styles.left}>
                <div className={styles.name}>General</div>
                <div>0 products</div>
              </div>
              <div className={styles.right}>
                <div className={styles.name}>Rates for</div>
                <Flex align={'center'}>
                  <div><IconMapPin size={16} style={{ position: 'relative', top: 2, marginRight: 4 }} /></div>
                  <div>2 locations</div>
                  <div style={{ position: 'relative', top: 3, marginLeft: 12, marginRight: 12 }}><IconArrowRight size={15} /></div>
                  <div style={{ position: 'relative', top: 2, marginRight: 4 }}><IconWorld size={16} /></div>
                  <div>2 zones</div>
                </Flex>
              </div>
              <div className={styles['right-icon']}>
                <IconChevronRight size={16} />
              </div>
            </Flex>
          </Flex>
        </div>

        <div style={{ marginTop: 16 }} className={styles.table}>
          <div className={styles.title}>
            Custom shipping rates
          </div>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={(
              <Flex style={{ marginTop: 16 }} vertical gap={12}>
                <div className={'secondary'}>
                  Creating a new group of locations in your shipping profiles lets you specify the zones and rates for locations in that group.
                </div>
                <div style={{ marginTop: 8 }}>
                  <Button>
                    New profile
                  </Button>
                </div>
              </Flex>
              )}
          />
        </div>
      </Card>
    </Flex>
  )
}
