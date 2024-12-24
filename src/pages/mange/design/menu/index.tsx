import { useLocation } from 'react-router-dom'
import { IconLayoutGridAdd, IconLayoutList, IconSettings } from '@tabler/icons-react'
import { Flex } from 'antd'
import classNames from 'classnames'

import IconButton from '@/components/icon-button'
import { useNav } from '@/hooks/use-nav'

import styles from './index.module.less'

export default function Menu () {
  const { search } = useLocation()

  const nav = useNav()

  return (
    <Flex gap={12} align={'center'} vertical className={styles.menu}>
      <IconButton
        onClick={() => { nav('?section') }}
        className={classNames({ [styles.active]: search.includes('section') || !search })}
        type={'text'}
        size={36}
      >
        <IconLayoutList size={18} />
      </IconButton>
      <IconButton
        className={classNames({ [styles.active]: search.includes('global') })}
        onClick={() => { nav('?global') }}
        type={'text'}
        size={36}
      >
        <IconSettings size={18} />
      </IconButton>
      <IconButton type={'text'} size={36}>
        <IconLayoutGridAdd size={18} />
      </IconButton>
    </Flex>
  )
}
