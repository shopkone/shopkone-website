import { create } from 'zustand/react'

import { GetShopInfoApi, GetShopInfoResponse } from '@/api/shop/get-shop-info'

export interface ManageState {
  shopInfo?: GetShopInfoResponse
  shopInfoLoading: boolean
}

export interface ManageAction {
  setShopInfo: () => Promise<GetShopInfoResponse>
}

export const useManageState = create<ManageState & ManageAction>((set, get, store) => ({
  shopInfo: undefined,
  shopInfoLoading: false,
  setShopInfo: async () => {
    set({ shopInfoLoading: true })
    try {
      set({ shopInfoLoading: true })
      const ret = await GetShopInfoApi()
      set({ shopInfo: ret })
      return ret
    } finally {
      set({ shopInfoLoading: false })
    }
  }
}))
