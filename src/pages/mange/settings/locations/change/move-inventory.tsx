import { useEffect, useMemo, useState } from 'react'
import { IconAlertTriangle } from '@tabler/icons-react'
import { useRequest } from 'ahooks'
import { Alert, Flex } from 'antd'

import { InventoryMoveApi } from '@/api/inventory/move'
import { LocationListApi } from '@/api/location/list'
import SModal from '@/components/s-modal'
import SSelect from '@/components/s-select'
import { UseOpenType } from '@/hooks/useOpen'

import styles from './index.module.less'

export interface MoveInventoryProps {
  info: UseOpenType<{ id: number, name: string }>
  onConfirm: () => Promise<void>
}

export default function MoveInventory (props: MoveInventoryProps) {
  const { info, onConfirm } = props

  const locations = useRequest(async () => await LocationListApi({ active: true }))
  const [currenSelect, setCurrentSelect] = useState<number>()
  const move = useRequest(InventoryMoveApi, { manual: true })
  const [loading, setLoading] = useState(false)

  const options = useMemo(() => {
    if (!info?.data?.id) return []
    if (!locations?.data?.length) return []
    if (!info?.open) return []
    const list = locations.data.filter(item => item.id !== info?.data?.id)
    return list.map(item => ({ label: item.name, value: item.id }))
  }, [locations, info?.data?.id, info?.open])

  const onOk = async () => {
    if (!currenSelect || !info?.data?.id) return
    try {
      setLoading(true)
      await move.runAsync({ to: currenSelect, from: info?.data?.id })
      await onConfirm()
      info.close()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!info.open) return
    if (currenSelect || !options?.length) return
    setCurrentSelect(options[0]?.value)
  }, [options, info.open])

  return (
    <SModal
      okText={'Deactivate'}
      title={`Deactivate ${info?.data?.name}?`}
      open={info.open}
      onCancel={info.close}
      onOk={onOk}
      confirmLoading={loading}
    >
      <div className={styles.p16}>
        <Alert
          message={
            <Flex gap={6}>
              <IconAlertTriangle size={16} className={styles.icon} />
              <Flex gap={16} vertical>
                <div>
                  To deactivate <span style={{ fontWeight: 600 }}>{info?.data?.name}</span>, you need to select a location to inherit:
                </div>
                <ul>
                  <li className={styles.item}>Inventory in this location</li>
                  <li className={styles.item}>Assigned to unfulfilled orders at this location</li>
                </ul>
              </Flex>
            </Flex>
          }
          type={'warning'}
          style={{ border: 'none' }}
        />
      </div>
      <div>
        <div className={'line'} style={{ margin: 0 }} />
        <div className={styles.p16}>
          <div>Select a location</div>
          <SSelect
            value={currenSelect}
            onChange={setCurrentSelect}
            options={options}
            style={{ marginTop: 8 }}
            className={'fit-width'}
          />
        </div>
      </div>
    </SModal>
  )
}
