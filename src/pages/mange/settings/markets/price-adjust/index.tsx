import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { IconPhoto, IconSearch } from '@tabler/icons-react'
import { useRequest } from 'ahooks'
import { Button, Flex, Form, Input, Tooltip } from 'antd'
import cloneDeep from 'lodash/cloneDeep'

import { useCountries } from '@/api/base/countries'
import { useCurrencyList } from '@/api/base/currency-list'
import { FileType } from '@/api/file/add-file-record'
import { AdjustType, MarketInfoApi } from '@/api/market/info'
import { MarketListRes } from '@/api/market/list'
import { MarketProductItem, MarketUpdateProductApi } from '@/api/market/update-market-price'
import { ProductListApi, ProductListReq, ProductListRes } from '@/api/product/list'
import FileImage from '@/components/file-image'
import Page from '@/components/page'
import SCard from '@/components/s-card'
import SInputNumber from '@/components/s-input-number'
import { sMessage } from '@/components/s-message'
import SRender from '@/components/s-render'
import SSelect from '@/components/s-select'
import STable, { STableProps } from '@/components/s-table'
import SelectCurrency from '@/components/select-currency'
import Status from '@/components/status'
import { reduce } from '@/utils'
import { isEqualHandle } from '@/utils/is-equal-handle'
import { formatPrice } from '@/utils/num'
import { genId } from '@/utils/random'

import styles from './index.module.less'

