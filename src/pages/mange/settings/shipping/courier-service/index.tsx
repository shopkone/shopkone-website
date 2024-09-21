import { ArrowRight, International, LocalTwo, Right } from '@icon-park/react'
import { Button, Card, Flex } from 'antd'

import SLocation from '@/components/s-location'

import styles from './index.module.less'

export default function CourierService () {
  return (
    <Flex vertical gap={16}>
      <Card
        extra={<Button className={'extra-link'} size={'small'} type={'link'}>Set up</Button>}
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
          No available locations at the moment. Please go to the location list Location to add new locations.
        </div>
      </Card>

      <Card title={'Shipping'}>

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
                  <div><LocalTwo size={16} style={{ position: 'relative', top: 2, marginRight: 4 }} /></div>
                  <div>2 locations</div>
                  <div style={{ position: 'relative', top: 3, marginLeft: 12, marginRight: 12 }}><ArrowRight size={15} /></div>
                  <div style={{ position: 'relative', top: 3, marginRight: 4 }}><International size={15} /></div>
                  <div>2 zones</div>
                </Flex>
              </div>
              <div className={styles['right-icon']}>
                <Right size={16} />
              </div>
            </Flex>
          </Flex>
        </div>

        <div style={{ marginTop: 16 }} className={styles.table}>
          <Flex justify={'space-between'} className={styles.title}>
            <div>Custom shipping rates</div>
            <Button className={'extra-link'} size={'small'} type={'link'}>New profile</Button>
          </Flex>
          <Flex vertical>
            <Flex style={{ padding: 12 }}>
              <Button style={{ fontSize: 13 }} type={'link'} className={'extra-link'}>Create a new profile</Button>
              <div style={{ marginLeft: 4 }}>to add custom rates or destination restrictions for groups of products</div>
            </Flex>
          </Flex>
        </div>
      </Card>
    </Flex>
  )
}
