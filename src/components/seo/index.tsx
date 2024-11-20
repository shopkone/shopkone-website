import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IconDots } from '@tabler/icons-react'
import { Button, Flex, Form, Popover, Typography } from 'antd'
import { useWatch } from 'antd/es/form/Form'

import SCard from '@/components/s-card'
import Edit, { SeoType } from '@/components/seo/edit'
import { useManageState } from '@/pages/mange/state'

import styles from './index.module.less'

export interface SeoProps {
  value?: SeoType
  onChange?: (seo?: SeoType) => void
  height?: boolean
}

export default function Seo (props: SeoProps) {
  const {
    value,
    onChange,
    height
  } = props
  const [editing, setEditing] = useState(false)

  const { t } = useTranslation('common', { keyPrefix: 'seo' })

  const mange = useManageState()

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
    <SCard
      style={{ height: !height ? undefined : (editing ? 413 : 160) }}
      className={'fit-height'}
      title={t('SEO')}
      extra={
        <Flex>
          {
            editing
              ? (
                <Button
                  onClick={() => {
                    setEditing(!editing)
                    onChange?.(tempSeoRef.current)
                  }}
                  size={'small'}
                  type={'text'}
                >
                  <div>{t('取消')}</div>
                </Button>
                )
              : null
          }
          <Button
            onClick={() => {
              tempSeoRef.current = value
              setEditing(!editing)
            }}
            size={'small'}
            type={'text'}
          >
            {
              editing
                ? (
                  <div style={{ color: '#3478f5' }}>{t('完成')}</div>
                  )
                : (
                  <div>{t('编辑')}</div>
                  )
            }
          </Button>
          <Popover
            placement={'bottom'}
            overlayInnerStyle={{ minWidth: 'unset' }}
            content={
              <Flex vertical gap={4}>
                <Button type={'link'} style={{ textAlign: 'left', paddingLeft: 0 }}>
                  {t('查看收录')}
                </Button>
                <Button style={{ textAlign: 'left', paddingLeft: 0 }} type={'link'}>
                  {t('手动提交')}
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
              <IconDots size={16} />
            </Button>
          </Popover>
        </Flex>
      }
    >
      {
        editing
          ? (
            <Edit
              onChange={(seo) => {
                onChange?.(seo)
              }}
              seo={value}
              title={title}
              description={description}
            />
            )
          : (
            <Flex vertical>
              <div className={styles.name}>{mange?.shopInfo?.store_name}</div>
              <Typography.Text ellipsis={{ tooltip: true }} className={styles.link}>
                https://b3930d-c0.myshopify.com
              </Typography.Text>
              <Typography.Text ellipsis={{ tooltip: true }} className={styles.title}>
                {value?.page_title || '-'}
              </Typography.Text>
              <Typography.Text ellipsis={{ tooltip: true }} className={styles.desc}>
                {value?.meta_description || '-'}
              </Typography.Text>
            </Flex>
            )
      }
    </SCard>
  )
}
