import { atom } from 'jotai'

import { ColumnType } from '@/components/columns-control'

export const columnsAtom = atom<ColumnType[]>([])
