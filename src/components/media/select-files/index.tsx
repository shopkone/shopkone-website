import { memo, useEffect, useRef, useState } from 'react'
import { IconSearch, IconTrash } from '@tabler/icons-react'
import { useInViewport, useRequest } from 'ahooks'
import { Button, Checkbox, Flex, Input, Typography } from 'antd'
import classNames from 'classnames'

import { AddFileApi, FileType } from '@/api/file/add-file-record'
import { FileGroupListApi } from '@/api/file/file-group-list'
import { FileListApi, FileListReq, FileListRes } from '@/api/file/file-list'
import { UploadFileType } from '@/api/file/UploadFileType'
import FileImage from '@/components/file-image'
import SLoading from '@/components/s-loading'
import SModal from '@/components/s-modal'
import SRender from '@/components/s-render'
import Empty from '@/components/s-table/empty'
import Index from '@/components/table-filter'
import Upload from '@/components/upload'
import { useUpload } from '@/components/upload/use-upload'
import { UseOpenType } from '@/hooks/useOpen'
import { genId } from '@/utils/random'

import styles from './index.module.less'

export interface SelectFilesProps {
  info: UseOpenType<number[]>
  onConfirm: (data: number[]) => Promise<void>
  multiple?: boolean
  types?: FileType[]
  includes?: FileType[]
}

