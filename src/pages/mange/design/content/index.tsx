import { useEffect, useMemo, useRef } from 'react'
import { useRequest } from 'ahooks'
import { Flex } from 'antd'

import { SectionRenderApi } from '@/api/design/section-render'
import { useDesignState } from '@/pages/mange/design/state'

import styles from './index.module.less'

export default function Content () {
  const state = useDesignState(state => state)
  const ref = useRef<HTMLIFrameElement>(null)
  const render = useRequest(SectionRenderApi, { manual: true })

  const width = useMemo(() => {
    if (state.device === 'desktop') return '100%'
    if (state.device === 'fill') return '100%'
    if (state.device === 'pad') return 768
    if (state.device === 'mobile') return 395
  }, [state.device])

  useEffect(() => {
    if (!state.update?.section_id) return
    render.runAsync({
      section_id: state.editing?.parent || state?.editing?.id || '',
      part_name: state.editing?.part_name || ''
    }).then(res => {
      state.iframe.send('FRESH', {
        html: res.html,
        sectionId: state.editing?.parent || state?.editing?.id
      })
    })
  }, [state.update])

  useEffect(() => {
    if (!ref.current) return
    state.initIFrame(ref)
  }, [ref])

  return (
    <Flex justify={'center'} className={styles.content}>
      <iframe
        ref={ref}
        style={{ width }}
        className={styles.iframe}
        src={'http://localhost:3000'}
      />
    </Flex>
  )
}
