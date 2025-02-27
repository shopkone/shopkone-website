import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { Flex, Form } from 'antd'

import { MarketCreateApi } from '@/api/market/create'
import Page from '@/components/page'
import SCard from '@/components/s-card'
import { sMessage } from '@/components/s-message'
import { useModal } from '@/components/s-modal'
import MarketsEdit from '@/pages/mange/settings/markets/change/markets-edit'
import { isEqualHandle } from '@/utils/is-equal-handle'

import styles from './index.module.less'

export default function MarketAdd () {
  const create = useRequest(MarketCreateApi, { manual: true })

  const { t } = useTranslation('settings', { keyPrefix: 'market' })
  const [form] = Form.useForm()
  const [isChange, setIsChange] = useState(false)
  const nav = useNavigate()
  const modal = useModal()

  const onValuesChange = () => {
    const values = form.getFieldsValue()
    const isSame = isEqualHandle(values, { name: '', country_codes: [] })
    setIsChange(!isSame)
  }

  const onCancel = () => {
    form.setFieldsValue({ name: '', country_codes: [] })
    setIsChange(false)
  }

  const onOk = async () => {
    await form.validateFields().catch(err => {
      const msg = err.errorFields?.[0]?.errors?.[0]
      if (msg) {
        sMessage.warning(msg)
      }
      throw new Error(err)
    })
    const values = form.getFieldsValue()
    const ret = await create.runAsync(values)
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
          const ret = await create.runAsync({ ...values, force: true })
          sMessage.success(t('市场添加成功'))
          nav(`/settings/markets/change/${ret.id}`)
        }
      })
      return
    }
    sMessage.success(t('市场添加成功'))
    nav(`/settings/markets/change/${ret.id}`)
  }

  return (
    <Page
      onCancel={onCancel}
      isChange={isChange}
      onOk={onOk}
      bottom={0}
      autoHeight
      width={600}
      title={t('添加市场')}
      back={'/settings/markets'}
    >
      <SCard>
        <MarketsEdit onValuesChange={onValuesChange} form={form} />
      </SCard>
    </Page>
  )
}
