import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRequest } from 'ahooks'
import { Button, Checkbox, Flex, Input } from 'antd'

import { useLanguageList } from '@/api/base/languages'
import { LanguageCreateApi } from '@/api/languages/add'
import SLoading from '@/components/s-loading'
import { sMessage } from '@/components/s-message'
import SModal from '@/components/s-modal'
import useBoxShadow from '@/hooks/use-boxshadow'
import { UseOpenType } from '@/hooks/useOpen'

import styles from './index.module.less'

export interface AddLanguageProps {
  openInfo: UseOpenType<string[]>
  onFresh: () => void
}

export default function AddLanguage (props: AddLanguageProps) {
  const languages = useLanguageList()
  const { t } = useTranslation('settings', { keyPrefix: 'language' })
  const ref = useRef<HTMLDivElement>(null)
  const boxStyle = useBoxShadow(ref)
  const create = useRequest(LanguageCreateApi, { manual: true })
  const [value, setValue] = useState<string[]>([])

  const onChange = (code: string) => {
    setValue(value => {
      if (value.includes(code)) return value.filter(i => i !== code)
      return [...value, code]
    })
  }

  const onOk = async () => {
    if (!value.length) return
    await create.runAsync({
      codes: value
    })
    setValue([])
    sMessage.success(t('添加成功'))
    props.openInfo.close()
    props.onFresh()
  }

  useEffect(() => {
    if (props.openInfo.open) {
      setValue([])
    }
  }, [props.openInfo.open])

  return (
    <SModal
      onOk={onOk}
      onCancel={props.openInfo.close}
      title={t('添加语言')}
      footer={(
        <Flex align={'center'} justify={'space-between'}>
          <div>
            {t('已选x个语言', { x: value.length })}
          </div>
          <Flex align={'center'} gap={12}>
            <Button onClick={props.openInfo.close}>{t('取消')}</Button>
            <Button type={'primary'} onClick={onOk} loading={create.loading} disabled={!value.length}>
              {t('添加')}
            </Button>
          </Flex>
        </Flex>
      )}
      open={props.openInfo.open}
    >
      <div style={boxStyle} className={styles.search}>
        <Input autoComplete={'off'} placeholder={t('搜索语言')} />
      </div>
      <div style={{ overflowY: 'auto', height: 450 }}>
        <div ref={ref} />
        <SLoading loading={languages.loading}>
          <Flex vertical>
            {
              languages.data?.filter(ii => !props.openInfo?.data?.includes(ii.value))?.map(i => (
                <div className={styles.item} key={i.value} onClick={() => { onChange(i.value) }}>
                  <Checkbox checked={value.includes(i.value)} onChange={() => { onChange(i.value) }}>
                    {i.label}
                  </Checkbox>
                </div>
              ))
            }
          </Flex>
          <div style={{ height: 20 }} />
        </SLoading>
      </div>
    </SModal>
  )
}
