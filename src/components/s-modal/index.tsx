import { useEffect, useRef } from 'react'
import { Info } from '@icon-park/react'
import { App, Modal, ModalFuncProps, ModalProps } from 'antd'

export const useModal = () => {
  const modal = useRef<{
    confirm: (props: ModalFuncProps) => void
    info: (props: ModalFuncProps) => void
    simple: (props: ModalFuncProps) => void
  }>({
        confirm: () => {},
        info: () => {},
        simple: () => {}
      })

  const { modal: m } = App.useApp()

  const renderIcon = (props: ModalFuncProps) => {
    const { icon } = props
    if (icon) {
      return icon
    }
    return <Info style={{ marginRight: 8, marginTop: 2 }} size={18} theme={'filled'} fill={'#1456f0'} />
  }

  useEffect(() => {
    modal.current.confirm = (props: ModalFuncProps = {}) => {
      const { title = 'Tips' } = props
      m.confirm({ centered: true, title, icon: renderIcon(props), width: 450, ...props })
    }
    modal.current.info = (props: ModalFuncProps = {}) => {
      const { title = 'Tips' } = props
      m.info({ centered: true, title, icon: renderIcon(props), width: 450, ...props })
    }
    modal.current.simple = (props: ModalFuncProps = {}) => {
      const { title = 'Tips' } = props
      m.confirm({ centered: true, title, icon: null, width: 450, ...props })
    }
  }, [m])

  return modal.current
}

// 分割线 SModal
export interface SModalProps extends ModalProps {
}

export default function SModal (props: SModalProps) {
  return (
    <Modal
      centered
      width={550}
      destroyOnClose
      maskClosable={false}
      {...props}
    />
  )
}
