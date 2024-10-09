import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import SLoading from '@/components/s-loading'
import ProductChangeInner from '@/pages/mange/product/product/product-change/inner'

export default function ProductChange () {
  const nav = useNavigate()
  const [loading, setLoading] = useState(false)

  const onFresh = (id: number) => {
    if (!id) return
    nav(`/products/products/change/${id}`)
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    })
  }

  if (loading) return <SLoading />

  return (
    <ProductChangeInner onFresh={onFresh} />
  )
}
