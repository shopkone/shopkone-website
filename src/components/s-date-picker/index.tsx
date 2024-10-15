import { IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight } from '@tabler/icons-react'
import { DatePicker, DatePickerProps } from 'antd'

export default function SDatePicker (props: DatePickerProps) {
  return (
    <DatePicker
      inputReadOnly
      prevIcon={<IconChevronLeft style={{ position: 'relative', top: 3 }} size={15} />}
      nextIcon={<IconChevronRight style={{ position: 'relative', top: 3 }} size={15} />}
      superPrevIcon={<IconChevronsLeft style={{ position: 'relative', top: 3, marginRight: 12 }} size={15} />}
      superNextIcon={<IconChevronsRight style={{ position: 'relative', top: 3, marginLeft: 12 }} size={15} />}
      className={'fit-width'}
      {...props}
    />
  )
}
