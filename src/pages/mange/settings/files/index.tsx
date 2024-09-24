import { useEffect, useState } from 'react'
import { useRequest } from 'ahooks'
import { Button, Card, Flex } from 'antd'

import { FileListApi, FileListReq } from '@/api/file/file-list'
import Page from '@/components/page'
import STable, { STableProps } from '@/components/s-table'
import Upload from '@/components/upload'
import { formatFileSize } from '@/utils/format'

export default function Files () {
  const list = useRequest(FileListApi, { manual: true })
  const [params, setParams] = useState<FileListReq>({ page: 1, page_size: 20 })

  const columns: STableProps['columns'] = [
    {
      title: 'File name',
      code: 'file_name',
      name: 'file_name',
      width: 200
    },
    {
      title: 'Date added',
      code: 'date_added',
      name: 'date_added',
      width: 100
    },
    {
      title: 'Size',
      code: 'size',
      name: 'size',
      render: (size: number) => formatFileSize(size),
      width: 80
    },
    {
      title: 'References',
      code: 'references',
      name: 'references',
      width: 80
    },
    {
      title: 'Link',
      code: 'src',
      name: 'src',
      width: 80,
      align: 'center',
      render: () => <Button style={{ width: 28, height: 28 }}>a</Button>
    }
  ]

  useEffect(() => {
    list.run(params)
  }, [params])

  return (
    <Page title={'Files'}>
      <Card styles={{ body: { paddingLeft: 0, paddingRight: 0 } }}>
        <STable
          rowSelection={{ onChange: () => {}, value: [], width: 15 }}
          init={!!list?.data?.list}
          loading={list.loading}
          empty={{
            title: 'Upload and manage your files',
            desc: 'Files can be images, videos or audio.',
            actions: (
              <Flex>
                <Upload
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
    </Page>
  )
}
