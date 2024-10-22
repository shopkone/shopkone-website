import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRequest } from 'ahooks'
import { Form, Input, InputRef } from 'antd'

import { FileGroupAddApi } from '@/api/file/file-group-add'
import { FileGroupUpdateApi } from '@/api/file/file-group-update'
import { sMessage } from '@/components/s-message'
import SModal from '@/components/s-modal'
import { UseOpenType } from '@/hooks/useOpen'

export interface AddGroupProps {
  open: UseOpenType<{ id: number, name: string }>
  onComplete: (groupId: number) => void
}

export default function AddGroup (props: AddGroupProps) {
  const { open, onComplete } = props
  const [name, setName] = useState<string>()

  const inputRef = useRef<InputRef>(null)

  const addGroup = useRequest(FileGroupAddApi, { manual: true })
  const editGroup = useRequest(FileGroupUpdateApi, { manual: true })
  const { t } = useTranslation('product')

  const onAdd = async () => {
    if (!name) return
    const ret = await addGroup.runAsync({ name })
    sMessage.success(t('添加分组成功'))
    open.close()
    onComplete(ret.id || 0)
  }

  const onEdit = async () => {
    if (!name || !open.data) return
    await editGroup.runAsync({ id: open.data?.id || 0, name })
    sMessage.success(t('编辑分组成功'))
    open.close()
    onComplete(open.data?.id)
  }

  const onOk = () => {
    if (!open.data?.id) {
      onAdd()
    } else {
      onEdit()
    }
  }

  useEffect(() => {
    if (open.open) {
      setTimeout(() => {
        inputRef.current?.focus()
      })
    } else {
      setName('')
    }
  }, [open.open])

  useEffect(() => {
    if (open.data) {
      setName(open.data.name)
    }
  }, [open.data])

  return (
    <SModal
      maskClosable={false}
      onOk={onOk}
      confirmLoading={addGroup.loading || editGroup.loading}
      okButtonProps={{ disabled: !name }}
      title={open.data?.name ? t('编辑分组') : t('添加分组')}
      onCancel={open.close}
      open={open.open}
    >
      <Form layout={'vertical'} style={{ margin: '16px 16px 24px 16px' }}>
        <Form.Item label={t('分组名称')}>
          <Input ref={inputRef} value={name} autoComplete={'off'} onChange={e => { setName(e.target.value) }} />
        </Form.Item>
      </Form>
    </SModal>
  )
}
