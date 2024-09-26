import { useEffect, useRef, useState } from 'react'
import { useRequest } from 'ahooks'
import { Button, Checkbox, Flex, Input, Modal, Typography } from 'antd'
import classNames from 'classnames'

import { FileType } from '@/api/file/add-file-record'
import { FileGroupListApi } from '@/api/file/file-group-list'
import { FileListApi, FileListReq, FileListRes } from '@/api/file/file-list'
import { ReactComponent as SearchIcon } from '@/assets/icon/search.svg'
import FileImage from '@/components/file-image'
import SLoading from '@/components/s-loading'
import SRender from '@/components/s-render'
import Empty from '@/components/s-table/empty'
import Index from '@/components/table-filter'
import { UseOpenType } from '@/hooks/useOpen'

import styles from './index.module.less'

export interface SelectFilesProps {
  info: UseOpenType<number[]>
}

export default function SelectFiles (props: SelectFilesProps) {
  const { info } = props
  const headerRef = useRef<HTMLDivElement>(null)
  const [showShadow, setShowShadow] = useState(false)
  const [params, setParams] = useState<FileListReq>({ page: 1, page_size: 20, group_id: 0 })
  const fileGroupList = useRequest(FileGroupListApi, { manual: true })
  const fileList = useRequest(FileListApi, { manual: true })
  const [list, setList] = useState<FileListRes[]>([])

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

  useEffect(() => {
    if (!headerRef?.current || !info.open) return
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        setShowShadow(entry.isIntersecting)
      })
    })
    io.observe(headerRef.current)
    return () => {
      io?.disconnect()
    }
  }, [info.open])

  useEffect(() => {
    if (!info.open) return
    setList([])
    fileGroupList.run()
    setParams({ page: 1, page_size: 20, group_id: 0 })
  }, [info.open])

  useEffect(() => {
    fileList.runAsync(params).then(res => {
      if (res.page.page === 1) {
        setList(res.list)
      } else {
        setList([...list, ...res.list])
      }
    })
  }, [params])

  return (
    <Modal
      className={styles.modal}
      title={'Select file'}
      width={936}
      onCancel={() => { info.close() }}
      open={info.open}
    >
      <Flex vertical style={{ height: '70vh' }}>
        <div className={classNames([styles.header, { [styles.shadow]: !showShadow && (fileList.loading || list?.length) }])}>
          <div className={styles.mb12}>
            <Input
              allowClear
              value={params.keyword}
              onChange={(e) => {
                setParams({ ...params, keyword: e.target.value, page: 1 })
              }}
              autoComplete={'off'}
              prefix={<SearchIcon className={styles['filter-icon']} />}
              placeholder={'Search files'}
              className={styles['search-input']}
            />
          </div>
          <Flex align={'center'} gap={4}>
            <Index checkbox={{
              options,
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
          </Flex>
        </div>

        <div className={styles.bottom}>
          <SLoading foreShow size={'large'} loading={fileList.loading || fileGroupList.loading}>
            <Flex style={!(fileList.loading || list?.length) ? hiddenStyle : undefined} vertical gap={4} justify={'center'} align={'center'} className={`${styles.container} ${styles.upload}`}>
              <Flex ref={headerRef} gap={12}>
                <Button size={'small'}>Add media</Button>
                <Button type={'text'} size={'small'}>Add from URL</Button>
              </Flex>
              <div className={'tips'}>
                Drag and drop images, videos, 3D models, and files
              </div>
            </Flex>

            <div className={styles.content}>
              <SRender className={styles.empty} render={!list?.length && !fileList.loading}>
                <div style={{ width: 550 }}>
                  <Empty
                    img={<SearchIcon className={'secondary'} style={{ fontSize: 64 }} />}
                    title={'No results found'} desc={'Edit your search criteria, or upload a new file.'}
                    actions={
                      <Flex gap={12}>
                        <Button type={'primary'}>Add file</Button>
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
                      align={'center'}
                      vertical
                      justify={'center'}
                      key={item.id}
                      className={styles['item-wrap']}
                      gap={12}
                    >
                      <div className={styles.imgWrap}>
                        <FileImage
                          width={100}
                          height={100}
                          className={styles.img}
                          src={item.cover || item.src} type={item.type}
                        />
                        <div className={styles.mask} />
                      </div>
                      <Flex vertical justify={'center'} align={'center'}>
                        <div>
                          <Typography.Text style={{ maxWidth: 100 }} ellipsis={{ tooltip: true }}>
                            {item.file_name}
                          </Typography.Text>
                        </div>
                        <div style={{ marginTop: -1 }} className={'secondary'}>{item.suffix}</div>
                      </Flex>
                      <div className={styles.checkbox}>
                        <Checkbox />
                      </div>
                    </Flex>
                  ))
                }
              </Flex>
              <SRender style={{ paddingTop: 24, paddingBottom: 48 }} render={list.length}>
                <Flex gap={12} justify={'center'} align={'center'}>
                  <div><SLoading size={24} /></div>
                  <div style={{ fontWeight: '550' }}>Loading...</div>
                </Flex>
              </SRender>
            </div>
          </SLoading>
        </div>
      </Flex>
    </Modal>

  )
}
