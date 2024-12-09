import React, { forwardRef, HTMLAttributes } from 'react'
import { IconChevronDown, IconGripVertical, IconTrash } from '@tabler/icons-react'
import classNames from 'classnames'

import IconButton from '@/components/icon-button'

import styles from './tree-item.module.less'

export interface Props extends HTMLAttributes<HTMLLIElement> {
  childCount?: number
  clone?: boolean
  collapsed?: boolean
  depth: number
  disableInteraction?: boolean
  disableSelection?: boolean
  ghost?: boolean
  handleProps?: any
  indicator?: boolean
  indentationWidth: number
  value: string
  onCollapse?: () => void
  onRemove?: () => void
  wrapperRef?: (node: HTMLLIElement) => void
  title: string
}

export const TreeItem = forwardRef<HTMLDivElement, Props>(
  (
    {
      childCount,
      clone,
      depth,
      disableSelection,
      disableInteraction,
      ghost,
      handleProps,
      indentationWidth,
      indicator,
      collapsed,
      onCollapse,
      onRemove,
      style,
      value,
      wrapperRef,
      title,
      ...props
    },
    ref
  ) => {
    return (
      <li
        className={classNames(
          styles.Wrapper,
          clone && styles.clone,
          ghost && styles.ghost,
          indicator && styles.indicator,
          disableSelection && styles.disableSelection,
          disableInteraction && styles.disableInteraction
        )}
        ref={wrapperRef}
        style={{
          /* @ts-expect-error */
          '--spacing': `${indentationWidth * depth}px`
        } satisfies React.CSSProperties}
        {...props}
      >
        <div className={styles.TreeItem} ref={ref} style={style}>
          <IconButton type={'text'} {...handleProps} style={{ marginRight: 4 }} size={24}>
            <IconGripVertical size={15} />
          </IconButton>
          {onCollapse
            ? (
              <IconButton
                size={24}
                type={'text'}
                onClick={onCollapse}
                className={classNames(
                  styles.Collapse,
                  collapsed && styles.collapsed
                )}
              >
                <IconChevronDown size={15} />
              </IconButton>
              )
            : null}
          <span className={styles.Text}>{title}</span>
          {!clone && onRemove
            ? (
              <IconButton type={'text'} danger onClick={onRemove} size={24}>
                <IconTrash size={15} />
              </IconButton>
              )
            : null}
          {clone && childCount && childCount > 1
            ? (
              <span className={styles.Count}>{childCount}</span>
              )
            : null}
        </div>
      </li>
    )
  }
)

TreeItem.displayName = 'TreeItem'
