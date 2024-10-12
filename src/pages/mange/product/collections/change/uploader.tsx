import { useEffect, useState } from 'react'
import { IconDots } from '@tabler/icons-react'
import { useDebounceFn, useRequest } from 'ahooks'
import { Button, Flex, Popover } from 'antd'
import classNames from 'classnames'

import { FileType } from '@/api/file/add-file-record'
import { fileListByIds, FileListByIdsRes } from '@/api/file/file-list-by-ids'
import FileImage from '@/components/file-image'
import SelectFiles from '@/components/media/select-files'
import SCard from '@/components/s-card'
import SRender from '@/components/s-render'
import Upload from '@/components/upload'
import { useOpen } from '@/hooks/useOpen'
import styles from '@/pages/mange/product/collections/change/index.module.less'
import FileInfo from '@/pages/mange/settings/files/file-info'

export interface UploaderProps {
  value?: number
  onChange?: (value?: number) => void
}

export default function Uploader (props: UploaderProps) {
  const { onChange, value } = props
  const [file, setFile] = useState<FileListByIdsRes>()
  const list = useRequest(fileListByIds, { manual: true })
  const [uploadImageErr, seUploadImageErr] = useState(false)
  const [uploadDragIn, setUploadDragIn] = useState(false)
  const openInfo = useOpen<number[]>()
  const infoOpen = useOpen<number>()
  const [open, setOpen] = useState(false)

  const onOpen = useDebounceFn(() => {
    setOpen(false)
    openInfo.edit(value ? [value] : undefined)
  }, { wait: 300, leading: true }).run

  useEffect(() => {
    if (!props.value) return
    list.runAsync({ ids: [Number(props.value)] }).then(list => { setFile(list?.[0]) })
  }, [props.value])

  return (
    <SCard
      extra={
        <SRender render={value}>
          <Flex>
            <Button onClick={() => { infoOpen.edit(value) }} type={'text'} size={'small'}>
              Edit
            </Button>
            <Popover
              open={open}
              onOpenChange={open => { setOpen(open) }}
              placement={'bottom'}
              overlayInnerStyle={{ minWidth: 'unset' }}
              content={
                <Flex vertical gap={4}>
                  <Button onClick={onOpen} size={'small'} type={'text'} style={{ textAlign: 'left' }}>
                    Change image
                  </Button>
                  <Button
                    onClick={() => { onChange?.(undefined); setOpen(false) }}
                    danger size={'small'} type={'text'} style={{ textAlign: 'left' }}
                  >
                    Remove
                  </Button>
                </Flex>
             }
              trigger={'click'}
            >
              <Button
                style={{
                  position: 'relative',
                  right: -4
                }}
                size={'small'}
                type={'text'}
              >
                <IconDots size={16} />
              </Button>
            </Popover>
          </Flex>
        </SRender>
      }
      title={'Image'}
    >
      <SRender render={!value}>
        <Upload
          onClick={onOpen}
          onDragIn={setUploadDragIn}
          onTypeError={seUploadImageErr}
          accepts={['image']}
          multiple={false}
          maxSize={1024 * 1024 * 10}
          align={'center'}
          justify={'center'}
          vertical
          gap={8}
          className={
            classNames(
              styles.cover,
              { [styles.dragIn]: uploadDragIn },
              { [styles.error]: uploadImageErr }
            )
          }
        >
          <SRender render={!uploadDragIn}>
            <Button>Select image</Button>
            <div className={'tips'}>or drop an image to upload</div>
          </SRender>
          <SRender render={uploadDragIn ? !uploadImageErr : null}>
            Drag image to upload.
          </SRender>
          <SRender render={uploadImageErr ? uploadDragIn : null}>
            Invalid image file.
          </SRender>
        </Upload>
      </SRender>
      <SRender render={value}>
        <div style={{ cursor: 'pointer' }} onClick={onOpen}>
          <FileImage
            containerStyle={{ minHeight: 100 }}
            width={266}
            height={'auto'}
            loading={list.loading}
            src={file?.path || ''}
            type={FileType.Image}
          />
        </div>
      </SRender>
      <SelectFiles
        includes={[FileType.Image]}
        info={openInfo}
        onConfirm={async (v) => { onChange?.(v?.[0]); openInfo.close() }}
      />

      <FileInfo open={infoOpen} groups={[]} reFresh={() => {}} />
    </SCard>
  )
}
