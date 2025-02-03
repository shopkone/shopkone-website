import { useTranslation } from 'react-i18next'
import { Form, Input } from 'antd'

import SCard from '@/components/s-card'
import FormMedia from '@/pages/mange/product/product/product-change/base-info/form-media'

export default function BaseInfo () {
  const { t } = useTranslation('product', { keyPrefix: 'product' })

  return (
    <SCard style={{ width: 612, flex: 1 }} bordered>
      <div>
        <Form.Item
          rules={[{ required: true, message: t('请输入商品标题') }]}
          name={'title'}
          label={t('商品标题')}
        >
          <Input autoComplete={'off'} placeholder={t('短袖T恤')} />
        </Form.Item>
        <Form.Item name={'description'} label={t('商品描述')}>
          <Input.TextArea autoSize={{ minRows: 8 }} />
        </Form.Item>
        <FormMedia />
      </div>
    </SCard>
  )
}
