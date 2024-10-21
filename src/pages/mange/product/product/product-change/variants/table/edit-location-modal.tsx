import { useEffect, useState } from 'react'
import { Button, Checkbox, Flex } from 'antd'

import { LocationListRes } from '@/api/location/list'
import SModal from '@/components/s-modal'
import { UseOpenType } from '@/hooks/useOpen'

export interface EditLocationModalProps {
  locationList: LocationListRes[]
  info: UseOpenType<number[]>
  onConfirm?: (value: number[]) => void
}

export default function EditLocationModal (props: EditLocationModalProps) {
  const { locationList, info, onConfirm } = props
  const [locationIds, setLocationIds] = useState<number[]>([])

  const onChange = (id: number) => {
    if (locationIds.includes(id)) {
      setLocationIds(locationIds.filter(i => i !== id))
    } else {
      setLocationIds([...locationIds, id])
    }
  }

  const isSelectedAll = locationIds?.length === locationList?.length

  const onSelectAll = () => {
    if (isSelectedAll) {
      setLocationIds([])
    } else {
      setLocationIds(locationList?.map(item => item.id))
    }
  }

  useEffect(() => {
    if (!info.open) {
      return
    }
    console.log(info.data, 'INFO>DATA')
    setLocationIds(info.data || [])
  }, [info.open])

  return (
    <SModal
      onOk={() => {
        onConfirm?.(locationIds)
        console.log(locationIds)
        info.close()
      }}
      onCancel={info.close}
      width={620}
      title={'编辑地点'}
      open={info.open}
      okButtonProps={{ disabled: locationIds.length === 0 }}
    >
      <div style={{ padding: 16 }}>
        <div style={{ marginBottom: 16 }}>选择哪些地点拥有这些商品</div>

        <Flex style={{ marginBottom: 16 }} align={'center'} justify={'space-between'}>
          <Button onClick={onSelectAll} style={{ marginLeft: -8, fontSize: 13 }} type={'link'} size={'small'}>
            {isSelectedAll ? '全不选' : '全选'}
          </Button>
          <div>
            已选择 {locationIds.length} 个，共 {locationList?.length || 0} 个
          </div>
        </Flex>

        <Flex vertical gap={8}>
          {
            locationList?.map(item => (
              <div key={item.id}>
                <Checkbox
                  checked={locationIds.includes(item.id)}
                  onChange={() => { onChange?.(item.id) }}
                >
                  {item.name}
                </Checkbox>
              </div>
            ))
          }
        </Flex>
      </div>
    </SModal>
  )
}
