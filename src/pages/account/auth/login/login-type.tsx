import { useNavigate } from 'react-router-dom'
import { IconMailFilled } from '@tabler/icons-react'
import { Button, Flex } from 'antd'

import { ReactComponent as BrandApple } from '@/assets/icon/brand-apple.svg'
import { ReactComponent as BrandFacebook } from '@/assets/icon/brand-facebook.svg'
import { ReactComponent as BrandGoogle } from '@/assets/icon/brand-google.svg'

export default function LoginType () {
  const nav = useNavigate()

  return (
    <Flex style={{ paddingTop: 24 }} vertical gap={16}>
      <Button onClick={() => { nav('/auth/login/email') }} size={'large'} block>
        <Flex align={'center'} gap={8}>
          <IconMailFilled size={16} />
          <div style={{ fontSize: 14 }}>使用电子邮箱继续</div>
        </Flex>
      </Button>

      <Button size={'large'} block>
        <Flex align={'center'} gap={8}>
          <BrandGoogle style={{ fontSize: 17 }} />
          <div style={{ fontSize: 14 }}>使用 Google 继续</div>
        </Flex>
      </Button>

      <Button size={'large'} block>
        <Flex align={'center'} gap={8}>
          <BrandFacebook style={{ fontSize: 15 }} />
          <div style={{ fontSize: 14 }}>使用 Facebook 继续</div>
        </Flex>
      </Button>

      <Button size={'large'} block>
        <Flex align={'center'} gap={8}>
          <BrandApple style={{ fontSize: 17 }} />
          <div style={{ fontSize: 14 }}>使用 Apple 继续</div>
        </Flex>
      </Button>
    </Flex>
  )
}
