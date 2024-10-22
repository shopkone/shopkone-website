import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation('product', { keyPrefix: 'inventory' })

  const columns: STableProps['columns'] = [
    {
      title: t('日期'),
      code: 'date',
      name: 'date',
      render: (date: number) => dayjs(date).format('YYYY-MM-DD HH:mm'),
      width: 180
    },
    { title: t('活动'), code: 'activity', name: 'activity', width: 180 },
    { title: t('流程中'), code: 'unavailable', name: 'unavailable', width: 150 },
    { title: t('可售'), code: 'quantity', name: 'quantity', width: 150 },
    { title: t('现货'), code: 'on_hand', name: 'on_hand', width: 150 }
  ]

  useEffect(() => {
    if (!info.open || !info.data?.id) return
    list.run({ id: info.data.id })
  }, [info.open])

  return (
    <SModal
      footer={false}
      onCancel={info.close}
      width={900}
      title={t('库存变更记录') + t('历史变更名称', { name: info.data?.name })}
      open={info.open}
    >
      <div style={{ height: 600, padding: 16 }}>
        <STable
          borderless
          className={'table-white-header table-border'}
          init={!list.loading}
          columns={columns}
          data={list?.data || []}
        />
      </div>
    </SModal>
  )
}
