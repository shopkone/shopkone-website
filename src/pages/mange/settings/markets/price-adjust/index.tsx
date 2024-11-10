import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { IconPhoto, IconSearch } from '@tabler/icons-react'
import { useRequest } from 'ahooks'
import { Button, Flex, Form, Input, Tooltip } from 'antd'

import { useCountries } from '@/api/base/countries'
import { useCurrencyList } from '@/api/base/currency-list'
import { FileType } from '@/api/file/add-file-record'
import { AdjustType, MarketInfoApi } from '@/api/market/info'
import { ProductListApi, ProductListReq, ProductListRes } from '@/api/product/list'
import FileImage from '@/components/file-image'
import Page from '@/components/page'
import SCard from '@/components/s-card'
import SInputNumber from '@/components/s-input-number'
import SRender from '@/components/s-render'
import SSelect from '@/components/s-select'
import STable, { STableProps } from '@/components/s-table'
import Status from '@/components/status'
import { reduce } from '@/utils'
import { formatPrice } from '@/utils/num'

import styles from './index.module.less'

export default function PriceAdjust () {
  const { t } = useTranslation('settings', { keyPrefix: 'market' })
  const id = Number(useParams().id || 0)
  const info = useRequest(MarketInfoApi, { manual: true })
  const [form] = Form.useForm()
  const currencyList = useCurrencyList()
  const adjustType = Form.useWatch('adjust_type', form)
  const priceAdjustment = Form.useWatch('price_adjustment', form)
  const currencyCode = Form.useWatch('currency_code', form)
  const currency = currencyList?.data?.find(c => c.code === currencyCode)
  const countries = useCountries()
  const countryList = countries?.data?.filter(c => info?.data?.country_codes?.includes(c.code))
  const [params, setParams] = useState<ProductListReq>({ page: 1, page_size: 20 })
  const productList = useRequest(ProductListApi, { manual: true })
  const [selected, setSelected] = useState<number[]>([])
  const isChangeAdjust = priceAdjustment !== info?.data?.price_adjustment

  const columns: STableProps['columns'] = [
    {
      title: t('商品'),
      code: 'product',
      name: 'product',
      render: (_, row: ProductListRes) => (
        <Flex align={'center'} gap={16}>
          <SRender render={row.image}>
            <FileImage size={16} width={32} height={32} src={row.image} type={FileType.Image} />
          </SRender>
          <SRender render={!row.image}>
            <Flex align={'center'} justify={'center'} style={{ width: 34, height: 34, background: '#f5f5f5', border: '1px solid #eee', borderRadius: 8 }}>
              <IconPhoto color={'#ddd'} />
            </Flex>
          </SRender>
          <div>{row.title}</div>
        </Flex>
      ),
      width: 280,
      lock: true
    },
    {
      title: t('状态'),
      code: 'id',
      name: 'id',
      render: (id: number) => {
        if (info?.data?.exclude_product_ids?.includes(id)) {
          return <Status style={{ display: 'inline-block' }} type={'warning'} >{t('排除')}</Status>
        }
        return <Status style={{ display: 'inline' }} type={'success'}>{t('包含')}</Status>
      }
    },
    {
      title: t('款式'),
      code: 'variants',
      name: 'variants',
      render: (variants: ProductListRes['variants']) => {
        return t('x个款式', { x: variants?.length })
      }
    },
    {
      title: t('售价'),
      code: 'price',
      name: 'price',
      render: (_, row: ProductListRes) => {
        const allPrice = row.variants?.map(variant => variant.price)
        const maxPrice = Math.max(...allPrice)
        const minPrice = Math.min(...allPrice)
        let isSame = false
        let range = `${formatPrice(minPrice)} ~ ${formatPrice(maxPrice)}`
        if (maxPrice === minPrice) {
          range = formatPrice(maxPrice)
          isSame = true
        }
        return (
          <Tooltip title={isChangeAdjust ? t('请保存当前编辑后再更改') : undefined}>
            <div>
              <SInputNumber
                disabled={isChangeAdjust}
                required
                placeholder={isChangeAdjust ? undefined : range}
                value={(isSame && !isChangeAdjust) ? maxPrice : undefined}
                prefix={currency?.symbol}
                money
                suffix={
                  <SRender render={!isChangeAdjust}>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                      }}
                      style={{ position: 'relative', left: 8 }}
                      type={'link'}
                      size={'small'}
                    >
                      {t('重置')}
                    </Button>
                  </SRender>
                }
              />
            </div>
          </Tooltip>
        )
      },
      width: 160
    }
  ]

  const adjustTypeOptions = [
    { label: t('价格升高'), value: AdjustType.PriceAdjustmentTypeIncrease },
    { label: t('价格降低'), value: AdjustType.PriceAdjustmentTypeReduce }
  ]

  useEffect(() => {
    if (!id) return
    info.run({ id })
  }, [id])

  useEffect(() => {
    if (!info.data) return
    form.setFieldsValue(info.data)
  }, [info.data])

  useEffect(() => {
    productList.run(params)
  }, [params])

  return (
    <Page
      loadingHiddenBg
      loading={!info.data?.id || countries?.loading}
      back={`/settings/markets/change/${id}`}
      title={
        <Flex align={'center'} gap={12}>
          {t('商品与定价')}
          <SRender
            className={countryList?.length === 1 ? undefined : styles.moreTips}
            render={info.data?.id ? countries?.data?.length : null}
            style={{ fontSize: 13, fontWeight: 450 }}
          >
            <Tooltip
              mouseEnterDelay={0.01}
              title={countryList?.length === 1 ? undefined : countryList?.map(i => i.name).join('、')}
            >
              #{info?.data?.is_main ? countryList?.[0]?.name : info?.data?.name}
            </Tooltip>
          </SRender>
        </Flex>
      }
      width={700}
    >
      <Form form={form} layout={'vertical'}>
        <Flex vertical gap={16}>
          <SCard tips={t('管理此市场中的客户将看到的货币，并仅为此市场调整价格。')} title={t('定价')}>
            <Flex gap={16}>
              <Form.Item name={'currency_code'} className={'flex1'} label={t('货币')}>
                <SSelect
                  listHeight={400}
                  showSearch
                  optionFilterProp={'label'}
                  options={currencyList.data?.map(item => ({ value: item.code, label: item.title }))}
                />
              </Form.Item>
              <Flex className={'flex1'} gap={4}>
                <Form.Item name={'adjust_type'} className={'flex1'} label={t('价格调整')}>
                  <SSelect options={adjustTypeOptions} />
                </Form.Item>
                <Form.Item name={'price_adjustment'} style={{ marginTop: 23, width: 100 }}>
                  <SInputNumber
                    required
                    precision={5}
                    style={{ height: 32 }}
                    prefix={<span style={{ fontSize: 16 }}>{adjustType === 1 ? '-' : '+'}</span>}
                    suffix={'%'}
                  />
                </Form.Item>
              </Flex>
            </Flex>
          </SCard>
          <SCard styles={{ body: { padding: '8px 4px' } }}>
            <Flex gap={8} className={styles.btns}>
              <Button type={'text'} size={'small'}>{t('全部商品', { x: productList?.data?.total })}</Button>
              <Button type={'text'} size={'small'}>{t('已包含', { x: reduce(productList?.data?.total, info?.data?.exclude_product_ids?.length) })}</Button>
              <Button type={'text'} size={'small'}>{t('已排除', { x: info?.data?.exclude_product_ids?.length })}</Button>
            </Flex>

            <Flex gap={8} style={{ padding: '16px 8px' }}>
              <Input autoComplete={'off'} placeholder={'搜索商品'} prefix={<IconSearch size={16} />} />
              <SSelect style={{ minWidth: 100 }} />
            </Flex>

            <STable
              style={{ padding: '0 8px 8px 8px' }}
              borderless
              className={'table-border'}
              data={productList.data?.list || []}
              columns={columns}
              loading={productList.loading}
              page={{
                current: params.page,
                pageSize: params.page_size,
                total: productList?.data?.total,
                onChange: (page, page_size) => {
                  setParams({ ...params, page, page_size })
                }
              }}
              rowSelection={{ onChange: setSelected, value: selected }}
            />
          </SCard>
        </Flex>
      </Form>
    </Page>
  )
}
