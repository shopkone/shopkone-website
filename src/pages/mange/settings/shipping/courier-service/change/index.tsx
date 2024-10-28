import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ShippingType } from '@/api/shipping/base'
import SLoading from '@/components/s-loading'
import CourierServiceInner from '@/pages/mange/settings/shipping/courier-service/change/inner'

export default function CourierServiceChange () {
  const nav = useNavigate()
  const [loading, setLoading] = useState(false)
  const type: ShippingType = Number(new URLSearchParams(window.location.search).get('type') || 0)

  const onFresh = (id: number) => {
    if (!id) return
    nav(`/settings/shipping/courier-service/change/${id}?type=${type}`)
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    })
  }

  if (loading) return <SLoading />

  return (
    <CourierServiceInner onFresh={onFresh} />
  )
}
