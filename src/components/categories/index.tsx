import { useEffect, useMemo, useState } from 'react'
import { FixedSizeList as List } from 'react-window'
import { IconChevronRight, IconSearch } from '@tabler/icons-react'
import { useMemoizedFn } from 'ahooks'
import { Flex, Input, Typography } from 'antd'
import classNames from 'classnames'
import cloneDeep from 'lodash/cloneDeep'

import { CategoriesRes } from '@/api/base/categories'
import SLoading from '@/components/s-loading'
import SModal from '@/components/s-modal'
import SRender from '@/components/s-render'
import { UseOpenType } from '@/hooks/useOpen'

import styles from './index.module.less'

export interface CategoriesProps {
  info: UseOpenType<number>
  onConfirm: (data: number) => void
  data: CategoriesRes[]
}

export default function Categories (props: CategoriesProps) {
  const { info, onConfirm, data } = props

  const [value, setValue] = useState<number[]>([])
  const [keyword, setKeyword] = useState('')

  const getItem = useMemoizedFn((key: number): CategoriesRes[] => {
    if (key === -1) {
      return data.filter(item => item.deep === 1) || []
    }
    return data.filter(item => item.pid === key) || []
  })

  const getHasChild = useMemoizedFn((pid: number) => {
    if (!data.length) return false
    let count = 0
    for (let i = 0; i < data.length; i++) {
      if (data[i].pid === pid) {
        count++
      }
    }
    return count > 0
  })

  const onExpand = useMemoizedFn((key: number, deep: number) => {
    const newValues = value.filter((i, index) => {
      return index < deep
    })
    setValue([...newValues, key])
  })

  const selectLabel = useMemo(() => {
    return (data.find(i => i.value === cloneDeep(value).pop())?.label)
  }, [value, data])

  const filterTree: any = useMemo(() => {
    if (!keyword) return []
    return data.filter(i => i.label.toUpperCase().includes(keyword.toUpperCase()))
  }, [keyword])

  let temp: number[] = []
  const skip = (key: number) => {
    const item = data.find(i => i.value === key)
    temp = [...temp, key]
    if (!item?.pid) {
      temp = temp.reverse()
      setValue([-1, ...cloneDeep(temp)])
      setKeyword('')
      temp = []
      return
    }
    skip(item.pid)
  }

  useEffect(() => {
    if (!info.open) {
      return
    }
    if (data.length) {
      if (!info.data) {
        setValue([-1])
      } else {
        skip(info.data)
      }
    }
  }, [data, info.open])

  return (
    <SModal
      onOk={() => { onConfirm(value?.length ? value.pop() as number : 0) }}
      title={'Select categories'}
      open={info.open}
      onCancel={info.close}
      width={1000}
    >
      <SLoading loading={(!data.length && !keyword)}>
        <Flex vertical style={{ height: 600 }}>
          <Flex align={'center'} justify={'space-between'}>
            <div className={styles.search}>
              <Input
                placeholder={'Search categories'}
                value={keyword}
                onChange={e => { setKeyword(e.target.value) }}
                prefix={<IconSearch size={14} className={styles.searchIcon} />}
              />
            </div>
            <SRender render={selectLabel}>
              <Flex style={{ marginRight: 16 }} align={'center'} gap={8}>
                <div>Select:</div>
                <div className={styles.selectLabel}>
                  {selectLabel}
                </div>
              </Flex>
            </SRender>
          </Flex>
          <Flex style={{ display: keyword ? 'none' : undefined }} className={styles.content}>
            {
              value.map((key, i) => {
                const item = getItem(key)
                if (!item?.length) return null
                return (
                  <div className={styles.col} key={key}>
                    {item.map(row => {
                      const hasChild = getHasChild(row.value)
                      const selected = value.find(i => i === row.value)
                      return (
                        <Flex
                          gap={12}
                          justify={'space-between'}
                          className={classNames(styles.row, selected && styles.selectRow)}
                          align={'center'}
                          onClick={() => {
                            onExpand(row.value, row.deep)
                          }}
                          key={row.value}
                        >
                          <Typography.Text ellipsis={{ tooltip: true }}>{row.label}</Typography.Text>
                          <SRender render={hasChild}>
                            <IconChevronRight className={styles.rightIcon} size={14} />
                          </SRender>
                        </Flex>
                      )
                    })}
                  </div>
                )
              })
            }
          </Flex>

          <SRender render={keyword} className={styles.content} style={{ paddingLeft: 12 }}>
            <List
              height={518} // 列表的高度，表示可视区域
              itemCount={filterTree.length} // 列表中的总项数
              itemSize={29} // 每一项的高度
              width={955} // 列表的宽度
            >
              {({ index, style }) => (
                <Flex
                  onClick={() => { skip(filterTree?.[index]?.value) }}
                  style={{ ...style, marginTop: 12 }}
                  key={filterTree?.[index]?.value}
                  align={'center'}
                  justify={'space-between'}
                  className={styles.filterRow}
                >
                  <div>{filterTree?.[index]?.label}</div>
                </Flex>
              )}
            </List>
          </SRender>
        </Flex>
      </SLoading>
    </SModal>
  )
}
