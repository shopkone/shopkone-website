import { IconArrowsSort, IconFilter, IconMenu2 } from '@tabler/icons-react'
import { Button, Flex } from 'antd'
import { ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'

import IconButton from '@/components/icon-button'
import FilterLabels from '@/components/table-filter/FilterLabels'

import { VariantStatus } from '@/constant/product'
import styles from './index.module.less'

export interface FiltersProps {
  value?: {
    status: VariantStatus
  }
  onChange?: (value: FiltersProps['value']) => void
}

export default function Filters (props: FiltersProps) {
  const { onChange, value } = props
  const [labels, setLabels] = useState<Record<string, ReactNode>>({})
  const { t } = useTranslation('product', { keyPrefix: 'product' })

  return (
    <div>
      <Flex gap={4} className={styles.btns}>
        <Button          type={'text'} size={'small'}>{t('全部')}</Button>
        <Button type={'text'} size={'small'}>{t('已上架')}</Button>
        <Button type={'text'} size={'small'}>{t('已下架')}</Button>
      </Flex>
      <div className={'line'} style={{ margin: '8px 0' }} />
      <Flex style={{ margin: 8 }} align={'center'} justify={'space-between'}>
        <Flex align={'center'} gap={20}>
          <Flex align={'center'} gap={8}>
            <div>asd</div>
            <div>asd</div>
          </Flex>
        </Flex>

        <Flex className={styles.actions} gap={12}>
          <IconButton size={26}>
            <IconFilter strokeWidth={2.5} size={14} />
          </IconButton>
          <IconButton size={26}>
            <IconMenu2 strokeWidth={2.5} size={14} />
          </IconButton>
          <IconButton size={26}>
            <IconArrowsSort strokeWidth={2.1} size={14} />
          </IconButton>
        </Flex>
      </Flex>

      <FilterLabels style={{ marginTop: 12 }} labels={labels} value={value} onChange={onChange} />
    </div>
  )
}
