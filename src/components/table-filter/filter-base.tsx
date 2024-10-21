import { ReactNode } from 'react'
import { IconChevronDown, IconX } from '@tabler/icons-react'
import { useMemoizedFn } from 'ahooks'
import { Button, Flex, Popover } from 'antd'

import SRender from '@/components/s-render'

import styles from './index.module.less'

export interface FilterBaseProps {
  open: boolean
  setOpen: (open: boolean) => void
  children: React.ReactNode
  label: ReactNode
  onClear?: () => void
  showLabel?: string
}

export default function FilterBase (props: FilterBaseProps) {
  const { open, setOpen, children, label, onClear, showLabel } = props

  const clearHandler = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClear?.()
  }

  const content = useMemoizedFn(() => (
    <div className={styles.base}>
      {children}
      <div className={styles.clear}>
        <Button disabled={!onClear} onClick={clearHandler} type={'link'} size={'small'}>清除</Button>
      </div>
    </div>
  ))

  return (
    <Popover content={content} open={open} onOpenChange={setOpen} trigger={'click'} placement={'bottomLeft'} arrow={false}>
      <Button
        style={{ background: onClear ? '#f0f0f0' : '#fff', fontWeight: onClear ? '500' : '400' }}
        type={onClear ? undefined : 'dashed'}
        size={'small'}
      >
        <Flex gap={4} align={'center'}>
          {label}
          <SRender render={onClear}>
            : {showLabel}
          </SRender>
          <SRender render={!onClear}>
            <IconChevronDown className={'secondary'} size={13} style={{ position: 'relative', top: 0 }} />
          </SRender>
          <SRender render={onClear}>
            <IconX onClick={clearHandler} className={styles.close} size={12} />
          </SRender>
        </Flex>
      </Button>
    </Popover>
  )
}
