import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { More, Plus } from '@icon-park/react'
import { useRequest } from 'ahooks'
import { Button, Flex, Popover, Typography } from 'antd'
import classNames from 'classnames'

import { FileGroupListApi } from '@/api/file/file-group-list'
import SCard from '@/components/s-card'
import SRender from '@/components/s-render'
import { useOpen } from '@/hooks/useOpen'
import AddGroup from '@/pages/mange/settings/files/add-group'

import styles from './index.module.less'

export default function Group () {
  const list = useRequest(FileGroupListApi)

  const nav = useNavigate()
  const open = useOpen<{ id: number, name: string }>()

  const [expand, setExpand] = useState<number>()

  const queryString = window.location.search
  const params = new URLSearchParams(queryString)
  const groupId = Number(params.get('groupId') || 0)

  const groups = useMemo(() => [{ id: 0, name: 'All files', count: 0 }, ...(list.data || [])], [list.data])

  const onSelect = (id: number, name: string) => {
    if (id === groupId) return
    nav(`/settings/files?groupId=${id}&groupName=${name}`)
  }

  return (
    <div className={styles.side}>
      <SCard
        loading={list.loading}
        styles={{ body: { padding: 0 } }}
        className={'fit-height'}
      >
        <div className={styles.sideTitle}>File group</div>
        <div className={styles.sideContent}>
          {
            groups.map(group => (
              <div
                onClick={() => { onSelect(group.id, group.name) }}
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
                          <Button type={'text'}>Delete</Button>
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
              <Plus size={15} />
              <div style={{ position: 'relative', top: -2 }}>Add group</div>
            </Flex>
          </Button>
        </div>
      </SCard>
      <AddGroup
        onComplete={id => {
          list.refreshAsync().then(res => {
            const item = res.find(i => i.id === id)
            if (!item) return
            onSelect(item.id, item.name)
          })
        }}
        open={open}
      />
    </div>
  )
}
