import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IconMaximize, IconTag } from '@tabler/icons-react'
import { Empty, Flex } from 'antd'

import IconButton from '@/components/icon-button'
import SCard from '@/components/s-card'
import SRender from '@/components/s-render'
import SSelect from '@/components/s-select'
import STable from '@/components/s-table'
import { Variant } from '@/pages/mange/product/product/product-change/variant-set/state'
import { UseColumns } from '@/pages/mange/product/product/product-change/variant-set/variant-list/use-columns'
import { OptionValue } from '@/pages/mange/product/product/product-change/variant-set/variant-options/option-item'
import * as worker from '@/pages/mange/product/product/product-change/variant-set/worker'

import styles from './index.module.less'

export interface VariantListProps {
  variants: Variant[]
  onChangeVariants?: (variants: Variant[]) => void
}

export default function VariantList (props: VariantListProps) {
  const { variants, onChangeVariants } = props
  const [options, setOptions] = useState<OptionValue[]>([])
  const { t } = useTranslation('product', { keyPrefix: 'product' })
  const [selected, setSelected] = useState<number[]>([])
  const columns = UseColumns({ onChange: onChangeVariants, value: variants })

  useEffect(() => {
    worker.toListWorker.onmessage = (e) => {
      onChangeVariants?.(e.data.variants || [])
      setOptions(e.data.options?.filter((i: any) => i.label) || [])
    }
  }, [])

  return (
    <SCard title={t('款式设置')}>
      <SRender render={!variants?.length}>
        <Empty
          image={<IconTag size={48} color={'#ddd'} />}
          style={{ paddingBottom: 32 }}
          description={(
            <Flex style={{ marginTop: -16, fontSize: 14 }} vertical gap={12}>
              {t('请设置款式选项')}
            </Flex>
          )}
        />
      </SRender>
      <SRender render={variants.length}>
        <Flex gap={20} align={'center'} justify={'space-between'}>
          <Flex wrap={'wrap'} gap={8} align={'center'}>
            <SRender render={options.length}>
              <div className={styles.label} style={{ flexShrink: 0, marginBottom: -1 }}>
                {t('筛选')}
              </div>
            </SRender>
            {
              options.map(option => (
                <SSelect
                  allowClear
                  style={{ flex: 1, minWidth: 100 }}
                  placeholder={option.label}
                  key={option.id}
                  size={'small'}
                  fieldNames={{ value: 'id', label: 'value' }}
                  options={option.values}
                  dropdownStyle={{ minWidth: 200 }}
                />
              ))
            }
          </Flex>
          <Flex gap={12} align={'center'}>
            <SSelect allowClear value={'所有地点'} size={'small'} />
            <div>
              <IconButton size={26}>
                <IconMaximize size={16} />
              </IconButton>
            </div>
          </Flex>
        </Flex>

        <STable
          style={{ marginTop: 8, marginLeft: -16, marginRight: -16 }}
          data={variants}
          columns={columns}
          rowSelection={{ onChange: setSelected, value: selected }}
        />
      </SRender>
    </SCard>
  )
}
