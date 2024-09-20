import { useNavigate } from 'react-router-dom'
import { ArrowRight } from '@icon-park/react'
import { useRequest } from 'ahooks'
import { Button, Flex, Form, Input } from 'antd'

import { LoginApi } from '@/api/account/login'
import { useModal } from '@/components/s-modal'
import { setStorage, STORAGE_KEY } from '@/utils/storage-key'

import styles from '../../index.module.less'

export default function Login () {
  const [form] = Form.useForm()
  const nav = useNavigate()

  const login = useRequest(LoginApi, { manual: true })

  const EMAIL_REG = /^[a-zA-Z0-9_.]+@[a-zA-Z0-9-]+[.a-zA-Z]+$/
  const password = Form.useWatch('password', form)
  const modal = useModal()
  const onLogin = async () => {
    if (login.loading) return
    await form.validateFields()
    if (!password || password?.length < 8) {
      modal.info({
        content: 'The password you entered is incorrect. Please try again.'
      })
      return
    }
    const ret = await login.runAsync(form.getFieldsValue())
    if (!ret.token) return
    setStorage(STORAGE_KEY.TOKEN, ret.token)
    window.location.href = '/'
  }

  return (
    <div>
      <div className={styles.logo}>Shopkone</div>
      <div className={styles.title}>Log in</div>
      <div className={styles.desc}>Continue to Shopkone</div>

      <Form layout={'vertical'} form={form}>
        <Form.Item rules={[{ required: true }, { pattern: EMAIL_REG, message: 'Please enter a valid email address.' }]} label={'Email'} name={'email'}>
          <Input onPressEnter={onLogin} size={'large'} />
        </Form.Item>
        <Form.Item className={'mb0'} name={'password'} label={'Password'}>
          <Input.Password onPressEnter={onLogin} autoComplete={'off'} size={'large'} />
        </Form.Item>
        <Button style={{ marginLeft: -8, marginTop: 4 }} type={'link'} size={'small'}>Forgot password?</Button>
        <Button loading={login.loading} onClick={onLogin} className={styles.btn} block type={'primary'} size={'large'}>
          Login
        </Button>
        <Flex align={'center'} justify={'center'} className={styles['help-link']}>
          <div>New to Shopkone? </div>
          <Button onClick={() => { nav('/auth/signup') }} size={'small'} className={styles['link-btn']} type={'link'}>
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
