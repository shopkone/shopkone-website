import { useState } from 'react'
import { useRequest } from 'ahooks'
import { Button, Flex } from 'antd'

import { SupplierListApi } from '@/api/product/supplier-list'
import SRender from '@/components/s-render'
import SSelect from '@/components/s-select'
import { useI18n } from '@/hooks/use-lang'
import { useOpen } from '@/hooks/useOpen'
import CreateSupplier from '@/pages/mange/product/purchase/change/create-supplier'
import styles from '@/pages/mange/product/purchase/change/index.module.less'

export interface SupplierProps {
  value?: number
  onChange?: (id: number) => void
}

export default function Supplier (props: SupplierProps) {
  const { value, onChange } = props
  const t = useI18n()

  const supplierList = useRequest(SupplierListApi)
  const [openSelect, setOpenSelect] = useState(false)

  const supplierInfo = useOpen()

  return (
    <Flex style={{ overflow: 'hidden', maxWidth: 433 }} align={'center'}>
      <div style={{ minWidth: 0, flex: value ? undefined : 1 }}>
        <SSelect
          value={value}
          onChange={onChange}
          loading={supplierList.loading}
          options={supplierList.data?.map(item => ({ value: item.id, label: item.address?.legal_business_name }))}
          open={openSelect}
          onDropdownVisibleChange={setOpenSelect}
          dropdownStyle={{ minWidth: 300 }}
          placeholder={t('Select supplier')}
          className={styles.select}
          variant={'borderless'}
          dropdownRender={node => (
            <Flex vertical>
              {node}
              <div className={'line'} />
              <div style={{ marginBottom: 6, marginLeft: 8, marginTop: -4 }}>
                <Button
                  onClick={() => {
                    setOpenSelect(false)
                    supplierInfo.edit()
                  }}
                  size={'small'}
                  type={'text'}
                  className={'primary-text'}
                >
                  Create new supplier
                </Button>
              </div>
            </Flex>
          )}
        />
      </div>

      <SRender render={value}>
        <Flex style={{ flexShrink: 0 }} flex={1} justify={'flex-end'}>
          <Button type={'text'} className={'primary-text'} size={'small'}>
            Supplier Details
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
