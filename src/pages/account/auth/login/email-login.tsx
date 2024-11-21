import { useTranslation } from 'react-i18next'
import { useRequest } from 'ahooks'
import { Button, Form, Input } from 'antd'

import { LoginApi } from '@/api/account/login'
import { useModal } from '@/components/s-modal'
import styles from '@/pages/account/index.module.less'
import { EMAIL_REG } from '@/utils/regular'
import { setStorage, STORAGE_KEY } from '@/utils/storage-key'

export default function EmailLogin () {
  const login = useRequest(LoginApi, { manual: true })
  const { t } = useTranslation('account', { keyPrefix: 'login' })
  const form = Form.useFormInstance()
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
      <Form.Item
        rules={[{ required: true }, { pattern: EMAIL_REG, message: t('请输入有效的邮箱') }]}
        name={'email'}
        style={{ marginBottom: 20 }}
      >
        <Input autoFocus onPressEnter={onLogin} size={'large'} placeholder={t('邮箱')} />
      </Form.Item>
      <Form.Item className={'mb0'} name={'password'}>
        <Input.Password placeholder={t('密码')} onPressEnter={onLogin} autoComplete={'off'} size={'large'} />
      </Form.Item>
      <Button style={{ marginLeft: -8, marginTop: 4 }} type={'link'} size={'small'}>{t('忘记密码？')}</Button>
      <Button loading={login.loading} onClick={onLogin} className={styles.btn} block type={'primary'} size={'large'}>
        {t('登录1')}
      </Button>
    </div>
  )
}
