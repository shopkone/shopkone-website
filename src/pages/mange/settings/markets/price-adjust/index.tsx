import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { IconPhoto, IconSearch, IconTag } from '@tabler/icons-react'
import { useRequest } from 'ahooks'
import { Button, Empty, Flex, Form, Input, Tooltip } from 'antd'
import cloneDeep from 'lodash/cloneDeep'

import { useCurrencyList } from '@/api/base/currency-list'
import { FileType } from '@/api/file/add-file-record'
import { MarketPriceInfoApi } from '@/api/market/market-price-info'
import { MarketSimpleApi } from '@/api/market/market-simple'
import { AdjustType, MarketProductItem, MarketUpdateProductApi } from '@/api/market/update-market-price'
import { ProductListApi, ProductListReq, ProductListRes } from '@/api/product/list'
import TransHandle from '@/api/trans-handle'
import FileImage from '@/components/file-image'
import Page from '@/components/page'
import SCard from '@/components/s-card'
import SInputNumber from '@/components/s-input-number'
import SLoading from '@/components/s-loading'
import { sMessage } from '@/components/s-message'
import { useModal } from '@/components/s-modal'
import SRender from '@/components/s-render'
import SSelect from '@/components/s-select'
import STable, { STableProps } from '@/components/s-table'
import SelectCurrency from '@/components/select-currency'
import Status from '@/components/status'
import { useNav } from '@/hooks/use-nav'
import { reduce } from '@/utils'
import { isEqualHandle } from '@/utils/is-equal-handle'
import { formatPrice, roundPrice } from '@/utils/num'
import { genId } from '@/utils/random'

import styles from './index.module.less'

