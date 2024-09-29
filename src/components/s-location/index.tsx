import { IconMapPin } from '@tabler/icons-react'
import { useMemoizedFn } from 'ahooks'
import { Flex, Tag, Typography } from 'antd'
import classNames from 'classnames'

import { useCountries } from '@/api/base/countries'
import { AddressType } from '@/api/common/address'
import { LocationListRes } from '@/api/location/list'
import SLoading from '@/components/s-loading'
import SRender from '@/components/s-render'

import styles from './index.module.less'

export interface SLocationProps {
  onClick?: (item: LocationListRes) => void
  extra?: (item: LocationListRes) => React.ReactNode
  value?: LocationListRes[]
  hideTag?: boolean
}

export default function SLocation (props: SLocationProps) {
  const { onClick, extra, value, hideTag } = props
  const countries = useCountries()

  const formatInfo = useMemoizedFn((address?: AddressType) => {
    if (!countries?.data?.length) return '-'
    const country = countries?.data?.find(item => item.code === address?.country)
    const zone = country?.zones?.find(item => item.code === address?.zone)?.name
    const format = country?.formatting
    const formatArr = format?.replaceAll('{', '').replaceAll('}', '').split('_')
    return formatArr?.map(item => item?.split(' ').map(item => {
      if (item === 'firstName') return address?.first_name
      if (item === 'lastName') return address?.last_name
      if (item === 'phone') return address?.phone?.num
      if (item === 'province') return zone
      if (item === 'country') return country?.name
      return (address as any)[item] || ''
    }).filter(i => i?.trim()).join(' ')).filter(i => i?.trim()).join(', ') || '-'
  })

  return (
    <SLoading loading={countries.loading}>
      <div className={styles.container}>
        {
          value?.map(item => (
            <Flex
              onClick={() => onClick?.(item)}
              key={item.id}
              gap={16}
              align={'center'}
              className={classNames([styles.item, { [styles['click-item']]: onClick }])}
            >
              <Flex align={'center'} justify={'center'} className={styles.mapPin}>
                <IconMapPin size={20} />
              </Flex>
              <div className={'flex1'}>
                <Flex align={'center'} gap={8} className={styles.title}>
                  <Typography.Text ellipsis={{ tooltip: true }} style={{ maxWidth: 500 }}>
                    {item?.name || '-'}
                  </Typography.Text>
                  <SRender render={!hideTag}>
                    <SRender render={item.default}>
                      <Tag style={{ background: '#3370ff30', color: '#3370ff', borderColor: '#3370ff30', borderRadius: 8, marginLeft: 12 }}>
                        Default
                      </Tag>
                    </SRender>
                    <SRender render={item.active ? !item.default : null}>
                      <Tag style={{ background: '#32a64530', color: '#32a645', borderColor: '#32a64530', borderRadius: 8 }}>
                        Active
                      </Tag>
                    </SRender>
                    <SRender render={!item.active}>
                      <Tag style={{ background: '#646A7330', color: '#646A73', borderColor: '#646A7330', borderRadius: 8 }}>
                        Inactive
                      </Tag>
                    </SRender>
                  </SRender>
                </Flex>
                <Typography.Text ellipsis={{ tooltip: true }} style={{ width: 500 }}>
                  {formatInfo(item.address)}
                </Typography.Text>
              </div>
              {extra?.(item)}
            </Flex>
          ))
        }
      </div>
    </SLoading>
  )
}
