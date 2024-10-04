import { useEffect, useState } from 'react'
import { useRequest } from 'ahooks'
import { Flex } from 'antd'

import { LocationListApi } from '@/api/location/list'
import SLoading from '@/components/s-loading'
import SSelect from '@/components/s-select'
import styles from '@/pages/mange/product/product/product-change/variants/table/index.module.less'

export default function LocationsSelect () {
  const locations = useRequest(async () => await LocationListApi({ active: true }))
  const [selected, setSelected] = useState<number>(0)

  const options = locations.data?.map(item => ({ label: item.name, value: item.id }))

  useEffect(() => {
    if (locations?.data?.length === 1) {
      setSelected(locations?.data?.[0]?.id)
    } else {
      setSelected(0)
    }
  }, [locations?.data])

  if (locations.loading) return <div><SLoading black size={14} /></div>

  if (Number(locations?.data?.length) < 2) return null

  return (
    <>
      <span className={styles.textLine}>|</span>
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
    </>
  )
}
