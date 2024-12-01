import { IconArrowAutofitWidth, IconDeviceDesktop, IconDeviceIpad, IconDeviceMobile } from '@tabler/icons-react'
import { useMemoizedFn } from 'ahooks'
import { Flex } from 'antd'
import classNames from 'classnames'

import IconButton from '@/components/icon-button'
import { DesignState, useDesignState } from '@/pages/mange/design/state'

import styles from './index.module.less'

export default function Header () {
  const state = useDesignState(state => state)

  const onSelectDevice = useMemoizedFn((device: DesignState['device']) => {
    state.setDevice(device)
  })

  return (
    <Flex align={'center'} justify={'center'} className={styles.header}>
      <div>asd</div>
      <Flex justify={'center'} align={'center'} gap={16} className={styles.center}>

        <IconButton
          onClick={() => { onSelectDevice('desktop') }}
          className={classNames({ [styles.active]: state.device === 'desktop' })}
          size={28}
          type={'text'}
        >
          <IconDeviceDesktop size={20} />
        </IconButton>

        <IconButton
          onClick={() => { onSelectDevice('pad') }}
          className={classNames({ [styles.active]: state.device === 'pad' })}
          size={28}
          type={'text'}
        >
          <IconDeviceIpad size={20} />
        </IconButton>

        <IconButton
          onClick={() => { onSelectDevice('mobile') }}
          className={classNames({ [styles.active]: state.device === 'mobile' })}
          size={28}
          type={'text'}
        >
          <IconDeviceMobile size={20} />
        </IconButton>

        <IconButton
          onClick={() => { onSelectDevice('fill') }}
          className={classNames({ [styles.active]: state.device === 'fill' })}
          size={28}
          type={'text'}
        >
          <IconArrowAutofitWidth size={20} />
        </IconButton>
      </Flex>
      <div>asd</div>
    </Flex>
  )
}
