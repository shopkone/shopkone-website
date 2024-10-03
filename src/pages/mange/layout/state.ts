import { create } from 'zustand/react'

export interface LayoutState {
  isChange?: boolean
  onCancel?: () => void
  onOk?: () => Promise<void> | void
  resetLoading: boolean
}

export interface LayoutAction {
  setChange: (value?: boolean) => void
  reset: () => void
  setAction: (action: { onCancel: LayoutState['onCancel'], onOk: LayoutState['onOk'] }) => void
  setResetLoading: (loading: boolean) => void
}

export const useLayoutState = create<LayoutState & LayoutAction>((set, get, store) => ({
  isChange: false,
  setChange: (value?: boolean) => { set({ isChange: value }) },

  onCancel: () => {},
  onOk: () => {},
  setAction: (action) => {
    set({ onCancel: action.onCancel, onOk: action.onOk })
  },

  resetLoading: false,
  setResetLoading: (loading: boolean) => {
    set({ resetLoading: loading })
  },
  reset: () => {
    set({ isChange: false, onCancel: () => {}, onOk: () => {}, resetLoading: false })
  }
}))
