import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { IconCirclePlus } from '@tabler/icons-react'
import { useDebounceFn } from 'ahooks'
import { Button, Form } from 'antd'

import SCard from '@/components/s-card'
import SRender from '@/components/s-render'
import OptionItem, {
  OptionValue
} from '@/pages/mange/product/product/product-change/variant-set/variant-options/option-item'
import { genId } from '@/utils/random'

import * as worker from '../worker'

import styles from './index.module.less'

export default function VariantOptions () {
  const { t } = useTranslation('product', { keyPrefix: 'product' })
  const form = Form.useFormInstance()
  const options = Form.useWatch('product_options', form) || []

  const onChangeHandle = (option: OptionValue) => {
  }

  const onAddHandle = () => {
    form.setFieldValue?.('product_options', [...options, { label: '', values: [''], id: genId() }])
  }

  const toList = useDebounceFn(() => {
    const variants = form.getFieldValue('variants')
    form.validateFields().then(res => {
      worker.toListWorker.postMessage({ options, variants })
    }).catch(err => {
    })
  }, { wait: 500 })

  useEffect(() => {
    form.setFieldValue?.('product_options', [{ label: '', values: [''], id: genId() }])
  }, [])

  useEffect(() => {
    toList.run()
  }, [options])

  return (
    <SCard title={t('款式选项')} styles={{ body: { padding: 0, paddingTop: 16 } }}>
      <Form.List name={'product_options'}>
        {
          (fields, { add, remove }) => (
            <div>
              {
                fields.map(field => (
                  <OptionItem
                    length={fields.length}
                    onRemove={() => { remove(field.name) }}
                    name={field.name}
                    key={field.name}
                  />
                ))
              }
            </div>
          )
        }
      </Form.List>
      <SRender render={options.length < 3}>
        <div style={{ paddingLeft: 12, paddingBottom: 12, marginTop: 12 }}>
          <Button className={styles.btn} onClick={onAddHandle}>
            <IconCirclePlus size={14} />
            {t('添加其它选项')}
          </Button>
        </div>
      </SRender>
    </SCard>
  )
}
