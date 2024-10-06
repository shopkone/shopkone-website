import { useEffect, useRef, useState } from 'react'
import { IconX } from '@tabler/icons-react'
import { useRequest } from 'ahooks'
import { Button, Flex, Typography } from 'antd'

import { AddFileApi } from '@/api/file/add-file-record'
import { UploadFileType } from '@/api/file/UploadFileType'
import FileImage from '@/components/file-image'
import SLoading from '@/components/s-loading'
import SModal from '@/components/s-modal'
import SRender from '@/components/s-render'
import STable, { STableProps } from '@/components/s-table'
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
        <Flex justify={'center'} style={{ marginLeft: 12 }}>
          <div style={{ display: 'inline-block' }}>
            <FileImage
              loading={row.status === 'uploading' || row.status === 'wait'}
              error={row.status === 'error'}
              width={42} height={42}
              src={row.cover || row.path}
              type={row.type}
            />
          </div>
        </Flex>
      ),
      width: 85
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

  const onConfirm = () => {
    props.onFinish(ids.current || [])
    onChange(r => [])
  }

  useEffect(() => {
    if (isStart.current) return
    uploadList()
    ids.current = []
  }, [files])

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
          <div>{files.find(i => i.status === 'uploading') ? 'Uploading' : 'Upload Complete!'}</div>
          <div style={{ fontSize: 12, fontWeight: 450 }}>
            <SRender render={files.filter(i => i.status === 'uploading')?.length}>
              <Flex style={{ marginLeft: -100 }} align={'center'} gap={6}>
                <SLoading black size={18} />
                <div>Uploading</div>
                <div style={{ marginLeft: 4, fontWeight: 500 }}>
                  ({files.filter(i => i.status === 'done').length || 0} / {files.filter(i => i.status !== 'error')?.length})
                </div>
              </Flex>
            </SRender>
            <SRender render={!files.filter(i => i.status === 'uploading')?.length}>
              <Button onClick={onConfirm} type={'text'} size={'small'}>
                <IconX size={16} />
              </Button>
            </SRender>
          </div>
        </Flex>
      }
      width={800} open={isStart.current}
      footer={null}
      closeIcon={null}
/*       closeIcon={
        <div style={{ position: 'relative', left: -16, width: 100 }}>
          {/!* <Button size={'small'} type={'primary'}>Finish</Button> *!/}
          <Flex style={{ marginLeft: -100 }} align={'center'} gap={4}>
            <SLoading size={20} />
            <div>Uploading</div>
          </Flex>
        </div>
      } */
    >
      <div style={{ height: 600 }}>
        <STable init={true} columns={columns} data={files} />
      </div>
    </SModal>
  )
}
