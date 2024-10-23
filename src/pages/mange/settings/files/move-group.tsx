import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { Form, Radio } from 'antd'

import { FileGroupListRes } from '@/api/file/file-group-list'
import { UpdateGroupIdByFileIdsApi } from '@/api/file/file-update-group-id'
import { sMessage } from '@/components/s-message'
import SModal from '@/components/s-modal'
import SRender from '@/components/s-render'
import SSelect from '@/components/s-select'
import { UseOpenType } from '@/hooks/useOpen'

export interface MoveGroupProps {
  open: UseOpenType<number[]>
  groupList: FileGroupListRes[]
  onConfirm: () => void
}

export default function MoveGroup (props: MoveGroupProps) {
  const { open, groupList, onConfirm } = props
  const move = useRequest(UpdateGroupIdByFileIdsApi, { manual: true })
  const gid = useParams().groupId
  const groupId = Number(gid || 0)
  const [form] = Form.useForm()

  const type = Form.useWatch('type', form)
  const { t } = useTranslation('settings', { keyPrefix: 'file' })

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
      title={t('移动x个文件', { x: open?.data?.length })}
      open={open.open}
    >
      <Form initialValues={{ type: 1 }} form={form} layout={'vertical'} style={{ padding: 16 }}>
        <SRender render={groupId}>
          <Form.Item name={'type'} style={{ marginBottom: 8 }}>
            <Radio.Group options={[{ value: 0, label: t('将文件移出当前分组') }]} />
          </Form.Item>
        </SRender>
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
