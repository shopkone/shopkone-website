import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useMemoizedFn, useRequest } from 'ahooks'
import { Button, Card, Form, Input } from 'antd'
import cloneDeep from 'lodash/cloneDeep'

import { NavInfoApi, NavItemType } from '@/api/online/navInfo'
import { NavUpdateApi } from '@/api/online/navUpdate'
import Page from '@/components/page'
import { sMessage } from '@/components/s-message'
import { useNav } from '@/hooks/use-nav'
import { useOpen } from '@/hooks/useOpen'
import NestedSortable from '@/pages/mange/online/nav-list/change/nested-sortable'
import { DEFAULT_ITEM } from '@/pages/mange/online/nav-list/change/sortable-item'
import { isEqualHandle } from '@/utils/is-equal-handle'

export default function NavChange () {
  const id = Number(useParams().id)
  const info = useRequest(NavInfoApi, { manual: true })
  const nav = useNav()
  const { t } = useTranslation('online', { keyPrefix: 'nav' })
  const [form] = Form.useForm()
  const [isChange, setIsChange] = useState(false)
  const update = useRequest(NavUpdateApi, { manual: true })
  const init = useRef()
  const openInfo = useOpen<NavItemType>()

  const onOk = async () => {
    await form.validateFields()
    const values = form.getFieldsValue()
    await update.runAsync({ ...info.data, ...values, id })
    sMessage.success(t('更新成功'))
    setIsChange(false)
    const res = await info.refreshAsync()
    form.setFieldsValue(res)
    onValuesChange(true)
  }

  const onValuesChange = (force?: boolean) => {
    const values = form.getFieldsValue(true)
    if (!init.current || force === true) {
      init.current = cloneDeep(values)
      return
    }
    const isSame = isEqualHandle(values, init.current)
    setIsChange(!isSame)
  }

  const onCancel = useMemoizedFn(() => {
    form.setFieldsValue(init.current)
    setIsChange(false)
  })

  useEffect(() => {
    if (!id) return
    info.runAsync({ id }).then(res => {
      form.setFieldsValue(res)
      onValuesChange(true)
    })
  }, [id])

  return (
    <Page
      onCancel={onCancel}
      loading={info.loading}
      width={800}
      isChange={isChange}
      onOk={onOk}
      back={'/online/nav_list'}
    >
      <Form onValuesChange={onValuesChange} form={form}>
        <Card title={t('导航名称')}>
          <Form.Item name={'title'}>
            <Input />
          </Form.Item>
        </Card>

        <Card
          extra={
            <Button
              onClick={() => { openInfo.edit({ ...DEFAULT_ITEM, parent_id: 0, levels: 1 }) }}
              style={{ marginRight: 0 }} size={'small'} type={'link'}
            >
              {t('添加菜单项')}
            </Button>
          }
          style={{ marginTop: 16 }}
          title={t('编辑菜单项')}
        >
          <Form.Item name={'links'}>
            <NestedSortable openInfo={openInfo} />
          </Form.Item>
        </Card>
      </Form>
    </Page>
  )
}
