import { create } from 'zustand/react'

export interface Options {
  name: string
  values: Array<{ value: string, id: number }>
  id: number
  isDone: boolean
}

export interface variantTableState {
  options: Options[]
}

export interface variantTableAction {
  setOptions: (options: Options[]) => void
}

export const userVariantTableState = create<variantTableState & variantTableAction>((set, get, store) => ({
  options: [],
  setOptions: (options) => {
    set({ options })
  }
}))
