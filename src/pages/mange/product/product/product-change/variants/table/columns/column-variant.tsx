import { useMemo } from 'react'
import { IconChevronDown, IconPhotoPlus } from '@tabler/icons-react'
import { Button, Checkbox, Flex } from 'antd'
import { TFunction } from 'i18next'

import { FileType } from '@/api/file/add-file-record'
import { FileListByIdsRes } from '@/api/file/file-list-by-ids'
import FileImage from '@/components/file-image'
import SLoading from '@/components/s-loading'
import SRender from '@/components/s-render'
import { Variant } from '@/pages/mange/product/product/product-change/variants/state'
import ColumnImageList from '@/pages/mange/product/product/product-change/variants/table/columns/column-image-list'

import styles from './index.module.less'

export interface ColumnVariantProps {
  row: Variant
  groupName: string
  expands: number[]
  onClick?: () => void
  fileList: FileListByIdsRes[]
  t: TFunction
}

export default function ColumnVariant (props: ColumnVariantProps) {
  const { row, groupName, expands, onClick, fileList, t } = props

  const image = row.image_id ? fileList?.find(i => i.id === row.image_id)?.path : undefined

  const images = useMemo(() => {
    const ids = row.children?.map(i => i.image_id).filter(Boolean)
    const paths = ids?.map(i => fileList?.find(j => j.id === i)?.path).filter(Boolean) || []
    return [...new Set(paths)]
  }, [fileList, row]) as string[]

  return (
    <Flex className={'fit-width flex1'} style={{ userSelect: 'none' }}>
      <SRender render={row.children}>
        <Flex onClick={e => { e.stopPropagation() }} style={{ cursor: 'pointer', paddingRight: 16 }}>
          <Checkbox />
        </Flex>
        <Flex flex={1} align={'center'} gap={16}>
          <SRender render={!images?.length}>
            <Button onClick={e => { e.stopPropagation(); onClick?.() }} className={styles.bigImg} size={'large'}>
              <IconPhotoPlus style={{ position: 'relative', top: 1 }} size={18} />
            </Button>
          </SRender>
          <SRender render={images?.length}>
            <div onClick={e => { e.stopPropagation(); onClick?.() }}>
              <ColumnImageList srcList={images || []} />
            </div>
          </SRender>
          <div className={styles.name}>
            <div className={styles.nameText}>
              {(row?.name?.find(i => i.label === groupName))?.value}
            </div>
            <Flex align={'center'} gap={8}>
              <div className={'secondary'}>
                {t('变体数', { count: row.children?.length })}
              </div>
              <IconChevronDown
                className={styles.icon}
                style={{ transform: expands?.includes(row.id) ? 'rotate(-180deg)' : 'rotate(0deg)' }}
                color={'#646a73'}
                size={14}
              />
            </Flex>
          </div>
        </Flex>
      </SRender>
      <SRender render={!row.children}>
        <Flex align={'center'} gap={12} style={{ marginLeft: groupName ? 12 : -8 }}>
          <Checkbox />
          <SRender render={!row.image_id}>
            <Button onClick={onClick} className={styles.smallImg} size={'large'}>
              <IconPhotoPlus size={16} />
            </Button>
          </SRender>
          <SRender style={{ cursor: 'pointer' }} onClick={onClick} render={row.image_id}>
            <SLoading size={24} loading={!!row.image_id && !image}>
              <FileImage width={42} height={42} src={image || ''} type={FileType.Image} />
            </SLoading>
          </SRender>
          <div>
            {row?.name?.filter(i => i.label !== groupName).map(item => (
              <div key={item.value + item.label}>
                {item.value}
              </div>
            ))}
          </div>
        </Flex>
      </SRender>
    </Flex>
  )
}
