import { ReactNode, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { IconCopy, IconDownload } from '@tabler/icons-react'
import { useDebounceFn, useMemoizedFn, useRequest } from 'ahooks'
import { Button, Flex, Tooltip, Typography } from 'antd'
import dayjs from 'dayjs'

import { FileType } from '@/api/file/add-file-record'
import { FilesDeleteApi } from '@/api/file/file-delete'
import { FileGroupListApi } from '@/api/file/file-group-list'
import { FileListApi, FileListReq, FileListRes } from '@/api/file/file-list'
import FileImage from '@/components/file-image'
import IconButton from '@/components/icon-button'
import Page from '@/components/page'
import SCard from '@/components/s-card'
import { sMessage } from '@/components/s-message'
import { useModal } from '@/components/s-modal'
import SRender from '@/components/s-render'
import STable, { STableProps } from '@/components/s-table'
import Upload from '@/components/upload'
import { useOpen } from '@/hooks/useOpen'
import FileInfo from '@/pages/mange/settings/files/file-info'
import Filters from '@/pages/mange/settings/files/filters'
import Group from '@/pages/mange/settings/files/group'
import MoveGroup from '@/pages/mange/settings/files/move-group'
import ReplaceCover from '@/pages/mange/settings/files/replace-cover'
import ReplaceImage from '@/pages/mange/settings/files/replace-image'
import ReplaceVideo from '@/pages/mange/settings/files/replace-video'
import { useTask } from '@/pages/mange/task/state'
import { formatFileSize } from '@/utils/format'

import styles from './index.module.less'

export default function Files () {
  const list = useRequest(FileListApi, { manual: true })
  const [params, setParams] = useState<FileListReq>({ page: 1, page_size: 20, group_id: 0 })
  const groupList = useRequest(FileGroupListApi)
  const filesDelete = useRequest(FilesDeleteApi, { manual: true })
  const gid = useParams().groupId
  const groupId = Number(gid || 0)
  const [selected, setSelected] = useState<number[]>([])
  const fileInfoOpen = useOpen<number>()
  const moveGroupOpen = useOpen<number[]>()
  const [loadingList, setLoadingList] = useState<number[]>([])
  const addTasks = useTask(state => state.addUploadTasks)
  const uploadFinished = useTask(state => state.uploadFinished)
  const resetUploadFinished = useTask(state => state.resetUploadFinished)

  const modal = useModal()
  const { t } = useTranslation('settings', { keyPrefix: 'file' })

  const onCopy = (link: string) => {
    navigator.clipboard.writeText(link)
    sMessage.success(t('链接已复制')) // 'Link copied'
  }

  const onLoading = (loading: boolean, id: number) => {
    setLoadingList(prev => {
      if (loading) {
        return [...prev, id]
      } else {
        list.refresh()
        return prev.filter(item => item !== id)
      }
    })
  }

  const columns: STableProps['columns'] = [
    {
      title: <div className={styles.colTitle}>{t('文件名')}</div>, // 'File name'
      code: 'file_name',
      name: 'file_name',
      width: 300,
      render: (name: string, row: FileListRes) => (
        <Flex align={'center'} gap={12}>
          <FileImage
            loading={loadingList.includes(row.id)}
            type={row.type}
            alt={name} src={row.cover || row.src}
          />
          <div className={styles.title}>
            <Flex align={'center'} gap={12} className={styles.name}>
              <Typography.Text style={{ maxWidth: 'calc(34.5vw - 300px)' }} ellipsis={{ tooltip: true }}>
                {name}
              </Typography.Text>
              <Flex
                onClick={e => { e.stopPropagation() }}
                style={{ position: 'relative', top: -1 }}
                className={'file_row_action_icons'}
                align={'center'} gap={12}
              >
                <SRender render={row.type === FileType.Image}>
                  <ReplaceImage
                    id={row.id}
                    onLoading={(loading) => { onLoading(loading, row.id) }}
                  />
                </SRender>
                <SRender render={row.type === FileType.Video}>
                  <ReplaceVideo
                    id={row.id}
                    onLoading={(loading) => { onLoading(loading, row.id) }}
                  />
                </SRender>
                <SRender render={row.type === FileType.Video}>
                  <ReplaceCover
                    id={row.id}
                    onLoading={(loading) => { onLoading(loading, row.id) }}
                  />
                </SRender>
              </Flex>
            </Flex>
            <div>{row.suffix}</div>
          </div>
        </Flex>
      ),
      lock: true
    },
    {
      title: t('添加日期'), // 'Date added'
      code: 'data_added',
      name: 'data_added',
      width: 100,
      render: (date: number) => {
        return dayjs(date).format('MM/DD/YYYY')
      }
    },
    {
      title: t('大小'), // 'Size'
      code: 'size',
      name: 'size',
      render: (size: number) => formatFileSize(size),
      width: 100
    },
    {
      title: t('引用'), // 'References'
      code: 'references',
      name: 'references',
      width: 80
    },
    {
      title: t('组名'), // 'Group name'
      code: 'group_id',
      name: 'group_id',
      width: 150,
      render: (groupId: number) => {
        const group = groupList.data?.find(item => item.id === groupId)
        return <Typography.Text ellipsis={{ tooltip: true }}>{group?.name || '--'}</Typography.Text>
      },
      hidden: !groupList?.data?.length
    },
    {
      title: '',
      code: 'src',
      name: 'src',
      width: 80,
      render: (src: string) => (
        <Flex onMouseUp={e => { e.stopPropagation() }} align={'center'} gap={12}>
          <div style={{ display: 'inline-block' }}>
            <Tooltip placement={'top'} title={t('下载素材')}> {/* 'Copy link' */}
              <IconButton
                href={src}
                type={'text'}
                size={26}
              >
                <IconDownload size={14} />
              </IconButton>
            </Tooltip>
          </div>

          <div style={{ display: 'inline-block' }}>
            <Tooltip placement={'top'} title={t('复制链接')}> {/* 'Copy link' */}
              <IconButton
                type={'text'}
                onClick={(e) => {
                  onCopy(src)
                }}
                size={26}
              >
                <IconCopy size={14} />
              </IconButton>
            </Tooltip>
          </div>
        </Flex>
      )
    }
  ]
  const Uploader = useMemoizedFn((p: { children: ReactNode }) => (
    <Upload
      onChange={addTasks}
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
      title: t('删除1', { count: selected?.length }),
      content: t('此操作无法撤销，文件将从您 Shopkone 商店的所有位置移除。'), // 'This can’t be undone. The files will be removed from all places they’re being used in your Shopkone store.'
      okButtonProps: { type: 'primary', danger: true },
      okText: t('删除2'), // 'Delete'
      onOk: async () => {
        await filesDelete.runAsync({ ids: selected })
        sMessage.success(t('成功删除文件')) // 'Delete files successfully'
        list.refresh()
        setSelected([])
      }
    })
  }

  const onFreshDebounce = useDebounceFn(() => {
    list.refresh()
  }, { wait: 1000 }).run

  useEffect(() => {
    list.run(params)
  }, [params])

  useEffect(() => {
    if (groupId !== params.group_id) {
      setParams({ ...params, group_id: groupId, page: 1 })
      document?.getElementById('shopkone-main')?.scrollTo({ top: 0 })
    }
  }, [groupId])

  useEffect(() => {
    if (uploadFinished) {
      onFreshDebounce()
    }
    return () => {
      resetUploadFinished()
    }
  }, [uploadFinished])

  return (
    <Page
      bottom={64}
      header={
        <SRender render={!!list?.data?.list?.length}>
          <Uploader>
            <Button type={'primary'}>{t('上传文件')}</Button>
          </Uploader>
        </SRender>
      }
      title={t('文件')}
    >
      <Flex gap={16}>
        <Group loading={groupList.loading} list={groupList?.data || []} asyncRefresh={groupList.refreshAsync} />
        <SCard styles={{ body: { padding: '8px 0' } }} style={{ flex: 1 }}>
          <Filters
            groupName={groupList?.data?.find(item => item.id === params.group_id)?.name}
            value={params}
            onChange={(v) => { setParams({ ...params, ...(v || {}), page: 1 }) }}
          />
          <STable
            rowClassName={() => styles.row}
            onRowClick={(row: FileListRes) => {
              fileInfoOpen.edit(row.id)
            }}
            actions={
              <Flex gap={12}>
                <Button type={'text'} size={'small'} danger onClick={onBatchDelete}>{t('删除文件')}</Button>
                <SRender render={!!groupList?.data?.length}>
                  <Button
                    type={'text'}
                    size={'small'}
                    onClick={() => { moveGroupOpen.edit(selected) }}
                  >
                    {t('移动到新组')}
                  </Button>
                </SRender>
              </Flex>
              }
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
              title: params.group_id
                ? t('分组没文件', { name: groupList?.data?.find(item => item.id === params.group_id)?.name })
                : t('上传和管理您的文件'),
              actions: (
                <Uploader>
                  <Button type={'primary'}>{t('上传文件1')}</Button>
                </Uploader>
              ),
              desc: ''
            }}
            data={list?.data?.list || []}
            columns={columns}
          />
        </SCard>
      </Flex>
      <FileInfo
        reFresh={list.refresh}
        groups={groupList?.data || []}
        open={fileInfoOpen}
      />
      <MoveGroup
        groupList={groupList?.data || []}
        open={moveGroupOpen}
        onConfirm={() => {
          list.refresh()
          setSelected([])
        }}
      />
    </Page>
  )
}
