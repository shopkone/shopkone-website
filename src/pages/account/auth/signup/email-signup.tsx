import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LoadingOutlined } from '@ant-design/icons'
import { IconCircleCheckFilled } from '@tabler/icons-react'
import { useCountDown, useMemoizedFn, useRequest } from 'ahooks'
import { Button, ButtonProps, Flex, Form, Input, Progress, Spin } from 'antd'

import { LoginApi } from '@/api/account/login'
import { RegisterApi } from '@/api/account/register'
import { SendCodeApi } from '@/api/account/send-code'
import SRender from '@/components/s-render'
import styles from '@/pages/account/index.module.less'
import { setStorage, STORAGE_KEY } from '@/utils/storage-key'

export default function EmailSignup () {
  const form = Form.useFormInstance()

  const [targetDate, setTargetDate] = useState<number>()
  const [count] = useCountDown({ targetDate })
  const [sendEmail, setSendEmail] = useState<string>()

  const send = useRequest(SendCodeApi, { manual: true })
  const register = useRequest(RegisterApi, { manual: true })
  const login = useRequest(LoginApi, { manual: true })
  const { t } = useTranslation('account', { keyPrefix: 'signup' })

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

    // 检测密码长度，最短8位
    if (password?.length >= 8) {
      strength += 1
    }

    // 检测是否包含字母和数字的组合
    if (/[a-zA-Z]/.test(password) && /\d/.test(password)) {
      strength += 1
    }

    // 检测是否包含特殊字符
    if (/[\W_]/.test(password)) {
      strength += 1
    }

    return strength
  }, [password, isValidPwd])

  const pwdStrengthStr = useMemo(() => {
    if (!isValidPwd) return ''
    if (checkPasswordStrength === 1) return t('弱')
    if (checkPasswordStrength === 2) return t('中')
    return '强'
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
    const ret = await login.runAsync({ email, password })
    if (!ret.token) return
    setStorage(STORAGE_KEY.TOKEN, ret.token)
    window.location.href = '/'
  })

  return (
    <div>
      <Form.Item
        rules={[{ required: true }, {
          pattern: EMAIL_REG,
          message: t('请输入有效的邮箱')
        }]}
        name={'email'}
      >
        <Input placeholder={t('邮箱')} onPressEnter={registerAccount} size={'large'} />
      </Form.Item>
      <Form.Item className={sendEmail ? 'mb0' : ''} name={'code'}>
        <Input
          placeholder={t('验证码')}
          onPressEnter={registerAccount}
          suffix={
            <Button
              disabled={!!count || send.loading}
              onClick={sendCode}
              className={styles.secondary}
              size={'small'}
              type={'text'}
            >
              <SRender render={!send.loading}>
                <SRender render={sendEmail ? !count : false}>
                  {t('重新发送')}
                </SRender>
                <SRender render={!sendEmail}>
                  {t('发送验证码')}
                </SRender>
                <SRender render={count}>
                  {t('重新发送1')}
                  （{Math.round(count / 1000)}s）
                </SRender>
              </SRender>
              <SRender render={send.loading}>
                <Spin spinning={send.loading} indicator={<LoadingOutlined />} />
              </SRender>
            </Button>
          }
          maxLength={6}
          max={999999}
          autoComplete={'off'}
          size={'large'}
        />
      </Form.Item>
      <SRender render={sendEmail} className={styles.tips}>
        <Flex align={'center'} gap={4}>
          <IconCircleCheckFilled color={'#2e7d32'} size={16} />
          {t('验证码已发送至邮箱', { email: sendEmail })}
        </Flex>
      </SRender>
      <Form.Item name={'password'} className={'mb0'}>
        <Input.Password onPressEnter={registerAccount} placeholder={t('密码')} autoComplete={'off'} size={'large'} />
      </Form.Item>
      <Progress
        showInfo={false}
        status={isValidPwd ? (checkPasswordStrength === 1 ? 'normal' : 'success') : undefined}
        className={styles.progress}
        percent={(isValidPwd) ? (34 * checkPasswordStrength) : 0}
      />
      <SRender className={styles.tips} render={isValidPwd}>
        <span style={{ fontWeight: 'bolder' }}>{t('密码强度', { pwdStrengthStr })}</span>
      </SRender>
      <SRender render={!isValidPwd} className={styles.tips}>
        {t('密码要求')}
      </SRender>
      <Button
        loading={register.loading || login.loading}
        onClick={registerAccount}
        className={styles.btn}
        disabled={!isValidPwd || !isValidEmail || !isValidCode}
        block
        type={'primary'}
        size={'large'}
      >
        {t('注册1')}
      </Button>

    </div>
  )
}
