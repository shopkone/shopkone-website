import { Button, Card, Empty, Flex, Form, Input, Radio } from 'antd'

import Page from '@/components/page'
import SRender from '@/components/s-render'
import Seo from '@/components/seo'
import Conditions from '@/pages/mange/product/collections/change/conditions'

import styles from './index.module.less'

const INIT_VALUES = {
  collection_type: 'manual',
  match_mode: 'all'
}

export default function Change () {
  const [form] = Form.useForm()

  const collection_type: string = Form.useWatch('collection_type', form)

  return (
    <Page isChange={true} back={'/products/collections'} width={950} title={'Create collection'}>
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
                <Radio.Group options={[{
                  label: 'Manual',
                  value: 'manual'
                }]}
                />
              </Form.Item>
              <div style={{ marginBottom: 4, marginLeft: 26, marginTop: -4 }} className={'tips'}>Add products to this collection one by one.</div>
              <Form.Item className={'mb0'} name={'collection_type'}>
                <Radio.Group options={[{ label: 'Automated', value: 'automated' }]} />
              </Form.Item>
              <div style={{ marginLeft: 26, marginTop: -4 }} className={'tips'}>
                Existing and future products that match the conditions you set will automatically be added to this collection.
              </div>
            </Card>
            <SRender render={collection_type === 'automated'}>
              <Conditions />
            </SRender>
            <Card title={'Products'} className={'fit-width'}>
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                style={{ padding: '32px 0' }}
                description={(
                  <Flex style={{ marginTop: 16 }} vertical gap={12}>
                    <div className={'tips'}>
                      There are no products in this collection.
                    </div>
                    <div>
                      <Button>
                        Select products
                      </Button>
                    </div>
                  </Flex>
              )}
              />
            </Card>
          </Flex>
          <Flex vertical gap={16} style={{ width: 300 }}>
            <Card title={'Image'} className={'fit-width'}>
              <Flex align={'center'} justify={'center'} vertical gap={8} className={styles.cover}>
                <Button>Add image</Button>
                <div className={'tips'}>or drop an image to upload</div>
              </Flex>
            </Card>
            <Seo />
          </Flex>
        </Flex>
      </Form>
    </Page>
  )
}
