import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { LinkOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { Button, Card, Flex } from 'antd'
import dayjs from 'dayjs'

import { FileListApi, FileListReq, FileListRes } from '@/api/file/file-list'
import Image from '@/components/image'
import Page from '@/components/page'
import SRender from '@/components/s-render'
import STable, { STableProps } from '@/components/s-table'
import Upload from '@/components/upload'
import Filters from '@/pages/mange/settings/files/filters'
import Group from '@/pages/mange/settings/files/group'
import { formatFileSize } from '@/utils/format'

import styles from './index.module.less'

export default function Files () {
  const list = useRequest(FileListApi, { manual: true })
  const [params, setParams] = useState<FileListReq>({ page: 1, page_size: 20, group_id: 0 })

  const location = useLocation()

  const columns: STableProps['columns'] = [
    {
      title: <div className={styles.colTitle}>File name</div>,
      code: 'file_name',
      name: 'file_name',
      width: 500,
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

  useEffect(() => {
    list.run(params)
  }, [params])

  useEffect(() => {
    const groupId = Number(new URLSearchParams(location.search).get('groupId') || 0)
    if (groupId !== params.group_id) {
      setParams({ ...params, group_id: groupId })
      document?.getElementById('shopkone-main')?.scrollTo({ top: 0 })
    }
  }, [location.search])

  return (
    <Page
      bottom={64}
      header={
        <SRender render={!!list?.data?.list?.length}>
          <Upload
            global
            multiple
            maxSize={1024 * 1024 * 20}
            accepts={['image', 'video', 'zip', 'audio']}
          >
            <Button type={'primary'}>Upload files</Button>
          </Upload>
        </SRender>
      }
      title={'Files'}
    >
      <Flex gap={16}>
        <Group />
        <div className={styles.right}>
          <Card styles={{ body: { padding: '8px 0' } }}>
            <Filters value={params} onChange={(v) => { setParams({ ...params, ...(v || {}) }) }} />
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
                title: 'Upload and manage your files',
                desc: 'Files can be images, videos or audio.',
                actions: (
                  <Flex>
                    <Upload
                      global
                      multiple
                      maxSize={1024 * 1024 * 20}
                      accepts={['image', 'video', 'zip', 'audio']}
                    >
                      <Button type={'primary'}>Upload files</Button>
                    </Upload>
                  </Flex>
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
