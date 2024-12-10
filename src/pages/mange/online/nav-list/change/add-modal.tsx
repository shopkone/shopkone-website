import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, Input } from 'antd'

import { NavItemType } from '@/api/online/navInfo'
import SModal from '@/components/s-modal'
import UrlSelect from '@/components/url-select'
import { UseOpenType } from '@/hooks/useOpen'
import { genId } from '@/utils/random'

export interface AddModalProps {
  info: UseOpenType<{ item?: NavItemType, isEdit: boolean }>
  onConfirm: (value: { item: NavItemType, isEdit: boolean }) => void
}

export default function AddModal (props: AddModalProps) {
  const { info, onConfirm } = props
  const { t } = useTranslation('online', { keyPrefix: 'nav' })
  const [form] = Form.useForm()

  const title = info?.data?.isEdit ? t('编辑菜单项') : t('添加菜单项')

  const onChange = async () => {
    await form.validateFields()
    const values = form.getFieldsValue()
    if (info.data?.isEdit && info.data.item) {
      onConfirm({ item: { ...info.data.item, title: values.title }, isEdit: true })
    } else {
      const newItem = { id: genId().toString(), title: values.title, url: values.url || '/', links: [] }
      const item = info.data?.item || { id: '', links: [], title: '', url: '' }
      onConfirm({ item: { ...item, links: item.links.concat(newItem) }, isEdit: false })
    }
    info.close()
  }

  useEffect(() => {
    if (!info.open) return
    if (info.data?.isEdit) {
      form.setFieldsValue(info?.data?.item || {})
    } else {
      form.setFieldsValue({ title: '' })
    }
  }, [info.open])

  return (
    <SModal onOk={onChange} onCancel={info.close} open={info.open} title={title}>
      <Form form={form} layout={'vertical'} style={{ padding: 16 }}>
        <Form.Item rules={[{ required: true }]} required={false} name={'title'} label={t('菜单项标题')}>
          <Input autoComplete={'off'} />
        </Form.Item>
        <Form.Item label={t('跳转链接')}>
          <UrlSelect />
        </Form.Item>
      </Form>
    </SModal>
  )
}
