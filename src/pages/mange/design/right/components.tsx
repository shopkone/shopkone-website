import { useEffect, useState } from 'react'
import { IconPlus } from '@tabler/icons-react'
import { useRequest } from 'ahooks'
import { ColorPicker, Flex, Input, Select, Slider, Switch } from 'antd'
import classNames from 'classnames'

import { SettingSchema } from '@/api/design/schema-list'
import { FileType } from '@/api/file/add-file-record'
import { FileInfoApi, FileInfoRes } from '@/api/file/file-info'
import SelectFiles from '@/components/media/select-files'
import SInputNumber from '@/components/s-input-number'
import SRender from '@/components/s-render'
import { useOpen } from '@/hooks/useOpen'

import styles from './index.module.less'

export interface Prop {
  setting: SettingSchema
  onChange: (key: string, value: any) => void
}

function DCheckBox (props: Prop) {
  const { setting, onChange } = props
  const [value, setValue] = useState<boolean>()
  useEffect(() => {
    setValue(setting.__kimi_value)
  }, [setting.__kimi_value])

  useEffect(() => {
    if (value === undefined) return
    onChange(setting.id, value)
  }, [value])

  return (
    <Flex className={styles.item} gap={12} justify={'space-between'} align={'center'}>
      <div>{setting.label.replace(':', ' ')}</div>
      <Switch
        onChange={val => { setValue(val) }}
        value={value}
      />
    </Flex>
  )
}

function DSelect (props: Prop) {
  const { setting, onChange } = props
  const [value, setValue] = useState<string>()
  useEffect(() => {
    setValue(setting.__kimi_value)
  }, [setting.__kimi_value])
  useEffect(() => {
    if (value === setting.__kimi_value) return
    if (value === undefined) return
    onChange(setting.id, value)
  }, [value])
  return (
    <Flex className={styles.item} gap={4} vertical>
      <div>{setting.label.replace(':', ' ')}</div>
      <Select onChange={setValue} value={value} options={setting.options} />
    </Flex>
  )
}

function DText (props: Prop) {
  const { setting, onChange } = props
  const [value, setValue] = useState<string>()
  useEffect(() => {
    setValue(setting.__kimi_value)
  }, [setting.__kimi_value])

  useEffect(() => {
    if (value === setting.__kimi_value) return
    if (value === undefined) return
    onChange(setting.id, value)
  }, [value])

  return (
    <Flex className={styles.item} gap={4} vertical>
      <div>{setting.label.replace(':', ' ')}</div>
      <Input value={value} onChange={e => { setValue(e.target.value) }} autoComplete={'off'} />
    </Flex>
  )
}

function DRange (props: Prop) {
  const { setting, onChange } = props
  const [value, setValue] = useState<number>()

  useEffect(() => {
    setValue(setting.__kimi_value)
  }, [setting.__kimi_value])

  useEffect(() => {
    if (value === setting.__kimi_value) return
    if (value === undefined) return
    onChange(setting.id, value)
  }, [value])

  return (
    <Flex className={styles.item} vertical>
      <div>{setting.label.replace(':', ' ')}</div>
      <Flex align={'center'} gap={16}>
        <Slider
          min={setting.min}
          max={setting.max}
          step={setting.step}
          onChange={val => { setValue(val) }}
          value={value}
          className={'flex1'}
        />
        <SInputNumber
          onChange={val => { setValue(val) }}
          value={value}
          suffix={setting.unit}
          style={{ width: 80 }}
        />
      </Flex>
    </Flex>
  )
}

function DTextArea (props: Prop) {
  const { setting, onChange } = props
  const [value, setValue] = useState<string>()
  useEffect(() => {
    setValue(setting.__kimi_value)
  }, [setting.__kimi_value])
  useEffect(() => {
    if (value === setting.__kimi_value) return
    if (value === undefined) return
    onChange(setting.id, value)
  }, [value])
  return (
    <Flex gap={4} className={styles.item} vertical>
      <div>{setting.label.replace(':', ' ')}</div>
      <Input.TextArea
        value={value}
        onChange={e => { setValue(e.target.value) }}
        autoSize={{ minRows: 3, maxRows: 5 }}
      />
    </Flex>
  )
}

function DColor (props: Prop) {
  const { setting, onChange } = props
  const [value, setValue] = useState<string>()

  useEffect(() => {
    setValue(setting.__kimi_value)
  }, [setting.__kimi_value])

  useEffect(() => {
    if (value === setting.__kimi_value) return
    if (value === undefined) return
    onChange(setting.id, value)
  }, [value])
  return (
    <Flex className={styles.item} gap={4} vertical>
      <Flex gap={8} align={'center'}>
        <ColorPicker value={value} onChange={v => { setValue(`#${v.toHex()}`) }} />
        <Flex vertical justify={'space-between'}>
          <div>{setting.label}</div>
          <span className={'tips'}>{value}</span>
        </Flex>
      </Flex>
    </Flex>
  )
}

