import { useTranslation } from 'react-i18next'
import { IconTrash } from '@tabler/icons-react'
import { Button, Flex, Form } from 'antd'

import IconButton from '@/components/icon-button'
import SInputNumber from '@/components/s-input-number'
import SRender from '@/components/s-render'

import styles from './index.module.less'

export interface FeesProps {
  value?: Array<{ condition?: number, fee?: number, id: number }>
  onChange?: (value: FeesProps['value']) => void
}

export default function Fees (props: FeesProps) {
  const { value = [], onChange } = props
  const { t } = useTranslation('settings', { keyPrefix: 'shipping' })

  const onAddItem = () => {
    onChange?.([...(value || []), { id: Date.now(), fee: 0 }])
  }

  const onRemoveItem = (id: number) => {
    onChange?.(value?.filter(item => item.id !== id))
  }

  const onChangeHandle = (id: number, key: 'fee' | 'condition', v?: number) => {
    const newItems = value?.map(item => item.id === id ? { ...item, [key]: v } : item)
    onChange?.(newItems)
  }

  return (
    <div>
      {
        value?.map((item, index) => (
          <Flex align={'center'} key={item.id} className={'fit-width'} gap={16}>
            <Form.Item label={!index ? t('最低订单价格') : t('当订单达到以下价格时')} className={'fit-width'}>
              <SInputNumber value={item.condition} onChange={(v) => { onChangeHandle(item.id, 'condition', v) }} money />
              <SRender render={index !== 0 && Number(item.condition) <= Number(value[index - 1]?.condition)}>
                <div className={styles.err}>
                  价格需要大于 {value[index - 1]?.condition || 0}
                </div>
              </SRender>
            </Form.Item>
            <Form.Item label={t('配送费用')} className={'fit-width'}>
              <SInputNumber value={item.fee} onChange={(v) => { onChangeHandle(item.id, 'fee', v) }} money />
            </Form.Item>
            <SRender render={value.length !== 1}>
              <div style={{ marginTop: 6 }}>
                <IconButton
                  onClick={() => {
                    onRemoveItem(item.id)
                  }} size={24} type={'text'}
                >
                  <IconTrash size={15} />
                </IconButton>
              </div>
            </SRender>
          </Flex>
        ))
      }
      <SRender render={value?.length !== 4}>
        <Button
          onClick={onAddItem}
          style={{
            position: 'relative',
            top: -12,
            left: -6,
            marginBottom: 4
          }}
          type={'link'}
          size={'small'}
        >
          添加条件
        </Button>
      </SRender>
    </div>
  )
}
