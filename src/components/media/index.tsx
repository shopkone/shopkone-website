import { Button, Flex } from 'antd'

import { FileType } from '@/api/file/add-file-record'
import FileList from '@/components/media/file-list'
import SelectFiles from '@/components/media/select-files'
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

  return (
    <div>
      <SRender render={!value?.length}>
        <Flex
          onClick={() => { openInfo.edit() }}
          vertical
          gap={4}
          justify={'center'}
          align={'center'}
          className={styles.container}
        >
          <Flex gap={12}>
            <div onClick={e => { e.stopPropagation() }}>
              <Upload
                multiple={true}
                accepts={['video', 'image']}
                maxSize={1024 * 1024 * 20}
              >
                <Button size={'small'}>Upload new</Button>
              </Upload>
            </div>
            <Button type={'text'} size={'small'} className={'primary-text'}>
              Select existing
            </Button>
          </Flex>
          <div className={'tips'}>Accepts images, videos, or 3D models</div>
        </Flex>
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
    </div>
  )
}
