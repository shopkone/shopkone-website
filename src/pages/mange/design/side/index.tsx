import { useRequest } from 'ahooks'

import { DesignDataListApi } from '@/api/design/data-list'
import SLoading from '@/components/s-loading'
import RenderPart from '@/pages/mange/design/side/render-part'
import { useDesignState } from '@/pages/mange/design/state'

import styles from './index.module.less'

export default function Side () {
  const state = useDesignState(state => state)
  const data = useRequest(DesignDataListApi)

  const hiddenStyle = state.device === 'fill'
    ? { width: 0, opacity: 0 }
    : {}

  return (
    <div style={hiddenStyle} className={styles.side}>
      <SLoading loading={data.loading}>
        <RenderPart part={data.data?.header_data} />
        <RenderPart part={data.data?.current_page_data} />
        <RenderPart part={data.data?.footer_data} />
      </SLoading>
    </div>
  )
}
