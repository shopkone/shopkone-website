import type { MutableRefObject } from 'react'

import { NavItemType } from '@/api/online/navInfo'

export type TreeItems = NavItemType[]

export interface FlattenedItem extends NavItemType {
  parentId: null | string
  depth: number
  index: number
}

export type SensorContext = MutableRefObject<{
  items: FlattenedItem[]
  offset: number
}>
