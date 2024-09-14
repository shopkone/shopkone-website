import { useEffect, useRef } from 'react'
import { Checkbox, Form, Input } from 'antd'

import styles from '@/components/seo/index.module.less'

export interface SeoType {
  page_title: string
  meta_description: string
  url_handle: string
  follow: boolean
}

export interface EditProps {
  seo?: SeoType
  title?: string
  description?: string
  onChange?: (seo: SeoType) => void
}

export default function Edit (props: EditProps) {
  const {
    seo,
    title,
    description
  } = props
  const [seoForm] = Form.useForm()
  const textRef = useRef<HTMLSpanElement>(null)
  const onFocus = () => {
    textRef.current?.focus()
  }

  const follow = Form.useWatch('follow', seoForm)

  useEffect(() => {
    seoForm.setFieldsValue(seo)
  }, [seo])

  useEffect(() => {
    if (follow) {
      seoForm.setFieldsValue({
        page_title: title,
        meta_description: description
      })
    }
  }, [follow])

  return (
    <Form
      onValuesChange={() => {
        props.onChange?.(seoForm.getFieldsValue())
      }}
      form={seoForm} layout={'vertical'} style={{ paddingBottom: 16 }}
    >
      <Form.Item
        valuePropName={'checked'}
        name={'follow'}
      >
        <Checkbox>Follow product information</Checkbox>
      </Form.Item>
      <Form.Item name={'page_title'} label={'Page title'}>
        <Input.TextArea
          disabled={follow}
          autoSize={{
            minRows: 1,
            maxRows: 3
          }}
        />
      </Form.Item>
      <Form.Item name={'meta_description'} label={'Meta description'}>
        <Input.TextArea
          disabled={follow}
          autoSize={{
            minRows: 4,
            maxRows: 10
          }}
        />
      </Form.Item>
      <Form.Item name={'url_handle'} label={'URL handle'}>
        <div className={styles.input}>
          <span
            onClick={onFocus} className={'tips'} style={{
              fontSize: 13,
              wordBreak: 'break-all'
            }}
          >
            https://b3930d-c0.myshopify.com/com/com/com/com/
          </span>
          <span ref={textRef} className={styles['text-input']} contentEditable />
        </div>
      </Form.Item>
    </Form>
  )
}
