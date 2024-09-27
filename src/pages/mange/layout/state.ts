import { create } from 'zustand/react'

export interface LayoutState {
  isChange?: boolean
  onCancel?: () => void
  onOk?: () => Promise<void> | void
}

export interface LayoutAction {
  setChange: (value?: boolean) => void
  reset: () => void
  setAction: (action: { onCancel: LayoutState['onCancel'], onOk: LayoutState['onOk'] }) => void
}

export const useLayoutState = create<LayoutState & LayoutAction>((set, get, store) => ({
  isChange: false,
  setChange: (value?: boolean) => { set({ isChange: value }) },

  onCancel: () => {},
  onOk: () => {},
  setAction: (action) => {
    set({ onCancel: action.onCancel, onOk: action.onOk })
  },

  reset: () => {
    set({ isChange: false, onCancel: () => {}, onOk: () => {} })
  }
}))
