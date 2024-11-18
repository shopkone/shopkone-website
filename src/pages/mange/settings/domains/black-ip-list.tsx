import { useTranslation } from 'react-i18next'
import { Input } from 'antd'

export interface BlackIpListProps {
  value?: string[]
  onChange?: (value: string[]) => void
}

export default function BlackIpList (props: BlackIpListProps) {
  const { value, onChange } = props
  const { t } = useTranslation('settings', { keyPrefix: 'domains' })

  return (
    <div>
      <Input.TextArea
        autoFocus
        autoSize={{ minRows: 11, maxRows: 11 }}
        placeholder={t('请输入IP地址，每行一个')}
        value={value?.join('\n') || ''}
        onChange={e => {
          onChange?.(e.target.value?.split('\n'))
        }}
      />
    </div>
  )
}
