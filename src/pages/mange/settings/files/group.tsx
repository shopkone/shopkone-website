import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { More } from '@icon-park/react'
import { IconPlus } from '@tabler/icons-react'
import { useRequest } from 'ahooks'
import { Button, Flex, Popover, Typography } from 'antd'
import classNames from 'classnames'

import { FileGroupListRes } from '@/api/file/file-group-list'
import { FileGroupRemoveApi } from '@/api/file/file-group-remove'
import SCard from '@/components/s-card'
import { sMessage } from '@/components/s-message'
import { useModal } from '@/components/s-modal'
import SRender from '@/components/s-render'
import { useOpen } from '@/hooks/useOpen'
import AddGroup from '@/pages/mange/settings/files/add-group'

import styles from './index.module.less'

export interface GroupProps {
  list: FileGroupListRes[]
  loading: boolean
  asyncRefresh: () => Promise<FileGroupListRes[]>
}

export default function Group (props: GroupProps) {
  const { list, loading, asyncRefresh } = props
  const nav = useNavigate()
  const open = useOpen<{ id: number, name: string }>()
  const groupRemove = useRequest(FileGroupRemoveApi, { manual: true })
  const modal = useModal()
  const [expand, setExpand] = useState<number>()

  const queryString = window.location.search
  const params = new URLSearchParams(queryString)
  const groupId = Number(params.get('groupId') || 0)

  const groups = useMemo(() => [{ id: 0, name: 'All files', count: 0 }, ...(list || [])], [list])

  const onSelect = (id: number) => {
    if (id === groupId) return
    nav(`/settings/files?groupId=${id}`)
  }

  const onRemove = async (id: number) => {
    modal.confirm({
      content: 'Are you sure to delete this group?',
      onOk: async () => {
        await groupRemove.runAsync({ id })
        sMessage.success('Delete group successfully')
        asyncRefresh()
        if (groupId === id) {
          onSelect(0)
        }
      },
      okButtonProps: { type: 'primary', danger: true },
      okText: 'Delete'
    })
  }

  return (
    <div className={styles.side}>
      <SCard
        loading={loading}
        styles={{ body: { padding: 0 } }}
        className={'fit-height'}
      >
        <div className={styles.sideTitle}>File group</div>
        <div className={styles.sideContent}>
          {
            groups.map(group => (
              <div
                onClick={() => { onSelect(group.id) }}
                key={group.id}
                className={classNames(styles.sideItem, { [styles.sideItemActive]: group.id === groupId })}
              >
                <Flex justify={'space-between'} align={'center'}>
                  <Typography.Text ellipsis>{group.name}</Typography.Text>
                  <SRender render={group.id}>
                    <Popover
                      open={expand === group.id}
                      onOpenChange={(open) => { setExpand(open ? group.id : undefined) }}
                      overlayInnerStyle={{ minWidth: 100 }}
                      trigger={'click'} arrow={false}
                      placement={'bottom'}
                      content={
                        <Flex onClick={e => { e.stopPropagation(); setExpand(undefined) }} vertical gap={8}>
                          <Button type={'text'} onClick={() => { open.edit({ id: group.id, name: group.name }) }}>Edit</Button>
                          <Button onClick={() => { onRemove(group.id) }} type={'text'}>Delete</Button>
                        </Flex>
                    }
                    >
                      <Button
                        style={{ background: expand === group.id ? '#e1e3e5' : undefined, opacity: expand === group.id ? 1 : undefined }}
                        className={styles.more} onClick={e => { e.stopPropagation() }}
                        type={'text'}
                        size={'small'}
                      >
                        <More size={15} />
                      </Button>
                    </Popover>
                  </SRender>
                </Flex>
              </div>
            ))
          }
        </div>
        <div className={styles.sideBottom}>
          <Button onClick={() => { open.edit() }} block>
            <Flex gap={4} justify={'center'} align={'center'}>
              <IconPlus style={{ position: 'relative', top: -3 }} size={14} />
              <div style={{ position: 'relative', top: -2 }}>Add group</div>
            </Flex>
          </Button>
        </div>
      </SCard>
      <AddGroup
        onComplete={id => {
          onSelect(id)
          asyncRefresh()
        }}
        open={open}
      />
    </div>
  )
}
