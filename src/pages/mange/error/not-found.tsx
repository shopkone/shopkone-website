import { useTranslation } from 'react-i18next'
import { Button, Flex } from 'antd'

import styles from './index.module.less'

export interface NotFoundProps {
  veritcal?: boolean
}

export default function NotFound (props: NotFoundProps) {
  const { t } = useTranslation('common', { keyPrefix: 'notFound' })

  return (
    <Flex gap={24} vertical={props.veritcal} align={'center'} justify={'center'} style={{ height: '100%' }}>
      <div>asd</div>
      <div>
        <div className={styles.title}>There's no page at this address</div>
        <Flex align={'center'} style={{ fontSize: 14 }}>
          请检查网址并重试，或者你可以选择
          <Button style={{ fontSize: 14, padding: 0 }} type={'link'} size={'small'}>{t('返回首页')}</Button>
        </Flex>
      </div>
    </Flex>
  )
}
