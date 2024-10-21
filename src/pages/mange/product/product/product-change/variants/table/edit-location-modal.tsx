import { useEffect, useState } from 'react'
import { Button, Checkbox, Flex } from 'antd'

import { LocationListRes } from '@/api/location/list'
import SModal from '@/components/s-modal'
import { useI18n } from '@/hooks/use-lang'
import { UseOpenType } from '@/hooks/useOpen'

export interface EditLocationModalProps {
  locationList: LocationListRes[]
  info: UseOpenType<number[]>
  onConfirm?: (value: number[]) => void
}

export default function EditLocationModal (props: EditLocationModalProps) {
  const { locationList, info, onConfirm } = props
  const [locationIds, setLocationIds] = useState<number[]>([])
  const t = useI18n()

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
      title={t('编辑地点')}
      open={info.open}
      okButtonProps={{ disabled: locationIds.length === 0 }}
    >
      <div style={{ padding: 16 }}>
        <div style={{ marginBottom: 12 }}>{t('哪些地点拥有这些商品？')}</div>

        <Flex style={{ marginBottom: 12 }} align={'center'} justify={'space-between'}>
          <Button onClick={onSelectAll} style={{ marginLeft: -8, fontSize: 13 }} type={'link'} size={'small'}>
            {isSelectedAll ? t('全不选') : t('全选')}
          </Button>
          <div>
            {t('已选中地点', { select: locationIds.length || 0, total: locationList?.length || 0 })}
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