function SelectFiles (props: SelectFilesProps) {
  const { info, onConfirm, multiple, includes } = props
  const extra = [FileType.Video, FileType.Image, FileType.Other, FileType.Audio].filter(i => !includes?.includes(i))
  const headerRef = useRef<HTMLDivElement>(null)
  const moreRef = useRef<HTMLDivElement>(null)
  const [showShadow, setShowShadow] = useState(false)
  const [params, setParams] = useState<FileListReq>({ page: 1, page_size: 20, group_id: 0 })
  const fileGroupList = useRequest(FileGroupListApi, { manual: true })
  const fileList = useRequest(FileListApi, { manual: true })
  const [list, setList] = useState<FileListRes[]>([])
  const [showMoreLoading, setShowMoreLoading] = useState(false)
  const [inViewport] = useInViewport(moreRef)
  const { upload } = useUpload()
  const addFile = useRequest(AddFileApi, { manual: true })
  const [selected, setSelected] = useState<number[]>([])
  const [confirmLoading, setConfirmLoading] = useState(false)

  const isUploading = !!list?.filter(i => i.uuid)?.length

  const hasSearch = params.keyword?.length || params.file_type?.length || params.file_size?.min || params.file_size?.max || params.used || params.group_id

  const options = [
    { value: FileType.Image, label: 'Image' },
    { value: FileType.Video, label: 'Video' },
    { value: FileType.Audio, label: 'Audio' },
    { value: FileType.Other, label: 'Other' }
  ]

  const hiddenStyle = {
    height: 0,
    width: 0,
    padding: 0,
    margin: 0,
    opacity: 0,
    overflow: 'hidden'
  }

  const onUpload = async (files: UploadFileType[]) => {
    const fileList = files.map(file => {
      const item: FileListRes = {
        id: genId(),
        file_name: file.name,
        data_added: Date.now(),
        suffix: file.suffix,
        src: file.path,
        size: file.size,
        group_id: file.group_id,
        cover: file.cover,
        type: file.type,
        uuid: file.uuid,
        references: 0,
        errMsg: file.errMsg
      }
      return item
    })
    const waitFileList = files.filter(item => !item.errMsg)
    setList([...fileList, ...list])
    for await (const item of waitFileList) {
      const ret = await upload(item)
      const res = await addFile.runAsync(ret)
      setList(pre => pre.map(item => {
        if (item.uuid !== ret.uuid) return item
        return { ...item, uuid: '', id: res.id, src: ret.path }
      }))
    }
  }

  const onRemoveErrFile = (uuid?: string) => {
    if (!uuid) return
    setList(prev => prev.filter(item => item.uuid !== uuid))
  }

  useEffect(() => {
    if (!headerRef?.current || !info.open) return
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        setShowShadow(entry.isIntersecting)
      })
    })
    io.observe(headerRef.current)
    setSelected(info.data || [])
    return () => {
      io?.disconnect()
    }
  }, [info.open, headerRef.current])

  useEffect(() => {
    if (!info.open) return
    setList([])
    fileGroupList.run()
    setParams({ page: 1, page_size: 20, group_id: 0 })
    setShowMoreLoading(false)
  }, [info.open])

  useEffect(() => {
    if (!info.open) return
    fileList.runAsync(params, extra).then(res => {
      if (res.page.page === 1) {
        setList(res.list)
      } else {
        setList([...list, ...res.list])
      }
    })
  }, [params])

  useEffect(() => {
    if (!inViewport || !showMoreLoading || fileList.loading) return
    setParams(prev => ({ ...prev, page: prev.page + 1 }))
  }, [inViewport])

  useEffect(() => {
    if (!list?.length) return
    if (!fileList?.data?.total) {
      setShowMoreLoading(false)
      return
    }
    if (fileList?.data?.total > list?.length) {
      setTimeout(() => {
        setShowMoreLoading(info.open)
      }, 500)
    } else {
      setShowMoreLoading(false)
    }
  }, [list])

  return (
    <SModal
      className={styles.modal}
      title={'Select file'}
      width={936}
      onCancel={info.close}
      destroyOnClose={true}
      footer={
        (
          <Flex justify={'space-between'}>
            <div>{selected?.length && multiple ? `${selected?.length} selected` : ''}</div>
            <Flex gap={12}>
              <Button onClick={info.close}>Cancel</Button>
              <Button
                type={'primary'}
                loading={confirmLoading}
                onClick={async () => {
                  try {
                    setConfirmLoading(true)
                    await onConfirm(selected)
                  } finally {
                    setConfirmLoading(false)
                  }
                }}
              >
                Done
              </Button>
            </Flex>
          </Flex>
        )
      }
      open={info.open}
    >
      <Flex vertical style={{ height: '70vh' }}>
        <SRender
          render={!(!hasSearch && !list?.length && !fileList.loading)}
          className={classNames([styles.header, { [styles.shadow]: !showShadow && (fileList.loading || list?.length) }])}
        >
          <div className={styles.mb12}>
            <Input
              allowClear
              value={params.keyword}
              onChange={(e) => {
                setParams({ ...params, keyword: e.target.value, page: 1 })
              }}
              autoComplete={'off'}
              prefix={<IconSearch size={15} className={styles['filter-icon']} />}
              placeholder={'Search files'}
              className={styles['search-input']}
            />
          </div>
          <Flex align={'center'} gap={4}>
            <Index checkbox={{
              options: options.filter(i => !extra?.includes(i.value)),
              onChange: (v) => {
                setParams({ ...params, file_type: v.map(i => Number(i || 0)), page: 1 })
              },
              value: params.file_type
            }}
            >
              File type
            </Index>
            <Index
              numberRange={{
                maxLabel: 'Max size',
                minLabel: 'Min size',
                unit: 'MB',
                onChange: (v) => {
                  setParams({ ...params, file_size: v, page: 1 })
                },
                value: params.file_size
              }}
            >
              File size
            </Index>
            <SRender render={!!fileGroupList?.data?.length}>
              <Index
                radio={{
                  options: fileGroupList?.data?.map(item => ({ label: item.name, value: item.id })) || [],
                  onChange: (value) => {
                    setParams({ ...params, group_id: Number(value || 0), page: 1 })
                  },
                  value: params.group_id
                }}
              >
                File group
              </Index>
            </SRender>
          </Flex>
        </SRender>

        <div className={styles.bottom}>
          <SLoading foreShow size={28} loading={(fileList.loading || fileGroupList.loading) ? (!inViewport) : false}>
            <Upload
              style={!(fileList.loading || list?.length) ? hiddenStyle : undefined}
              vertical
              gap={4}
              justify={'center'}
              align={'center'}
              className={`${styles.container} ${styles.upload}`}
              onChange={onUpload}
              multiple
              maxSize={20 * 1024 * 1024}
              accepts={['video', 'image', 'zip', 'audio']}
            >
              <Flex ref={headerRef} gap={12}>
                <Button size={'small'}>Upload file</Button>
                <Button type={'text'} size={'small'}>Add from URL</Button>
              </Flex>
              <div className={'tips'}>
                Files can be images, videos and zip.
              </div>
            </Upload>

            <div className={styles.content}>
              <SRender className={styles.empty} render={!list?.length && !fileList.loading}>
                <div style={{ width: 700 }}>
                  <Empty
                    title={hasSearch ? 'No results found' : 'Upload and manage your files'}
                    desc={hasSearch ? 'Edit your search criteria, or upload a new file.' : 'Files can be images, videos and zip.'}
                    actions={
                      <Flex gap={12}>
                        <Button type={'primary'}>Upload file</Button>
                        <Button>Add from URL</Button>
                      </Flex>
                      }
                  />
                </div>
              </SRender>
              <Flex style={{ paddingBottom: 24 }} wrap={'wrap'} gap={9}>
                {
                    list?.map(item => (
                      <Flex
                        onClick={() => {
                          if (item.uuid) return
                          setSelected(pre => {
                            if (pre.includes(item.id)) {
                              return pre.filter(i => i !== item.id)
                            } else {
                              if (multiple) return [...pre, item.id]
                              return [item.id]
                            }
                          })
                        }}
                        align={'center'}
                        vertical
                        justify={'center'}
                        key={item.id}
                        className={
                          classNames(styles['item-wrap'], { [styles.itemWrapNoDone]: item.uuid, [styles.itemSelected]: selected.includes(item.id) })
                        }
                        gap={12}
                      >
                        <div className={styles.imgWrap}>
                          <SRender render={!item.uuid}>
                            <FileImage
                              width={100}
                              height={100}
                              className={styles.img}
                              src={item.cover || item.src} type={item.type}
                            />
                            <div className={styles.mask} />
                          </SRender>
                          <SRender render={item.uuid ? !item.errMsg : null}>
                            <SLoading size={28} loading>
                              <div style={{ width: 100, height: 100 }} />
                            </SLoading>
                          </SRender>
                          <SRender render={item.uuid ? item.errMsg : null}>
                            <div style={{ position: 'relative' }}>
                              <FileImage
                                className={styles.img}
                                width={100} height={100}
                                src={''}
                                type={FileType.Image}
                              />
                              <div
                                className={styles.errMask}
                              >
                                <IconTrash
                                  onClick={() => { onRemoveErrFile(item.uuid) }}
                                  size={24}
                                />
                              </div>
                            </div>
                          </SRender>
                        </div>
                        <Flex vertical justify={'center'} align={'center'}>
                          <div>
                            <Typography.Text style={{ maxWidth: 100 }} ellipsis={{ tooltip: true }}>
                              {item.file_name}
                            </Typography.Text>
                          </div>
                          <SRender render={!item.uuid}>
                            <div style={{ marginTop: -1 }} className={'secondary'}>{item.suffix}</div>
                          </SRender>
                          <SRender render={item.uuid ? !item.errMsg : null}>
                            <div style={{ marginTop: -1, color: '#32a645' }}>uploading</div>
                          </SRender>
                          <SRender render={item.uuid ? item.errMsg : null}>
                            <Typography.Text ellipsis={{ tooltip: true }} style={{ marginTop: -1, color: '#f54a45', width: 120 }}>
                              {item.errMsg}
                            </Typography.Text>
                          </SRender>
                        </Flex>
                        <SRender render={!item.uuid}>
                          <div className={styles.checkbox}>
                            <Checkbox checked={selected.includes(item.id)} />
                          </div>
                        </SRender>
                      </Flex>
                    ))
                  }
              </Flex>
              <SRender style={{ paddingTop: 24, paddingBottom: 48 }} render={showMoreLoading ? (!isUploading && list?.length) : null}>
                <Flex ref={moreRef} gap={12} justify={'center'} align={'center'}>
                  <div><SLoading size={24} /></div>
                  <div style={{ fontWeight: '550' }}>Loading...</div>
                </Flex>
              </SRender>
              <SRender style={{ paddingTop: 24, paddingBottom: 48 }} render={showMoreLoading ? isUploading : null}>
                <Flex gap={12} justify={'center'} align={'center'}>
                  <div><SLoading size={24} /></div>
                  <div style={{ fontWeight: '550' }}>Please wait uploading finish...</div>
                </Flex>
              </SRender>
            </div>
          </SLoading>
        </div>
      </Flex>
    </SModal>

  )
}

export default memo(SelectFiles)
