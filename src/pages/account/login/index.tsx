import { useNavigate } from 'react-router-dom'
import { ArrowRight } from '@icon-park/react'
import { Button, Flex, Form, Input } from 'antd'

import styles from '../index.module.less'

export default function Login () {
  const [form] = Form.useForm()
  const nav = useNavigate()

  return (
    <div>
      <div className={styles.logo}>Shopkone</div>
      <div className={styles.title}>Log in</div>
      <div className={styles.desc}>Continue to Shopkone</div>

      <Form layout={'vertical'} form={form}>
        <Form.Item label={'Email'} name={'email'}>
          <Input size={'large'} />
        </Form.Item>
        <Form.Item className={'mb0'} name={'password'} label={'Password'}>
          <Input.Password autoComplete={'off'} size={'large'} />
        </Form.Item>
        <Button style={{ marginLeft: -8, marginTop: 4 }} type={'link'} size={'small'}>Forgot password?</Button>
        <Button className={styles.btn} block type={'primary'} size={'large'}>
          Login
        </Button>
        <Flex align={'center'} justify={'center'} className={styles['help-link']}>
          <div>New to Shopkone? </div>
          <Button onClick={() => { nav('/accounts/signup') }} size={'small'} className={styles['link-btn']} type={'link'}>
            <Flex style={{ fontSize: 13 }} align={'center'} gap={4}>
              <div>Get started</div>
              <ArrowRight className={styles['link-icon']} />
            </Flex>
          </Button>
        </Flex>
      </Form>
    </div>
  )
}
