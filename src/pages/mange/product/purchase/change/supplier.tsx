import { ReactNode, useState } from 'react'
import { useRequest } from 'ahooks'
import { Button, Flex, Typography } from 'antd'

import { SupplierListApi } from '@/api/product/supplier-list'
import SRender from '@/components/s-render'
import SSelect from '@/components/s-select'
import { useI18n } from '@/hooks/use-lang'
import { useOpen } from '@/hooks/useOpen'
import CreateSupplier from '@/pages/mange/product/purchase/change/create-supplier'
import styles from '@/pages/mange/product/purchase/change/index.module.less'
import { renderText } from '@/utils/render-text'

export interface SupplierProps {
  value?: number
  onChange?: (id: number) => void
  infoMode: ReactNode
}

export default function Supplier (props: SupplierProps) {
  const { value, onChange, infoMode } = props
  const t = useI18n()

  const supplierList = useRequest(SupplierListApi)
  const [openSelect, setOpenSelect] = useState(false)

  const supplierInfo = useOpen()

  return (
    <Flex style={{ maxWidth: 433 }} align={'flex-end'}>
      <SRender render={!infoMode} style={{ minWidth: 0, flex: value ? undefined : 1 }}>
        <SSelect
          value={value}
          onChange={onChange}
          loading={supplierList.loading}
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
                  {t('Create new supplier')}
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
          <Button type={'link'} size={'small'}>
            {t('供应商详细信息')}
          </Button>
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
