import { ReactNode, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRequest } from 'ahooks'
import { Button, Flex, Typography } from 'antd'

import { AddFileApi } from '@/api/file/add-file-record'
import { UploadFileType } from '@/api/file/UploadFileType'
import FileImage from '@/components/file-image'
import SLoading from '@/components/s-loading'
import SModal from '@/components/s-modal'
import SRender from '@/components/s-render'
import STable, { STableProps } from '@/components/s-table'
import Status from '@/components/status'
import { useUpload } from '@/components/upload/use-upload'
import { formatFileSize } from '@/utils/format'

export interface UploadingProps {
  files: UploadFileType[]
  onChange: (files: (r: UploadFileType[]) => UploadFileType[]) => void
  onFinish: (ids: number[]) => void
}

export default function Uploading (props: UploadingProps) {
  const { files, onChange } = props
  const { upload } = useUpload()
  const addFile = useRequest(AddFileApi, { manual: true })
  const isStart = useRef(false)
  const ids = useRef<number[]>([])
  const [forceUpdate, setForceUpdate] = useState(0)
  const { t } = useTranslation('common')

  const StatsMap: Record<UploadFileType['status'], ReactNode> = {
    wait: <Status type={'info'}>{t('media.等待上传')}</Status>,
    uploading: <Status type={'info'}>{t('media.上传中1')}</Status>,
    done: <Status type={'success'}>{t('media.已完成')}</Status>,
    error: <Status type={'error'}>{t('media.上传出错')}</Status>
  }

  const uploadList = async () => {
    try {
      let waitList = files.filter(item => item.status === 'wait')
      waitList = waitList.map(i => ({ ...i, status: 'uploading' }))
      if (waitList?.length) {
        isStart.current = true
        setForceUpdate(forceUpdate + 1)
        for await (const file of waitList) {
          const res = await upload(file)
          const ret = await addFile.runAsync(res)
          ids.current.push(ret.id)
          onChange(r => r.map(i => i.uuid === file.uuid ? res : i))
        }
      } else if (files?.length && !isStart.current) {
        isStart.current = true
        setForceUpdate(forceUpdate + 1)
      }
    } finally {
      setTimeout(() => {
        isStart.current = false
      }, 500)
    }
  }

  const columns: STableProps['columns'] = [
    {
      title: '',
      code: 'uuid',
      name: 'uuid',
      render: (uuid: string, row: UploadFileType) => (
        <div style={{ display: 'inline-block' }}>
          <FileImage
            loading={row.status === 'uploading' || row.status === 'wait'}
            error={row.status === 'error'}
            width={42} height={42}
            src={row.cover || row.path}
            type={row.type}
          />
        </div>
      ),
      width: 70
    },
    {
      title: t('media.文件名'),
      code: 'name',
      name: 'name',
      render: (name: string) => (
        <Typography.Paragraph style={{ marginBottom: 0 }} ellipsis={{ tooltip: true, rows: 1 }}>{name}</Typography.Paragraph>
      )
    },
    {
      title: t('media.类型'),
      code: 'suffix',
      name: 'suffix'
    },
    {
      title: t('media.大小'),
      code: 'size',
      name: 'size',
      render: (size: number) => formatFileSize(size)
    },
    {
      title: t('media.状态'),
      code: 'status',
      name: 'status',
      render: (status: UploadFileType['status']) => (
        <div style={{ display: 'inline-block' }}>{StatsMap[status]}</div>
      )
    }
  ]

  const onConfirm = () => {
    props.onFinish(ids.current || [])
    onChange(r => [])
  }

  useEffect(() => {
    if (isStart.current) return
    uploadList()
    ids.current = []
  }, [files])

  if (!files?.length) return null

  return (
    <SModal
      onCancel={onConfirm}
      title={
        <Flex
          style={{ position: 'absolute', top: 15, right: 0, left: 0, padding: '0 20px' }}
          className={'fit-width'}
          align={'center'}
          justify={'space-between'}
        >
          <div>{files.find(i => i.status === 'wait') ? t('media.正在上传') : t('media.上传完成')}</div>
          <div style={{ fontSize: 12, fontWeight: 450 }}>
            <SRender render={files.filter(i => i.status === 'wait')?.length}>
              <Flex style={{ marginLeft: -100 }} align={'center'} gap={6}>
                <SLoading black size={18} />
                <div>{t('正在上传')}</div>
                <div style={{ marginLeft: 4, fontWeight: 500 }}>
                  ({files.filter(i => i.status === 'done').length || 0} / {files.filter(i => i.status !== 'error')?.length})
                </div>
              </Flex>
            </SRender>
            <SRender render={!files.filter(i => i.status === 'wait')?.length}>
              <Button onClick={onConfirm} type={'primary'} size={'small'}>
                {t('media.好的')}
              </Button>
            </SRender>
          </div>
        </Flex>
      }
      width={800} open={isStart.current}
      footer={null}
      closeIcon={null}
    >
      <div style={{ height: 600, padding: 16 }}>
        <STable borderless className={'table-white-header table-border'} init={true} columns={columns} data={files} />
      </div>
    </SModal>
  )
}
