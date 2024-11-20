import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Button, Flex } from 'antd'

import SEmpty from '@/components/s-empty'

export interface NotFoundProps {
  veritcal?: boolean
}

export default function NotFound (props: NotFoundProps) {
  const { t } = useTranslation('common', { keyPrefix: 'notFound' })

  const nav = useNavigate()

  return (
    <Flex align={'center'} justify={'center'} className={'fit-width fit-height'}>
      <div style={{ transform: 'scale(1.2)' }} className={'flex1'}>
        <SEmpty
          type={'err_404'}
          desc={t('请检查网址并重试，或者你可以选择')}
          title={t('找不到页面')}
          row
          width={600}
        >
          <Button type={'primary'} onClick={() => { nav('/') }}>
            {t('回到首页')}
          </Button>
        </SEmpty>
      </div>
    </Flex>
  )
}
