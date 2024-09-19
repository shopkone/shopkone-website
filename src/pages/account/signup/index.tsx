import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoadingOutlined } from '@ant-design/icons'
import { ArrowRight } from '@icon-park/react'
import { useCountDown, useMemoizedFn, useRequest } from 'ahooks'
import { Button, ButtonProps, Flex, Form, Input, Progress, Spin } from 'antd'

import { LoginApi } from '@/api/account/login'
import { RegisterApi } from '@/api/account/register'
import { SendCodeApi } from '@/api/account/send-code'
import SInputNumber from '@/components/s-input-number'
import { sMessage } from '@/components/s-message'
import SRender from '@/components/s-render'

import styles from '../index.module.less'

export default function Signup () {
  const [form] = Form.useForm()
  const nav = useNavigate()

  const [targetDate, setTargetDate] = useState<number>()
  const [count] = useCountDown({ targetDate })
  const [sendEmail, setSendEmail] = useState<string>()

  const send = useRequest(SendCodeApi, { manual: true })
  const register = useRequest(RegisterApi, { manual: true })
  const login = useRequest(LoginApi, { manual: true })

  const password: string = Form.useWatch('password', form)
  const email: string = Form.useWatch('email', form)
  const code: number = Form.useWatch('code', form)

  // 校验邮箱
  const EMAIL_REG = /^[a-zA-Z0-9_.]+@[a-zA-Z0-9-]+[.a-zA-Z]+$/

  const isValidPwd = useMemo(() => {
    if (!password) return false
    return password && password.length >= 8 && password.length <= 50 && password[0] !== ' ' && password[password.length - 1] !== ' '
  }, [password])
  const isValidEmail = useMemo(() => {
    return email && EMAIL_REG.test(email)
  }, [email])
  const isValidCode = useMemo(() => {
    return code && code.toString()?.length === 6
  }, [code])

  const checkPasswordStrength = useMemo(() => {
    let strength = 0
    // 判断是否包含字母（大写或小写）
    const hasLetters = /[a-zA-Z]/.test(password)
    // 判断是否包含数字
    const hasNumbers = /[0-9]/.test(password)
    // 判断是否包含特殊字符
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    // 判断密码长度
    const hasValidLength = password?.length >= 8
    // 根据规则增加强度分数
    if (hasLetters) strength++
    if (hasNumbers) strength++
    if (hasSpecialChars) strength++
    if (hasValidLength) strength++
    // 根据分数返回强度描述
    if (strength <= 2) {
      return 1 // Weak
    } else if (strength === 3) {
      return 2 // Medium
    } else if (strength === 4) {
      return 2 // Strong
    }
    return 1 // 默认返回弱
  }, [password, isValidPwd])

  const pwdStrengthStr = useMemo(() => {
    if (!isValidPwd) return ''
    if (checkPasswordStrength === 1) return 'weak'
    if (checkPasswordStrength === 2) return 'medium'
    return 'strong'
  }, [checkPasswordStrength, isValidPwd])

  const sendCode: ButtonProps['onClick'] = useMemoizedFn(async (e) => {
    e.stopPropagation()
    await form.validateFields()
    await send.runAsync({ email, type: 'register' })
    setTargetDate(Date.now() + 59 * 1000)
    setSendEmail(email)
  })

  const registerAccount = useMemoizedFn(async () => {
    if (register.loading) return
    await form.validateFields()
    if (!isValidPwd || !isValidEmail || !isValidCode) return
    await register.runAsync({ email, password, code: code.toString() })
    await login.runAsync({ email, password })
    sMessage.success('Login successful!')
    nav('/')
  })

  return (
    <div>
      <div className={styles.logo}>Shopkone</div>
      <div className={styles.title}>Create a Shopkone account</div>
      <div className={styles.desc}>One last step before starting your free trial.</div>

      <Form layout={'vertical'} form={form} colon={false}>
        <Form.Item rules={[{ required: true }, { pattern: EMAIL_REG, message: 'Please enter a valid email address.' }]} label={'Email'} name={'email'}>
          <Input onPressEnter={registerAccount} size={'large'} />
        </Form.Item>
        <Form.Item className={sendEmail ? 'mb0' : ''} name={'code'} label={'Verification code'}>
          <SInputNumber
            onPressEnter={registerAccount}
            suffix={
              <Button disabled={!!count || send.loading} onClick={sendCode} className={styles.secondary} size={'small'} type={'text'}>
                <SRender render={!send.loading}>
                  <SRender render={sendEmail ? !count : false}>
                    Resend
                  </SRender>
                  <SRender render={!sendEmail}>
                    Send Verification Code
                  </SRender>
                  <SRender render={count}>
                    Resend（{Math.round(count / 1000)}s）
                  </SRender>
                </SRender>
                <SRender render={send.loading}>
                  <Spin spinning={send.loading} indicator={<LoadingOutlined />} />
                </SRender>
              </Button>
            }
            uint
            max={999999}
            autoComplete={'off'}
            size={'large'}
          />
        </Form.Item>
        <SRender render={sendEmail} className={styles.tips}>
          A 6-digit code was sent to {sendEmail}.
        </SRender>
        <Form.Item name={'password'} className={'mb0'} label={'Password'}>
          <Input.Password onPressEnter={registerAccount} autoComplete={'off'} size={'large'} />
        </Form.Item>
        <Progress
          showInfo={false}
          status={isValidPwd ? (checkPasswordStrength === 1 ? 'normal' : 'success') : undefined}
          className={styles.progress}
          percent={(isValidPwd) ? (34 * checkPasswordStrength) : 0}
        />
        <SRender className={styles.tips} render={isValidPwd}>
          <span style={{ fontWeight: 'bolder' }}>Password strength: {pwdStrengthStr}.</span> Try lengthening it or adding numbers or symbols.
        </SRender>
        <SRender render={!isValidPwd} className={styles.tips}>
          Your password must be at least 8 characters, and can’t begin or end with a space.
        </SRender>
        <Button loading={register.loading || login.loading} onClick={registerAccount} className={styles.btn} disabled={!isValidPwd || !isValidEmail || !isValidCode} block type={'primary'} size={'large'}>
          Create Shopkone account
        </Button>
        <Flex align={'center'} justify={'center'} className={styles['help-link']}>
          <div>Already have a Shopkone account?</div>
          <Button onClick={() => { nav('/accounts/login') }} size={'small'} className={styles['link-btn']} type={'link'}>
            <Flex style={{ fontSize: 13 }} align={'center'} gap={4}>
              <div>Login</div>
              <ArrowRight className={styles['link-icon']} />
            </Flex>
          </Button>
        </Flex>
      </Form>
    </div>
  )
}
