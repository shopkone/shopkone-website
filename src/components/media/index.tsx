import { useRef, useState } from 'react'
import { Button, Flex } from 'antd'
import classNames from 'classnames'

import { FileType } from '@/api/file/add-file-record'
import { UploadFileType } from '@/api/file/UploadFileType'
import FileList from '@/components/media/file-list'
import SelectFiles from '@/components/media/select-files'
import Uploading from '@/components/media/uploading'
import SRender from '@/components/s-render'
import Upload from '@/components/upload'
import { useOpen } from '@/hooks/useOpen'

import styles from './index.module.less'

export interface MediaProps {
  value?: number[]
  onChange?: (value: number[]) => Promise<void>
  onSelect: (ids: number[]) => void
  select: number[]
}

export default function Media (props: MediaProps) {
  const { value, onChange, select, onSelect } = props
  const openInfo = useOpen<number[]>()
  const [files, setFiles] = useState<UploadFileType[]>([])
  const [uploadImageErr, seUploadImageErr] = useState(false)
  const [uploadDragIn, setUploadDragIn] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div>
      <SRender render={!value?.length}>
        <Upload
          className={
              classNames(
                styles.container,
                { [styles.dragIn]: uploadDragIn },
                { [styles.error]: uploadImageErr }
              )
            }
          getElement={ele => { // @ts-expect-error
            inputRef.current = ele
          }}
          onClick={() => { openInfo.edit() }}
          onDragIn={setUploadDragIn}
          onTypeError={seUploadImageErr}
          onChange={setFiles}
          multiple={true}
          accepts={['video', 'image']}
          maxSize={1024 * 1024 * 20}
          gap={8}
          align={'center'}
          justify={'center'}
          vertical
        >
          <SRender render={uploadDragIn ? !uploadImageErr : null}>
            Drag image to upload.
          </SRender>
          <SRender render={uploadImageErr ? uploadDragIn : null}>
            Invalid image file.
          </SRender>
          <SRender render={!uploadDragIn}>
            <Flex gap={8}>
              <Button size={'small'}>
                Select existing
              </Button>
              <Button
                type={'text'}
                size={'small'}
                className={'primary-text'}
                onClick={(e) => { e.stopPropagation(); inputRef?.current?.click() }}
              >
                Upload new
              </Button>
            </Flex>
            <div className={'tips'}>Accepts images or videos</div>
          </SRender>
        </Upload>
      </SRender>

      <SelectFiles
        includes={[FileType.Image, FileType.Video]}
        onConfirm={async (v) => { await onChange?.(v); openInfo.close() }}
        info={openInfo}
        multiple
      />
      <FileList
        select={select}
        onSelect={onSelect}
        selectOpenInfo={openInfo}
        onChange={onChange}
        ids={value || []}
      />
      <Uploading
        onFinish={async (ids) => await onChange?.(ids)}
        onChange={setFiles}
        files={files}
      />
    </div>
  )
}
