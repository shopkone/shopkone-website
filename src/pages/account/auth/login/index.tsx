import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation('account', { keyPrefix: 'login' })

  const EMAIL_REG = /^[a-zA-Z0-9_.]+@[a-zA-Z0-9-]+[.a-zA-Z]+$/
  const password = Form.useWatch('password', form)
  const modal = useModal()
  const onLogin = async () => {
    if (login.loading) return
    await form.validateFields()
    if (!password || password?.length < 8) {
      modal.info({
        content: t('您输入的密码不正确，请重试。')
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
      <div className={styles.title}>{t('登录')}</div>
      <div className={styles.desc}>{t('进入 Shopkone')}</div>

      <Form layout={'vertical'} form={form}>
        <Form.Item rules={[{ required: true }, { pattern: EMAIL_REG, message: t('请输入有效的邮箱') }]} label={t('邮箱')} name={'email'}>
          <Input onPressEnter={onLogin} size={'large'} />
        </Form.Item>
        <Form.Item className={'mb0'} name={'password'} label={t('密码')}>
          <Input.Password onPressEnter={onLogin} autoComplete={'off'} size={'large'} />
        </Form.Item>
        <Button style={{ marginLeft: -8, marginTop: 4 }} type={'link'} size={'small'}>{t('忘记密码？')}</Button>
        <Button loading={login.loading} onClick={onLogin} className={styles.btn} block type={'primary'} size={'large'}>
          {t('登录1')}
        </Button>
        <Flex align={'center'} justify={'center'} className={styles['help-link']}>
          <div>{t('还没账号？')} </div>
          <Button onClick={() => { nav('/auth/signup') }} size={'small'} className={styles['link-btn']} type={'link'}>
            <Flex style={{ fontSize: 13 }} align={'center'} gap={4}>
              <div>{t('立即注册')}</div>
              <ArrowRight className={styles['link-icon']} />
            </Flex>
          </Button>
        </Flex>
      </Form>
    </div>
  )
}