function DColorBackground (props: Prop) {
  const { setting } = props
  return (
    <Flex className={styles.item} gap={4} vertical>
      <Flex gap={8} align={'center'}>
        <ColorPicker defaultValue={'#1677ff'} />
        <Flex vertical justify={'space-between'}>
          <div>{setting.label}</div>
          <span className={'tips'}>{setting.__kimi_value}</span>
        </Flex>
      </Flex>
    </Flex>
  )
}

function DHeader (props: Prop) {
  const { setting } = props
  return (
    <Flex className={classNames(styles.item, styles.header)} gap={24} align={'center'}>
      <div className={'line'} />
      <div className={styles.headerText}>{setting.content?.replaceAll(':', ' ')}</div>
      <div className={'line'} />
    </Flex>
  )
}

function DImagePicker (props: Prop) {
  const { setting, onChange } = props
  const openInfo = useOpen<number[]>([])
  const fileInfo = useRequest(FileInfoApi, { manual: true })
  const [value, setValue] = useState<FileInfoRes>()

  useEffect(() => {
    setValue(setting.__kimi_value)
  }, [setting.__kimi_value])

  useEffect(() => {
    if (value === setting.__kimi_value) return
    if (value === undefined) return
    const aspect_ratio = (value?.width || 0) / (value?.height || 1)
    const presentation = { focal_point: '50.0% 50.0%' }
    onChange(setting.id, { ...value, aspect_ratio, media_type: 'image', src: value?.path, presentation })
  }, [value])

  return (
    <div>
      <Flex className={styles.item} gap={4} vertical>
        <div>{setting.label.replace(':', ' ')}</div>
        <SRender render={!value?.path}>
          <Flex
            onClick={() => { openInfo.edit() }}
            align={'center'}
            justify={'center'}
            className={styles.imageBtn}
          >
            <IconPlus />
          </Flex>
        </SRender>
        <SRender onClick={() => { openInfo.edit() }} className={styles.imgContainer} render={value?.path}>
          <img
            style={{ height: 'auto', width: 250, maxHeight: 250 }}
            src={value?.path || ''}
            alt={''}
          />
        </SRender>
      </Flex>
      <SelectFiles
        onConfirm={async (v) => {
          if (!v[0]) return
          const ret = await fileInfo.runAsync({ id: v[0] })
          setValue(ret)
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
    <div style={{ marginBottom: -12, color: '#666' }} className={styles.item}>
      {setting.content}
    </div>
  )
}

function DLinkList (props: Prop) {
  const { setting } = props
  return (
    <div className={styles.item}>
      <div>{setting.label.replace(':', ' ')}</div>
      <div>{setting.__kimi_value}</div>
    </div>
  )
}

function DRichText (props: Prop) {
  const { setting, onChange } = props
  const [value, setValue] = useState<string>()

  useEffect(() => {
    setValue(setting.__kimi_value)
  }, [setting.__kimi_value])

  useEffect(() => {
    if (value === setting.__kimi_value) return
    if (value === undefined) return
    onChange(setting.id, value)
  }, [value])
  return (
    <div className={styles.item}>
      <div>{setting.label.replace(':', ' ')}</div>
      <Input.TextArea
        onChange={e => { setValue(e.target.value) }}
        value={value}
        autoSize={{ minRows: 3, maxRows: 5 }}
      />
    </div>
  )
}

function DHtmlEditor (props: Prop) {
  const { setting, onChange } = props
  const [value, setValue] = useState<string>()
  useEffect(() => {
    if (!setting.__kimi_value) {
      setValue(setting.__kimi_value)
    }
  }, [setting.__kimi_value])

  useEffect(() => {
    if (value === setting.__kimi_value) return
    if (value === undefined) return
    onChange(setting.id, value)
  }, [value])
  return (
    <Flex vertical gap={4} className={styles.item}>
      <div>{setting.label.replace(':', ' ')}</div>
      <Input.TextArea
        value={value}
        onChange={e => { setValue(e.target.value) }}
        autoSize={{ minRows: 3, maxRows: 5 }}
      />
    </Flex>
  )
}

function DUrl (props: Prop) {
  const { setting } = props
  return (
    <Flex gap={4} vertical className={styles.item}>
      <div>{setting.label.replace(':', ' ')}</div>
      还没有实现 URL
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
  richtext: DRichText
}
