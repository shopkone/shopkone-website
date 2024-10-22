import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Checkbox, Flex, Form } from 'antd'

import Media from '@/components/media'
import SRender from '@/components/s-render'
import styles from '@/pages/mange/product/product/product-change/base-info/index.module.less'

export default function FormMedia () {
  const [select, setSelect] = useState<number[]>([])
  const form = Form.useFormInstance()
  const fileIds: number[] = form.getFieldValue('file_ids') || []
  const { t } = useTranslation('product', { keyPrefix: 'product' })

  return (
    <Form.Item
      rootClassName={styles.formItem}
      className={'mb0'}
      label={
        <>
          <SRender render={!select.length}>
            {t('商品图片/视频')}
          </SRender>
          <SRender render={!!select.length}>
            <Flex style={{ marginBottom: 4 }} className={'fit-width'} align={'center'} justify={'space-between'}>
              <Flex align={'center'} gap={7}>
                <div>
                  <Checkbox
                    checked={select.length === fileIds?.length}
                    onChange={(e) => {
                      setSelect(e.target.checked ? fileIds : [])
                    }}
                    indeterminate={select.length > 0 && select.length < fileIds?.length}
                  />
                </div>
                {t('已选文件', { count: select.length })}
              </Flex>
              <Flex>
                <Button
                  onClick={() => {
                    setSelect([])
                    form.setFieldValue('file_ids', fileIds.filter((id) => !select.includes(id)))
                  }}
                  style={{ height: 20, position: 'relative', right: -12 }}
                  danger
                  type={'text'}
                  size={'small'}
                >
                  {t('移除')}
                </Button>
              </Flex>
            </Flex>
          </SRender>
        </>
      }
      name={'file_ids'}
    >
      <Media select={select} onSelect={setSelect} />
    </Form.Item>
  )
}
