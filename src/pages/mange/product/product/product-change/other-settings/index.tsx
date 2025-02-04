import { useTranslation } from 'react-i18next'
import { Form } from 'antd'

import SCard from '@/components/s-card'
import TrackType from '@/pages/mange/product/product/product-change/other-settings/track-type'
import TypeChanger from '@/pages/mange/product/product/product-change/other-settings/type-changer'

import styles from './index.module.less'

export default function OtherSettings () {
  const { t } = useTranslation('product', { keyPrefix: 'product' })

  return (
    <SCard
      className={styles.container}
    >
      <div>
        <Form.Item label={t('款式类型')} name={'variant_type'}>
          <TypeChanger />
        </Form.Item>

        <Form.Item
          label={t('库存策略')}
          name={'inventory_tracking'}
        >
          <TrackType />
        </Form.Item>

        <Form.Item
          label={t('库存地点')}
          name={'enabled_location_ids'}
          className={'mb0'}
        >
          asd
        </Form.Item>

      </div>
    </SCard>
  )
}
