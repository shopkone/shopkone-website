import { atom } from 'jotai'

export interface PageAtom {
  isChange?: boolean
}

export const pageAtom = atom<PageAtom>({})
