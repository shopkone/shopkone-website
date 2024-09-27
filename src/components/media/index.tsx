import { Button, Flex } from 'antd'

import SelectFiles from '@/components/media/select-files'
import { useOpen } from '@/hooks/useOpen'

import styles from './index.module.less'

export default function Media () {
  const openInfo = useOpen<number[]>()

  return (
    <Flex vertical gap={4} justify={'center'} align={'center'} className={styles.container}>
      <Flex gap={12}>
        <Button size={'small'}>Upload new</Button>
        <Button type={'text'} size={'small'} className={'primary-text'}>
          Select existing
        </Button>
      </Flex>
      <div className={'tips'}>Accepts images, videos, or 3D models</div>

      <SelectFiles onConfirm={async () => {}} info={openInfo} multiple />
    </Flex>
  )
}
