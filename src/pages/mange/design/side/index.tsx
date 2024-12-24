import { useLocation } from 'react-router-dom'

import SRender from '@/components/s-render'
import SectionSide from '@/pages/mange/design/section-side'
import Settings from '@/pages/mange/design/settings'
import { useDesignState } from '@/pages/mange/design/state'

import styles from './index.module.less'

export default function Side () {
  const state = useDesignState(state => state)
  const { search } = useLocation()

  const hiddenStyle = state.device === 'fill'
    ? { width: 0, opacity: 0 }
    : {}

  return (
    <div style={hiddenStyle} className={styles.side}>
      <div className={styles.header}>主页</div>
      <SRender render={search.includes('section') || !search}>
        <SectionSide />
      </SRender>
      <SRender render={search?.includes('global')}>
        <Settings />
      </SRender>
    </div>
  )
}
