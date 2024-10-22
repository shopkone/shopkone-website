import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMemoizedFn } from 'ahooks'
import { Flex, FlexProps } from 'antd'
import classNames from 'classnames'

import { FileSource, FileType } from '@/api/file/add-file-record'
import { UploadFileType } from '@/api/file/UploadFileType'
import { useOss } from '@/hooks/use-oss'
import { formatFileSize } from '@/utils/format'
import { getVideoInfo } from '@/utils/get-video-info'
import { genId } from '@/utils/random'

import styles from './index.module.less'

export interface UploadProps extends Omit<FlexProps, 'onChange' | 'onClick' | 'children'> {
  directory?: boolean
  multiple: boolean
  maxSize: number
  accepts: Array<'video' | 'image' | 'audio' | 'zip'>
  onChange?: (files: UploadFileType[]) => void
  groupId?: number
  onDragIn?: (enter: boolean) => void
  onTypeError?: (isError: boolean) => void
  onClick?: () => void
  getElement?: (element: HTMLInputElement) => void
  children?: React.ReactNode
}

export default function Upload (props: UploadProps) {
  const {
    directory,
    multiple,
    onClick,
    maxSize,
    accepts,
    onChange,
    groupId = 0,
    onDragIn,
    onTypeError,
    getElement,
    children,
    ...rest
  } = props
  const oss = useOss()

  const isDragIn = useRef(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [onDragging, setDragging] = useState(false)
  const { t } = useTranslation('common', { keyPrefix: 'upload' })

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

  const acceptMap = {
    video: '视频',
    image: '图片',
    audio: '音频',
    zip: '压缩包'
  }

  const onClickHandle = () => {
    props.onClick
      ? props.onClick?.()
      : inputRef.current?.click()
  }

  const checkFile = (file: UploadFileType) => {
    let errMsg = ''
    if (file.fileInstance.size > maxSize) {
      const max: string = formatFileSize(maxSize)
      errMsg = t('超过', { n: max })
    }
    if (!accepts.some(item => file.fileInstance.type.includes(item))) {
      const typeMsg = accepts?.map(item => acceptMap[item]).map((item, index) => {
        return index === accepts?.length - 1 ? `${t('或')}${item}` : `${item}、`
      }).join('') || ''
      errMsg = t('类型错误', { n: typeMsg, m: file.suffix })
    }
    return { ...file, status: errMsg ? 'error' : file.status, errMsg }
  }

  // 获取图片尺寸
  const getImageSize = useMemoizedFn(async (file: File): Promise<{ width: number, height: number }> => {
    return await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const image = new Image()
        image.onload = () => {
          resolve({ width: image.width, height: image.height })
        }
        image.onerror = () => {
          resolve({ width: 0, height: 0 })
          // reject(new Error('Failed to load image.'))
        }
        if (event.target && typeof event.target.result === 'string') {
          image.src = event.target.result
        }
      }
      reader.onerror = () => {
        reject(new Error(t('文件读取异常')))
      }
      reader.readAsDataURL(file)
    })
  })

  // 获取文件信息
  const getFileInfo = async (file: File) => {
    let info: UploadFileType = {
      size: 0,
      name: '',
      type: FileType.Image,
      path: '',
      alt: '',
      width: 0,
      height: 0,
      duration: 0,
      source: FileSource.Local,
      status: 'wait',
      uuid: genId().toString(),
      fileInstance: file,
      suffix: file.type.split('/').pop()?.toUpperCase() || file.name?.split('.').pop()?.toUpperCase() || '',
      group_id: groupId,
      errMsg: '',
      cover: ''
    }
    // 获取文件大小
    info.size = file.size
    // 获取文件名
    info.name = file.name.split('.')?.[0] || 'unknown'
    // 校验文件
    info = checkFile(info)
    if (info?.errMsg !== '' || info.status === 'error') {
      return info
    }
    // 获取文件类型
    if (file.type.includes('image')) {
      info.type = FileType.Image
    }
    if (file.type.includes('video')) {
      info.type = FileType.Video
    }
    if (file.type.includes('audio')) {
      info.type = FileType.Audio
    }
    if (!info.type) {
      info.type = FileType.Other
    }
    switch (info.type) {
      case FileType.Image: {
        // 获取宽高
        const { width, height } = await getImageSize(file)
        info.width = width
        info.height = height
        break
      }
      case FileType.Video: {
        // 获取时长
        const videoInfo = await getVideoInfo(file, oss)
        info.duration = videoInfo.duration
        info.cover = videoInfo.url
        info.width = videoInfo.width
        info.height = videoInfo.height
        break
      }
      case FileType.Audio: {
        // 获取时长
        const videoInfo = await getVideoInfo(file, oss)
        info.duration = videoInfo.duration
        break
      }
    }
    return info
  }

  const onInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files?.length) {
      e.target.value = ''
      return
    }
    // 获取文件信息
    const fileInfos = await Promise.all(files.map(async file => await getFileInfo(file)))
    onChange?.(fileInfos)
    e.target.value = ''
  }

  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    isDragIn.current = false
    onDragIn?.(false)
    setDragging(false)
    onTypeError?.(false)
    const files = Array.from(e.dataTransfer.files)
    if (!files?.length) {
      return
    }
    const fileInfos = await Promise.all(files.map(async file => await getFileInfo(file)))
    onChange?.(fileInfos)
  }

  const onDropLeave = (e: React.DragEvent) => {
    e.preventDefault()
    if (!isDragIn.current) {
      return
    }
    isDragIn.current = false
    onDragIn?.(false)
    setDragging(false)
    onTypeError?.(false)
  }

  const onDropIn = (e: React.DragEvent) => {
    e.preventDefault()
    if (isDragIn.current) {
      return
    }
    isDragIn.current = true
    onDragIn?.(true)
    setDragging(true)
    const typeList = Array.from(e.dataTransfer.items).map(item => item.type)
    const isEvery = typeList.every(item => {
      return accepts.some(accept => item.includes(accept))
    })
    onTypeError?.(!isEvery)
  }

  useEffect(() => {
    if (!inputRef.current) return
    getElement?.(inputRef.current)
  }, [inputRef.current])

  return (
    <>
      <input
        accept={accept}
        onChange={onInputChange}
        ref={inputRef}
        className={styles.input}
        type={'file'}
        multiple={multiple}
        {...directoryProps}
      />
      <Flex
        onDragEnter={onDropIn}
        onDragOver={onDropIn}
        onDragLeave={onDropLeave}
        onDragEnd={onDropLeave}
        onDragExit={onDropLeave}
        onDrop={onDrop}
        onClick={onClickHandle}
        {...rest}
        className={classNames({ [styles.container]: onDragging }, rest.className)}
      >
        {children}
      </Flex>
    </>
  )
}
