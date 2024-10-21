import { useEffect } from 'react'
import { useRequest } from 'ahooks'
import { Form, Radio } from 'antd'

import { FileGroupListRes } from '@/api/file/file-group-list'
import { UpdateGroupIdByFileIdsApi } from '@/api/file/file-update-group-id'
import { sMessage } from '@/components/s-message'
import SModal from '@/components/s-modal'
import SSelect from '@/components/s-select'
import { useI18n } from '@/hooks/use-lang'
import { UseOpenType } from '@/hooks/useOpen'

export interface MoveGroupProps {
  open: UseOpenType<number[]>
  groupList: FileGroupListRes[]
  onConfirm: () => void
}

export default function MoveGroup (props: MoveGroupProps) {
  const { open, groupList, onConfirm } = props
  const move = useRequest(UpdateGroupIdByFileIdsApi, { manual: true })

  const [form] = Form.useForm()

  const type = Form.useWatch('type', form)
  const t = useI18n()

  const onOk = async () => {
    if (!open.data?.length) return
    if (type === 0) {
      await move.runAsync({ group_id: 0, file_ids: open.data })
    } else {
      const grupId = form.getFieldValue('group_id')
      await move.runAsync({ group_id: grupId, file_ids: open.data })
    }
    open.close()
    onConfirm()
    sMessage.success(t('移动文件成功'))
  }

  useEffect(() => {
    if (type === 1) {
      form.setFieldValue('group_id', groupList[0].id)
    } else {
      form.setFieldValue('group_id', undefined)
    }
  }, [type])

  useEffect(() => {
    if (open.open) {
      form.resetFields()
    }
  }, [open.open])

  return (
    <SModal
      onOk={onOk}
      confirmLoading={move.loading}
      onCancel={open.close}
      title={t(`将 ${open?.data?.length} 个文件移动到新组`)}
      open={open.open}
    >
      <Form initialValues={{ type: 1 }} form={form} layout={'vertical'} style={{ padding: '0 16px' }}>
        <Form.Item name={'type'} style={{ marginBottom: 8 }}>
          <Radio.Group options={[{ value: 0, label: t('将文件移出当前文件组') }]} />
        </Form.Item>
        <Form.Item name={'type'} style={{ marginBottom: 8 }}>
          <Radio.Group options={[{ value: 1, label: t('移至新组') }]} />
        </Form.Item>
        <Form.Item name={'group_id'} style={{ marginLeft: 24 }}>
          <SSelect
            placeholder={t('选择组')}
            disabled={type === 0}
            options={groupList.map(item => ({ label: item.name, value: item.id }))}
          />
        </Form.Item>
      </Form>
    </SModal>
  )
}
