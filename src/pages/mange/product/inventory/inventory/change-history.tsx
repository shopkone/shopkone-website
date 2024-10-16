import { useEffect } from 'react'
import { useRequest } from 'ahooks'
import dayjs from 'dayjs'

import { HistoryListApi } from '@/api/inventory/history-list'
import SModal from '@/components/s-modal'
import STable, { STableProps } from '@/components/s-table'
import { UseOpenType } from '@/hooks/useOpen'

export interface ChangeHistoryProps {
  info: UseOpenType<{ id: number, name: string }>
}

export default function ChangeHistory (props: ChangeHistoryProps) {
  const { info } = props
  const list = useRequest(HistoryListApi, { manual: true })

  const columns: STableProps['columns'] = [
    {
      title: 'Date',
      code: 'date',
      name: 'date',
      render: (date: number) => dayjs(date).format('YYYY-MM-DD HH:mm')
    },
    { title: 'Activity', code: 'activity', name: 'activity' },
    { title: 'Unavailable', code: 'unavailable', name: 'unavailable' },
    { title: 'Committed', code: 'committed', name: 'committed' },
    { title: 'Available', code: 'quantity', name: 'quantity' },
    { title: 'On hand', code: 'on_hand', name: 'on_hand' }
  ]

  useEffect(() => {
    if (!info.open || !info.data?.id) return
    list.run({ id: info.data.id })
  }, [info.open])

  return (
    <SModal
      footer={false}
      onCancel={info.close}
      width={1000}
      title={`${info?.data?.name} history`}
      open={info.open}
    >
      <div style={{ height: 600 }}>
        <STable init={!list.loading} columns={columns} data={list?.data || []} />
      </div>
    </SModal>
  )
}
