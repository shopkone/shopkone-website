import { MouseEventHandler, useEffect } from 'react'
import { IconPlus, IconX } from '@tabler/icons-react'
import { useRequest } from 'ahooks'
import { ColorPicker, Flex, Input, Radio, Slider, Switch } from 'antd'

import { CollectionOptionsApi } from '@/api/collection/options'
import { SettingSchema } from '@/api/design/schema-list'
import { FileType } from '@/api/file/add-file-record'
import { FileInfoApi } from '@/api/file/file-info'
import { NavListApi } from '@/api/online/navList'
import IconButton from '@/components/icon-button'
import SelectFiles from '@/components/media/select-files'
import SInputNumber from '@/components/s-input-number'
import SLoading from '@/components/s-loading'
import SRender from '@/components/s-render'
import SSelect from '@/components/s-select'
import { useOpen } from '@/hooks/useOpen'

import styles from './index.module.less'

export interface Prop {
  setting: SettingSchema
  isFirst: boolean
  value?: any
  onChange?: (value: any) => void
}

function DCheckBox (props: Prop) {
  const { setting, onChange, value } = props

  return (
    <Flex className={styles.item} gap={12} justify={'space-between'} align={'center'}>
      <div className={styles.label}>{setting.label.replace(':', ' ')}</div>
      <Switch onChange={val => { onChange?.(val) }} value={value} />
    </Flex>
  )
}

function DSelect (props: Prop) {
  const { setting, onChange, value } = props
  return (
    <Flex className={styles.item} gap={4} align={'center'} justify={'space-between'}>
      <div className={styles.label}>{setting.label.replace(':', ' ')}</div>
      <SSelect allowClear style={{ width: 160 }} onChange={onChange} value={value} options={setting.options} />
    </Flex>
  )
}

function DText (props: Prop) {
  const { setting, onChange, value } = props

  return (
    <Flex justify={'space-between'}gap={4} vertical>
      <div style={{ width: 'auto' }} className={styles.label}>
        {setting.label.replace(':', ' ')}
      </div>
      <Input value={value} onChange={e => { onChange?.(e.target.value) }} autoComplete={'off'} />
    </Flex>
  )
}

function DRange (props: Prop) {
  const { setting, onChange, value } = props

  return (
    <Flex gap={4} justify={'space-between'} align={'center'}>
      <div className={styles.label}>{setting.label.replace(':', ' ')}</div>
      <Slider
        style={{ flex: 1 }}
        min={setting.min}
        max={setting.max}
        step={setting.step}
        onChange={val => { onChange?.(val) }}
        value={value}
      />
      <SInputNumber
        onChange={val => { onChange?.(val) }}
        value={value}
        suffix={setting.unit}
        style={{ width: 80 }}
      />
    </Flex>
  )
}

function DTextArea (props: Prop) {
  const { setting, onChange, value } = props
  return (
    <Flex gap={4} className={styles.item} vertical>
      <div className={styles.label} style={{ width: 'auto' }}>
        {setting.label.replace(':', ' ')}
      </div>
      <Input.TextArea
        value={value}
        onChange={e => {
          onChange?.(e.target.value)
        }}
        autoSize={{ minRows: 3, maxRows: 5 }}
      />
    </Flex>
  )
}

function DColor (props: Prop) {
  const { setting, onChange, value } = props
  return (
    <Flex className={styles.color} justify={'space-between'} gap={8} align={'center'}>
      <div className={styles.label}>{setting.label}</div>
      <ColorPicker
        showText
        className={styles.colorInput}
        value={value}
        style={{ width: 160 }}
        onChange={v => {
          onChange?.(`#${v.toHex()}`)
        }}
      />
      <div className={styles.closeX}>
        <IconButton
          onClick={() => { onChange?.('') }}
          type={'text'}
          size={20}
        >
          <IconX size={14} />
        </IconButton>
      </div>
    </Flex>
  )
}

function DColorBackground (props: Prop) {
  const {
    setting,
    onChange,
    value
  } = props
  return (
    <Flex className={styles.color} justify={'space-between'} gap={8} align={'center'}>
      <div className={styles.label}>{setting.label}</div>
      <ColorPicker
        style={{ width: 160 }}
        allowClear
        showText
        className={styles.colorInput}
        value={value}
        onChange={v => { onChange?.(`#${v.toHex()}`) }}
      />
      <div className={styles.closeX}>
        <IconButton onClick={() => { onChange?.('') }} type={'text'} size={20}>
          <IconX size={14} />
        </IconButton>
      </div>
    </Flex>
  )
}

function DHeader (props: Prop) {
  const { setting, isFirst } = props
  return (
    <div
      style={{
        borderTop: isFirst ? 'none' : undefined,
        paddingTop: isFirst ? 0 : undefined
      }}
      className={styles.headerText}
    >
      {setting.content?.replaceAll(':', ' ')}
    </div>
  )
}

