import { useEffect, useMemo, useState } from 'react'
import { useRequest } from 'ahooks'
import { Button, Flex, Form, Input } from 'antd'
import dayjs from 'dayjs'

import { FileType } from '@/api/file/add-file-record'
import { FileInfoApi } from '@/api/file/file-info'
import { FileUpdateApi } from '@/api/file/file-update'
import FileImage from '@/components/file-image'
import FileVideo from '@/components/file-video'
import SLoading from '@/components/s-loading'
import { sMessage } from '@/components/s-message'
import SModal from '@/components/s-modal'
import SRender from '@/components/s-render'
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

  const info = useRequest(FileInfoApi, { manual: true })
  const update = useRequest(FileUpdateApi, { manual: true })

  const [name, setName] = useState<string>()
  const [alt, setAlt] = useState<string>()
  const [src, setSrc] = useState('')

  const groupName = groups.find(item => item.id === info?.data?.group_id)?.name

  const tranTimer = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  const isChange = useMemo(() => {
    return (name !== info?.data?.name) || (alt !== info?.data?.alt)
  }, [info.data, alt, name])

  const onSave = async () => {
    await update.runAsync({
      id: data || 0,
      name: name || info?.data?.name || '',
      alt: alt || info?.data?.alt || '',
      src: info?.data?.path || '',
      cover: info?.data?.cover || info?.data?.path || ''
    })
    sMessage.success('Update file info successfully')
    open.close()
    reFresh()
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
      if (src !== (res.cover || res.path || '')) {
        setSrc(res.cover || res.path || '')
      }
    })
  }, [data, open.open])

  return (
    <SModal
      footer={null}
      width={1000}
      title={info?.data?.name || '-'}
      open={open.open}
      onCancel={open.close}
    >
      <SLoading loading={info.loading}>
        <Flex className={styles.container}>
          <SRender render={info?.data?.type === FileType.Image}>
            <FileImage
              src={src}
              type={info?.data?.type || FileType.Other}
              width={600}
              height={450}
              padding={12}
              style={{ background: 'transparent', border: 'none' }}
            />
          </SRender>
          <SRender render={info?.data?.type === FileType.Video}>
            <FileVideo
              duration={info?.data?.duration}
              cover={info?.data?.cover}
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
                      <div>Group by {groupName}</div>
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
