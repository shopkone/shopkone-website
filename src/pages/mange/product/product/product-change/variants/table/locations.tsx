import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { Button, Flex } from 'antd'

import { LocationListApi } from '@/api/location/list'
import SLoading from '@/components/s-loading'
import SSelect from '@/components/s-select'
import { useOpen } from '@/hooks/useOpen'
import EditLocationModal from '@/pages/mange/product/product/product-change/variants/table/edit-location-modal'

export interface LocationsSelectProps {
  selected: number
  setSelected: (selected: number) => void
  value?: number[]
  onChange?: (value: number[]) => void
}

export default function LocationsSelect (props: LocationsSelectProps) {
  const { selected, setSelected, value, onChange } = props
  const locations = useRequest(async () => await LocationListApi({ active: true }))
  const { id } = useParams()
  const options = locations.data?.map(item => ({ label: item.name, value: item.id }))?.filter(i => value?.includes(i.value))

  const openInfo = useOpen<number[]>()

  useEffect(() => {
    if (!value?.includes(selected)) {
      setSelected(0)
    }
  }, [value])

  useEffect(() => {
    if (!id && locations.data?.length) {
      onChange?.(locations?.data?.map(item => item.id) || [])
    }
  }, [id, locations.data])

  if (locations.loading) return <div><SLoading black size={14} /></div>

  if (Number(locations?.data?.length) < 2) return null

  return (
    <>
      <Flex align={'center'} gap={8}>
        <div style={{ flexShrink: 0 }}>Location</div>
        <SSelect
          value={selected}
          onChange={setSelected}
          options={[{ label: 'All locations', value: 0 }].concat(options || [])}
          size={'small'}
          dropdownStyle={{ minWidth: 300, maxWidth: 500 }}
          style={{ minWidth: 120, maxWidth: 300 }}
        />
        <Button
          onClick={() => { openInfo.edit(value) }}
          type={'link'}
          style={{ marginLeft: -6 }}
          size={'small'}
        >
          编辑地点
        </Button>
      </Flex>

      <EditLocationModal
        onConfirm={onChange}
        info={openInfo}
        locationList={locations?.data || []}
      />
    </>
  )
}
