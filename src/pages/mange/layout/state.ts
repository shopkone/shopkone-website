import { ReactNode } from 'react'
import { create } from 'zustand/react'

export interface LayoutState {
  isChange?: boolean
  onCancel?: () => void
  onOk?: () => Promise<void> | void
  resetLoading: boolean
  t?: (query: string, context?: any) => string
  okText?: ReactNode
}

export interface LayoutAction {
  setChange: (value?: boolean) => void
  reset: () => void
  setAction: (action: { onCancel: LayoutState['onCancel'], onOk: LayoutState['onOk'] }) => void
  setResetLoading: (loading: boolean) => void
  setT: (t: LayoutState['t'], context?: any) => void
  setOkText: (text: ReactNode) => void
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
    set({ isChange: false, onCancel: () => {}, onOk: () => {}, resetLoading: false, t: undefined })
  },

  setT: (t) => {
    set({ t })
  },

  setOkText: (text) => {
    set({ okText: text })
  }
}))
