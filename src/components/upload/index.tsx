import { useRef } from 'react'
import { useMemoizedFn } from 'ahooks'
import { Flex, FlexProps } from 'antd'
import { useAtom } from 'jotai'

import { FileSource, FileType } from '@/api/file/add-file-record'
import { UploadFileType } from '@/api/file/UploadFileType'
import { useOss } from '@/hooks/use-oss'
import { uploadList } from '@/pages/mange/task/state'
import { formatFileSize } from '@/utils/format'
import { getVideoInfo } from '@/utils/get-video-info'
import { genId } from '@/utils/random'

import styles from './index.module.less'

export interface UploadProps extends Omit<FlexProps, 'onChange'> {
  directory?: boolean
  multiple: boolean
  maxSize: number
  accepts: Array<'video' | 'image' | 'audio' | 'zip'>
  onUpload?: (files: UploadFileType[]) => void
  global: boolean
  groupId?: number
}

export default function Upload (props: UploadProps) {
  const {
    directory,
    multiple,
    onClick,
    maxSize,
    accepts,
    global,
    onUpload,
    groupId = 0,
    ...rest
  } = props
  const oss = useOss()

  const inputRef = useRef<HTMLInputElement>(null)
  const [oldFileList, setFileList] = useAtom(uploadList)

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

  const checkFile = (files: UploadFileType[]) => {
    return files.map(file => {
      let errMsg = ''
      if (file.size > maxSize) {
        errMsg = `The file is too large. Please upload a file smaller than ${formatFileSize(maxSize)}.`
      }
      if (!accepts.some(item => file.fileInstance.type.includes(item))) {
        errMsg = `The file format is not supported. Please try uploading an ${accepts?.map(item => item).join(' or ')}.`
      }
      return { ...file, status: errMsg ? 'error' : file.status, errMsg }
    })
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
          reject(new Error('Failed to load image.'))
        }
        if (event.target && typeof event.target.result === 'string') {
          image.src = event.target.result
        }
      }
      reader.onerror = () => {
        reject(new Error('Failed to read file.'))
      }
      reader.readAsDataURL(file)
    })
  })

  // 获取文件信息
  const getFileInfo = async (file: File) => {
    const info: UploadFileType = {
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
      global,
      group_id: groupId,
      errMsg: '',
      cover: ''
    }
    // 获取文件大小
    info.size = file.size
    // 获取文件名
    info.name = file.name
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

  const onChange = useMemoizedFn((files: UploadFileType[]) => {
    const list = oldFileList.filter(item => {
      return !files.find(i => item.uuid === i.uuid)
    })
    setFileList(files.concat(list))
  })

  const onInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files?.length) {
      e.target.value = ''
      return
    }
    // 获取文件信息
    let fileInfos = await Promise.all(files.map(async file => await getFileInfo(file)))
    // 校验文件
    fileInfos = checkFile(fileInfos)
    onUpload?.(fileInfos)
    onChange?.(fileInfos)
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
