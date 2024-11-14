import { useNavigate } from 'react-router-dom'
import { IconMailFilled } from '@tabler/icons-react'
import { Button, Flex } from 'antd'

import { ReactComponent as BrandApple } from '@/assets/icon/brand-apple.svg'
import { ReactComponent as BrandFacebook } from '@/assets/icon/brand-facebook.svg'
import { ReactComponent as BrandGoogle } from '@/assets/icon/brand-google.svg'
import styles from '@/pages/account/index.module.less'

export default function SignUpType () {
  const nav = useNavigate()

  return (
    <Flex vertical gap={16}>
      <Button onClick={() => { nav('/auth/signup/email') }} size={'large'} block>
        <Flex align={'center'} gap={8}>
          <IconMailFilled className={styles.typeIcon} size={18} />
          <div style={{ fontSize: 14 }}>使用电子邮箱继续</div>
        </Flex>
      </Button>

      <Button size={'large'} block>
        <BrandGoogle className={styles.typeIcon} style={{ fontSize: 19 }} />
        <div style={{ fontSize: 14 }}>使用 Google 继续</div>
      </Button>

      <Button size={'large'} block>
        <BrandFacebook className={styles.typeIcon} style={{ fontSize: 17 }} />
        <div style={{ fontSize: 14 }}>使用 Facebook 继续</div>
      </Button>

      <Button size={'large'} block>
        <BrandApple className={styles.typeIcon} style={{ fontSize: 19 }} />
        <div style={{ fontSize: 14 }}>使用 Apple 继续</div>
      </Button>
    </Flex>
  )
}
