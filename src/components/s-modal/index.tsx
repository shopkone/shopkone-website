import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { IconInfoCircleFilled } from '@tabler/icons-react'
import { App, Flex, Modal, ModalFuncProps, ModalProps, Typography } from 'antd'

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

  const { t } = useTranslation('common')

  const renderIcon = (props: ModalFuncProps) => {
    const { icon } = props
    if (icon) {
      return icon
    }
    return (
      <Flex align={'center'} className={'shopkone-modal-confirm-icon'}>
        <IconInfoCircleFilled size={20} color={'#1456f0'} />
      </Flex>
    )
  }

  useEffect(() => {
    modal.current.confirm = (props: ModalFuncProps = {}) => {
      const { title = t('model.提示') } = props
      m.confirm({
        centered: true,
        title,
        icon: renderIcon(props),
        width: 500,
        ...props
      })
    }
    modal.current.info = (props: ModalFuncProps = {}) => {
      const { title = t('model.提示') } = props
      m.info({ centered: true, title, icon: renderIcon(props), width: 450, ...props })
    }
    modal.current.simple = (props: ModalFuncProps = {}) => {
      const { title = t('model.提示') } = props
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
      title={
        <Typography.Text style={{ maxWidth: Number(props.width || 550) - 100, fontSize: 14 }} ellipsis={{ tooltip: true }}>
          {props.title}
        </Typography.Text>
      }
    />
  )
}
