import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IconChevronRight, IconCirclePlus, IconEye, IconGripVertical, IconTrash } from '@tabler/icons-react'
import { useRequest } from 'ahooks'
import { Button, Flex, Typography } from 'antd'
import classNames from 'classnames'

import { BlockData, PartData } from '@/api/design/data-list'
import { BlockSchema, DesignSchemaListApi, SectionSchema, SettingSchema } from '@/api/design/schema-list'
import SRender from '@/components/s-render'
import { useDesignState } from '@/pages/mange/design/state'

import styles from './index.module.less'

export interface RenderPartProps {
  part?: PartData
}

export default function RenderPart (props: RenderPartProps) {
  const { t } = useTranslation('design')
  const { part } = props
  const schemaList = useRequest(DesignSchemaListApi, { manual: true })
  const setEditing = useDesignState(state => state.setEditing)
  const editing = useDesignState(state => state.editing)
  const iframe = useDesignState(state => state.iframe)
  const update = useDesignState(state => state.update)
  const [expandId, setExpandId] = useState<string[]>([])

  const onExpand = (key: string) => {
    if (expandId.includes(key)) {
      setExpandId(expandId.filter(i => i !== key))
    } else {
      setExpandId([...expandId, key])
    }
  }

  const setSectionEdit = (id: string, schema?: SectionSchema) => {
    setExpandId([...expandId, id])
    try {
      const section = part?.sections?.[id]
      if (id === editing?.id) return
      if (!section) return
      const settings: SettingSchema[] = schema?.settings || []
      Object.keys(part?.sections?.[id]?.settings || {})?.forEach(i => {
        const setting = settings?.find(ii => ii.id === i)
        if (!setting) return
        setting.__kimi_value = part?.sections?.[id]?.settings?.[i]
        if (setting.__kimi_value === undefined) {
          setting.__kimi_value = setting.default
        }
      })
      setEditing({
        id,
        name: schema?.name || '',
        type: 'section',
        schema: settings || [],
        parent: '',
        part_name: part?.type
      })
      iframe.send('SELECT', { id, name: schema?.name })
    } catch {
      console.log('渲染异常')
    }
  }

  const setBlockEdit = (id: string, schema?: BlockSchema, block?: BlockData, parent?: string, sectionSchema?: SectionSchema) => {
    if (!block || !schema) return
    const settings: SettingSchema[] = schema?.settings || []
    Object.keys(block.settings || {}).forEach(i => {
      const setting = settings?.find(ii => ii.id === i)
      if (!setting) return
      setting.__kimi_value = block?.settings?.[i]
      if (setting?.__kimi_value === undefined) {
        setting.__kimi_value = setting.default
      }
    })
    setEditing({
      id,
      name: schema?.name || '',
      type: 'block',
      schema: settings || [],
      parent: parent || '',
      part_name: part?.type || ''
    })
    iframe.send('SELECT', { id: parent, blockId: id, name: sectionSchema?.name })
  }

  useEffect(() => {
    if (!update?.section_id || (part?.type !== update?.part_name)) return
    if (!part?.sections) return
    if (update?.block_id && part.sections[update?.section_id]?.blocks?.[update.block_id]) {
      part.sections[update?.section_id].blocks[update.block_id].settings[update.key] = update.value
    } else {
      part.sections[update?.section_id].settings[update.key] = update.value
    }
  }, [update?.value, update?.key])

  useEffect(() => {
    if (!part?.sections) return
    const t = Object.values(part.sections).map(i => i.type)
    schemaList.run({ type: t })
  }, [part?.sections])

  if (!part) return null

  return (
    <div>
      <div className={styles.title}>{part.name || t('模板')}</div>
      <div>
        {part?.order?.map(key => {
          const section = part.sections?.[key]
          const sectionSchema = schemaList?.data?.find(i => i.type === section?.type)
          if (!section) return null
          return (
            <div key={key}>
              <Flex
                className={
                classNames(
                  styles.item,
                  { [styles.itemBtnActive]: editing?.id === key && editing.type === 'section' }
                )
                } style={{ marginLeft: 12 }} align={'center'} justify={'center'}
              >
                <Button
                  className={styles.btn}
                  onClick={() => { onExpand(key) }} type={'text'}
                  style={{ padding: '0 1px', marginRight: 4, borderRadius: 6 }}
                >
                  <IconChevronRight
                    className={expandId.includes(key)
                      ? styles.activeSection
                      : styles.icon}
                    size={14}
                  />
                </Button>
                <Button
                  className={classNames(styles.btn)}
                  type={'text'}
                  style={{ padding: '0 1px', marginRight: 4, borderRadius: 6, height: 22 }}
                >
                  <IconGripVertical size={15} />
                </Button>

                <div
                  className={classNames(styles.itemBtn)}
                  onClick={() => {
                    setSectionEdit(key, sectionSchema)
                  }}
                >
                  <Flex justify={'space-between'} align={'center'} flex={1}>
                    <Typography.Text ellipsis={{ tooltip: true }} className={styles.text}>
                      {schemaList?.data?.find(i => i.type === section.type)?.name}
                    </Typography.Text>
                    <div className={styles.actions}>
                      <Flex align={'center'} gap={4} flex={1} justify={'right'}>
                        <Button
                          className={styles.btn}
                          type={'text'}
                          style={{ padding: '0 2px', marginRight: 4, borderRadius: 6, height: 22 }}
                        >
                          <IconTrash size={15} />
                        </Button>
                        <Button
                          className={styles.btn}
                          type={'text'}
                          style={{ padding: '0 2px', marginRight: 4, borderRadius: 6, height: 22, marginTop: 1 }}
                        >
                          <IconEye size={17} />
                        </Button>
                      </Flex>
                    </div>
                  </Flex>
                </div>
              </Flex>

              <SRender render={expandId.includes(key)}>
                <div>
                  {
                    section?.block_order?.map((blockKey) => {
                      const block = section?.blocks?.[blockKey]
                      const blockSchema = sectionSchema?.blocks.find(i => i.type === block.type)
                      return (
                        <Flex
                          align={'center'}
                          onClick={() => {
                            setBlockEdit(blockKey, blockSchema, block, key, sectionSchema)
                          }}
                          className={
                            classNames(
                              styles.block,
                              { [styles.itemBtnActive]: editing?.id === blockKey && editing.parent === key && editing.type === 'block' })
                          }
                          key={blockKey}
                        >
                          <Button
                            className={styles.btn}
                            type={'text'}
                            style={{ padding: '0 2px', marginRight: 4, borderRadius: 6, height: 22 }}
                          >
                            <IconGripVertical size={15} />
                          </Button>
                          {blockSchema?.name}
                          <Flex className={styles.actions} align={'center'} gap={4} flex={1} justify={'right'}>
                            <Button
                              className={styles.btn}
                              type={'text'}
                              style={{ padding: '0 2px', marginRight: 4, borderRadius: 6, height: 22 }}
                            >
                              <IconTrash size={15} />
                            </Button>
                            <Button
                              className={styles.btn}
                              type={'text'}
                              style={{ padding: '0 2px', marginRight: 4, borderRadius: 6, height: 22, marginTop: 1 }}
                            >
                              <IconEye size={17} />
                            </Button>
                          </Flex>
                        </Flex>
                      )
                    })
                  }
                  <Flex align={'center'} gap={8} className={`primary-text ${styles.block}`}>
                    <IconCirclePlus size={15} style={{ marginTop: 2, marginLeft: 4 }} />
                    <div>{t('添加分区')}</div>
                  </Flex>
                </div>
              </SRender>
            </div>
          )
        })}
      </div>
    </div>
  )
}
