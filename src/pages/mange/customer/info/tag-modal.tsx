import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IconPlus, IconTrash } from '@tabler/icons-react'
import { Button, Flex, Input } from 'antd'

import IconButton from '@/components/icon-button'
import SModal from '@/components/s-modal'
import { UseOpenType } from '@/hooks/useOpen'
import { genId } from '@/utils/random'

export interface TagModalProps {
  openInfo: UseOpenType<string[]>
  onFresh: () => void
}

export default function TagModal (props: TagModalProps) {
  const { openInfo } = props
  const { t } = useTranslation('customers', { keyPrefix: 'info' })
  const [value, setValue] = useState<Array<{ id: number, value: string }>>([])
  const ref = useRef<HTMLInputElement>(null)
  const inputRefs = useRef<Record<string, HTMLInputElement>>({})

  const onAddItem = () => {
    const id = genId()
    setValue([...value, { id, value: '' }])
    setTimeout(() => {
      ref?.current?.scrollTo({ top: 100000, behavior: 'smooth' })
      inputRefs.current[id.toString()]?.focus()
    })
  }

  const onRemoveItem = (id: number) => {
    setValue(value.filter(i => i.id !== id))
  }

  const onChange = (id: number, v: string) => {
    setValue(value.map(i => i.id === id ? { ...i, value: v } : i))
  }

  useEffect(() => {
    if (!openInfo.open) return
    setValue(openInfo.data?.map(i => ({ id: genId(), value: i })) || [])
    inputRefs.current = {}
  }, [openInfo.open])

  return (
    <SModal
      onCancel={openInfo.close}
      title={t('编辑标签')}
      open={openInfo.open}
      width={500}
    >
      <Flex
        ref={ref}
        gap={8}
        vertical
        style={{ padding: 16, height: 500, overflowY: 'auto' }}
      >
        {
            value.map((item) => (
              <Flex gap={12} align={'center'} key={item.id}>
                <Input
                  ref={el => {
                    if (inputRefs.current) {
                      // @ts-expect-error
                      inputRefs.current[item.id.toString()] = el
                    }
                  }}
                  value={item.value}
                  onChange={e => { onChange(item.id, e.target.value) }}
                />
                <IconButton
                  type={'text'}
                  onClick={() => { onRemoveItem(item.id) }}
                  size={24}
                >
                  <IconTrash size={15} />
                </IconButton>
              </Flex>
            ))
          }
        <div>
          <Button
            onClick={onAddItem}
            size={'small'}
            style={{ marginTop: value?.length ? 8 : 0 }}
          >
            <IconPlus
              style={{ position: 'relative', top: -1 }}
              size={13}
            />
            {t('添加标签')}
          </Button>
        </div>
      </Flex>
    </SModal>
  )
}
