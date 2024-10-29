import { useState } from 'react'

export interface UseOpenType<T=undefined> {
  close: () => void
  edit: (data?: T) => void
  data?: T
  open: boolean
}

export const useOpen = <T = any>(initData?: T): UseOpenType<T> => {
  const [data, setData] = useState<T | undefined>(initData)
  const [open, setOpen] = useState(false)

  const edit = (data?: T) => {
    setData(data)
    setOpen(true)
  }

  const close = () => {
    setOpen(false)
  }

  return { close, edit, data, open }
}
