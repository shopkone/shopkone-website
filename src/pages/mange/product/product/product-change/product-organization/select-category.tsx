import { useCategories } from '@/api/base/categories'
import Categories from '@/components/categories'
import SLoading from '@/components/s-loading'
import SSelect from '@/components/s-select'
import { useOpen } from '@/hooks/useOpen'

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
    <SLoading size={18} loading={!data.length}>
      <SSelect
        value={selectLabel}
        open={false}
        onDropdownVisibleChange={v => {
          v && selectCategoriesInfo.edit(value)
        }}
      />

      <Categories data={data} onConfirm={onSelectCategories} info={selectCategoriesInfo} />
    </SLoading>
  )
}
