import { useEffect } from 'react'
import { useRequest } from 'ahooks'

import { DesignDataListApi } from '@/api/design/data-list'
import SLoading from '@/components/s-loading'
import RenderPart from '@/pages/mange/design/side/render-part'

export default function SectionSide () {
  const data = useRequest(DesignDataListApi, { manual: true })

  useEffect(() => {
    window.addEventListener('message', function (e) {
      if (e?.data?.type !== 'SHOPKIMI_READY') return
      if (!e?.data?.data) return
      data.run({ page: e.data.data })
    })
  }, [])

  return (
    <SLoading loading={data.loading}>
      <RenderPart part={data.data?.header_data} />
      <RenderPart part={data.data?.current_page_data} />
      <RenderPart part={data.data?.footer_data} />
    </SLoading>
  )
}
