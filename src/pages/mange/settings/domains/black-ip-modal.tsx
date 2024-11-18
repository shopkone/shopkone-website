import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useRequest } from 'ahooks'
import { Form, Radio } from 'antd'

import { BlackIpType, DomainBlackIpUpdateApi } from '@/api/domain/black-ip-update'
import { sMessage } from '@/components/s-message'
import SModal from '@/components/s-modal'
import { UseOpenType } from '@/hooks/useOpen'
import BlackIpList from '@/pages/mange/settings/domains/black-ip-list'

export interface BlackIpModalProps {
  openInfo: UseOpenType<{ type: BlackIpType, ips: string[] }>
  onFresh: () => void
}

export default function BlackIpModal (props: BlackIpModalProps) {
  const { openInfo, onFresh } = props
  const { t } = useTranslation('settings', { keyPrefix: 'domains' })
  const [form] = Form.useForm()
  const update = useRequest(DomainBlackIpUpdateApi, { manual: true })

  const options = [
    { label: t('黑名单'), value: BlackIpType.Black },
    { label: t('白名单'), value: BlackIpType.White }
  ]

  const onOk = async () => {
    await form.validateFields().catch(err => {
      const msg = err.errorFields?.[0]?.errors?.[0]
      if (msg) {
        sMessage.warning(msg)
      }
      throw new Error(err)
    })
    const { type, ips = [] } = form.getFieldsValue()
    await update.runAsync({
      type,
      ips: [...new Set(ips.filter(Boolean))] as string[]
    })
    sMessage.success(t('更新成功'))
    onFresh()
    openInfo.close()
  }

  useEffect(() => {
    if (!openInfo.open) return
    if (openInfo.data) {
      form.setFieldsValue(openInfo.data)
    } else {
      form.setFieldsValue({
        type: BlackIpType.Black,
        ips: []
      })
    }
  }, [openInfo.open])

  return (
    <SModal onCancel={openInfo.close} confirmLoading={update.loading} onOk={onOk} title={t('添加黑名单/ 白名单')} open={openInfo.open}>
      <Form layout={'vertical'} form={form} colon={false} style={{ height: 400, overflowY: 'auto', padding: 16 }}>
        <Form.Item name={'type'} label={t('类型')}>
          <Radio.Group options={options} />
        </Form.Item>
        <Form.Item
          required={false}
          rules={[{ required: true, message: t('请输入IP地址') }]}
          label={t('IP 地址')}
          name={'ips'}
        >
          <BlackIpList />
        </Form.Item>
      </Form>
    </SModal>
  )
}
