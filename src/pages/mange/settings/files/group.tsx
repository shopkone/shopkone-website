import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from '@icon-park/react'
import { useRequest } from 'ahooks'
import { Button, Flex } from 'antd'
import classNames from 'classnames'

import { FileGroupListApi } from '@/api/file/file-group-list'
import SCard from '@/components/s-card'

import styles from './index.module.less'

export default function Group () {
  const list = useRequest(FileGroupListApi)

  const nav = useNavigate()

  const queryString = window.location.search
  const params = new URLSearchParams(queryString)
  const groupId = Number(params.get('groupId') || 0)

  const groups = useMemo(() => [{ id: 0, name: 'All files', count: 0 }, ...(list.data || [])], [list.data])

  const onSelect = (id: number) => {
    if (id === groupId) return
    nav(`/mange/files?groupId=${id}`)
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
                onClick={() => { onSelect(group.id) }}
                key={group.id}
                className={classNames(styles.sideItem, { [styles.sideItemActive]: group.id === groupId })}
              >
                {group.name}
              </div>
            ))
          }
        </div>
        <div className={styles.sideBottom}>
          <Button block>
            <Flex gap={4} justify={'center'} align={'center'}>
              <Plus size={15} />
              <div style={{ position: 'relative', top: -2 }}>Add group</div>
            </Flex>
          </Button>
        </div>
      </SCard>
    </div>
  )
}
