import { create } from 'zustand/react'

import { LocationListRes } from '@/api/location/list'

export interface ShippingState {
  locations: LocationListRes[]
}

export interface ShippingAction {
  setLocations: (locations: LocationListRes[]) => void
}

export const useShippingState = create<ShippingState & ShippingAction>((set, get, store) => ({
  locations: [],
  setLocations: (locations) => {
    set({ locations })
  }
}))
