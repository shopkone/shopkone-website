import { useTranslation } from 'react-i18next'
import { IconTax } from '@tabler/icons-react'
import { Button, Empty } from 'antd'

import { CountriesRes } from '@/api/base/countries'
import { BaseCustomerTax } from '@/api/tax/info'
import SCard from '@/components/s-card'
import { useOpen } from '@/hooks/useOpen'
import AddModal from '@/pages/mange/settings/taxes/taxes/info/add-modal'

export interface CustomersTaxProps {
  country?: CountriesRes
}

export default function CustomersTax (props: CustomersTaxProps) {
  const { country } = props
  const openInfo = useOpen<BaseCustomerTax>()
  const { t } = useTranslation('settings', { keyPrefix: 'tax' })

  return (
    <SCard
      tips={t('发货到指定区域时，为特定产品系列自定义基于区域的税率或运费。')}
      title={t('自定义税费')}
      extra={<Button type={'link'} size={'small'}>{t('添加自定义税费')}</Button>}
    >
      <Empty
        image={
          <div style={{ paddingTop: 24 }}>
            <IconTax size={64} color={'#ddd'} />
          </div>
        }
        description={(
          <div className={'secondary'}>
            {t('发货到指定区域时，为特定产品系列自定义基于区域的税率或运费。')}
          </div>
        )}
        style={{ paddingBottom: 32, marginTop: -12 }}
      >
        <Button onClick={() => { openInfo.edit() }}>
          {t('添加自定义税费')}
        </Button>
      </Empty>

      <AddModal country={country} openInfo={openInfo} />
    </SCard>
  )
}
