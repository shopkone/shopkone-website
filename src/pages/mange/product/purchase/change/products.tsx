import { useEffect } from 'react'
import { Button, Empty, Flex } from 'antd'

import { useVariantsByIds } from '@/api/product/variants-by-ids'
import SCard from '@/components/s-card'
import SRender from '@/components/s-render'
import STable, { STableProps } from '@/components/s-table'
import SelectVariants from '@/components/select-variants'
import { useI18n } from '@/hooks/use-lang'
import { useOpen } from '@/hooks/useOpen'

export interface ProductsProps {
  onChange?: (value: number[]) => void
  value?: number[]
}

export default function Products (props: ProductsProps) {
  const { value, onChange } = props
  const { run, loading, data } = useVariantsByIds()

  const t = useI18n()
  const openInfo = useOpen<number[]>([])

  // TODO: 一定要写这个
  const columns: Array<STableProps['columns']> = [
  ]

  useEffect(() => {
    if (!value?.length) return
    run({ ids: value })
  }, [value])

  return (
    <SCard
      extra={
        <Button
          type={'text'}
          size={'small'}
          className={'primary-text'}
          onClick={() => {
            openInfo.edit(value)
          }}
        >
          {t('Select products')}
        </Button>
      }
      loading={loading}
      title={t('Products')}
      className={'fit-width'}
    >
      <SRender render={!value?.length}>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={(
            <Flex style={{ marginTop: 20 }} vertical gap={12}>
              <div>
                {t('Only items with inventory tracking settings can be selected.')}
              </div>
              <div>
                <Button onClick={() => {
                  openInfo.edit(value)
                }}
                >
                  {t('Select products')}
                </Button>
              </div>
            </Flex>
          )}
        />
      </SRender>

      <SRender render={!!value?.length}>
        <STable columns={columns} data={data} init={!!data?.length} />
      </SRender>

      <SelectVariants
        onConfirm={async (ids) => {
          onChange?.(ids)
        }}
        info={openInfo}
      />

    </SCard>
  )
}
