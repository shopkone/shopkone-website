import { ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRequest } from 'ahooks'
import { Button, Flex, Popover, Typography } from 'antd'

import { useCountries } from '@/api/base/countries'
import { SupplierListApi, SupplierListRes } from '@/api/product/supplier-list'
import SRender from '@/components/s-render'
import SSelect from '@/components/s-select'
import { useOpen } from '@/hooks/useOpen'
import CreateSupplier from '@/pages/mange/product/purchase/change/create-supplier'
import styles from '@/pages/mange/product/purchase/change/index.module.less'
import { formatInfo } from '@/utils/format'
import { renderText } from '@/utils/render-text'

export interface SupplierProps {
  value?: number
  onChange?: (id: number) => void
  infoMode: ReactNode
}

export default function Supplier (props: SupplierProps) {
  const { value, onChange, infoMode } = props
  const { t } = useTranslation('product', { keyPrefix: 'purchase' })

  const supplierList = useRequest(SupplierListApi)
  const [openSelect, setOpenSelect] = useState(false)
  const countries = useCountries()
  const supplierInfo = useOpen<SupplierListRes>()
  const [open, setOpen] = useState(false)

  return (
    <Flex style={{ maxWidth: 433 }} align={'flex-end'}>
      <SRender render={!infoMode} style={{ minWidth: 0, flex: value ? undefined : 1 }}>
        <SSelect
          value={value}
          onChange={onChange}
          loading={supplierList.loading || countries.loading}
          options={supplierList.data?.map(item => ({ value: item.id, label: item.address?.legal_business_name }))}
          open={openSelect}
          onDropdownVisibleChange={setOpenSelect}
          dropdownStyle={{ minWidth: 300 }}
          placeholder={t('选择供应商')}
          className={styles.select}
          variant={'borderless'}
          dropdownRender={node => (
            <Flex vertical>
              {node}
              <div className={'line'} />
              <div style={{ marginBottom: 6, marginTop: -4 }}>
                <Button
                  onClick={() => {
                    setOpenSelect(false)
                    supplierInfo.edit()
                  }}
                  size={'small'}
                  type={'link'}
                >
                  {t('创建供应商1')}
                </Button>
              </div>
            </Flex>
          )}
        />
      </SRender>

      <SRender render={infoMode}>
        <Typography.Text>
          {renderText(supplierList?.data?.find(i => i.id === value)?.address?.legal_business_name)}
        </Typography.Text>
      </SRender>

      <SRender render={value}>
        <Flex style={{ flexShrink: 0, position: 'relative', top: infoMode ? 3 : -3 }} flex={1} justify={'flex-end'}>
          <Popover
            arrow={false}
            placement={'bottom'}
            open={open}
            onOpenChange={setOpen}
            trigger={'click'}
            content={
              <div style={{ maxWidth: 300 }}>
                <div style={{
                  fontWeight: 600,
                  fontSize: 14,
                  marginBottom: 8
                }}
                >
                  {renderText(supplierList?.data?.find(i => i.id === value)?.address?.legal_business_name)}
                </div>
                {formatInfo(countries, supplierList?.data?.find(i => i.id === value)?.address)}
                <Button
                  onClick={() => {
                    setOpen(false)
                    supplierInfo.edit(supplierList?.data?.find(i => i.id === value))
                  }}
                  style={{
                    marginLeft: -8,
                    marginTop: 8
                  }}
                  type={'link'}
                  size={'small'}
                >
                  {t('编辑供应商信息1')}
                </Button>
              </div>
            }
          >
            <Button type={'link'} size={'small'}>
              {t('供应商详细信息')}
            </Button>
          </Popover>
        </Flex>
      </SRender>

      <CreateSupplier
        onOk={async (id) => {
          await supplierList.refreshAsync()
          onChange?.(id)
        }}
        info={supplierInfo}
      />
    </Flex>
  )
}
