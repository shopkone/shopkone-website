import { create } from 'zustand/react'

export interface LayoutState {
  isChange?: boolean
}

export interface LayoutAction {
  setChange: (value?: boolean) => void
  reset: () => void
}

export const useLayoutState = create<LayoutState & LayoutAction>((set, get, store) => ({
  isChange: false,
  setChange: (value?: boolean) => { set({ isChange: value }) },
  reset: () => {
    set({ isChange: false })
  }
}))
