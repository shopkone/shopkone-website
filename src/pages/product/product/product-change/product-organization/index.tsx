import { Button, Card, Checkbox, Form, Input } from 'antd'

import styles from './index.module.less'

export default function ProductOrganization () {
  return (
    <Card title={'Product organization'}>
      <Form.Item style={{ marginBottom: 8 }}>
        <Checkbox>Requires shipping</Checkbox>
      </Form.Item>
      <Form.Item>
        <Checkbox>Charge tax on this product</Checkbox>
      </Form.Item>
      <div className={styles.line} />
      <Form.Item label={'Category'}>
        <div className={'tips'}>No categories have been created ye.</div>
        <Button className={'primary-text'} style={{ marginLeft: -6 }} type={'text'} size={'small'}>
          Create category
        </Button>
      </Form.Item>
      <div className={styles.line} />
      <Form.Item label={'Spu'}>
        <Input />
      </Form.Item>
      <Form.Item label={'Vendor'}>
        <Input />
      </Form.Item>
      <Form.Item label={'Collections'}>
        <Input />
      </Form.Item>
      <Form.Item className={'mb0'} label={'Tags'}>
        <Input />
      </Form.Item>
    </Card>
  )
}
