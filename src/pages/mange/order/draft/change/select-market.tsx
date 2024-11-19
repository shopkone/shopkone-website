import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IconCheck } from '@tabler/icons-react'
import { useMemoizedFn } from 'ahooks'
import { Flex, Radio } from 'antd'
import classNames from 'classnames'

import { useCountries } from '@/api/base/countries'
import { MarketListRes } from '@/api/market/list'
import SModal from '@/components/s-modal'
import SRender from '@/components/s-render'
import { UseOpenType } from '@/hooks/useOpen'

import styles from './index.module.less'

export interface SelectMarketProps {
  openInfo: UseOpenType<string>
  options: MarketListRes[]
  selectedCountry: string
  onConfirm: (code: string) => void
}

export default function SelectMarket (props: SelectMarketProps) {
  const { openInfo, options, selectedCountry } = props
  const { t } = useTranslation('orders', { keyPrefix: 'drafts' })
  const [value, setValue] = useState<string>()
  const countries = useCountries()

  const getName = useMemoizedFn((code: string) => {
    const country = countries?.data?.find(c => c.code === code)
    return country?.name || '--'
  })

  const onOk = () => {
    if (!value) return
    openInfo.close()
    props.onConfirm(value)
  }

  useEffect(() => {
    if (!openInfo.open) return
    setValue(selectedCountry)
  }, [openInfo.open])

  return (
    <SModal
      onOk={onOk}
      loading={countries.loading}
      title={t('更换市场')}
      open={openInfo.open}
      onCancel={openInfo.close}
    >
      <Flex vertical gap={8} style={{ padding: '16px 4px', overflowY: 'auto', height: 500 }}>
        {
          options?.map((item, index) => (
            <div key={item.name}>
              <SRender render={index}>
                <div className={styles.line} />
              </SRender>
              <div className={styles.title}>{item.name}</div>
              <Flex vertical>
                {
                  item.country_codes?.map(code => (
                    <Flex
                      gap={8}
                      className={classNames(styles.item, { [styles.selected]: code === value })}
                      key={code}
                      align={'center'}
                      onClick={() => { setValue(code) }}
                    >
                      <SRender className={styles.selectedIcon} style={{ marginRight: 10 }} render={code === value}>
                        <IconCheck strokeWidth={3} color={'var(--color-primary)'} size={14} />
                      </SRender>
                      <SRender render={code !== value}>
                        <Radio />
                      </SRender>
                      {getName(code)}
                    </Flex>
                  ))
                }
              </Flex>
            </div>
          ))
        }
      </Flex>
    </SModal>
  )
}
