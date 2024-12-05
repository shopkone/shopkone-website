import { useEffect, useMemo, useRef } from 'react'
import { useRequest } from 'ahooks'
import { Flex } from 'antd'

import { SectionRenderApi } from '@/api/design/section-render'
import { GetShopIdApi } from '@/api/shop/get-shop-id'
import { useDesignState } from '@/pages/mange/design/state'

import styles from './index.module.less'

export default function Content () {
  const state = useDesignState(state => state)
  const ref = useRef<HTMLIFrameElement>(null)
  const render = useRequest(SectionRenderApi, { manual: true })
  const shopId = useRequest(GetShopIdApi)

  const width = useMemo(() => {
    if (state.device === 'desktop') return '100%'
    if (state.device === 'fill') return '100%'
    if (state.device === 'pad') return 768
    if (state.device === 'mobile') return 395
  }, [state.device])

  useEffect(() => {
    if (!state.contentFreshFlag) return
    render.runAsync({
      section_id: state.editing?.parent || state?.editing?.id || '',
      part_name: state.editing?.part_name || ''
    }).then(res => {
      state.iframe.send('FRESH', { html: res.html, sectionId: state.editing?.parent || state?.editing?.id })
    })
  }, [state.contentFreshFlag])

  useEffect(() => {
    if (!ref.current) return
    console.log('INIT')
    state.initIFrame(ref)
  }, [ref])

  return (
    <Flex justify={'center'} className={styles.content}>
      <iframe
        ref={ref}
        style={{ width }}
        className={styles.iframe}
        src={shopId.data?.shop_id ? `http://localhost:3100?shop_id=${shopId.data?.shop_id}` : undefined}
      />
    </Flex>
  )
}
