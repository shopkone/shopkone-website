declare module '*.module.less' {
  const classes: Readonly<Record<string, string>>
  export default classes
}
declare module '*.less'

declare module '*.png' {
  const value: string
  export default value
}

declare module '*.jpg' {
  const value: string
  export default value
}

declare module '*.jpeg' {
  const value: string
  export default value
}

declare module '*.gif' {
  const value: string
  export default value
}

declare module '*.svg' {
  export const ReactComponent: React.FunctionComponent<React.SVGAttributes<SVGElement>>
}

declare interface Window {
  // 全局弹窗
  __info_modal: Function
  // 是否编辑变更标识
  __isChange: boolean
}
