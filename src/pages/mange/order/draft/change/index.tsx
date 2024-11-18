import { useTranslation } from 'react-i18next'
import { IconTag } from '@tabler/icons-react'
import { Button, Empty, Flex } from 'antd'

import Page from '@/components/page'
import SCard from '@/components/s-card'
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
            <Empty
              description={t('请选择商品')}
              style={{ paddingBottom: 16 }} image={<IconTag size={64} color={'#eee'} />}
            >
              <Button onClick={() => { selectProductInfo.edit([]) }} style={{ minWidth: 150 }} type={'primary'}>
                {t('选择商品')}
              </Button>
            </Empty>
          </SCard>

          <SCard title={t('收款')}>
            asd
          </SCard>
        </Flex>

        <SCard style={{ width: 320 }}>asd</SCard>
      </Flex>

      <SelectVariants info={selectProductInfo} />
    </Page>
  )
}