export default function PriceAdjust () {
  const { t } = useTranslation('settings', { keyPrefix: 'market' })
  const id = Number(useParams().id || 0)
  const info = useRequest(MarketInfoApi, { manual: true })
  const [form] = Form.useForm()
  const adjustType = Form.useWatch('adjust_type', form)
  const adjustPercent = Form.useWatch('adjust_percent', form)
  const currencyCode = Form.useWatch('currency_code', form)
  const currencyList = useCurrencyList()
  const currency = currencyList?.data?.find(c => c.code === currencyCode)
  const countries = useCountries()
  const countryList = countries?.data?.filter(c => info?.data?.country_codes?.includes(c.code))
  const [params, setParams] = useState<ProductListReq>({ page: 1, page_size: 20 })
  const productList = useRequest(ProductListApi, { manual: true })
  const [selected, setSelected] = useState<number[]>([])
  const isChangeAdjust =
    adjustPercent !== info?.data?.adjust_percent ||
    currencyCode !== info?.data?.currency_code ||
    adjustType !== info?.data?.adjust_type
  const [current, setCurrent] = useState(0)
  const [list, setList] = useState<MarketProductItem[]>([])
  const exclude_product_ids = list?.filter(i => i.exclude)?.map(i => i.product_id) || []
  const [isChange, setIsChange] = useState(false)
  const initRef = useRef(null)
  const update = useRequest(MarketUpdateProductApi, { manual: true })

  const getPrice = (product: ProductListRes) => {
    const adjustProduct = list?.find(i => i.product_id === product.id)
    if (typeof adjustProduct?.fixed === 'number') return { prices: [adjustProduct?.fixed], fixed: true }
    return { prices: product?.variants?.map(i => i.price), fixed: false }
  }

  const filterAdjustProducts = (items: MarketProductItem[]) => {
    return items.filter(i => {
      // 如果fixed为undefined且exclude为false，则过滤掉
      return !(i.fixed === undefined && !i.exclude)
    })
  }

  const onUpdateFixed = (productId: number, price?: number) => {
    const newList = cloneDeep(list)
    const has = newList.find(i => i.product_id === productId)
    if (has) {
      has.fixed = price
    } else {
      newList.push({ product_id: productId, fixed: price, id: genId(), exclude: false })
    }
    setList(filterAdjustProducts(newList))
  }

  const onSetNoFixed = () => {
    const newList = cloneDeep(list)
    newList.forEach(i => {
      i.fixed = undefined
    })
    setList(filterAdjustProducts(newList))
  }

  const onChangeExclude = (product_ids: number[], exclude: boolean) => {
    const newList = cloneDeep(list)
    product_ids.forEach(pid => {
      const has = newList.find(i => i.product_id === pid)
      if (!has) {
        newList.push({ product_id: pid, exclude, id: genId() })
      } else {
        has.exclude = exclude
      }
    })
    setSelected([])
    setList(filterAdjustProducts(newList))
  }

  const adjustTypeOptions = [
    { label: t('价格升高'), value: AdjustType.PriceAdjustmentTypeIncrease },
    { label: t('价格降低'), value: AdjustType.PriceAdjustmentTypeReduce }
  ]

  const onValuesChange = (force?: boolean) => {
    const values = form.getFieldsValue(true)
    if (!initRef.current || force === true) {
      initRef.current = values
      return
    }
    const isSame = isEqualHandle(values, initRef.current)
    setIsChange(!isSame)
  }

  const onOk = async () => {
    if (!info?.data?.id) return
    await form.validateFields().catch(err => {
      const msg = err.errorFields?.[0]?.errors?.[0]
      if (msg) {
        sMessage.warning(msg)
      }
      throw new Error(err)
    })
    const values = form.getFieldsValue(true)
    await update.runAsync({ ...values, adjust_products: list, market_id: info?.data?.id })
    setIsChange(false)
    sMessage.success(t('更新成功'))
    info.refresh()
  }

  console.log({ isChange })

  const onCancel = () => {
    form.setFieldsValue(initRef.current)
    setIsChange(false)
    setList(info?.data?.adjust_products || [])
  }

  const onChangeTab = (tab: number) => {
    setCurrent(tab)
    const p = cloneDeep({ ...params, page: 1 })
    if (tab === 0) {
      p.include_ids = undefined
      p.exclude_ids = undefined
    }
    if (tab === 1) {
      p.exclude_ids = exclude_product_ids
      p.include_ids = undefined
    }
    if (tab === 2) {
      p.include_ids = exclude_product_ids
      p.exclude_ids = undefined
    }
    setParams(p)
    setSelected([])
  }

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
      width: 250,
      lock: true
    },
    {
      width: 80,
      title: t('状态'),
      code: 'id',
      name: 'id',
      render: (id: number) => {
        return (
          <Flex gap={8} align={'center'}>
            {exclude_product_ids?.includes(id)
              ? <Status type={'error'}>{t('排除')}</Status>
              : <Status type={'success'}>{t('包含')}</Status>}
          </Flex>
        )
      }
    },
    {
      title: t('款式'),
      code: 'variants',
      name: 'variants',
      render: (variants: ProductListRes['variants']) => {
        return t('x个款式', { x: variants?.length })
      },
      width: 100
    },
    {
      title: t('售价'),
      code: 'price',
      name: 'price',
      render: (_, row: ProductListRes) => {
        const { prices, fixed } = getPrice(row)
        const maxPrice = Math.max(...prices)
        const minPrice = Math.min(...prices)
        let isSame = false
        let range = `${formatPrice(minPrice)} ~ ${formatPrice(maxPrice)}`
        if (maxPrice === minPrice) {
          range = formatPrice(maxPrice)
          isSame = true
        }
        return (
          <Tooltip title={isChangeAdjust ? t('请保存当前编辑后再更改') : undefined}>
            <div onMouseUp={e => { e.stopPropagation() }}>
              <SInputNumber
                onChange={(value) => { onUpdateFixed(row.id, value) }}
                disabled={isChangeAdjust}
                placeholder={isChangeAdjust ? undefined : range}
                value={(isSame && !isChangeAdjust) ? maxPrice : undefined}
                prefix={currency?.symbol}
                money
                suffix={
                  <SRender render={!isChangeAdjust}>
                    <SRender render={fixed}>
                      <Button
                        onClick={(e) => {
                          onUpdateFixed(row.id, undefined)
                        }}
                        style={{ position: 'relative', left: 8 }}
                        type={'link'}
                        size={'small'}
                      >
                        {t('重置')}
                      </Button>
                    </SRender>
                  </SRender>
                }
              />
              <SRender render={fixed}>
                <div style={{ marginTop: 4 }} className={'tips'}>{t('固定价格')}</div>
              </SRender>
            </div>
          </Tooltip>
        )
      },
      width: 150
    }
  ]

  useEffect(() => {
    if (!id) return
    info.run({ id })
  }, [id])

  useEffect(() => {
    if (!info.data) return
    setList(info.data.adjust_products)
    form.setFieldsValue(info.data)
    onValuesChange(true)
  }, [info.data])

  useEffect(() => {
    productList.run(params)
  }, [params])

  useEffect(() => {
    if (!initRef?.current || !info?.data) return
    if (currencyCode !== info?.data?.currency_code) {
      onSetNoFixed()
    }
  }, [currencyCode])

  return (
    <Page
      onOk={onOk}
      isChange={isChange || !(isEqualHandle(list, info.data?.adjust_products)) || list?.length !== info.data?.adjust_products?.length}
      onCancel={onCancel}
      loadingHiddenBg
      loading={!info.data?.id || countries?.loading || info?.loading}
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
      <Form onValuesChange={onValuesChange} form={form} layout={'vertical'}>
        <Flex vertical gap={16}>
          <SCard tips={t('管理此市场中的客户将看到的货币，并仅为此市场调整价格。')} title={t('定价')}>
            <Flex gap={16}>
              <Form.Item name={'currency_code'} className={'flex1'} label={t('货币')}>
                <SelectCurrency />
              </Form.Item>
              <Flex className={'flex1'} gap={4}>
                <Form.Item name={'adjust_type'} className={'flex1'} label={t('价格调整')}>
                  <SSelect options={adjustTypeOptions} />
                </Form.Item>
                <Form.Item name={'adjust_percent'} style={{ marginTop: 23, width: 100 }}>
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
              <Button
                style={{ height: 22 }}
                id={current === 0 ? styles.temp : undefined}
                className={current === 0 ? styles.active : undefined}
                onClick={() => { onChangeTab(0) }}
                type={'text'}
                size={'small'}
              >
                {t('全部商品', { x: productList?.data?.total })}
              </Button>
              <Button
                style={{ height: 22 }}
                id={current === 1 ? styles.temp : undefined}
                className={current === 1 ? styles.active : undefined}
                onClick={() => { onChangeTab(1) }}
                type={'text'}
                size={'small'}
              >
                {t('已包含', { x: reduce(productList?.data?.total, exclude_product_ids?.length) })}
              </Button>
              <Button
                style={{ height: 22 }}
                id={current === 2 ? styles.temp : undefined}
                className={current === 2 ? styles.active : undefined}
                onClick={() => { onChangeTab(2) }}
                type={'text'}
                size={'small'}
              >
                {t('已排除', { x: exclude_product_ids?.length })}
              </Button>
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
              onRowClick={(row: MarketListRes) => {
                if (selected.includes(row.id)) {
                  setSelected(selected.filter(i => i !== row.id))
                } else {
                  setSelected([...selected, row.id])
                }
              }}
              actions={
                <Flex align={'center'}>
                  <Button onClick={() => { onChangeExclude(selected, false) }} type={'link'} size={'small'} >
                    {t('包含')}
                  </Button>
                  <Button onClick={() => { onChangeExclude(selected, true) }} type={'link'} size={'small'} danger>
                    {t('排除')}
                  </Button>
                </Flex>
              }
              rowSelection={{ onChange: setSelected, value: selected }}
            />
          </SCard>
        </Flex>
      </Form>
    </Page>
  )
}
