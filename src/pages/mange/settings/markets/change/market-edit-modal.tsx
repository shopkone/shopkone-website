import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { Flex, Form } from 'antd'

import { MarketInfoRes } from '@/api/market/info'
import { MarketUpdateApi } from '@/api/market/update'
import { sMessage } from '@/components/s-message'
import SModal, { useModal } from '@/components/s-modal'
import { UseOpenType } from '@/hooks/useOpen'
import styles from '@/pages/mange/settings/markets/change/index.module.less'
import MarketsEdit from '@/pages/mange/settings/markets/change/markets-edit'

export interface MarketEditModalProps {
  openInfo: UseOpenType<MarketInfoRes>
  onFinished: () => void
}

export default function MarketEditModal (props: MarketEditModalProps) {
  const { openInfo, onFinished } = props
  const [form] = Form.useForm()
  const { t } = useTranslation('settings', { keyPrefix: 'market' })
  const update = useRequest(MarketUpdateApi, { manual: true })
  const id = Number(useParams().id || 0)
  const modal = useModal()

  const onOk = async () => {
    const values = await form.validateFields()
    const ret = await update.runAsync({ ...values, id })
    if (ret.remove_names?.length) {
      modal.confirm({
        title: t('x个市场将被删除', { x: ret.remove_names.length }),
        content: (
          <div>
            <div>{t('删除提示')}</div>
            <div style={{ marginTop: 4 }}>
              {
                ret.remove_names.map(name => (
                  <Flex align={'center'} gap={6} key={name}>
                    <div className={styles.dot} />
                    <div>{name}</div>
                  </Flex>
                ))
              }
            </div>
          </div>
        ),
        onOk: async () => {
          await update.runAsync({ ...values, id, force: true })
          sMessage.success(t('市场更新成功'))
          onFinished()
          openInfo.close()
        }
      })
      return
    }
    sMessage.success(t('市场更新成功'))
    openInfo.close()
    onFinished()
  }

  useEffect(() => {
    if (!openInfo.open) return
    form.setFieldsValue(openInfo.data)
  }, [openInfo.open])

  return (
    <SModal
      onOk={onOk}
      okText={t('更新')}
      onCancel={openInfo.close}
      title={t('编辑市场')}
      open={openInfo.open}
      confirmLoading={update.loading}
    >
      <div style={{ padding: 16 }}>
        <MarketsEdit data={openInfo?.data} form={form} height={420} noClassName />
      </div>
    </SModal>
  )
}
