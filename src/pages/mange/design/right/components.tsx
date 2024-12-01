import { IconPlus } from '@tabler/icons-react'
import { ColorPicker, Flex, Input, Select, Slider, Switch } from 'antd'
import classNames from 'classnames'

import { SettingSchema } from '@/api/design/schema-list'
import SInputNumber from '@/components/s-input-number'

import styles from './index.module.less'

export interface Prop {
  setting: SettingSchema
}

function DCheckBox (props: Prop) {
  const { setting } = props
  return (
    <Flex className={styles.item} gap={12} justify={'space-between'} align={'center'}>
      <div>{setting.label.replace(':', ' ')}</div>
      <Switch value={setting.__kimi_value} />
    </Flex>
  )
}

function DSelect (props: Prop) {
  const { setting } = props
  return (
    <Flex className={styles.item} gap={4} vertical>
      <div>{setting.label.replace(':', ' ')}</div>
      <Select value={setting.__kimi_value} options={setting.options} />
    </Flex>
  )
}

function DText (props: Prop) {
  const { setting } = props
  return (
    <Flex className={styles.item} gap={4} vertical>
      <div>{setting.label.replace(':', ' ')}</div>
      <Input value={setting.__kimi_value} autoComplete={'off'} />
    </Flex>
  )
}

function DRange (props: Prop) {
  const { setting } = props
  return (
    <Flex className={styles.item} vertical>
      <div>{setting.label.replace(':', ' ')}</div>
      <Flex align={'center'} gap={16}>
        <Slider value={setting.__kimi_value} className={'flex1'} />
        <SInputNumber
          value={setting.__kimi_value}
          suffix={setting.unit}
          style={{ width: 80 }}
        />
      </Flex>
    </Flex>
  )
}

function DTextArea (props: Prop) {
  const { setting } = props
  return (
    <Flex gap={4} className={styles.item} vertical>
      <div>{setting.label.replace(':', ' ')}</div>
      <Input.TextArea
        value={setting.__kimi_value}
        autoSize={{ minRows: 3, maxRows: 5 }}
      />
    </Flex>
  )
}

function DColor (props: Prop) {
  const { setting } = props
  return (
    <Flex className={styles.item} gap={4} vertical>
      <Flex gap={8} align={'center'}>
        <ColorPicker value={setting.__kimi_value} defaultValue={'#1677ff'} />
        <Flex vertical justify={'space-between'}>
          <div>{setting.label}</div>
          <span className={'tips'}>{setting.__kimi_value}</span>
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
  const { setting } = props
  return (
    <Flex className={styles.item} gap={4} vertical>
      <div>{setting.label.replace(':', ' ')}</div>
      <Flex align={'center'} justify={'center'} className={styles.imageBtn}>
        <IconPlus />
      </Flex>
    </Flex>
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

function DHtmlEditor (props: Prop) {
  const { setting } = props
  return (
    <Flex vertical gap={4} className={styles.item}>
      <div>{setting.label.replace(':', ' ')}</div>
      <Input.TextArea
        value={setting.__kimi_value}
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
  link_list: DLinkList
}
