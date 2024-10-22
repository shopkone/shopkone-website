import { useEffect, useState } from 'react'

import SLoading from '@/components/s-loading'
import { useModal } from '@/components/s-modal'
import i18n from '@/i18n'
import Account from '@/pages/account'
import Mange from '@/pages/mange'

export default function Pages () {
  const modal = useModal()
  const [init, setInit] = useState(false)
  const pathname = location.pathname

  useEffect(() => {
    i18n.then(() => {
      setInit(true)
    })
    window.__info_modal = modal.info
  }, [modal])

  if (!init) return <SLoading />

  if (pathname?.split('/')[1] === 'accounts') {
    return <Account />
  }
  return <Mange />
}
