import { useTranslation } from 'react-i18next'
import { IconTag } from '@tabler/icons-react'
import { Button, Flex } from 'antd'

import Page from '@/components/page'
import SCard from '@/components/s-card'
import SEmpty from '@/components/s-empty'
import SelectVariants from '@/components/select-variants'
import { useOpen } from '@/hooks/useOpen'

export default function OrderDraftChange () {
  const { t } = useTranslation('orders', { keyPrefix: 'drafts' })
  const selectProductInfo = useOpen<number[]>()

  return (
    <Page back={'/orders/drafts'} title={t('创建订单')} width={950}>
      <Flex gap={16}>
        <Flex gap={16} vertical className={'flex1'}>
          <SCard title={t('商品')}>
            <SEmpty
              title={t('订单包含哪些商品')}
              image={<IconTag size={52} color={'#eee'} />}
            >
              <Button onClick={() => { selectProductInfo.edit([]) }} style={{ minWidth: 150 }} >
                {t('选择商品')}
              </Button>
            </SEmpty>
          </SCard>

          <SCard title={t('收款')}>
            asd
          </SCard>
        </Flex>

        <Flex vertical gap={16}>
          <SCard title={t('客户')} style={{ width: 320 }}>
            asd
          </SCard>
        </Flex>
      </Flex>

      <SelectVariants info={selectProductInfo} />
    </Page>
  )
}
