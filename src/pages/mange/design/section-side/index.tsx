import { useEffect } from 'react'
import { useRequest } from 'ahooks'

import { DesignDataListApi } from '@/api/design/data-list'
import SLoading from '@/components/s-loading'
import RenderPart from '@/pages/mange/design/side/render-part'
import { useDesignState } from '@/pages/mange/design/state'

export default function SectionSide () {
  const data = useRequest(DesignDataListApi)

  const iframe = useDesignState(state => state.iframe)
  console.log(iframe.onMessage)

  useEffect(() => {
    iframe.onMessage = () => {}
  }, [])

  return (
    <SLoading loading={data.loading}>
      <RenderPart part={data.data?.header_data} />
      <RenderPart part={data.data?.current_page_data} />
      <RenderPart part={data.data?.footer_data} />
    </SLoading>
  )
}
