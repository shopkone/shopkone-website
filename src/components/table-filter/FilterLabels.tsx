import { ReactNode } from 'react'
import { IconX } from '@tabler/icons-react'
import { Flex, FlexProps } from 'antd'

import Status from '@/components/status'
import styles from '@/pages/mange/settings/files/index.module.less'

export interface FiltersProps extends Omit<FlexProps, 'children'> {
  labels: Record<string, ReactNode>
  value: any
  onChange?: (value: FiltersProps['value']) => void
}

export default function FilterLabels (props: FiltersProps) {
  const { labels, onChange, value, ...rest } = props
  return (
    <Flex {...rest} gap={16}>
      {
        Object.keys(labels).filter(i => labels[i]).map(key => (
          <Status style={{ padding: '10px 6px' }} type={'info'} key={key}>
            {labels[key]}
            <IconX
              className={styles.clearBtn}
              onClick={() => onChange?.(Object.assign({}, value, { [key]: undefined }))}
              style={{ marginLeft: 8, marginTop: -1, marginRight: -4 }}
              size={14}
            />
          </Status>
        ))
      }
    </Flex>
  )
}
