import { useRef } from 'react'
import { Flex, FlexProps } from 'antd'

import { useModal } from '@/components/s-modal'
import { formatFileSize } from '@/utils/format'

import styles from './index.module.less'

interface UploadProps extends FlexProps {
  directory?: boolean
  multiple: boolean
  maxSize: number
  accepts: Array<'video' | 'image' | 'audio' | 'zip'>
}

export default function Upload (props: UploadProps) {
  const {
    directory,
    multiple,
    onClick,
    maxSize,
    accepts,
    ...rest
  } = props

  const inputRef = useRef<HTMLInputElement>(null)
  const modal = useModal()

  const directoryProps = {
    webkitdirectory: directory ? '' : false,
    mozdirectory: directory ? '' : false,
    directory: directory ? '' : false,
    odirectory: directory ? '' : false
  }

  const accept = accepts?.map(item => {
    switch (item) {
      case 'video':
        return 'video/*'
      case 'image':
        return 'image/*'
      case 'audio':
        return 'audio/*'
      case 'zip':
        return 'application/zip'
    }
    return ''
  }).join(',')

  const onClickHandle = () => {
    inputRef.current?.click()
  }

  const checkFile = (file: File) => {
    // 校验大小
    if (file.size > maxSize) {
      return `The file is too large. Please upload a file smaller than ${formatFileSize(maxSize)}.`
    }
    // 校验格式
    if (!accepts.some(item => file.type.includes(item))) {
      return `The file format is not supported. Please try uploading an ${accepts?.map(item => item).join(' or ')}.`
    }
  }

  const getFileInfo = (file: File) => {
    const info = { size: 0, name: '', type: '' }
    // 获取文件大小
    info.size = file.size
    // 获取文件名
    info.name = file.name
    // 获取文件类型
    info.type = file.type
    return info
  }

  const upload = async (file: File) => {
  }

  const dealwithFile = (file: File) => {
    // 校验文件
    const errMsg = checkFile(file)
    if (errMsg) return errMsg
    // 获取文件信息
    const info = getFileInfo(file)
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files?.length) {
      for (let i = 0; i < files.length; i++) {
        const errMsg = dealwithFile(files[i])
        if (errMsg) {
          modal.info({ content: errMsg, title: 'Upload failed' })
          break
        }
      }
    }
    e.target.value = ''
  }

  return (
    <div className={styles.container}>
      <input
        accept={accept}
        onChange={onInputChange}
        ref={inputRef}
        className={styles.input}
        type={'file'}
        multiple={multiple}
        {...directoryProps}
      />
      <Flex onClick={onClickHandle} {...rest} />
    </div>
  )
}
