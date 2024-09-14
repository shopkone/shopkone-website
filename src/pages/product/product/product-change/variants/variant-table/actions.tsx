import { useEffect, useState } from 'react'
import { DoubleLeft, DoubleRight, HamburgerButton } from '@icon-park/react'
import { Button, Flex, Tooltip } from 'antd'
import { useAtom } from 'jotai'

import { expandAtom } from '@/pages/product/product/product-change/variants/state'

import styles from './index.module.less'

export interface ActionsProps {
  hide?: boolean
}

export default function Actions (props: ActionsProps) {
  const { hide } = props
  const [expand, setExpand] = useAtom(expandAtom)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [expand])

  if (hide) {
    return null
  }

  return (
    <Flex gap={12}>
      <Tooltip title={'Edit Header'}>
        <Button
          size={'small'}
          className={styles.btn}
        >
          <HamburgerButton size={14} className={styles.icon} />
        </Button>
      </Tooltip>
      <Tooltip
        open={open}
        onOpenChange={setOpen}
        title={(!expand) ? 'Expand' : 'Collapse'}
      >
        <Button
          onClick={() => {
            setExpand(!expand)
          }}
          size={'small'}
          className={styles.btn}
        >
          {
            !expand
              ? <DoubleRight size={13} className={styles.icon} />
              : <DoubleLeft size={13} className={styles.icon} />
          }
        </Button>
      </Tooltip>
    </Flex>
  )
}
