import { useEffect } from 'react'

import { useModal } from '@/components/s-modal'
import Account from '@/pages/account'
import Mange from '@/pages/mange'

export default function Pages () {
  const modal = useModal()

  const pathname = location.pathname

  useEffect(() => {
    window.__info_modal = modal.info
  }, [modal])

  if (pathname?.split('/')[1] === 'accounts') {
    return <Account />
  }
  return <Mange />
}
