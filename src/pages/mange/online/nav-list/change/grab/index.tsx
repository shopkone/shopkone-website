import { useMemo } from 'react'

import { NavItemType } from '@/api/online/navInfo'
import SLoading from '@/components/s-loading'

import { SortableTree } from './sortable-tree'

export interface GrabProps {
  value?: NavItemType[]
  onChange?: (value: NavItemType[]) => void
}

export default function Grab (props: GrabProps) {
  const { value, onChange } = props
  const items: any = useMemo(() => {
    return value?.filter(i => i.levels === 1).map(first => {
      const { id, title } = first
      const second = value?.filter(i => i.levels === 2 && i.parent_id === id).map(second => {
        const { title, id } = second
        const third = value?.filter(i => i.levels === 3 && i.parent_id === id).map(third => {
          const { title, id } = third
          return { id: id.toString(), title, children: [] }
        })
        return { id: id.toString(), title, children: third }
      })
      return { id: id.toString(), title, children: second }
    })
  }, [value])
  console.log({ items })
  if (!items?.length) return <SLoading />
  return <SortableTree collapsible indicator removable value={items || []} />
}
