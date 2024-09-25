import { FileListRes } from '@/api/file/file-list'
import SModal from '@/components/s-modal'
import { UseOpenType } from '@/hooks/useOpen'

export interface FileInfoProps {
  open: UseOpenType<FileListRes>
}

export default function FileInfo (props: FileInfoProps) {
  const { open } = props
  return (
    <SModal open={open.open} onCancel={open.close}>
      asd
    </SModal>
  )
}
