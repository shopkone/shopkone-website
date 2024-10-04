import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import SLoading from '@/components/s-loading'
import { sMessage } from '@/components/s-message'
import ProductChangeInner from '@/pages/mange/product/product/product-change/inner'

export default function ProductChange () {
  const [id, setId] = useState(0)
  const nav = useNavigate()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!id) return
    nav(`/products/products/change/${id}`)
    sMessage.success('Product created')
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 60)
  }, [id])

  if (loading) return <SLoading />

  return (
    <ProductChangeInner key={id} onFresh={setId} />
  )
}
