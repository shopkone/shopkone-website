import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { Card, Flex, Form, Input, Radio } from 'antd'

import { CreateProductCollectionApi } from '@/api/collection/create'
import { ProductCollectionInfoApi } from '@/api/collection/info'
import { ProductCollectionUpdateApi } from '@/api/collection/update'
import Page from '@/components/page'
import { sMessage } from '@/components/s-message'
import SRender from '@/components/s-render'
import Seo from '@/components/seo'
import Conditions from '@/pages/mange/product/collections/change/conditions'
import Products from '@/pages/mange/product/collections/change/products'
import Uploader from '@/pages/mange/product/collections/change/uploader'
import { isEqualHandle } from '@/utils/is-equal-handle'
import { genId } from '@/utils/random'

export enum CollectionType {
  Manual = 1,
  Auto = 2
}

export enum MatchModeType {
  All = 1,
  Any = 2
}

const INIT_VALUES = {
  collection_type: CollectionType.Manual,
  match_mode: MatchModeType.All,
  seo: {
    page_title: '',
    meta_description: '',
    url_handle: '',
    follow: true
  }
}

export default function Change () {
  const [form] = Form.useForm()
  const create = useRequest(CreateProductCollectionApi, { manual: true })
  const info = useRequest(ProductCollectionInfoApi, { manual: true })
  const update = useRequest(ProductCollectionUpdateApi, { manual: true })
  const type: CollectionType = Form.useWatch('collection_type', form)
  const [isChange, setIsChange] = useState(false)
  const init = useRef<any>()
  const { id } = useParams()
  const nav = useNavigate()

  const onValuesChange = () => {
    const values = form.getFieldsValue()
    if (!init.current?.seo) {
      init.current = values
    }
    if (id && !init.current?.title) {
      init.current = values
    }
    if (init.current?.seo) {
      init.current.seo.id = 0
    }
    if (values.seo) {
      values.seo.id = 0
    }
    const isChange = !isEqualHandle(init.current, values)
    setIsChange(isChange)
  }

  const onReset = () => {
    form.setFieldsValue(init.current)
    setIsChange(false)
  }

  const onOk = async () => {
    const values = form.getFieldsValue()
    const conditions = values?.conditions?.map?.((item: any) => item?.item)
    if (!id) {
      const ret = await create.runAsync({ ...values, conditions })
      init.current = null
      nav(`/products/collections/change/${ret.id}`)
      sMessage.success('Collection created!')
      setIsChange(false)
    } else {
      await update.runAsync({ ...values, id: Number(id), conditions })
      init.current = null
      sMessage.success('Collection updated')
      info.refresh()
      setIsChange(false)
    }
  }

  useEffect(() => {
    if (type === CollectionType.Auto) {
      if (!form.getFieldValue('conditions')?.length) {
        form.setFieldValue('conditions', [
          { item: { id: genId(), action: 'eq', value: undefined, key: 'tag' } }
        ])
      }
      if (!form.getFieldValue('match_mode')) {
        form.setFieldValue('match_mode', MatchModeType.All)
      }
      const ids = info.data?.collection_type === CollectionType.Auto ? info?.data?.product_ids : []
      console.log({ ids })
      form.setFieldValue('product_ids', ids || [])
    }
    if (type === CollectionType.Manual) {
      console.log(123)
      const ids = info.data?.collection_type === CollectionType.Manual ? info?.data?.product_ids : []
      form.setFieldValue('product_ids', ids || [])
    }
  }, [type])

  useEffect(() => {
    if (!id) return
    info.runAsync({ id: Number(id) })
  }, [id])

  useEffect(() => {
    if (info.data) {
      const conditions = info.data?.conditions?.map?.((item: any) => ({ item }))
      form.setFieldsValue({ ...info.data, conditions })
      onValuesChange()
    }
  }, [info.data])

  return (
    <Page
      loading={create.loading || info.loading}
      onOk={onOk}
      onCancel={onReset}
      isChange={isChange}
      back={'/products/collections'}
      width={950}
      title={id ? 'Edit collection' : 'Create collection'}
    >
      <Form onValuesChange={onValuesChange} initialValues={INIT_VALUES} form={form} layout={'vertical'}>
        <Flex gap={16}>
          <Flex vertical flex={1} gap={16}>
            <Card className={'fit-width'}>
              <Form.Item name={'title'} label={'Title'}>
                <Input placeholder={'e.g. Summer collection, Under $100, Staff picks'} autoComplete={'off'} />
              </Form.Item>
              <Form.Item name={'description'} className={'mb0'} label={'Description'}>
                <Input.TextArea autoSize={{ minRows: 12 }} />
              </Form.Item>
            </Card>
            <Card title={'Collection type'} className={'fit-width'}>
              <Form.Item className={'mb0'} name={'collection_type'}>
                <Radio.Group options={[{ label: 'Manual', value: CollectionType.Manual }]} />
              </Form.Item>
              <div style={{ marginBottom: 4, marginLeft: 26, marginTop: -4 }} className={'tips'}>Add products to this collection one by one.</div>
              <Form.Item className={'mb0'} name={'collection_type'}>
                <Radio.Group options={[{ label: 'Automated', value: CollectionType.Auto }]} />
              </Form.Item>
              <div style={{ marginLeft: 26, marginTop: -4 }} className={'tips'}>
                Existing and future products that match the conditions you set will automatically be added to this collection.
              </div>
            </Card>

            <SRender render={type === CollectionType.Auto}>
              <Conditions />
            </SRender>

            <Form.Item className={'mb0'} name={'product_ids'}>
              <Products />
            </Form.Item>
          </Flex>
          <Flex vertical gap={16} style={{ width: 300 }}>
            <Form.Item className={'mb0'} name={'cover_id'}>
              <Uploader />
            </Form.Item>
            <Form.Item className={'mb0'} name={'seo'}>
              <Seo height />
            </Form.Item>
          </Flex>
        </Flex>
      </Form>

    </Page>
  )
}
