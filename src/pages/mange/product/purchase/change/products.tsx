import { Button, Empty, Flex } from 'antd'

import SCard from '@/components/s-card'
import SelectVariants from '@/components/select-variants'
import { useI18n } from '@/hooks/use-lang'
import { useOpen } from '@/hooks/useOpen'

export interface ProductsProps {
  onChange?: (value: number[]) => void
  value?: number[]
}

export default function Products (props: ProductsProps) {
  const t = useI18n()
  const openInfo = useOpen<number[]>([])

  return (
    <SCard title={t('Products')} className={'fit-width'}>
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={(
          <Flex style={{ marginTop: 20 }} vertical gap={12}>
            <div>
              {t('Only items with inventory tracking settings can be selected.')}
            </div>
            <div>
              <Button onClick={() => {
                openInfo.edit()
              }}
              >
                {t('Select products')}
              </Button>
            </div>
          </Flex>
        )}
      />

      <SelectVariants info={openInfo} />

    </SCard>
  )
}
