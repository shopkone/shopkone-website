import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation('common', { keyPrefix: 'media' })

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
            {t('拖拽图片进行上传')}
          </SRender>
          <SRender render={uploadImageErr ? uploadDragIn : null}>
            {t('无效的图片格式')}
          </SRender>
          <SRender render={!uploadDragIn}>
            <Flex gap={8}>
              <Button size={'small'}>
                {t('从素材库中选择')}
              </Button>
              <Button
                type={'link'}
                size={'small'}
                onClick={(e) => { e.stopPropagation(); inputRef?.current?.click() }}
              >
                {t('上传本地文件1')}
              </Button>
            </Flex>
            <div className={'tips'}>{t('支持上传图片或视频')}</div>
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
