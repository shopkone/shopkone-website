import { Button } from 'antd'

import { useCategories } from '@/api/base/categories'
import Categories from '@/components/categories'
import SLoading from '@/components/s-loading'
import SRender from '@/components/s-render'
import { useOpen } from '@/hooks/useOpen'

import styles from './index.module.less'

export interface SelectCategoryProps {
  value?: number
  onChange?: (data: number) => void
}

export default function SelectCategory (props: SelectCategoryProps) {
  const { value, onChange } = props
  const selectCategoriesInfo = useOpen<number>()
  const { data } = useCategories()

  const onSelectCategories = (data: number) => {
    onChange?.(data)
    selectCategoriesInfo.close()
  }

  const selectLabel = data.find(i => i.value === value)?.label

  return (
    <SLoading loading={!data.length}>
      <SRender className={styles.category} render={selectLabel}>
        {selectLabel}
      </SRender>
      <Button
        onClick={() => { selectCategoriesInfo.edit(value) }}
        className={'primary-text'}
        style={{ marginLeft: -7 }}
        type={'text'}
        size={'small'}
      >
        Select category
      </Button>

      <Categories data={data} onConfirm={onSelectCategories} info={selectCategoriesInfo} />
    </SLoading>
  )
}
