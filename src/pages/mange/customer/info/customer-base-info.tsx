import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { IconCake, IconMail, IconPhone, IconUser, IconWorld } from '@tabler/icons-react'
import { Flex } from 'antd'
import dayjs from 'dayjs'

import { useLanguageList } from '@/api/base/languages'
import { GenderType } from '@/api/customer/create'
import { CustomerInfoRes } from '@/api/customer/info'
import SLoading from '@/components/s-loading'
import SRender from '@/components/s-render'
import styles from '@/pages/mange/customer/info/index.module.less'
import { formatPhone } from '@/utils/format'

export interface CustomerBaseInfoProps {
  info?: CustomerInfoRes
}

export default function CustomerBaseInfo (props: CustomerBaseInfoProps) {
  const { info } = props
  const { t } = useTranslation('customers', { keyPrefix: 'info' })
  const languages = useLanguageList()

  const genderColor = useMemo(() => {
    if (info?.gender === GenderType.Female) {
      return '#FF69B4'
    } else if (info?.gender === GenderType.Male) {
      return '#1E90FF'
    } else {
      return undefined
    }
  }, [info?.gender])

  const name = [info?.first_name, info?.last_name].filter(Boolean).join(' ')

  if (!info) return <SLoading />

  return (
    <Flex style={{ marginTop: 4 }} vertical gap={12}>
      <Flex align={'center'} className={styles.icon} gap={8}>
        <IconUser
          size={15}
          color={genderColor}
        />
        <div className={'main-text'}>{name}</div>
      </Flex>
      <Flex align={'center'} className={styles.icon} gap={8}>
        <IconMail size={14} />
        {info?.email
          ? (
            <div className={'main-text'}>{info?.email}</div>
            )
          : t('暂无信息')}
      </Flex>
      <Flex align={'center'} className={styles.icon} gap={8}>
        <IconPhone size={14} />
        {info?.phone?.num
          ? (
            <div className={'main-text'}>
              {formatPhone(info?.phone)}
            </div>
            )
          : t('暂无信息')}
      </Flex>

      <SRender render={info?.birthday}>
        <Flex align={'center'} className={styles.icon} gap={8}>
          <IconCake size={14} />
          <div className={'main-text'}>{dayjs.unix(info?.birthday || 0)?.format('YYYY-MM-DD')}</div>
        </Flex>
      </SRender>

      <SRender render={info?.language}>
        <SLoading loading={!languages?.data}>
          <Flex align={'center'} className={styles.icon} gap={8}>
            <IconWorld size={14} />
            <div className={'main-text'}>
              {languages?.data?.find(l => l.value === info?.language)?.label}
            </div>
          </Flex>
        </SLoading>
      </SRender>
    </Flex>
  )
}
