import { useMemo, useState } from 'react'
import { useRequest } from 'ahooks'

import { api } from '@/api/api'

export interface ProductListByIdsReq {
  ids: number[]
}

export interface ProductListByIdsRes {
  id: number
  min_price: number
  max_price: number
  status: number
  image: string
  title: string
}

const ProductListByIdsApi = async (data: ProductListByIdsReq) => {
  return await api<ProductListByIdsRes[]>('/product/list-by-ids', data)
}

export const useProductListByIds = () => {
  const get = useRequest(ProductListByIdsApi, { manual: true })
  const [list, setList] = useState<Array<{ id: number, info: ProductListByIdsRes }>>([])

  const run = async (ids: number[]) => {
    const need = ids.filter(id => !list.find(item => item.id === id))
    if (!need.length) return
    const ret = await get.runAsync({ ids: need })
    setList(list.concat(ret.map(item => ({ id: item.id, info: item }))))
  }

  const data = useMemo(() => {
    return list.map(item => item.info)
  }, [list])

  return { data, run, loading: get.loading }
}
