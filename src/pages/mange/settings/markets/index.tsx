import Page from '@/components/page'
import SCard from '@/components/s-card'
import SSelect from '@/components/s-select'

export default function Markets () {
  return (
    <Page title={'市场'} width={700}>
      <SCard
        extra={
        <SSelect size={'small'}/>
        }
        title={'市场列表'}>
        asd
      </SCard>
    </Page>
  )
}
