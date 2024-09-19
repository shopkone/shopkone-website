import request from '@/utils/request'

async function api<Result> (path: string, data?: unknown): Promise<Result> {
  const url = path[0] === '/' ? path : '/' + path
  return await request.post(url, data)
}

export interface PageRes<T> {
  total: number
  list: T
}

export interface PageReq {
  page: number
  page_size: number
}

export { api }
