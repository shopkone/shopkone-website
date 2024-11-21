import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Button } from 'antd'

import Page from '@/components/page'

export default function CustomerList () {
  const { t } = useTranslation('customers', { keyPrefix: 'list' })
  const nav = useNavigate()

  return (
    <Page
      header={
        <Button onClick={() => { nav('/customers/change') }} type={'primary'}>
          {t('添加客户')}
        </Button>
      }
      title={t('客户')}
    >
      asd
    </Page>
  )
}
