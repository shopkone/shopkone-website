import { useEffect, useMemo, useState } from 'react'
import { IconCopy, IconReplace } from '@tabler/icons-react'
import { useRequest } from 'ahooks'
import { Button, Flex, Form, Input, Typography } from 'antd'
import dayjs from 'dayjs'

import { FileType } from '@/api/file/add-file-record'
import { FileInfoApi } from '@/api/file/file-info'
import { FileUpdateApi } from '@/api/file/file-update'
import { UploadFileType } from '@/api/file/UploadFileType'
import FileImage from '@/components/file-image'
import FileVideo from '@/components/file-video'
import SLoading from '@/components/s-loading'
import { sMessage } from '@/components/s-message'
import SModal from '@/components/s-modal'
import SRender from '@/components/s-render'
import Upload from '@/components/upload'
import { useOss } from '@/hooks/use-oss'
import { UseOpenType } from '@/hooks/useOpen'
import { formatFileSize } from '@/utils/format'

import styles from './index.module.less'

export interface FileInfoProps {
  open: UseOpenType<number>
  groups: Array<{ id: number, name: string }>
  reFresh: () => void
}

export default function FileInfo (props: FileInfoProps) {
  const { open, groups, reFresh } = props
  const { data } = open

  const [updaloadFile, setUploadFile] = useState<UploadFileType>()

  const info = useRequest(FileInfoApi, { manual: true })
  const update = useRequest(FileUpdateApi, { manual: true })

  const [name, setName] = useState<string>()
  const [cover, setCover] = useState<string>()
  const [alt, setAlt] = useState<string>()
  const [src, setSrc] = useState('')
  const oss = useOss()

  const groupName = groups.find(item => item.id === info?.data?.group_id)?.name

  const tranTimer = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  const isChange = useMemo(() => {
    return (name !== info?.data?.name) || (alt !== info?.data?.alt) || (cover !== info?.data?.cover)
  }, [info.data, alt, name, cover])

  const onSave = async () => {
    await update.runAsync({
      id: data || 0,
      name: name || info?.data?.name || '',
      alt: alt || '',
      src: info?.data?.path || '',
      cover: cover || ''
    })
    sMessage.success('Update file info successfully')
    open.close()
    reFresh()
  }

  const onCopyCoverLink = () => {
    navigator.clipboard.writeText(cover || '')
    sMessage.success('Cover link copied!')
  }

  useEffect(() => {
    if (!open.open) {
      setSrc('')
      return
    }
    if (!data) return
    info.runAsync({ id: data }).then(res => {
      setName(res.name)
      setAlt(res.alt)
      setCover(res.cover)
      if (src !== (res.cover || res.path || '')) {
        setSrc(res.cover || res.path || '')
      }
    })
  }, [data, open.open])

  useEffect(() => {
    if (updaloadFile?.status === 'wait') {
      oss.run(updaloadFile.name, updaloadFile.fileInstance).then(res => {
        setUploadFile({ ...updaloadFile, status: 'uploading', path: res?.url })
        setCover(res?.url)
      })
    }
  }, [updaloadFile])

  return (
    <SModal
      footer={null}
      width={1000}
      title={info?.data?.name || '-'}
      open={open.open}
      onCancel={open.close}
    >
      <SLoading loading={info.loading}>
        <Flex className={styles.container} align={'center'}>
          <SRender style={{ width: 600, height: 450, flexShrink: 0 }} render={info?.data?.type === FileType.Image}>
            <FileImage
              src={src}
              type={info?.data?.type || FileType.Other}
              width={600}
              height={450}
              padding={12}
              style={{ background: 'transparent', border: 'none' }}
            />
          </SRender>
          <SRender style={{ width: 600, height: 350, flexShrink: 0 }} render={info?.data?.type === FileType.Video}>
            <FileVideo
              duration={info?.data?.duration}
              cover={cover}
              src={info?.data?.path || ''}
              style={{ height: 350, width: 600, marginRight: 60 }}
            />
          </SRender>
          <div className={styles.info}>
            <Flex vertical justify={'space-between'} className={'fit-height'}>
              <Form layout={'vertical'}>
                <Form.Item label={'Name'}>
                  <Input
                    onChange={e => { setName(e.target.value) }}
                    value={name}
                    autoComplete={'off'}
                  />
                </Form.Item>
                <SRender render={info?.data?.type === FileType.Video}>
                  <Form.Item label={'Cover'}>
                    <Flex gap={8}>
                      <div style={{ display: 'inline-block' }}>
                        <FileImage loading={updaloadFile?.status === 'wait'} width={48} height={48} src={cover || ''} type={FileType.Image} />
                      </div>
                      <SRender className={' '} render={updaloadFile?.status !== 'wait' && (info.data?.cover || updaloadFile?.path)}>
                        <Upload onChange={files => { setUploadFile(files[0]) }} multiple={false} maxSize={1024 * 1024 * 10} accepts={['image']}>
                          <Button type={'text'} size={'small'} className={'primary-text'}>
                            <Flex align={'center'} gap={6}>
                              <IconReplace size={14} style={{ position: 'relative', top: -1 }} />
                              Replace cover
                            </Flex>
                          </Button>
                        </Upload>

                        <Button onClick={onCopyCoverLink} type={'text'} size={'small'}>
                          <Flex align={'center'} gap={6}>
                            <IconCopy size={14} style={{ position: 'relative', top: -1 }} />
                            <div>Copy cover link</div>
                          </Flex>
                        </Button>
                      </SRender>
                    </Flex>
                  </Form.Item>
                </SRender>
                <SRender render={info?.data?.type === FileType.Image}>
                  <Form.Item label={'Alt text'}>
                    <Input
                      onChange={e => { setAlt(e.target.value) }}
                      value={alt}
                      autoComplete={'off'}
                    />
                  </Form.Item>
                </SRender>
                <Form.Item label={'Details'}>
                  <Flex className={styles.details} vertical>
                    <div>
                      {[
                        info?.data?.suffix,
                        !info?.data?.width ? '' : `${info?.data?.width} x ${info?.data?.height}`,
                        formatFileSize(info?.data?.size || 0)
                      ].filter(i => i).join(' • ')}
                    </div>
                    <SRender render={info?.data?.duration}>Duration {tranTimer(info?.data?.duration || 0)}</SRender>
                    <div>Added {dayjs(info?.data?.created_at).format('MM/DD/YYYY')}</div>
                    <SRender render={groupName}>
                      <Typography.Text ellipsis={{ tooltip: true }} style={{ width: 300 }}>
                        Group by {groupName}
                      </Typography.Text>
                    </SRender>
                  </Flex>
                </Form.Item>
                <Form.Item label={'Used in'}>
                  <div className={styles.details} style={{ marginTop: -16 }}>
                    Not referenced in your store
                  </div>
                </Form.Item>
              </Form>
              <Flex justify={'flex-end'}>
                <Button onClick={onSave} loading={update.loading} type={'primary'} disabled={!isChange}>
                  Save
                </Button>
              </Flex>
            </Flex>
          </div>
        </Flex>
      </SLoading>
    </SModal>
  )
}
