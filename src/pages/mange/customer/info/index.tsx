import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { IconMailFilled, IconPhoneFilled, IconPlus, IconUserFilled } from '@tabler/icons-react'
import { useRequest } from 'ahooks'
import { Button, Flex } from 'antd'

import { useCountries } from '@/api/base/countries'
import { CustomerFreeTax, CustomerInfoApi } from '@/api/customer/info'
import Page from '@/components/page'
import SCard from '@/components/s-card'
import SRender from '@/components/s-render'
import Status from '@/components/status'
import { useOpen } from '@/hooks/useOpen'
import NoteModal from '@/pages/mange/customer/info/note-modal'
import TagModal from '@/pages/mange/customer/info/tag-modal'
import TaxModal from '@/pages/mange/customer/info/tax-modal'
import { formatInfo } from '@/utils/format'

import styles from './index.module.less'

export default function CustomerInfo () {
  const { t } = useTranslation('customers', { keyPrefix: 'info' })
  const id = Number(useParams().id)
  const info = useRequest(CustomerInfoApi, { manual: true })
  const countries = useCountries()
  const tagOpen = useOpen<string[]>()
  const noteOpen = useOpen<string>()
  const taxOpen = useOpen<CustomerFreeTax>()

  useEffect(() => {
    if (!id) return
    info.run({ id })
  }, [id])

  const name = [info?.data?.first_name, info?.data?.last_name].filter(Boolean).join(' ')

  return (
    <Page
      back={'/customers/customers'}
      title={name}
      loadingHiddenBg
      loading={!info.data || !countries.data}
      width={950}
    >
      <Flex className={'fit-width'} gap={16}>
        <Flex vertical className={'flex1'} gap={16}>
          <SCard
            extra={
              <Button type={'link'} size={'small'}>
                {t('加入黑名单')}
              </Button>
            }
            title={
              <Flex gap={12}>
                {name}
                <Status>{t('未注册')}</Status>
              </Flex>
            }
            className={'fit-width'}
          >
            <div>{t('尚未登录过')}</div>
            <div style={{ marginTop: 8 }}>{t('2024-11-19 18:41来自:手动创建')}</div>
          </SCard>

          <SCard title={t('订单数据')} className={'fit-width'}>
            <Flex style={{ marginTop: 8 }}>
              <Flex align={'center'} vertical gap={4} className={'flex1'}>
                <div>{2} 天前</div>
                <div className={'secondary'}>{t('最近一笔订单')}</div>
              </Flex>
              <div className={styles.line} />
              <Flex align={'center'} vertical gap={4} className={'flex1'}>
                <div>12</div>
                <div className={'secondary'}>{t('总订单数')}</div>
              </Flex>
              <div className={styles.line} />
              <Flex align={'center'} vertical gap={4} className={'flex1'}>
                <div>US$ 0.58</div>
                <div className={'secondary'}>{t('总消费金额')}</div>
              </Flex>
              <div className={styles.line} />
              <Flex align={'center'} vertical gap={4} className={'flex1'}>
                <div>US$ 0.29</div>
                <div className={'secondary'}>{t('客单价')}</div>
              </Flex>
            </Flex>
          </SCard>

          <SCard title={t('最近5笔订单')} className={'fit-width'}>
            asd
          </SCard>
        </Flex>
        <Flex vertical gap={16} style={{ width: 320 }}>
          <SCard
            extra={
              <Button type={'link'} size={'small'}>
                {t('编辑')}
              </Button>
            }
            title={t('客户信息')}
            className={'fit-width'}
          >
            <Flex style={{ marginTop: 4 }} vertical gap={12}>
              <Flex align={'center'} className={styles.icon} gap={8}>
                <IconUserFilled size={15} />
                <div className={'main-text'}>{name}</div>
              </Flex>
              <Flex align={'center'} className={styles.icon} gap={8}>
                <IconMailFilled size={15} />
                {info?.data?.email
                  ? (
                    <div className={'main-text'}>{info?.data?.email}</div>
                    )
                  : t('暂无信息')}
              </Flex>
              <Flex align={'center'} className={styles.icon} gap={8}>
                <IconPhoneFilled size={15} />
                {info?.data?.phone
                  ? (
                    <div className={'main-text'}>{info?.data?.phone}</div>
                    )
                  : t('暂无信息')}
              </Flex>
            </Flex>

            <Flex className={styles.item} align={'center'} justify={'space-between'}>
              <div className={styles.title}>{t('客户地址')}</div>
              <Button style={{ marginRight: -8 }} type={'link'} size={'small'}>
                {t('管理')}
              </Button>
            </Flex>

            {
              info?.data?.address?.map(address => (
                <div key={address.id}>
                  {formatInfo(countries, address)}
                </div>
              ))
            }

            <Button style={{ marginLeft: -12, marginTop: 8 }} type={'link'} size={'small'}>
              <IconPlus size={13} />
              {t('添加收货地址')}
            </Button>

            <Flex className={styles.item} align={'center'} justify={'space-between'}>
              <div className={styles.title}>{t('订阅')}</div>
              <Button style={{ marginRight: -8 }} type={'link'} size={'small'}>
                {t('编辑')}
              </Button>
            </Flex>
            <Flex align={'center'} gap={12}>
              {t('邮件')}
              <Status>{t('未订阅')}</Status>
            </Flex>
            <Flex align={'center'} style={{ marginTop: 12 }} gap={12}>
              {t('短信')}
              <Status>{t('未订阅')}</Status>
            </Flex>
          </SCard>
          <SCard
            extra={
              <Button
                onClick={() => {
                  const country = countries.data?.find(i => i.code === info?.data?.address?.[0]?.country)
                  const area = {
                    country_code: country?.code || '',
                    zones: [],
                    is_all: !!country?.zones?.length
                  }
                  const defaultTax: CustomerFreeTax = {
                    areas: area?.country_code ? [area] : [],
                    free: !!country,
                    all: false
                  }
                  taxOpen.edit(info?.data?.tax || defaultTax)
                }}
                style={{ marginRight: -8 }}
                type={'link'}
                size={'small'}
              >
                {t('编辑')}
              </Button>
            }
            title={t('免税管理')} className={'fit-width'}
          >
            <SRender render={!info.data?.tax?.free}>
              <span style={{ color: '#aaa' }}>--</span>
            </SRender>
          </SCard>
          <SCard
            extra={
              <Button
                onClick={() => { tagOpen.edit(info?.data?.tags) }}
                style={{ marginRight: -8 }}
                type={'link'}
                size={'small'}
              >
                {t('编辑')}
              </Button>
            }
            title={t('标签')}
            className={'fit-width'}
          >
            <Flex gap={12}>
              {info.data?.tags?.map((tag) => (<Status key={tag}>{tag}</Status>))}
            </Flex>
            <SRender render={!info.data?.tags?.length}>
              <span style={{ color: '#aaa' }}>--</span>
            </SRender>
          </SCard>
          <SCard
            extra={
              <Button
                onClick={() => { noteOpen.edit(info?.data?.note) }}
                style={{ marginRight: -8 }}
                type={'link'}
                size={'small'}
              >
                {t('编辑')}
              </Button>
            }
            title={t('备注')}
            className={'fit-width'}
          >
            {info.data?.note}
            <SRender render={!info.data?.note}>
              <span style={{ color: '#aaa' }}>--</span>
            </SRender>
          </SCard>
        </Flex>
      </Flex>

      <TagModal openInfo={tagOpen} onFresh={info.refresh} />
      <NoteModal openInfo={noteOpen} onFresh={info.refresh} />
      <TaxModal openInfo={taxOpen} onFresh={info.refresh} />
    </Page>
  )
}
