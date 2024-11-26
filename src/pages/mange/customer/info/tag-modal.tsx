import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IconPlus, IconTrash } from '@tabler/icons-react'
import { useMemoizedFn, useRequest } from 'ahooks'
import { Button, Flex, Input } from 'antd'

import { CustomerUpdateTagsApi } from '@/api/customer/update-tags'
import IconButton from '@/components/icon-button'
import { sMessage } from '@/components/s-message'
import SModal from '@/components/s-modal'
import { UseOpenType } from '@/hooks/useOpen'
import { genId } from '@/utils/random'

export interface TagModalProps {
  openInfo: UseOpenType<string[]>
  onFresh: () => void
  customerId: number
}

export default function TagModal (props: TagModalProps) {
  const { openInfo, customerId, onFresh } = props
  const { t } = useTranslation('customers', { keyPrefix: 'info' })
  const [value, setValue] = useState<Array<{ id: number, value: string }>>([])
  const ref = useRef<HTMLInputElement>(null)
  const inputRefs = useRef<Record<string, HTMLInputElement>>({})
  const update = useRequest(CustomerUpdateTagsApi, { manual: true })

  const onAddItem = useMemoizedFn(() => {
    const id = genId()
    setValue([...value, { id, value: '' }])
    setTimeout(() => {
      ref?.current?.scrollTo({ top: 100000, behavior: 'smooth' })
      setTimeout(() => {
        inputRefs.current[id.toString()]?.focus()
      }, 200)
    })
  })

  const onRemoveItem = useMemoizedFn((id: number) => {
    setValue(value.filter(i => i.id !== id))
  })

  const onChange = useMemoizedFn((id: number, v: string) => {
    setValue(value.map(i => i.id === id ? { ...i, value: v } : i))
  })

  const onOk = async () => {
    const tags = value.map(i => i.value).filter(Boolean)
    await update.runAsync({ id: customerId, tags: [...new Set(tags)] })
    sMessage.success(t('更新成功'))
    onFresh()
    openInfo.close()
  }

  useEffect(() => {
    if (!openInfo.open) return
    setValue(openInfo.data?.map(i => ({ id: genId(), value: i })) || [])
    inputRefs.current = {}
  }, [openInfo.open])

  return (
    <SModal
      confirmLoading={update.loading}
      onCancel={openInfo.close}
      title={t('编辑标签')}
      open={openInfo.open}
      width={500}
      onOk={onOk}
    >
      <Flex
        ref={ref}
        gap={8}
        vertical
        style={{ padding: 16, height: 500, overflowY: 'auto', paddingBottom: 64 }}
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
