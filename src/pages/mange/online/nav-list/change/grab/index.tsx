import { NavItemType } from '@/api/online/navInfo'
import SLoading from '@/components/s-loading'
import { UseOpenType } from '@/hooks/useOpen'

import { SortableTree } from './sortable-tree'

export interface GrabProps {
  value?: NavItemType[]
  onChange?: (value: NavItemType[]) => void
  openInfo: UseOpenType<{ item?: NavItemType, isEdit: boolean }>
  list: NavItemType[]
}

export default function Grab (props: GrabProps) {
  const { value, onChange, openInfo, list } = props
  if (!value?.length) return <SLoading />

  return (
    <SortableTree
      openInfo={openInfo}
      onChange={onChange}
      collapsible
      indicator
      removable
      value={value || []}
      list={list}
    />
  )
}
