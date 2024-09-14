import { useEffect, useRef, useState } from 'react'
import { More, Share } from '@icon-park/react'
import { Button, Card, Flex, Form, Popover, Typography } from 'antd'
import { useWatch } from 'antd/es/form/Form'

import Edit, { SeoType } from '@/components/seo/edit'

import styles from './index.module.less'

export interface SeoProps {
  value?: SeoType
  onChange?: (seo: SeoType) => void
}

export default function Seo (props: SeoProps) {
  const {
    value,
    onChange
  } = props
  const [editing, setEditing] = useState(false)

  const tempSeoRef = useRef<SeoType>()

  const form = Form.useFormInstance()
  const title = Form.useWatch('title', form)
  const description = useWatch('description', form)

  useEffect(() => {
    if (editing) return
    if (!value || value.follow) {
      const s: SeoType = {
        page_title: title,
        meta_description: description,
        url_handle: '',
        follow: true
      }
      onChange?.(s)
    }
  }, [title, description, editing])

  return (
    <Card
      title={'SEO'}
      extra={
        <Flex>
          {
            editing
              ? (
                <Button
                  onClick={() => {
                    setEditing(!editing)
                    tempSeoRef.current = undefined
                  }}
                  size={'small'}
                  type={'text'}
                >
                  <div style={{ color: '#646a73' }}>Cancel</div>
                </Button>
                )
              : null
          }
          <Button
            onClick={() => {
              if (editing && tempSeoRef.current) {
                onChange?.(tempSeoRef.current)
              }
              tempSeoRef.current = undefined
              setEditing(!editing)
            }}
            size={'small'}
            type={'text'}
          >
            {
              editing
                ? (
                  <div style={{ color: '#3370ff' }}>Done</div>
                  )
                : (
                  <div style={{ color: '#646a73' }}>Edit</div>
                  )
            }
          </Button>
          {
            editing
              ? null
              : (
                <Popover
                  placement={'bottom'}
                  overlayInnerStyle={{ minWidth: 'unset' }}
                  content={
                    <Flex vertical gap={4}>
                      <Button type={'text'} size={'small'}>
                        <Flex align={'center'} style={{ color: '#646a73' }} gap={8}>
                          <div>Check Google indexing</div>
                          <Share
                            strokeWidth={5} style={{
                              position: 'relative',
                              top: 2
                            }}
                          />
                        </Flex>
                      </Button>
                      <Button type={'text'} size={'small'}>
                        <Flex align={'center'} style={{ color: '#646a73' }} gap={8}>
                          <div>Submit for indexing</div>
                          <Share
                            strokeWidth={5} style={{
                              position: 'relative',
                              top: 2
                            }}
                          />
                        </Flex>
                      </Button>
                    </Flex>
                  }
                  trigger={'click'}
                >
                  <Button
                    style={{
                      position: 'relative',
                      right: -4
                    }}
                    size={'small'}
                    type={'text'}
                  >
                    <More size={16} strokeWidth={6} fill={'#646a73'} />
                  </Button>
                </Popover>
                )
          }
        </Flex>
      }
    >
      {
        editing
          ? (
            <Edit
              onChange={(seo) => {
                tempSeoRef.current = seo
              }}
              seo={value}
              title={title}
              description={description}
            />
            )
          : (
            <Flex vertical>
              <div className={styles.name}>我的店铺</div>
              <Typography.Text ellipsis={{ tooltip: true }} className={styles.link}>
                https://b3930d-c0.myshopify.com
              </Typography.Text>
              <Typography.Text ellipsis={{ tooltip: true }} className={styles.title}>
                {value?.page_title}
              </Typography.Text>
              <Typography.Text ellipsis={{ tooltip: true }} className={styles.desc}>
                {value?.meta_description}
              </Typography.Text>
            </Flex>
            )
      }
    </Card>
  )
}
