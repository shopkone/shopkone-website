import { useEffect, useRef } from 'react'
import { Info } from '@icon-park/react'
import { App, Modal, ModalFuncProps, ModalProps } from 'antd'
import classNames from 'classnames'

import styles from './index.module.less'

export const useModal = () => {
  const modal = useRef<{
    confirm: (props: ModalFuncProps) => void
    info: (props: ModalFuncProps) => void
    simple: (props: ModalFuncProps) => void
  }>({
        confirm: () => {},
        info: () => {},
        simple: () => {},
      })

  const { modal: m } = App.useApp()

  const renderIcon = (props: ModalFuncProps) => {
    const { icon } = props
    if (icon) {
      return icon
    }
    return <Info size={22} theme={'filled'} fill={'#1456f0'} />
  }

  useEffect(() => {
    modal.current.confirm = (props: ModalFuncProps = {}) => {
      const { title = 'Tips' } = props
      m.confirm({ centered: true, title, okText: '确定 ', cancelText: '取消 ', icon: renderIcon(props), width: 450, className: styles['modal-hooks'], ...props })
    }
    modal.current.info = (props: ModalFuncProps = {}) => {
      const { title = 'Tips' } = props
      m.info({ centered: true, title, okText: '确定 ', icon: renderIcon(props), width: 450, className: styles['modal-hooks'], ...props })
    }
    modal.current.simple = (props: ModalFuncProps = {}) => {
      const { title = 'Tips' } = props
      m.confirm({ centered: true, title, okText: '确定 ', icon: null, width: 450, className: styles['modal-hooks'], ...props })
    }
  }, [m])

  return modal.current
}

// 分割线 SModal
export interface SModalProps extends ModalProps {
  bordered?: boolean
  borderedTop?: boolean
  height?: number | string
  noMargin?: boolean
}

export default function SModal (props: SModalProps) {
  const { children, bordered, height, borderedTop, noMargin, ...restProps } = props
  return (
    <Modal
      centered
      className={styles.modal}
      width={550}
      destroyOnClose
      maskClosable={false}
      okText={'确定 '}
      cancelText={'取消 '}
      okButtonProps={{ style: { marginLeft: 16 } }}
      {...restProps}
    >
      <div
        style={{ height }}
        className={classNames([
          styles.body,
          { [styles.border]: bordered },
          { [styles['border-top']]: borderedTop },
          { [styles.noMargin]: noMargin }]
        )}
      >
        {children}
      </div>
    </Modal>
  )
}
