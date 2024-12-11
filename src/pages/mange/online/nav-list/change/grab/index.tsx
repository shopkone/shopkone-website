import { useTranslation } from 'react-i18next'
import { Button, Card, Flex } from 'antd'

import { NavItemType } from '@/api/online/navInfo'
import SRender from '@/components/s-render'
import { useOpen } from '@/hooks/useOpen'

import { SortableTree } from './sortable-tree'

export interface GrabProps {
  value?: NavItemType[]
  onChange?: (value: NavItemType[]) => void
}

export default function Grab (props: GrabProps) {
  const { value, onChange } = props
  const openInfo = useOpen<{ item?: NavItemType, isEdit: boolean }>()
  const { t } = useTranslation('online', { keyPrefix: 'nav' })

  return (
    <Card
      extra={
        <SRender render={value?.length}>
          <Button
            onClick={() => { openInfo.edit({ isEdit: false }) }}
            style={{ marginRight: 0 }} size={'small'} type={'link'}
          >
            {t('添加菜单项')}
          </Button>
        </SRender>
      }
      style={{ marginTop: 16 }}
      title={t('编辑菜单项')}
    >
      <SRender render={!value?.length}>
        <Flex style={{ padding: 12 }} justify={'center'}>
          <Button onClick={() => { openInfo.edit({ isEdit: false }) }} type={'primary'}>
            {t('添加菜单项')}
          </Button>
        </Flex>
      </SRender>
      <SortableTree
        openInfo={openInfo}
        onChange={onChange}
        collapsible
        indicator
        removable
        value={value || []}
      />
    </Card>
  )
}
