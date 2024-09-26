import { ReactNode, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { LinkOutlined } from '@ant-design/icons'
import { useDebounceFn, useMemoizedFn, useRequest } from 'ahooks'
import { Button, Card, Flex, Tooltip } from 'antd'
import dayjs from 'dayjs'

import { FileType } from '@/api/file/add-file-record'
import { FilesDeleteApi } from '@/api/file/file-delete'
import { FileGroupListApi } from '@/api/file/file-group-list'
import { FileListApi, FileListReq, FileListRes } from '@/api/file/file-list'
import { ReactComponent as ReplaceIcon } from '@/assets/icon/replace.svg'
import { ReactComponent as ReplaceCoverIcon } from '@/assets/icon/replace-cover.svg'
import FileImage from '@/components/file-image'
import Page from '@/components/page'
import { sMessage } from '@/components/s-message'
import { useModal } from '@/components/s-modal'
import SRender from '@/components/s-render'
import STable, { STableProps } from '@/components/s-table'
import Upload from '@/components/upload'
import { useOpen } from '@/hooks/useOpen'
import FileInfo from '@/pages/mange/settings/files/file-info'
import Filters from '@/pages/mange/settings/files/filters'
import Group from '@/pages/mange/settings/files/group'
import { useGlobalTask } from '@/pages/mange/task/state'
import { formatFileSize } from '@/utils/format'

import styles from './index.module.less'

export default function Files () {
  const list = useRequest(FileListApi, { manual: true })
  const [params, setParams] = useState<FileListReq>({ page: 1, page_size: 20, group_id: 0 })
  const groupList = useRequest(FileGroupListApi)
  const filesDelete = useRequest(FilesDeleteApi, { manual: true })
  const location = useLocation()
  const [selected, setSelected] = useState<number[]>([])
  const fileInfoOpen = useOpen<number>()
  const addFiles = useGlobalTask(state => state.addFiles)
  const fileDoneFlag = useGlobalTask(state => state.fileDoneFlag)

  const modal = useModal()

  const onCopy = (link: string) => {
    navigator.clipboard.writeText(link)
    sMessage.success('Link copied')
  }

  const columns: STableProps['columns'] = [
    {
      title: <div className={styles.colTitle}>File name</div>,
      code: 'file_name',
      name: 'file_name',
      width: 300,
      render: (name: string, row: FileListRes) => (
        <Flex align={'center'} gap={12}>
          <FileImage type={row.type} alt={name} src={row.cover || row.src} />
          <div className={styles.title}>
            <Flex align={'center'} gap={12} className={styles.name}>
              <div>{name}</div>
              <Flex style={{ position: 'relative', top: -1 }} className={'file_row_action_icons'} align={'center'} gap={12}>
                <Upload
                  accepts={[]}
                  multiple={false}
                  maxSize={1024 * 1024 * 20}
                >
                  <Tooltip title={'Replace'}>
                    <Button className={styles.actionsIcon} type={'text'} size={'small'}>
                      <ReplaceIcon style={{ fontSize: 15 }} />
                    </Button>
                  </Tooltip>
                </Upload>
                <SRender render={row.type === FileType.Video}>
                  <Tooltip title={'Replace cover'}>
                    <Button className={styles.actionsIcon} type={'text'} size={'small'}>
                      <ReplaceCoverIcon style={{ fontSize: 17, position: 'relative', top: -1 }} />
                    </Button>
                  </Tooltip>
                </SRender>
              </Flex>
            </Flex>
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
      render: (src: string) => (
        <Tooltip title={'Copy link'}>
          <Button onClick={(e) => { e.stopPropagation(); onCopy(src) }} className={styles.btn}>
            <LinkOutlined className={styles.icon} />
          </Button>
        </Tooltip>
      )
    }
  ]
  const Uploader = useMemoizedFn((p: { children: ReactNode }) => (
    <Upload
      onChange={addFiles}
      groupId={params.group_id}
      multiple
      maxSize={1024 * 1024 * 20}
      accepts={['image', 'video', 'zip', 'audio']}
    >
      {p.children}
    </Upload>
  ))

  const onBatchDelete = () => {
    modal.confirm({
      title: `Delete ${selected?.length} files?`,
      content: 'This can’t be undone. The files will be removed from all places they’re being used in your Shopkone store.',
      okButtonProps: { type: 'primary', danger: true },
      okText: 'Delete',
      onOk: async () => {
        await filesDelete.runAsync({ ids: selected })
        sMessage.success('Delete files successfully')
        list.refresh()
        setSelected([])
      }
    })
  }

  const onFreshDebounce = useDebounceFn(list.refresh, { wait: 500 }).run

  useEffect(() => {
    list.run(params)
  }, [params])

  useEffect(() => {
    const groupId = Number(new URLSearchParams(location.search).get('groupId') || 0)
    if (groupId !== params.group_id) {
      setParams({ ...params, group_id: groupId, page: 1 })
      document?.getElementById('shopkone-main')?.scrollTo({ top: 0 })
    }
  }, [location.search])

  useEffect(() => {
    onFreshDebounce()
  }, [fileDoneFlag])

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
              onRowClick={(row: FileListRes) => {
                fileInfoOpen.edit(row.id)
              }}
              actions={
                <Button size={'small'} danger onClick={onBatchDelete}>Delete files</Button>
              }
              useVirtual={false}
              page={{
                total: list?.data?.total || 0,
                current: params.page,
                pageSize: params.page_size,
                onChange: (page, page_size) => {
                  if (page !== params.page) {
                    setSelected([])
                  }
                  setParams({ ...params, page, page_size })
                }
              }}
              rowSelection={{ onChange: setSelected, value: selected }}
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
      <FileInfo
        reFresh={list.refresh}
        groups={groupList?.data || []}
        open={fileInfoOpen}
      />
    </Page>
  )
}
