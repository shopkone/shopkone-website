import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useMemoizedFn, useRequest } from 'ahooks'
import { Card, Form, Input } from 'antd'
import cloneDeep from 'lodash/cloneDeep'

import { NavCreateApi } from '@/api/online/navCreate'
import { NavInfoApi, NavItemType } from '@/api/online/navInfo'
import { NavUpdateApi } from '@/api/online/navUpdate'
import Page from '@/components/page'
import { sMessage } from '@/components/s-message'
import { useNav } from '@/hooks/use-nav'
import Grab from '@/pages/mange/online/nav-list/change/grab'
import { isEqualHandle } from '@/utils/is-equal-handle'
import { genId } from '@/utils/random'

export default function NavChange () {
  const id = Number(useParams().id)
  const info = useRequest(NavInfoApi, { manual: true })
  const { t } = useTranslation('online', { keyPrefix: 'nav' })
  const [form] = Form.useForm()
  const [isChange, setIsChange] = useState(false)
  const update = useRequest(NavUpdateApi, { manual: true })
  const create = useRequest(NavCreateApi, { manual: true })
  const init = useRef()
  const nav = useNav()

  const onOk = async () => {
    await form.validateFields()
    const values = form.getFieldsValue()
    if (id) {
      await update.runAsync({ ...info.data, ...values, id })
      sMessage.success(t('更新成功'))
      const res = await info.refreshAsync()
      form.setFieldsValue(res)
      onValuesChange(true)
    } else {
      const ret = await create.runAsync({ ...values, handle: genId().toString() })
      sMessage.success(t('添加成功'))
      nav(`/online/nav_list/change/${ret.id}`)
    }
    setIsChange(false)
  }

  // @ts-expect-error
  const formatLink = (links: NavItemType[]) => {
    return links.map(item => {
      const { links, url, id, title } = item
      return {
        id,
        title,
        url,
        links: links && links.length > 0 ? formatLink(links) : []
      }
    })
  }

  const onValuesChange = (force?: boolean) => {
    const values = cloneDeep(form.getFieldsValue(true))
    if (!init.current || force === true) {
      init.current = cloneDeep(values)
      return
    }
    values.links = values.links?.length ? formatLink(values.links) : values.links
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
      title={id ? t('菜单导航') : t('添加菜单导航')}
      onCancel={onCancel}
      loading={info.loading}
      width={750}
      isChange={isChange}
      onOk={onOk}
      back={'/online/nav_list'}
    >
      <Form onValuesChange={onValuesChange} form={form}>
        <Card title={t('导航名称')}>
          <Form.Item
            required={false}
            rules={[{ required: true, message: t('请输入导航名称') }]}
            name={'title'}
          >
            <Input />
          </Form.Item>
        </Card>

        <Form.Item
          required={false}
          rules={[{ required: true, message: t('请添加菜单项') }]}
          className={'mb0'} name={'links'}
        >
          <Grab />
        </Form.Item>
      </Form>
    </Page>
  )
}
