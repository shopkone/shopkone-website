import { create } from 'zustand/react'

export interface Options {
  name: string
  values: Array<{ value: string, id: number }>
  id: number
  isDone: boolean
}

export interface productChangeState {
  options: Options[]
}

export interface productChangeAction {
  setOptions: (options: Options[]) => void
}

export const userProductChangeState = create<productChangeState & productChangeAction>((set, get, store) => ({
  options: [],
  setOptions: (options) => {
    set({ options })
  }
}))
