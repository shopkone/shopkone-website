import Status from '@/components/status'

export enum TransferStatus {
  Draft = 1,
  Ordered = 2,
  PartialReceived = 3,
  Received = 4,
}

export const getTransferStatus = (t: any, status?: TransferStatus, borderless?: boolean) => {
  switch (status) {
    case TransferStatus.Draft:
      return <Status borderless={borderless} type={'default'}>{t('草稿')}</Status>
    case TransferStatus.Ordered:
      return <Status borderless={borderless} type={'info'}>{t('已订购')}</Status>
    case TransferStatus.PartialReceived:
      return <Status borderless={borderless} type={'warning'}>{t('部分处理')}</Status>
    case TransferStatus.Received:
      return <Status borderless={borderless} type={'success'}>{t('已完成')}</Status>
  }
  return ''
}
