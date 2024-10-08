import styles from './index.module.less'

export interface ColumnImageListProps {
  srcList: string[]
}

export default function ColumnImageList (props: ColumnImageListProps) {
  const { srcList } = props
  console.log(srcList)
  return (
    <div className={styles.imageList}>
      {
        srcList.map((item, index) => (
          <div
            className={styles.imageItem}
            style={{
              backgroundImage: `url(${item})`,
              transform: `rotate(${15 * index}deg) scale(${1 - 0.1 * index})`,
              zIndex: index + 1
            }}
            key={item}
          />
        ))
      }
    </div>
  )
}
