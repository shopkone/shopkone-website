import { useEffect, useState } from 'react'
import { LoadingOutlined } from '@ant-design/icons'
import { DoubleLeft, DoubleRight, HamburgerButton } from '@icon-park/react'
import { Button, Flex, Spin, Tooltip } from 'antd'
import { useAtom, useAtomValue } from 'jotai'

import { expandAtom, loadingAtom } from '@/pages/product/product/product-change/state'

import styles from './index.module.less'

export default function Actions () {
  const [expand, setExpand] = useAtom(expandAtom)
  const [open, setOpen] = useState(false)
  const loading = useAtomValue(loadingAtom)

  useEffect(() => {
    setOpen(false)
  }, [expand])

  return (
    <Flex gap={12}>
      <div className={styles.actions}>
        <Spin spinning={loading} indicator={<LoadingOutlined />} />
      </div>
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
