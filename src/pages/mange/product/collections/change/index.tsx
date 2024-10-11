import { useEffect, useState } from 'react'
import { useRequest } from 'ahooks'
import { Card, Flex, Form, Input, Radio } from 'antd'

import { CreateProductCollectionApi } from '@/api/product/collection'
import Page from '@/components/page'
import SRender from '@/components/s-render'
import Seo from '@/components/seo'
import Conditions from '@/pages/mange/product/collections/change/conditions'
import Products from '@/pages/mange/product/collections/change/products'
import Uploader from '@/pages/mange/product/collections/change/uploader'
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
  match_mode: MatchModeType.All
}

export default function Change () {
  const [form] = Form.useForm()
  const create = useRequest(CreateProductCollectionApi, { manual: true })
  const type: CollectionType = Form.useWatch('collection_type', form)
  const [isChange, setIsChange] = useState(false)

  useEffect(() => {
    if (type === CollectionType.Auto) {
      form.setFieldValue('conditions', [
        { item: { id: genId(), action: 'eq', value: undefined, key: 'tag' } }
      ])
    }
  }, [type])

  return (
    <Page isChange={isChange} back={'/products/collections'} width={950} title={'Create collection'}>
      <Form initialValues={INIT_VALUES} form={form} layout={'vertical'}>
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
            <Seo height />
          </Flex>
        </Flex>
      </Form>

    </Page>
  )
}
