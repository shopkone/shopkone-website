import { TreeDataNode } from 'antd'

const filterZones = (zones: TreeDataNode[], searchKey: string): TreeDataNode[] => {
  return zones?.filter(zone => {
    if (typeof zone.title !== 'string') return false
    return zone.title.toUpperCase().includes(searchKey.toUpperCase())
  }) || []
}

const filterCountries = (countries: TreeDataNode[], searchKey: string): TreeDataNode[] => {
  return countries?.map(node => {
    if (typeof node.title !== 'string') return { ...node, children: [] }
    if (node.title.toUpperCase().includes(searchKey.toUpperCase())) return { ...node, children: node.children?.length ? node.children : [{ key: 'SHOPKIMI', title: 'SHOPKIMI' }] }
    return { ...node, children: filterZones(node.children || [], searchKey) }
  }).filter(node => node.children?.length).map(node => {
    return { ...node, children: node.children?.[0]?.key === 'SHOPKIMI' ? [] : node.children }
  }) || []
}

self.onmessage = e => {
  const { tree, searchKey }: { tree: TreeDataNode[], searchKey: string } = e.data
  if (!searchKey) {
    self.postMessage({ tree, expands: [], searchKey })
    return
  }

  const result = tree.map(node => {
    if (typeof node.title !== 'string') return { ...node, children: [] }
    if (node.title.toUpperCase().includes(searchKey.toUpperCase())) return node
    return { ...node, children: filterCountries(node.children || [], searchKey) }
  }).filter(node => node.children?.length)

  const list: any[] = []
  tree.forEach(i1 => {
    if (i1.children?.length) {
      list.push(i1.key)
      i1?.children?.forEach(i2 => {
        if (i2.children?.length) {
          list.push(i2.key)
        }
      })
    }
  })

  self.postMessage({ tree: result, expands: [...new Set(list || [])] })
}
