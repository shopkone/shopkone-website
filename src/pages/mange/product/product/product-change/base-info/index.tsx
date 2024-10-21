import { Card, Form, Input } from 'antd'

import { useI18n } from '@/hooks/use-lang'
import FormMedia from '@/pages/mange/product/product/product-change/base-info/form-media'

export default function BaseInfo () {
  const t = useI18n()
  return (
    <Card style={{ width: 612, flex: 1 }} bordered>
      <div>
        <Form.Item
          rules={[{ required: true, message: t('请输入商品标题') }]}
          name={'title'}
          label={t('商品标题')}
        >
          <Input autoComplete={'off'} placeholder={t('短袖T恤')} />
        </Form.Item>
        <Form.Item name={'description'} label={t('商品描述')}>
          <Input.TextArea autoSize={{ minRows: 4, maxRows: 4 }} />
        </Form.Item>
        <FormMedia />
      </div>
    </Card>
  )
}
