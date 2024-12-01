import { create } from 'zustand/react'

export interface DesignState {
  device: 'mobile' | 'desktop' | 'pad' | 'fill'
}

interface DesignAction {
  setDevice: (device: DesignState['device']) => void
}

export const useDesignState = create<DesignState & DesignAction>((set, get, store) => ({
  device: 'desktop',
  setDevice: (device) => {
    set({ device })
  }
}))
