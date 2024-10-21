import { Card, Flex } from 'antd'

import Page from '@/components/page'
import STable from '@/components/s-table'
import { useI18n } from '@/hooks/use-lang'

export default function Domains () {
  const t = useI18n()
  return (
    <Page type={'settings'} title={t('域名')} width={800} bottom={48}>
      <Flex vertical gap={16}>
        <Card title={t('主域名')}>
          <div className={'tips'} style={{ marginBottom: 12 }}>
            {t('激活后，所有商店域名生成的流量将被重定向到注册的默认域名。')}
          </div>
          <STable
            borderless
            style={{
              border: '1px solid #d0d3d6',
              borderRadius: 12,
              overflow: 'hidden'
            }}
            columns={[]}
            data={[]}
          />
        </Card>
        <Card title={t('域名列表')}>
          <div className={'tips'} style={{ marginBottom: 12 }}>
            <div>
              {t('您的根域名是任何域名命名系统中最高级别的域名。我们强烈建议链接到 www.domain.com 形式的域名。')}
            </div>
            <div style={{ marginTop: 4 }}>
              {t('后缀为 ".fun" 的域名在 Shopkone 中不被支持。')}
            </div>
          </div>
          <STable
            borderless
            className={'table-border'}
            columns={[]}
            data={[]}
          />
        </Card>
        <Card title={t('IP 阻止')}>
          <div className={'tips'} style={{ marginBottom: 12 }}>
            {t('启用后，您可以阻止来自特定国家/地区的访客。')}
          </div>
          <STable
            borderless
            style={{ border: '1px solid #d0d3d6', borderRadius: 12, overflow: 'hidden' }}
            columns={[]}
            data={[]}
          />
        </Card>
      </Flex>
    </Page>
  )
}
