import React, { forwardRef, HTMLAttributes } from 'react'
import { IconChevronDown, IconGripVertical, IconPencil, IconPlus, IconTrash } from '@tabler/icons-react'
import classNames from 'classnames'

import IconButton from '@/components/icon-button'
import SRender from '@/components/s-render'

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
  onEdit?: () => void
  onAdd?: () => void
  wrapperRef?: (node: HTMLLIElement) => void
  title: string
  firstLevelsCount: number
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
      firstLevelsCount,
      onEdit,
      onAdd,
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
          // marginBottom: depth === 0 ? 16 : undefined
        } satisfies React.CSSProperties}
        {...props}
      >
        <div className={styles.TreeItem} ref={ref} style={style}>
          <IconButton type={'text'} {...handleProps} style={{ marginRight: 4 }} size={24}>
            <IconGripVertical size={14} />
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
          <SRender render={onAdd}>
            <IconButton style={{ marginRight: 8 }} type={'text'} onClick={onAdd} size={24}>
              <IconPlus size={15} />
            </IconButton>
          </SRender>
          <SRender render={onEdit}>
            <IconButton style={{ marginRight: 8 }} type={'text'} onClick={onEdit} size={24}>
              <IconPencil size={14} />
            </IconButton>
          </SRender>
          {!clone && onRemove
            ? (
              <IconButton disabled={!depth && firstLevelsCount === 1} type={'text'} danger onClick={onRemove} size={24}>
                <IconTrash size={14} />
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
