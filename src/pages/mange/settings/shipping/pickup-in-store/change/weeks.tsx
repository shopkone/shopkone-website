import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { IconTrash } from '@tabler/icons-react'
import { Button, Flex, Form, Radio } from 'antd'

import { BaseInStorePickUpBusinessHours } from '@/api/in-store-pickup/info'
import IconButton from '@/components/icon-button'
import SRender from '@/components/s-render'
import SSelect from '@/components/s-select'
import { getTimeOptions } from '@/pages/mange/settings/shipping/pickup-in-store/change/time-options'

import styles from './index.module.less'

export interface WeeksProps {
  value?: BaseInStorePickUpBusinessHours[]
  onChange?: (value: WeeksProps['value']) => void
  err: Array<string | undefined>
  setErr: (err: Array<string | undefined>) => void
}

export default function Weeks (props: WeeksProps) {
  const { value, onChange, err, setErr } = props
  const { t } = useTranslation('settings', { keyPrefix: 'shipping' })
  const form = Form.useFormInstance()
  const is_unified = Form.useWatch('is_unified', form)

  const onSetOpen = (id: number) => {
    onChange?.(value?.map(i => i.id === id ? { ...i, is_open: true } : i))
  }

  const onSetClose = (id: number) => {
    onChange?.(value?.map(i => i.id === id ? { ...i, is_open: false } : i))
  }

  const onUpdate = (id: number, v: number, type: 'start' | 'end') => {
    onChange?.(value?.map(i => i.id === id ? { ...i, [type]: v } : i))
  }

  const WeekdayOptions = [
    { label: t('星期一'), value: 0 },
    { label: t('星期二'), value: 1 },
    { label: t('星期三'), value: 2 },
    { label: t('星期四'), value: 3 },
    { label: t('星期五'), value: 4 },
    { label: t('星期六'), value: 5 },
    { label: t('星期日'), value: 6 }
  ]

  const business = value?.filter(i => i.is_open)
  const relexed = value?.filter(i => !i.is_open)

  useEffect(() => {
    const weekErr = value?.map(week => {
      const start = week.start
      const end = week.end
      if (!week.is_open) return undefined
      if (start > end) {
        return t('结束时间不能小于开始时间')
      }
      return undefined
    })
    setErr(weekErr || [])
  }, [value])

  return (
    <div>
      <div>{t('营业时间')}</div>
      <Form.Item name={'is_unified'} className={'mb0'}>
        <Radio.Group options={[{ label: t('统一时间'), value: true }]} />
      </Form.Item>
      <SRender render={is_unified}>
        <Flex gap={12} align={'center'} style={{ width: 370, marginLeft: 20 }}>
          <Form.Item className={'mb0 flex1'} name={'start'}>
            <SSelect onChange={async () => await form.validateFields(['end', 'start'], { recursive: true })} options={getTimeOptions()} />
          </Form.Item>
          <div>-</div>
          <Form.Item
            rules={[{
              validator: async (rule, value) => {
                if (value <= form.getFieldValue('start')) {
                  await Promise.reject(t('结束时间不能小于开始时间'))
                }
              }
            }]}
            className={'mb0 flex1'} name={'end'}
          >
            <SSelect options={getTimeOptions()} />
          </Form.Item>
        </Flex>
      </SRender>
      <Form.Item name={'is_unified'} style={{ marginBottom: 8, marginTop: 8 }}>
        <Radio.Group options={[{ label: t('按天设置时间'), value: false }]} />
      </Form.Item>
      <SRender render={!is_unified}>
        <Flex gap={16} vertical style={{ marginLeft: 24 }}>
          <SRender render={business?.length}>{t('营业')}</SRender>
          {
            business?.map(week => (
              <Flex gap={16} align={'center'} key={week.id}>
                <div>
                  {WeekdayOptions?.find(item => (week.week === item.value))?.label}
                </div>
                <Flex gap={12} align={'center'} style={{ width: 310 }}>
                  <SSelect onChange={v => { onUpdate(week.id, v, 'start') }} value={week.start} options={getTimeOptions()} />
                  <div>-</div>
                  <div className={'fit-width'}>
                    <SSelect onChange={v => { onUpdate(week.id, v, 'end') }} value={week.end} options={getTimeOptions()} />
                    <div className={styles.err}>
                      {err[week.week]}
                    </div>
                  </div>
                </Flex>
                <IconButton onClick={() => { onSetClose(week.id) }} size={24} type={'text'}>
                  <IconTrash size={14} />
                </IconButton>
              </Flex>
            ))
          }
          <SRender render={relexed?.length}>{t('休息')}</SRender>
          {
            relexed?.map(week => (
              <Flex gap={16} align={'center'} key={week.id}>
                <div>{WeekdayOptions?.find(item => (week.week === item.value))?.label}</div>
                <Button onClick={() => { onSetOpen(week.id) }}>{t('设为营业')}</Button>
              </Flex>
            ))
          }
        </Flex>
      </SRender>
    </div>
  )
}
