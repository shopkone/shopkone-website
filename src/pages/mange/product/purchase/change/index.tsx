import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import SLoading from '@/components/s-loading'
import PurchaseChangeInner from '@/pages/mange/product/purchase/change/inner'

export default function PurchaseChange () {
  const nav = useNavigate()
  const [loading, setLoading] = useState(false)

  const onFresh = (id: number) => {
    if (!id) return
    nav(`/products/purchase_orders/change/${id}`)
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    })
  }

  if (loading) return <SLoading />

  return (
    <PurchaseChangeInner onFresh={onFresh} />
  )
}