export default function PriceAdjust () {
  const { t } = useTranslation('settings', { keyPrefix: 'market' })
  const id = Number(useParams().id || 0)

  const [params, setParams] = useState<ProductListReq>({ page: 1, page_size: 20 })
  const [selected, setSelected] = useState<number[]>([])
  const [list, setList] = useState<MarketProductItem[]>([])
  const initRef = useRef(null)
  const modal = useModal()
  const nav = useNav()

  const currencyList = useCurrencyList()
  const priceProduct = useRequest(MarketPriceInfoApi, { manual: true })
  const productList = useRequest(ProductListApi, { manual: true })
  const marketInfo = useRequest(MarketSimpleApi, { manual: true })
  const update = useRequest(MarketUpdateProductApi, { manual: true })
  const [isChange, setIsChange] = useState(false)
  const [current, setCurrent] = useState(0)

  const [form] = Form.useForm()
  const adjustType = Form.useWatch('adjust_type', form)
  const adjustPercent = Form.useWatch('adjust_percent', form)
  const currencyCode = Form.useWatch('currency_code', form)

  const isChangeAdjust =
    adjustPercent !== priceProduct?.data?.adjust_percent ||
    currencyCode !== priceProduct?.data?.currency_code ||
    adjustType !== priceProduct?.data?.adjust_type
  const exclude_product_ids = list?.filter(i => i.exclude)?.map(i => i.product_id) || []
  const loadingHandle = useRef(false)

  const currency = currencyList?.data?.find(c => c.code === currencyCode)

  const changeMainTips = (
    <TransHandle
      to={'/settings/general'}
      title={t('商品与定价')}
      i18nkey={t('更改提示')}
    >
      {t('商店结算货币')}
    </TransHandle>
  )

  const getPrice = (product: ProductListRes) => {
    const adjustProduct = list?.find(i => i.product_id === product.id)
    if (typeof adjustProduct?.fixed === 'number') return { prices: [adjustProduct?.fixed], fixed: true }
    return {
      prices: product?.variants?.map(i => {
        const price = i.price * (priceProduct?.data?.exchange_rate || 0)
        const offset = price * adjustPercent * 0.01
        return roundPrice(price + (adjustType === AdjustType.PriceAdjustmentTypeReduce ? -offset : +offset))
      }),
      fixed: false
    }
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
    await form.validateFields().catch(err => {
      const msg = err.errorFields?.[0]?.errors?.[0]
      if (msg) {
        sMessage.warning(msg)
      }
      throw new Error(err)
    })
    const values = form.getFieldsValue(true)
    await update.runAsync({ ...values, adjust_products: list, market_id: id })
    setIsChange(false)
    sMessage.success(t('更新成功'))
    priceProduct.refresh()
  }

  const onModal = async () => {
    modal.confirm({
      title: t('确认更改市场货币吗？'),
      content: t('更改市场货币将删除所有您已经设置的固定价格'),
      onOk
    })
  }

  const onCancel = () => {
    form.setFieldsValue(initRef.current)
    setIsChange(false)
    setList(priceProduct?.data?.adjust_products || [])
  }

  const onChangeTab = (tab: number) => {
    if (tab === current) return
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
    loadingHandle.current = true
    setParams(p)
    setSelected([])
    setTimeout(() => {
      setCurrent(tab)
    })
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
      title: t('变体'),
      code: 'variants',
      name: 'variants',
      render: (variants: ProductListRes['variants']) => {
        return t('x个变体', { x: variants?.length })
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
          <Tooltip title={(isChangeAdjust && !marketInfo?.data?.is_main) ? t('请保存当前编辑后再更改') : undefined}>
            <div onMouseUp={e => { e.stopPropagation() }}>
              <SInputNumber
                onChange={(value) => { onUpdateFixed(row.id, value) }}
                disabled={isChangeAdjust}
                placeholder={isChangeAdjust ? undefined : range}
                value={((isSame && !isChangeAdjust) || marketInfo?.data?.is_main) ? maxPrice : undefined}
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
    loadingHandle.current = false
    if (!id) return
    priceProduct.run({ market_id: id })
    marketInfo.run({ id })
  }, [id])

  useEffect(() => {
    if (!priceProduct.data) return
    setList(priceProduct.data.adjust_products)
    form.setFieldsValue(priceProduct.data)
    onValuesChange(true)
  }, [priceProduct.data])

  useEffect(() => {
    productList.runAsync(params).then(res => {
      loadingHandle.current = false
    })
  }, [params])

  useEffect(() => {
    if (!initRef?.current || !priceProduct?.data) return
    if (currencyCode !== priceProduct?.data?.currency_code) {
      onSetNoFixed()
    }
  }, [currencyCode])

  let isLoading = !priceProduct?.data || !productList?.data
  isLoading = isLoading || priceProduct.loading || currencyList?.loading

  const isRealChange = isChange || !(isEqualHandle(list, priceProduct.data?.adjust_products)) || list?.length !== priceProduct.data?.adjust_products?.length

  return (
    <Page
      onOk={priceProduct?.data?.currency_code !== currencyCode ? onModal : onOk}
      isChange={priceProduct.data ? isRealChange : false}
      onCancel={onCancel}
      loadingHiddenBg
      loading={isLoading}
      back={`/settings/markets/change/${id}`}
      title={
        <Flex align={'center'} gap={12}>
          {t('商品与定价')}
          <span className={styles.moreTips}>#{marketInfo?.data?.name || '--'}</span>
        </Flex>
      }
      width={700}
    >
      <Form onValuesChange={onValuesChange} form={form} layout={'vertical'}>
        <Flex vertical gap={16}>
          <SCard
            tips={
            marketInfo?.data?.is_main
              ? (
                  changeMainTips
                )
              : (
                  t('管理此市场中的客户将看到的货币，并仅为此市场调整价格。')
                )
            }
            title={t('定价')}
          >
            <Flex gap={16}>
              <div className={'flex1'}>
                <Tooltip placement={'bottomLeft'} title={marketInfo?.data?.is_main ? changeMainTips : undefined}>
                  <Form.Item
                    name={'currency_code'}
                    label={t('货币')}
                  >
                    <SelectCurrency disabled={marketInfo?.data?.is_main} />
                  </Form.Item>
                </Tooltip>
              </div>
              <SRender render={!marketInfo?.data?.is_main}>
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
              </SRender>
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
                {t('全部商品', { x: productList?.data?.page?.all_total })}
              </Button>
              <Button
                style={{ height: 22 }}
                id={current === 1 ? styles.temp : undefined}
                className={current === 1 ? styles.active : undefined}
                onClick={() => { onChangeTab(1) }}
                type={'text'}
                size={'small'}
              >
                {t('已包含', { x: reduce(productList?.data?.page?.all_total, exclude_product_ids?.length) })}
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

            <SRender render={productList?.data?.page?.all_total}>
              <Flex gap={8} style={{ padding: '16px 8px' }}>
                <Input autoComplete={'off'} placeholder={'搜索商品'} prefix={<IconSearch size={16} />} />
                <SSelect style={{ minWidth: 100 }} />
              </Flex>
            </SRender>

            <SLoading loading={productList.loading || loadingHandle.current}>
              <SRender
                style={{ padding: '48px 8px 32px 8px' }}
                render={!productList?.data?.total && productList.data}
              >
                <Empty
                  image={
                    <div style={{ paddingTop: 32 }}>
                      <IconTag size={64} color={'#ddd'} />
                    </div>
                  }
                  description={(
                    <Flex vertical gap={8} className={'secondary'}>
                      <div style={{ fontSize: 14 }}>
                        {current === 0 ? t('店铺未添加商品') : (current === 1 ? t('此市场已排除所有商品') : t('此市场已包含所有商品'))}
                      </div>
                      <div className={'secondary'}>
                        {current === 0 ? undefined : (current === 1 ? t('此市场中的客户将无法购买您的产品') : t('此市场中的客户可以购买您的任何产品'))}
                      </div>
                    </Flex>
                  )}
                  style={{
                    paddingBottom: 24,
                    marginTop: -32
                  }}
                >
                  <SRender render={current === 0}>
                    <Button onClick={() => { nav('/products/products', { title: t('商品与定价') }) }}>
                      {t('去添加商品')}
                    </Button>
                  </SRender>
                </Empty>
              </SRender>

              <SRender render={productList.data ? productList?.data?.total : false}>
                <div style={{ marginLeft: 12, marginBottom: 2 }} className={'tips'}>
                  <TransHandle i18nkey={t('修改主市场价格提示')} title={t('商品与定价')} to={'/products/products'}>
                    {t('商品管理页')}
                  </TransHandle>
                </div>
                <STable
                  style={{ padding: '0 8px 8px 8px' }}
                  borderless
                  className={'table-border'}
                  data={productList.data?.list || []}
                  columns={columns}
                  page={{
                    current: params.page,
                    pageSize: params.page_size,
                    total: productList?.data?.total,
                    onChange: (page, page_size) => {
                      setParams({ ...params, page, page_size })
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
              </SRender>
            </SLoading>
          </SCard>
        </Flex>
      </Form>
    </Page>
  )
}
