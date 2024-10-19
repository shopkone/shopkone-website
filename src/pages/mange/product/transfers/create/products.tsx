import { Button, Empty, Flex } from 'antd'

import { useVariantsByIds } from '@/api/product/variants-by-ids'
import { TransferItem } from '@/api/transfers/create'
import SCard from '@/components/s-card'
import STable from '@/components/s-table'
import SelectVariants from '@/components/select-variants'
import { useI18n } from '@/hooks/use-lang'
import { useOpen } from '@/hooks/useOpen'
import { genId } from '@/utils/random'

export interface ProductsProps {
  value?: TransferItem[]
  onChange?: (value: TransferItem[]) => void
}

export default function Products (props: ProductsProps) {
  const { value, onChange } = props
  const { run, data } = useVariantsByIds()
  const t = useI18n()
  const openInfo = useOpen<number[]>([])

  return (
    <SCard>
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={(
          <Flex style={{ marginTop: 20 }} vertical gap={12}>
            <div style={{ fontSize: 14, fontWeight: 'bolder' }}>
              {t('请选择需要转移库存数量的产品')}
            </div>
            <div>{t('请选择要转移的产品，最多不超过200种产品')}</div>
            <Flex align={'center'} justify={'center'} style={{ marginTop: 8 }}>
              <Button onClick={() => { openInfo.edit([]) }} >
                {t('选择商品')}
              </Button>
            </Flex>
          </Flex>
        )}
      />

      <STable columns={[]} data={[]} />

      <SelectVariants
        onConfirm={async (ids) => {
          const newList = ids.filter(id => !value?.find(item => item.variant_id === id)).map(item => {
            return { id: genId(), variant_id: item, quantity: 1 }
          }) || []
          const oldList = value?.filter(item => ids.includes(item.variant_id)) || []
          onChange?.([...newList, ...oldList])
        }}
        info={openInfo}
        disabled={[]}
      />
    </SCard>
  )
}
