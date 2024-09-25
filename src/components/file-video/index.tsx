import { useEffect, useRef, useState } from 'react'
import { PlayOne } from '@icon-park/react'
import { Flex } from 'antd'

import SRender from '@/components/s-render'

import styles from './index.module.less'

export interface FileVideoProps {
  style?: React.CSSProperties
  src: string
  cover?: string
  duration?: number
}

export default function FileVideo (props: FileVideoProps) {
  const { cover, src, style, duration } = props

  const [play, setPlay] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const tranTimer = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  useEffect(() => {
    setPlay(false)
    return () => {
      setPlay(false)
    }
  }, [src])

  useEffect(() => {
    if (play) {
      videoRef.current?.play()
    }
  }, [play])

  return (
    <div className={styles.container} style={style}>
      <SRender render={!play}>
        <div className={styles.playContainer} onClick={() => { setPlay(true) }}>
          <img
            className={styles.cover}
            style={{ width: style?.width, height: style?.height }}
            src={cover || ''}
          />
          <Flex vertical align={'center'} justify={'center'} className={styles.play}>
            <PlayOne className={styles.icon} size={60} fill={'#fff'} />
            <div className={styles.duration}>{tranTimer(160)}</div>
          </Flex>
        </div>
      </SRender>
      <SRender render={src ? play : null}>
        <video
          ref={videoRef}
          className={'fit-height fit-width'}
          controls src={src}
        />
      </SRender>
    </div>
  )
}
