import { memo, ReactNode, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
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
import FilterCheckbox from '@/components/table-filter/filter-checkbox'
import FilterNumberRange from '@/components/table-filter/filter-number-range'
import FilterRadio from '@/components/table-filter/filter-radio'
import FilterLabels from '@/components/table-filter/FilterLabels'
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
  const [params, setParams] = useState<FileListReq>({ page: 1, page_size: 30, group_id: 0 })
  const fileGroupList = useRequest(FileGroupListApi, { manual: true })
  const fileList = useRequest(FileListApi, { manual: true })
  const [list, setList] = useState<FileListRes[]>([])
  const [showMoreLoading, setShowMoreLoading] = useState(false)
  const [inViewport] = useInViewport(moreRef)
  const { upload } = useUpload()
  const addFile = useRequest(AddFileApi, { manual: true })
  const [selected, setSelected] = useState<number[]>([])
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [labels, setLabels] = useState<Record<string, ReactNode>>({})
  const isUploading = !!list?.filter(i => i.uuid)?.length
  const { t } = useTranslation('common', { keyPrefix: 'media' })

  const hasSearch = params.keyword?.length || params.file_type?.length || params.file_size?.min || params.file_size?.max || params.used || params.group_id

  const options = [
    { value: FileType.Image, label: t('图片') },
    { value: FileType.Video, label: t('视频') },
    { value: FileType.Audio, label: t('音频') },
    { value: FileType.Other, label: t('其他') }
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
    try {
      for await (const item of waitFileList) {
        const ret = await upload(item, true)
        const res = await addFile.runAsync(ret)
        setList(pre => pre.map(item => {
          if (item.uuid !== ret.uuid) return item
          return { ...item, uuid: '', id: res.id, src: ret.path }
        }))
        if (multiple) {
          setSelected(s => [...s, res.id])
        } else if (!multiple) {
          setSelected(s => [res.id])
        }
      }
    } catch {
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
      title={t('素材库')}
      width={936}
      onCancel={info.close}
      destroyOnClose={true}
      footer={
        (
          <Flex justify={'space-between'}>
            <div>{selected?.length && multiple ? t('已选中', { count: selected?.length }) : ''}</div>
            <Flex gap={12}>
              <Button onClick={info.close}>{t('取消')}</Button>
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
                {t('确定')}
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
              placeholder={t('搜索素材')}
              className={styles['search-input']}
            />
          </div>
          <Flex align={'center'} gap={4}>
            <FilterNumberRange
              maxLabel={t('最小值')}
              minLabel= {t('最大值')}
              unit={'MB'}
              onChange={(v) => { setParams?.({ ...params, file_size: v }) }}
              onLabelChange={(l) => { setLabels({ ...labels, file_size: l }) }}
              value={params?.file_size || {}}
            >
              {t('文件大小')}
            </FilterNumberRange>

            <FilterCheckbox
              options={options}
              onChange={(v) => {
                setParams?.({ ...params, file_type: v.map(i => Number(i || 0)) })
              }}
              value={params?.file_type}
              onLabelChange={(l) => { setLabels({ ...labels, file_type: l }) }}
            >
              {t('文件类型')}
            </FilterCheckbox>

            <FilterRadio
              options={[
                { label: t('使用中'), value: 1 },
                { label: t('未使用'), value: 2 }
              ]}
              value={params?.used}
              onChange={(v) => { setParams?.({ ...params, used: Number(v || 0) }) }}
              onLabelChange={(l) => { setLabels({ ...labels, used: l }) }}
            >
              {t('使用状态')}
            </FilterRadio>
          </Flex>
          <FilterLabels style={{ marginTop: 12 }} labels={labels} value={params} onChange={setParams} />
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
                <Button size={'small'}>{t('上传本地文件')}</Button>
                <Button type={'text'} size={'small'}>{t('从URL添加素材')}</Button>
              </Flex>
            </Upload>

            <div className={styles.content}>
              <SRender className={styles.empty} render={!list?.length && !fileList.loading}>
                <div style={{ width: 700 }}>
                  <Empty
                    title={hasSearch ? t('未搜索到任何内容') : t('上传并管理您的素材')}
                    desc={hasSearch ? t('尝试修改搜索条件或上传新的素材') : ''}
                    actions={
                      <Flex gap={12}>
                        <Upload
                          onChange={onUpload}
                          multiple
                          maxSize={20 * 1024 * 1024}
                          accepts={['video', 'image', 'zip', 'audio']}
                        >
                          <Button type={'primary'}>{t('上传本地文件')}</Button>
                        </Upload>
                        <Button>{t('从URL添加素材1')}</Button>
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
                            <div style={{ marginTop: -1, color: '#2e7d32' }}>{t('上传中')}</div>
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
                  <div style={{ fontWeight: '550' }}>{t('加载中')}</div>
                </Flex>
              </SRender>
              <SRender style={{ paddingTop: 24, paddingBottom: 48 }} render={showMoreLoading ? isUploading : null}>
                <Flex gap={12} justify={'center'} align={'center'}>
                  <div><SLoading size={24} /></div>
                  <div style={{ fontWeight: '550' }}>{t('请等待上传完成...')}</div>
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
