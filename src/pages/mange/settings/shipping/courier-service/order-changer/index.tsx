import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IconGripVertical } from '@tabler/icons-react'
import { useRequest } from 'ahooks'
import { Flex } from 'antd'

import { LocationListRes } from '@/api/location/list'
import { SetLocationOrder, SetLocationOrderItem } from '@/api/location/set-order'
import IconButton from '@/components/icon-button'
import SLocation from '@/components/s-location'
import { sMessage } from '@/components/s-message'
import SModal from '@/components/s-modal'
import Sortable from '@/components/sortable'
import ItemSortable from '@/components/sortable/sortable-item'
import { UseOpenType } from '@/hooks/useOpen'

import styles from './index.module.less'

export interface OrderChangerProps {
  locations: LocationListRes[]
  openInfo: UseOpenType<void>
  onFresh: () => void
}

export default function OrderChanger (props: OrderChangerProps) {
  const { locations, openInfo, onFresh } = props
  const [sortedList, setSortedList] = useState<SetLocationOrderItem[]>([])
  const { t } = useTranslation('settings', { keyPrefix: 'shipping' })
  const setOrder = useRequest(SetLocationOrder, { manual: true })

  const onOk = async () => {
    await setOrder.runAsync({ items: sortedList })
    onFresh()
    openInfo.close()
    sMessage.success(t('发货点路由顺序调整成功'))
  }

  useEffect(() => {
    setSortedList(locations.map((i) => ({ location_id: i.id, order: i.order })))
  }, [locations])

  return (
    <SModal
      confirmLoading={setOrder.loading}
      onOk={onOk}
      okText={t('更新')}
      open={openInfo.open}
      onCancel={openInfo.close}
      title={t('调整发货点路由')}
      width={700}
    >
      <Flex
        vertical
        gap={8}
        style={{
          minHeight: 400,
          maxHeight: 600,
          padding: 16,
          overflowY: 'auto',
          overflowX: 'hidden'
        }}
      >
        <div style={{ marginBottom: 4 }} className={'tips'}>
          {t('拖拽以调整发货点路由顺序')}
        </div>

        <Sortable<LocationListRes>
          items={sortedList?.map(item => locations.find(i => i.id === item.location_id)) as any}
          onChange={(v) => {
            setSortedList(v.map((i, index) => ({
              location_id: i.id,
              order: index + 1
            })))
          }}
          draggingClassName={styles.dragging}
        >
          {
            (data, id, isBg) => data.map((i, index) => (
              <ItemSortable
                draggingClassName={styles.dragging}
                className={isBg ? styles.draggingItem : styles.item}
                style={{ marginBottom: 12 }}
                rowKey={i.id}
                index={index}
                key={i.id}
              >
                <SLocation
                  hideLoading
                  hideTag
                  extra={row => (
                    <IconButton className={styles.btn} size={24} type={'text'}>
                      <IconGripVertical size={16} />
                    </IconButton>
                  )}
                  value={[i]}
                />
              </ItemSortable>
            ))
          }
        </Sortable>
        <div style={{ height: 64 }} />
      </Flex>
    </SModal>
  )
}
