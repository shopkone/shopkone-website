import { ReactNode, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { LinkOutlined } from '@ant-design/icons'
import { useDebounceFn, useMemoizedFn, useRequest } from 'ahooks'
import { Button, Card, Flex } from 'antd'
import dayjs from 'dayjs'
import { useAtomValue } from 'jotai'

import { FileGroupListApi } from '@/api/file/file-group-list'
import { FileListApi, FileListReq, FileListRes } from '@/api/file/file-list'
import Image from '@/components/image'
import Page from '@/components/page'
import SRender from '@/components/s-render'
import STable, { STableProps } from '@/components/s-table'
import Upload from '@/components/upload'
import Filters from '@/pages/mange/settings/files/filters'
import Group from '@/pages/mange/settings/files/group'
import { triggerNewUploadFileAtom } from '@/pages/mange/task/state'
import { formatFileSize } from '@/utils/format'

import styles from './index.module.less'

export default function Files () {
  const list = useRequest(FileListApi, { manual: true })
  const [params, setParams] = useState<FileListReq>({ page: 1, page_size: 20, group_id: 0 })
  const groupList = useRequest(FileGroupListApi)
  const newUploadFile = useAtomValue(triggerNewUploadFileAtom)
  const location = useLocation()

  const columns: STableProps['columns'] = [
    {
      title: <div className={styles.colTitle}>File name</div>,
      code: 'file_name',
      name: 'file_name',
      width: 300,
      render: (name: string, row: FileListRes) => (
        <Flex align={'center'} gap={12}>
          <Image
            className={styles.img}
            src={row.src}
          />
          <div className={styles.title}>
            <div className={styles.name}>{name}</div>
            <div>{row.suffix}</div>
          </div>
        </Flex>
      )
    },
    {
      title: 'Date added',
      code: 'data_added',
      name: 'data_added',
      width: 100,
      render: (date: number) => {
        return dayjs(date).format('MM/DD/YYYY')
      }
    },
    {
      title: 'Size',
      code: 'size',
      name: 'size',
      render: (size: number) => formatFileSize(size),
      width: 100
    },
    {
      title: 'References',
      code: 'references',
      name: 'references',
      width: 100
    },
    {
      title: 'Group name',
      code: 'group_id',
      name: 'group_id',
      width: 150,
      render: (groupId: number) => {
        const group = groupList.data?.find(item => item.id === groupId)
        return group?.name || '--'
      },
      hidden: !groupList?.data?.length
    },
    {
      title: 'Link',
      code: 'src',
      name: 'src',
      width: 60,
      render: () => (
        <Button className={styles.btn}>
          <LinkOutlined className={styles.icon} />
        </Button>
      )
    }
  ]
  const Uploader = useMemoizedFn((p: { children: ReactNode }) => (
    <Upload
      groupId={params.group_id}
      global
      multiple
      maxSize={1024 * 1024 * 20}
      accepts={['image', 'video', 'zip', 'audio']}
    >
      {p.children}
    </Upload>
  ))

  const triggerFresh = useDebounceFn(() => {
    list.refreshAsync()
  })

  useEffect(() => {
    list.run(params)
  }, [params])

  useEffect(() => {
    const groupId = Number(new URLSearchParams(location.search).get('groupId') || 0)
    if (groupId !== params.group_id) {
      console.log(123)
      setParams({ ...params, group_id: groupId, page: 1 })
      document?.getElementById('shopkone-main')?.scrollTo({ top: 0 })
    }
  }, [location.search])

  useEffect(() => {
    if (!newUploadFile) return
    triggerFresh.run()
  }, [newUploadFile])

  return (
    <Page
      bottom={64}
      header={
        <SRender render={!!list?.data?.list?.length}>
          <Uploader>
            <Button type={'primary'}>Upload files</Button>
          </Uploader>
        </SRender>
      }
      title={'Files'}
    >
      <Flex gap={16}>
        <Group loading={groupList.loading} list={groupList?.data || []} asyncRefresh={groupList.refreshAsync} />
        <div className={styles.right}>
          <Card styles={{ body: { padding: '8px 0' } }}>
            <Filters
              groupName={groupList?.data?.find(item => item.id === params.group_id)?.name}
              value={params}
              onChange={(v) => { setParams({ ...params, ...(v || {}), page: 1 }) }}
            />
            <STable
              useVirtual={false}
              page={{
                total: list?.data?.total || 0,
                current: params.page,
                pageSize: params.page_size,
                onChange: (page, page_size) => {
                  setParams({ ...params, page, page_size })
                }
              }}
              rowSelection={{ onChange: () => {}, value: [], width: 30 }}
              init={!!list?.data?.list}
              loading={list.loading}
              empty={{
                title: params.group_id ? 'No files in this group' : 'Upload and manage your files',
                desc: 'Upload and manage your files.',
                actions: (
                  <Uploader>
                    <Button type={'primary'}>Upload files</Button>
                  </Uploader>
                )
              }}
              data={list?.data?.list || []}
              columns={columns}
            />
          </Card>
        </div>
      </Flex>

    </Page>
  )
}
