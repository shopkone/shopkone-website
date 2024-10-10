import { ReactNode } from 'react'
import { IconChevronDown } from '@tabler/icons-react'
import { useMemoizedFn } from 'ahooks'
import { Button, Flex, Popover } from 'antd'

import styles from './index.module.less'

export interface FilterBaseProps {
  open: boolean
  setOpen: (open: boolean) => void
  children: React.ReactNode
  label: ReactNode
  onClear?: () => void
}

export default function FilterBase (props: FilterBaseProps) {
  const { open, setOpen, children, label, onClear } = props

  const content = useMemoizedFn(() => (
    <div className={styles.base}>
      {children}
      <div className={styles.clear}>
        <Button disabled={!onClear} onClick={onClear} type={'link'} size={'small'}>Clear</Button>
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
        <Flex gap={4} align={'center'} style={{ position: 'relative', top: -1 }}>
          {label}
          <IconChevronDown className={'secondary'} size={13} style={{ position: 'relative', top: 0 }} />
        </Flex>
      </Button>
    </Popover>
  )
}
