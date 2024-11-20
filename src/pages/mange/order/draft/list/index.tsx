import { useTranslation } from 'react-i18next'

import Page from '@/components/page'
import SCard from '@/components/s-card'
import SEmpty from '@/components/s-empty'
import STable from '@/components/s-table'
import { useNav } from '@/hooks/use-nav'

export default function OrderDraftList () {
  const { t } = useTranslation('orders', { keyPrefix: 'drafts' })
  const nav = useNav()

  return (
    <Page title={t('草稿单')}>
      <SCard styles={{ body: { padding: '8px 0' } }}>
        <STable
       /*    empty={{
            title: t('管理你创建的草稿订单'),
            desc: t('可将草稿订单发送给客户，当客户完成结账或你完成收款后将成为正式订单。'),
            actions: (
              <Flex>
                <Button onClick={() => { nav('change') }} type={'primary'}>{t('创建订单')}</Button>
              </Flex>
            )
          }} */
          data={[]}
          columns={[]}
        >
          <SEmpty type={'empty_order'}>
            asd
          </SEmpty>
        </STable>
      </SCard>
    </Page>
  )
}
