import { RefObject } from 'react'
import { create } from 'zustand/react'

import { SectionSchema, SettingSchema } from '@/api/design/schema-list'

export interface DesignState {
  device: 'mobile' | 'desktop' | 'pad' | 'fill'
  editing?: {
    id?: string
    schema?: SettingSchema[]
    name?: string
    type?: 'section' | 'block'
    parent?: string
    part_name?: string
  }
  update?: {
    block_id?: string
    section_id?: string
    part_name?: string
    key: string
    value: any
  }
  iframe: {
    send: (key: string, data?: any) => void
    onMessage: ((this: WindowEventHandlers, ev: MessageEvent) => any) | null | undefined
  }
  settingRight?: SectionSchema
}

interface DesignAction {
  setDevice: (device: DesignState['device']) => void
  setEditing: (editing: DesignState['editing']) => void
  initIFrame: (iframe: RefObject<HTMLIFrameElement>) => void
  setUpdate: (update: DesignState['update']) => void
  updateSettingRight: (p: DesignState['settingRight']) => void
}

export const useDesignState = create<DesignState & DesignAction>((set, get, store) => ({
  device: 'desktop',
  setDevice: (device) => {
    set({ device })
  },
  setEditing: (editing) => {
    set({ editing })
  },

  setUpdate: (update) => {
    set({ update })
  },

  iframe: {
    send: (key, data) => {
    },
    onMessage: (e) => {
    }
  },
  initIFrame: (iframe) => {
    const send = (key: string, data?: any) => {
      iframe.current?.contentWindow?.postMessage({ type: 'SHOPKIMI_' + key, data }, '*')
    }
    const onMessage = () => {
    }
    set({ iframe: { send, onMessage } })
  },

  updateSettingRight: (params) => {
    set({ settingRight: params })
  }
}))
