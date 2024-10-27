import { IconMapPin } from '@tabler/icons-react'
import { Flex, Typography } from 'antd'
import classNames from 'classnames'

import { useCountries } from '@/api/base/countries'
import { LocationListRes } from '@/api/location/list'
import SLoading from '@/components/s-loading'
import SRender from '@/components/s-render'
import Status from '@/components/status'
import { formatInfo } from '@/utils/format'

import styles from './index.module.less'

export interface SLocationProps {
  onClick?: (item: LocationListRes) => void
  extra?: (item: LocationListRes, index: number) => React.ReactNode
  value?: LocationListRes[]
  hideTag?: boolean
  hideLogo?: boolean
  style?: (item: LocationListRes, index: number) => React.CSSProperties
  prefix?: (item: LocationListRes, index: number) => React.ReactNode
  hideLoading?: boolean
}

export default function SLocation (props: SLocationProps) {
  const { onClick, extra, value, hideTag, hideLogo, style, prefix, hideLoading } = props
  const countries = useCountries()

  return (
    <SLoading loading={countries.loading ? !hideLoading : false}>
      <div className={styles.container}>
        {
          value?.map((item, index) => (
            <Flex
              onClick={() => onClick?.(item)}
              key={item.id}
              gap={16}
              align={'center'}
              className={classNames([styles.item, { [styles['click-item']]: onClick }])}
              style={style?.(item, index)}
            >
              {prefix?.(item, index)}
              <SRender render={!hideLogo}>
                <Flex align={'center'} justify={'center'} className={styles.mapPin}>
                  <IconMapPin size={20} />
                </Flex>
              </SRender>
              <div className={'flex1'}>
                <Flex align={'center'} gap={8} className={styles.title}>
                  <Typography.Text ellipsis={{ tooltip: true }} style={{ maxWidth: 500 }}>
                    {item?.name || '-'}
                  </Typography.Text>
                  <SRender render={!hideTag}>
                    <SRender render={item.default}>
                      <Status type={'info'}>
                        Default
                      </Status>
                    </SRender>
                    <SRender render={item.active ? !item.default : null}>
                      <Status type={'success'}>
                        Active
                      </Status>
                    </SRender>
                    <SRender render={!item.active}>
                      <Status>
                        Inactive
                      </Status>
                    </SRender>
                  </SRender>
                </Flex>
                <Typography.Text ellipsis={{ tooltip: true }} style={{ width: 500 }}>
                  {formatInfo(countries, item.address)}
                </Typography.Text>
              </div>
              {extra?.(item, index)}
            </Flex>
          ))
        }
      </div>
    </SLoading>
  )
}
