import { Trans } from 'react-i18next'
import { useMemoizedFn } from 'ahooks'
import { Button } from 'antd'

import { useNav } from '@/hooks/use-nav'

export interface TransHandleProps {
  i18nkey: string
  title: string
  to: string
  children: React.ReactNode
}

export default function TransHandle (props: TransHandleProps) {
  const { i18nkey, title, to, children } = props
  const nav = useNav()

  const LangHandle = useMemoizedFn((p) => {
    return (
      <div style={{
        display: 'inline-block',
        marginLeft: -6,
        marginRight: -6
      }}
      >
        <Button
          type={'link'}
          size={'small'}
          onClick={() => {
            nav(to, { title })
          }}
        >
          {children}
        </Button>
      </div>
    )
  })

  return (
    <Trans
      components={{ link: <LangHandle /> }}
      i18nKey={i18nkey}
    />
  )
}
