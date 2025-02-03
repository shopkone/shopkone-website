import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IconCirclePlus } from '@tabler/icons-react'
import { Flex } from 'antd'

import SRender from '@/components/s-render'
import OptionItem, {
  OptionValue
} from '@/pages/mange/product/product/product-change/variant-set/variant-options/option-item'
import { genId } from '@/utils/random'

import styles from './index.module.less'

export default function VariantOptions () {
  const { t } = useTranslation('product', { keyPrefix: 'product' })
  const [options, setOptions] = useState<OptionValue[]>([])

  const onChangeHandle = (option: OptionValue) => {
    setOptions(options.map(item => {
      if (item.id === option.id) {
        return option
      }
      return item
    }))
  }

  const onAddHandle = () => {
    setOptions([...options, { label: '', values: [''], id: genId() }])
  }

  const onRemoveHandle = (optionId: number) => {
    setOptions(options.filter(item => item.id !== optionId))
  }

  useEffect(() => {
    setOptions([{ label: '', values: [''], id: genId() }])
  }, [])

  return (
    <div className={styles.inner}>
      {
        options.map((option, index) => (
          <OptionItem
            length={options.length}
            onRemove={() => { onRemoveHandle(option.id) }}
            onChange={onChangeHandle}
            option={option}
            key={option.id}
          />
        ))
      }
      <SRender render={options.length < 3}>
        <Flex onClick={onAddHandle} className={styles.btn} align={'center'} gap={6}>
          <IconCirclePlus size={14} />
          {t('添加其它选项')}
        </Flex>
      </SRender>
    </div>
  )
}
