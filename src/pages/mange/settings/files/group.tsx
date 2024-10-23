import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { IconDots, IconPlus } from '@tabler/icons-react'
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

  const gid = useParams().groupId
  const groupId = Number(gid || 0)
  const { t } = useTranslation('settings', { keyPrefix: 'file' })

  const groups = useMemo(() => [{ id: 0, name: t('所有文件'), count: 0 }, ...(list || [])], [list])

  const onSelect = (id: number) => {
    console.log(id)
    if (id === groupId) return
    nav(`/settings/files/${id}`)
  }

  const onRemove = async (id: number) => {
    modal.confirm({
      content: t('您确定要删除这个分组吗？'),
      onOk: async () => {
        await groupRemove.runAsync({ id })
        sMessage.success(t('删除分组成功'))
        asyncRefresh()
        if (groupId === id) {
          onSelect(0)
        }
      },
      okButtonProps: { type: 'primary', danger: true },
      okText: t('删除')
    })
  }

  return (
    <div className={styles.side}>
      <SCard
        loading={loading}
        styles={{ body: { padding: 0 } }}
        className={'fit-height'}
      >
        <div className={styles.sideTitle}>{t('文件分组')}</div>
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
                          <Button type={'text'} onClick={() => { open.edit({ id: group.id, name: group.name }) }}>{t('编辑')}</Button>
                          <Button onClick={() => { onRemove(group.id) }} type={'text'}>{t('删除')}</Button>
                        </Flex>
                      }
                    >
                      <Button
                        style={{ background: expand === group.id ? '#e1e3e5' : undefined, opacity: expand === group.id ? 1 : undefined }}
                        className={styles.more} onClick={e => { e.stopPropagation() }}
                        type={'text'}
                        size={'small'}
                      >
                        <IconDots size={15} />
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
            <IconPlus size={14} />
            {t('添加分组1')}
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
