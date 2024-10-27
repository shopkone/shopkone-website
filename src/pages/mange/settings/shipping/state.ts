import { create } from 'zustand/react'

import { LocationListRes } from '@/api/location/list'

export interface ShippingState {
  locations: LocationListRes[]
  loading: boolean
}

export interface ShippingAction {
  setLocations: (locations: LocationListRes[]) => void
  setLoading: (loading: boolean) => void
}

export const useShippingState = create<ShippingState & ShippingAction>((set, get, store) => ({
  locations: [],
  setLocations: (locations) => {
    set({ locations })
  },

  loading: false,
  setLoading: (loading) => { set({ loading }) }
}))
