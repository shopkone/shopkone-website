import { useEffect } from 'react'
import { IconChevronRight } from '@tabler/icons-react'
import { useRequest } from 'ahooks'
import { Flex } from 'antd'
import classNames from 'classnames'

import { BlockData, PartData } from '@/api/design/data-list'
import { BlockSchema, DesignSchemaListApi, SectionSchema, SettingSchema } from '@/api/design/schema-list'
import IconButton from '@/components/icon-button'
import { useDesignState } from '@/pages/mange/design/state'

import styles from './index.module.less'

export interface RenderPartProps {
  part?: PartData
}

export default function RenderPart (props: RenderPartProps) {
  const { part } = props
  const schemaList = useRequest(DesignSchemaListApi, { manual: true })
  const setEditing = useDesignState(state => state.setEditing)
  const editing = useDesignState(state => state.editing)
  const iframe = useDesignState(state => state.iframe)
  const update = useDesignState(state => state.update)

  useEffect(() => {
    if (!part?.sections) return
    const t = Object.values(part.sections).map(i => i.type)
    schemaList.run({ type: t })
  }, [part?.sections])

  const setSectionEdit = (id: string, schema?: SectionSchema) => {
    const section = part?.sections[id]
    if (id === editing?.id) return
    if (!section) return
    const settings: SettingSchema[] = schema?.settings || []
    Object.keys(part?.sections[id]?.settings || {})?.forEach(i => {
      const setting = settings.find(ii => ii.id === i)
      if (!setting) return
      setting.__kimi_value = part?.sections[id]?.settings[i]
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
    iframe.send('SELECT', { id })
  }

  const setBlockEdit = (id: string, schema?: BlockSchema, block?: BlockData, parent?: string) => {
    if (!block || !schema) return
    const settings: SettingSchema[] = schema?.settings || []
    Object.keys(block.settings || {}).forEach(i => {
      const setting = settings.find(ii => ii.id === i)
      if (!setting) return
      setting.__kimi_value = block.settings[i]
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
    iframe.send('SELECT', { id: parent, blockId: id })
  }

  useEffect(() => {
    if (!update?.section_id || (part?.type !== update?.part_name)) return
    if (!part?.sections) return
    if (update.block_id) {
      part.sections[update?.section_id].blocks[update.block_id].settings[update.key] = update.value
    } else {
      part.sections[update?.section_id].settings[update.key] = update.value
    }
  }, [update?.value, update?.key])

  if (!part) return null

  return (
    <div>
      <div>{part.name}</div>
      <div>
        {part?.order?.map(key => {
          const section = part.sections[key]
          const sectionSchema = schemaList?.data?.find(i => i.type === section.type)
          if (!section) return null
          return (
            <div key={key}>
              <Flex align={'center'}>
                <IconButton type={'text'} size={24}>
                  <IconChevronRight size={14} />
                </IconButton>
                <div
                  className={
                    classNames(styles.itemBtn, { [styles.itemBtnActive]: editing?.id === key && editing.type === 'section' })
                  }
                  onClick={() => {
                    setSectionEdit(key, sectionSchema)
                  }}
                >
                  <Flex align={'center'} flex={1}>
                    <span>
                      {schemaList?.data?.find(i => i.type === section.type)?.name}
                    </span>
                  </Flex>
                </div>
              </Flex>

              <div>
                {
                  section?.block_order?.map((blockKey) => {
                    const block = section.blocks[blockKey]
                    const blockSchema = sectionSchema?.blocks.find(i => i.type === block.type)
                    return (
                      <div
                        onClick={() => { setBlockEdit(blockKey, blockSchema, block, key) }}
                        className={
                        classNames(
                          styles.block,
                          { [styles.itemBtnActive]: editing?.id === blockKey && editing.parent === key && editing.type === 'block' })
                        }
                        key={blockKey}
                      >
                        {blockSchema?.name}
                      </div>
                    )
                  })
                }
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
