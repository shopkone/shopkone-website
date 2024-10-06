import { useEffect, useState } from 'react'
import { Flex, Typography } from 'antd'

import { UploadFileType } from '@/api/file/UploadFileType'
import FileImage from '@/components/file-image'
import SModal from '@/components/s-modal'
import STable, { STableProps } from '@/components/s-table'
import { useUpload } from '@/components/upload/use-upload'
import { UseOpenType } from '@/hooks/useOpen'
import { formatFileSize } from '@/utils/format'

export interface UploaderProps {
  info: UseOpenType<UploadFileType[]>
}

export default function Uploader (props: UploaderProps) {
  const { info } = props
  const { upload } = useUpload()
  const [list, setList] = useState<UploadFileType[]>([])

  const uploader = async (items: UploadFileType[]) => {
    if (!items.length) {
      info.close()
      return
    }
    for await (const file of items) {
      const res = await upload(file)
      setList(i => i.map(item => item.uuid === file.uuid ? res : item))
    }
  }

  useEffect(() => {
    if (!info.open) return
    if (!info.data?.length) return
    setList(info.data)
  }, [info.open])

  useEffect(() => {
    if (!info.open || !list.length) return
    const isUploading = list.filter(item => item.status === 'uploading' || item.status === 'done')
    if (isUploading.length) return
    const waiting = list.filter(item => item.status === 'wait')
    if (!waiting.length) return
    uploader(waiting)
  }, [list])

  const columns: STableProps['columns'] = [
    {
      title: '',
      code: 'uuid',
      name: 'uuid',
      render: (uuid: string, row: UploadFileType) => (
        <Flex align={'center'} justify={'center'} style={{ display: 'inline-block', marginLeft: 12 }}>
          <FileImage
            loading={row.status === 'uploading' || row.status === 'wait'}
            error={row.status === 'error'}
            width={42} height={42}
            src={row.cover || row.path}
            type={row.type}
          />
        </Flex>
      ),
      width: 80
    },
    {
      title: 'File name',
      code: 'name',
      name: 'name',
      render: (name: string) => (
        <Typography.Paragraph style={{ marginBottom: 0 }} ellipsis={{ tooltip: true, rows: 1 }}>{name}</Typography.Paragraph>
      )
    },
    {
      title: 'Type',
      code: 'suffix',
      name: 'suffix'
    },
    {
      title: 'Size',
      code: 'size',
      name: 'size',
      render: (size: number) => formatFileSize(size)
    },
    {
      title: 'Status',
      code: 'status',
      name: 'status'
    }
  ]

  return (
    <SModal footer={null} onCancel={info.close} title={'Upload files'} open={info.open} width={800}>
      <div style={{ height: 600, overflowY: 'auto' }}>
        <STable borderless={false} columns={columns} data={list || []} init />
      </div>
    </SModal>
  )
}
