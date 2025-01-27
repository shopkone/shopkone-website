import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { IconInfoCircleFilled } from '@tabler/icons-react'
import { useMemoizedFn } from 'ahooks'
import { App, Button, Flex, Modal, ModalFuncProps, ModalProps, Typography } from 'antd'

import SLoading from '@/components/s-loading'

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

  const { t } = useTranslation('common', { keyPrefix: 'modal' })

  const renderIcon = (props: ModalFuncProps) => {
    const { icon } = props
    if (icon) {
      return icon
    }
    return (
      <Flex align={'center'} className={'shopkimi-modal-confirm-icon'}>
        <IconInfoCircleFilled size={20} color={'#3478f5'} />
      </Flex>
    )
  }

  useEffect(() => {
    modal.current.confirm = (props: ModalFuncProps = {}) => {
      const { title = t('提示') } = props
      m.confirm({
        centered: true,
        title,
        icon: renderIcon(props),
        width: 500,
        ...props
      })
    }
    modal.current.info = (props: ModalFuncProps = {}) => {
      const { title = t('提示') } = props
      m.info({ centered: true, title, icon: renderIcon(props), width: 450, ...props })
    }
    modal.current.simple = (props: ModalFuncProps = {}) => {
      const { title = t('提示') } = props
      m.confirm({ centered: true, title, icon: null, width: 450, ...props })
    }
  }, [m])

  return modal.current
}

// 分割线 SModal
export interface SModalProps extends ModalProps {
  extra?: React.ReactNode
}

export default function SModal (props: SModalProps) {
  const { extra, children, loading, ...rest } = props
  const { t } = useTranslation('common', { keyPrefix: 'modal' })

  const ExtraFooter = useMemoizedFn(() => {
    return (
      <Flex justify={'space-between'} align={'center'}>
        {extra}
        <Flex gap={16}>
          <Button
            onClick={rest?.onCancel}
            {...rest.cancelButtonProps}
          >
            {rest.cancelText || t('取消')}
          </Button>
          <Button
            onClick={rest?.onOk}
            type={'primary'}
            loading={rest?.confirmLoading}
            {...props.okButtonProps}
          >
            {rest.okText || t('确定')}
          </Button>
        </Flex>
      </Flex>
    )
  })

  return (
    <Modal
      centered
      width={550}
      destroyOnClose
      maskClosable={false}
      footer={extra ? <ExtraFooter /> : undefined}
      {...rest}
      title={
        <Typography.Text style={{ maxWidth: Number(props.width || 550) - 100, fontSize: 14 }} ellipsis={{ tooltip: true }}>
          {props.title}
        </Typography.Text>
      }
    >
      <SLoading loading={loading}>
        {children}
      </SLoading>
    </Modal>
  )
}
