import { useTranslation } from 'react-i18next'
import { Flex, Form, Input, Radio } from 'antd'

import SInputNumber from '@/components/s-input-number'
import SModal from '@/components/s-modal'
import SSelect from '@/components/s-select'
import { UseOpenType } from '@/hooks/useOpen'

export interface AddModalProps {
  openInfo: UseOpenType
}

export default function AddModal () {
  const { t } = useTranslation('settings', { keyPrefix: 'tax' })

  const options = [
    { label: t('商品系列'), value: 'collection' },
    { label: t('运费'), value: 'shipping' }
  ]

  return (
    <SModal title={t('添加自定义税费')} width={500} >
      <Form style={{ padding: 16, minHeight: 400 }} layout={'vertical'}>
        <Form.Item label={t('适用内容')}>
          <Radio.Group options={options} />
        </Form.Item>
        <Form.Item label={t('商品系列')}>
          <SSelect />
        </Form.Item>
        <Form.Item label={t('适用地区')}>
          <SSelect />
        </Form.Item>
        <Flex gap={16}>
          <Form.Item label={t('税名')} className={'flex1'}>
            <Input autoComplete={'off'} />
          </Form.Item>
          <Form.Item label={t('税率')} className={'flex1'}>
            <SInputNumber suffix={'%'} precision={4} required min={0} />
          </Form.Item>
        </Flex>
      </Form>
    </SModal>
  )
}
