import request from '@/utils/request'

async function api<Result> (path: string, data?: unknown, __hideErrorCodes?: number[]): Promise<Result> {
  const url = path[0] === '/' ? path : '/' + path
  // @ts-expect-error
  return await request(url, { data, method: 'POST', __hideErrorCodes })
}

export interface PageRes<T> {
  total: number
  list: T
  page: PageReq
}

export interface PageReq {
  page: number
  page_size: number
}

export { api }
