import { IconGripVertical, IconPhotoPlus, IconTrash } from '@tabler/icons-react'
import { Button, Flex, Input, Tooltip } from 'antd'

export default function ItemValues () {
  return (
    <Flex align={'center'} gap={4}>
      <Button
        style={{
          width: 24,
          height: 24,
          position: 'relative',
          top: -1
        }}
        type={'text'}
        size={'small'}
      >
        <IconGripVertical style={{ position: 'relative', left: -4 }} size={14} />
      </Button>
      <Input
        suffix={
          <Button
            style={{ width: 24, height: 24, position: 'absolute', right: 8 }}
            type={'text'}
            size={'small'}
            onClick={e => {
              e.stopPropagation()
            }}
          >
            <IconTrash
              style={{ position: 'relative', left: -4 }} size={15}
            />
          </Button>
        }
      />
      <Tooltip title={'Add option image'}>
        <Button
          style={{ width: 24, height: 24 }}
          type={'text'}
          size={'small'}
          onClick={e => {
            e.stopPropagation()
          }}
        >
          <IconPhotoPlus style={{ position: 'relative', left: -4 }} size={15} />
        </Button>
      </Tooltip>
    </Flex>
  )
}
