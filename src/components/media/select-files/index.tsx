import { useEffect, useRef, useState } from 'react'
import { Button, Flex, Input, Modal } from 'antd'
import classNames from 'classnames'

import { ReactComponent as SearchIcon } from '@/assets/icon/search.svg'
import Index from '@/components/table-filter'

import styles from './index.module.less'

export default function SelectFiles () {
  const headerRef = useRef<HTMLDivElement>(null)
  const [showShadow, setShowShadow] = useState(false)

  useEffect(() => {
    if (!headerRef?.current) return
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        setShowShadow(entry.isIntersecting)
      })
    })
    io.observe(headerRef.current)
    return () => { io.disconnect() }
  }, [headerRef])

  return (
    <Modal className={styles.modal} title={'Select file'} width={940} open={false} centered>
      <Flex vertical style={{ height: '70vh' }}>
        <div className={classNames([styles.header, { [styles.shadow]: !showShadow }])}>
          <div className={styles.mb12}>
            <Input
              prefix={<SearchIcon className={styles['filter-icon']} />}
              placeholder={'Search files'}
              className={styles['search-input']}
            />
          </div>
          <Flex align={'center'} gap={4}>
            <Index>File type</Index>
            <Index>File size</Index>
          </Flex>
        </div>

        <div className={styles.bottom}>
          <Flex vertical gap={4} justify={'center'} align={'center'} className={`${styles.container} ${styles.upload}`}>
            <Flex ref={headerRef} gap={12}>
              <Button size={'small'}>Add media</Button>
              <Button type={'text'} size={'small'}>Add from URL</Button>
            </Flex>
            <div className={'tips'}>
              Drag and drop images, videos, 3D models, and files
            </div>
          </Flex>

          <div className={styles.content}>
            <Flex wrap={'wrap'} gap={9} justify={'space-between'}>
              <div className={styles['item-wrap']}>asd</div>
              <div className={styles['item-wrap']}>asd</div>
              <div className={styles['item-wrap']}>asd</div>
              <div className={styles['item-wrap']}>asd</div>
              <div className={styles['item-wrap']}>asd</div>
              <div className={styles['item-wrap']}>asd</div>
              <div className={styles['item-wrap']}>asd</div>
              <div className={styles['item-wrap']}>asd</div>
              <div className={styles['item-wrap']}>asd</div>
              <div className={styles['item-wrap']}>asd</div>
              <div className={styles['item-wrap']}>asd</div>
              <div className={styles['item-wrap']}>asd</div>
              <div className={styles['item-wrap']}>asd</div>
              <div className={styles['item-wrap']}>asd</div>
              <div className={styles['item-wrap']}>asd</div>
              <div className={styles['item-wrap']}>asd</div>
              <div className={styles['item-wrap']}>asd</div>
              <div className={styles['item-wrap']}>asd</div>
              <div className={styles['item-wrap']}>asd</div>
            </Flex>
          </div>
        </div>
      </Flex>
    </Modal>

  )
}
