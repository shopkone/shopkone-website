import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Flex, Form, Input } from 'antd'

import { BaseShippingZone } from '@/api/shipping/base'
import { sMessage } from '@/components/s-message'
import SModal from '@/components/s-modal'
import SelectCountry from '@/components/select-country'
import { UseOpenType } from '@/hooks/useOpen'
import { genId } from '@/utils/random'

export interface ZoneModalProps {
  openInfo: UseOpenType<BaseShippingZone>
  confirm?: (value: BaseShippingZone) => void
  olds: BaseShippingZone[]
  disabled: string[]
}

export default function ZoneModal (props: ZoneModalProps) {
  const { openInfo, confirm, olds, disabled } = props
  const { t } = useTranslation('settings', { keyPrefix: 'shipping' })
  const [selectedZoneIds, setSelectedZoneIds] = useState<string[]>([])
  const [form] = Form.useForm()
  const onOk = async () => {
    const { name } = form.getFieldsValue()
    if (!name) {
      sMessage.warning(t('请输入区域名称'))
      return
    }
    if (!selectedZoneIds.length) {
      sMessage.warning(t('至少选择一个国家/地区'))
      return
    }
    const same = olds.find(item => item.name === name)
    if (same && same.id !== openInfo.data?.id) {
      sMessage.warning(t('区域名称已存在'))
      return
    }
    if (openInfo.data) {
      confirm?.({ ...openInfo.data, name, codes: selectedZoneIds })
    } else {
      confirm?.({ codes: selectedZoneIds, name, fees: [], id: genId() })
    }
    openInfo.close()
  }

  useEffect(() => {
    if (!openInfo.open) return
    setSelectedZoneIds(openInfo.data?.codes || [])
    form.setFieldValue('name', openInfo.data?.name)
  }, [openInfo])

  return (
    <SModal
      onCancel={() => {
        openInfo.close()
      }}
      title={t('添加区域')}
      open={openInfo.open}
      width={600}
      footer={
        <Flex align={'center'} justify={'space-between'}>
          <div>{t('已选国家', { x: selectedZoneIds.length })}</div>
          <Flex align={'center'} gap={8}>
            <Button
              onClick={openInfo.close}
            >
              {t('取消')}
            </Button>
            <Button
              onClick={onOk}
              type={'primary'}
            >
              {t('确定')}
            </Button>
          </Flex>
        </Flex>
      }
    >
      <Flex vertical style={{ height: 600, overflowY: 'hidden', padding: 16 }}>
        <Form colon={false} form={form} layout={'vertical'}>
          <Form.Item required={false} rules={[{ required: true }]} name={'name'} label={t('区域名称')}>
            <Input autoComplete={'off'} />
          </Form.Item>

          <Form.Item label={t('国家/地区')}>
            <SelectCountry disabled={disabled} height={400} value={selectedZoneIds} onChange={setSelectedZoneIds} />
          </Form.Item>

        </Form>
      </Flex>
    </SModal>
  )
}
