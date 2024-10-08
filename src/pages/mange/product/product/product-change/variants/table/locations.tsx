import { useEffect } from 'react'
import { useRequest } from 'ahooks'
import { Flex } from 'antd'

import { LocationListApi } from '@/api/location/list'
import SLoading from '@/components/s-loading'
import SSelect from '@/components/s-select'

export interface LocationsSelectProps {
  selected: number
  setSelected: (selected: number) => void
}

export default function LocationsSelect (props: LocationsSelectProps) {
  const { selected, setSelected } = props
  const locations = useRequest(async () => await LocationListApi({ active: true }))

  const options = locations.data?.map(item => ({ label: item.name, value: item.id }))

  useEffect(() => {
    if (locations?.data?.length) {
      setSelected(locations?.data?.[0]?.id)
    } else {
      setSelected(0)
    }
  }, [locations?.data])

  if (locations.loading) return <div><SLoading black size={14} /></div>

  if (Number(locations?.data?.length) < 2) return null

  return (
    <Flex align={'center'} gap={8}>
      <div style={{ flexShrink: 0 }}>Location</div>
      <SSelect
        value={selected}
        onChange={setSelected}
        options={[{ label: 'All locations', value: 0 }].concat(options || [])}
        size={'small'}
        dropdownStyle={{ minWidth: 200 }}
        style={{ minWidth: 120 }}
      />
    </Flex>
  )
}