function DCollection (props: Prop) {
  const { setting, value, onChange } = props

  const options = useRequest(CollectionOptionsApi)

  return (
    <Flex className={styles.item} gap={4}>
      <div className={styles.label}>{setting.label.replace(':', ' ')}</div>
      <SSelect
        style={{ width: 160 }}
        options={options?.data?.map(i => ({ label: i.label, value: `shopkimi://collection/${i.value}` }))}
        value={value}
        onChange={onChange}
      />
    </Flex>
  )
}

function DImagePicker (props: Prop) {
  const { setting, onChange, value } = props
  const openInfo = useOpen<number[]>([])
  const fileInfo = useRequest(FileInfoApi, { manual: true })

  const onCancel: MouseEventHandler<HTMLElement> = (e) => {
    e.stopPropagation()
    onChange?.('')
  }

  useEffect(() => {
    if (typeof value !== 'string') return
    if (!value?.includes('shopkimi://media/')) return
    const id = value?.replaceAll('shopkimi://media/', '')
    if (!Number(id)) return
    fileInfo.run({ id: Number(id) })
  }, [value])

  return (
    <div className={'fit-width'}>
      <Flex className={styles.item} gap={4}>
        <div className={styles.label}>
          {setting.label.replace(':', ' ')}
        </div>
        <div style={{ flex: 1 }}>
          <SLoading loading={fileInfo.loading} foreShow>
            <SRender render={!fileInfo?.data || !value}>
              <Flex
                flex={1}
                onClick={() => { openInfo.edit() }}
                align={'center'}
                justify={'center'}
                className={styles.imageBtn}
              >
                <IconPlus />
              </Flex>
            </SRender>
            <SRender onClick={() => { openInfo.edit() }} className={styles.imgContainer} render={value ? fileInfo?.data : null}>
              <div className={styles.iconX}>
                <IconButton onClick={onCancel} size={24}>
                  <IconX size={16} />
                </IconButton>
              </div>
              <img
                style={{
                  height: 'auto',
                  maxWidth: 154,
                  maxHeight: 200
                }}
                src={fileInfo?.data?.path || ''}
                alt={''}
              />
            </SRender>
          </SLoading>
        </div>
      </Flex>
      <SelectFiles
        onConfirm={async (v) => {
          if (!v[0]) {
            onChange?.('')
          } else {
            onChange?.(`shopkimi://media/${v[0]}`)
          }
          openInfo.close()
        }}
        info={openInfo}
        multiple={false}
        includes={[FileType.Image]}
      />
    </div>
  )
}

function DParagraph (props: Prop) {
  const { setting } = props
  return (
    <div style={{ color: '#666' }}>
      {setting.content}
    </div>
  )
}

function DLinkList (props: Prop) {
  const { setting, value, onChange } = props
  const list = useRequest(NavListApi)
  return (
    <Flex gap={4} className={styles.item}>
      <div className={styles.label}>{setting.label.replace(':', ' ')}</div>
      <SSelect
        value={value}
        onChange={val => { onChange?.(val) }}
        options={list.data?.map(v => ({ label: v.title, value: `shopkimi://menu/${v.handle}` }) || [])}
        loading={list.loading}
      />
    </Flex>
  )
}

function DRichText (props: Prop) {
  const { setting, onChange, value } = props

  return (
    <div className={styles.item}>
      <div className={styles.label}>{setting.label.replace(':', ' ')}</div>
      <Input.TextArea
        onChange={e => { onChange?.(e.target.value) }}
        value={value}
        autoSize={{ minRows: 3, maxRows: 5 }}
      />
    </div>
  )
}

function DHtmlEditor (props: Prop) {
  const { setting, onChange, value } = props

  return (
    <Flex gap={4} className={styles.item}>
      <div className={styles.label}>{setting.label.replace(':', ' ')}</div>
      <Input.TextArea
        value={value}
        onChange={e => { onChange?.(e.target.value) }}
        autoSize={{ minRows: 3, maxRows: 5 }}
      />
    </Flex>
  )
}

function DUrl (props: Prop) {
  const { setting, value } = props
  return (
    <Flex gap={4} className={styles.item}>
      <div className={styles.label}>{setting.label.replace(':', ' ')}</div>
      还没有实现 URL{value}
    </Flex>
  )
}

function DRadio (props: Prop) {
  const { setting, onChange, value } = props
  return (
    <Flex justify={'space-between'} gap={4} className={styles.item}>
      <div className={styles.label}>{setting.label.replace(':', ' ')}</div>
      <Radio.Group
        className={styles.radioGroup}
        options={setting.options}
        onChange={e => { onChange?.(e.target.value) }}
        value={value}
      />
    </Flex>
  )
}

export default {
  checkbox: DCheckBox,
  select: DSelect,
  range: DRange,
  textarea: DTextArea,
  color: DColor,
  header: DHeader,
  text: DText,
  color_background: DColorBackground,
  image_picker: DImagePicker,
  paragraph: DParagraph,
  html: DHtmlEditor,
  url: DUrl,
  link_list: DLinkList,
  richtext: DRichText,
  radio: DRadio,
  collection: DCollection
}
