import { useEffect, useRef } from 'react'
import { IconCircleCheckFilled, IconExclamationCircleFilled } from '@tabler/icons-react'
import { useRequest } from 'ahooks'
import { Flex, Tooltip, Typography } from 'antd'

import { AddFileApi } from '@/api/file/add-file-record'
import { UploadFileType } from '@/api/file/UploadFileType'
import FileImage from '@/components/file-image'
import SLoading from '@/components/s-loading'
import SRender from '@/components/s-render'
import { useUpload } from '@/components/upload/use-upload'
import { useTask } from '@/pages/mange/task/state'
import { formatFileSize } from '@/utils/format'

import styles from './index.module.less'

export interface UploadTaskProps {
  tasks: UploadFileType[]
}

export default function UploadTask (props: UploadTaskProps) {
  const { tasks } = props
  const updateTask = useTask(state => state.updateUploadTask)
  const { upload } = useUpload()
  const addFileRecord = useRequest(AddFileApi, { manual: true })
  const setUploadFinished = useTask(state => state.setUploadFinished)
  const waitUploading = useRef<UploadFileType[]>([])
  const loadingRef = useRef(false)

  const uploadItem = async (task: UploadFileType) => {
    if (task.status !== 'wait' || loadingRef.current) return
    loadingRef.current = true
    const newTask: UploadFileType = { ...task, status: 'uploading' }
    updateTask(newTask)

    try {
      const res = await upload(newTask)
      await addFileRecord.runAsync(res)
      updateTask(res)
      setUploadFinished()
    } finally {
      waitUploading.current = waitUploading.current.filter(item => item.uuid !== newTask.uuid)
      loadingRef.current = false
    }
  }

  useEffect(() => {
    const waitTasks = tasks.filter(item => item.status === 'wait' && !waitUploading.current.find(i => i.uuid === item.uuid))
    waitUploading.current = [...waitUploading.current, ...waitTasks]

    if (!loadingRef.current && waitUploading.current.length > 0) {
      uploadItem(waitUploading.current[0])
    }
  }, [tasks])

  return (
    <Flex className={styles.upload} vertical>
      {
        tasks?.map((task, index) => (
          <Flex gap={8} className={styles.item} key={task.uuid} align={'center'}>
            <SRender render={tasks?.length > 1} style={{ marginTop: 3, width: 16 }}>{index + 1}</SRender>
            <FileImage src={task.cover || task.path} width={32} height={32} type={task.type} />
            <Flex vertical flex={1}>
              <Typography.Text ellipsis={{ tooltip: true }} style={{ width: 280 }}>
                {task.name}
              </Typography.Text>
              <Flex gap={8}>
                <div>{task.suffix}</div>
                <div>{formatFileSize(task.size)}</div>
              </Flex>
            </Flex>
            <Flex justify={'flex-end'}>
              <SRender render={task.status === 'uploading'}>
                <SLoading size={18} />
              </SRender>
              <SRender render={task.status === 'wait'}>
                <SLoading size={18} />
              </SRender>
              <SRender render={task.status === 'error'}>
                <Tooltip title={task.errMsg}>
                  <IconExclamationCircleFilled color={'#d32f2f'} size={18} />
                </Tooltip>
              </SRender>
              <SRender render={task.status === 'done'}>
                <IconCircleCheckFilled color={'#32a645'} size={18} />
              </SRender>
            </Flex>
          </Flex>
        ))
      }
    </Flex>
  )
}
