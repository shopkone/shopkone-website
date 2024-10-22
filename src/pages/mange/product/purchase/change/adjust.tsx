import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IconCirclePlus, IconTrash } from '@tabler/icons-react'
import { Button } from 'antd'

import IconButton from '@/components/icon-button'
import SInputNumber from '@/components/s-input-number'
import SModal from '@/components/s-modal'
import SRender from '@/components/s-render'
import SSelect from '@/components/s-select'
import STable, { STableProps } from '@/components/s-table'
import { getAdjustTypeOptions } from '@/constant/purchase'
import { UseOpenType } from '@/hooks/useOpen'
import { genId } from '@/utils/random'

import styles from './index.module.less'

export interface AdjustItem {
  id: number
  type?: number
  price: number
  typeText?: string
}

export interface AdjustProps {
  info: UseOpenType<AdjustItem[]>
  onConfirm: (value: AdjustItem[]) => void
}

export default function Adjust (props: AdjustProps) {
  const { info, onConfirm } = props
  const [value, setValue] = useState<AdjustItem[]>([])
  const { t } = useTranslation('product')

  const onAddItem = () => {
    setValue([...value, { id: genId(), price: 0 }])
  }

  const AdjustTypeOptions = getAdjustTypeOptions(t)

  const onConfirmHandle = () => {
    console.log(value.filter(item => item.type))
    onConfirm(value.filter(item => item.type))
    info.close()
  }

  const columns: STableProps['columns'] = [
    {
      title: t('Adjust'),
      code: 'type',
      name: 'type',
      render: (type: number, row: AdjustItem) => (
        <SSelect
          onChange={(v) => { setValue(value.map(i => i.id === row.id ? { ...i, type: v } : i)) }}
          value={type}
          placeholder={t('Choose type')}
          options={AdjustTypeOptions}
          style={{ width: 250 }}
        />
      ),
      width: 250
    },
    {
      title: t('Price'),
      code: 'price',
      name: 'price',
      render: (price: number, row: AdjustItem) => (
        <SInputNumber
          className={row.type === 2 ? styles.discountInput : ''}
          prefix={
            row.type === 2 ? <span>$<span style={{ position: 'relative', left: 5 }}>-</span></span> : '$'
          }
          required
          onChange={(v) => { setValue(value.map(i => i.id === row.id ? { ...i, price: Number(v) } : i)) }}
          value={price || 0}
          style={{ width: 250 }}
          money
        />
      ),
      width: 250
    },
    {
      title: '',
      code: '123',
      name: '32',
      render: () => (
        <IconButton type={'text'} size={25}>
          <IconTrash size={15} />
        </IconButton>
      ),
      width: 50
    }
  ]

  useEffect(() => {
    if (!info.open) return
    if (info.data) {
      setValue(info.data)
    } else {
      setValue([{ id: genId(), type: 4, price: 0 }])
    }
  }, [info.open])

  return (
    <SModal onOk={onConfirmHandle} width={600} title={t('Modify cost summary')} open={info.open} onCancel={info.close}>
      <div style={{ padding: 12 }}>
        <STable
          className={'table-white-header table-border'}
          columns={columns}
          borderless
          data={value}
          init
        />
        <SRender render={value?.length !== 8 && value?.length}>
          <Button onClick={onAddItem} style={{ marginTop: 12, marginLeft: -8 }} size={'small'} type={'link'}>
            <IconCirclePlus size={15} style={{ position: 'relative', top: -1 }} />
            {t('Add adjust')}
          </Button>
        </SRender>
      </div>
    </SModal>
  )
}
