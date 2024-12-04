import { RefObject } from 'react'
import { create } from 'zustand/react'

import { SettingSchema } from '@/api/design/schema-list'

export interface DesignState {
  device: 'mobile' | 'desktop' | 'pad' | 'fill'
  editing?: {
    id: string
    schema: SettingSchema[]
    name: string
    type: 'section' | 'block'
    parent: string
    part_name: string
  }
  contentFreshFlag: number
  iframe: {
    send: (key: string, data?: any) => void
  }
}

interface DesignAction {
  setDevice: (device: DesignState['device']) => void
  setEditing: (editing: DesignState['editing']) => void
  setContentFresh: () => void
  initIFrame: (iframe: RefObject<HTMLIFrameElement>) => void
}

export const useDesignState = create<DesignState & DesignAction>((set, get, store) => ({
  device: 'desktop',
  setDevice: (device) => {
    set({ device })
  },
  setEditing: (editing) => {
    set({ editing })
  },
  contentFreshFlag: 0,
  setContentFresh: () => {
    set({ contentFreshFlag: get().contentFreshFlag + 1 })
  },

  iframe: {
    send: (key, data) => {
    }
  },
  initIFrame: (iframe) => {
    const send = (key: string, data?: any) => {
      iframe.current?.contentWindow?.postMessage({ type: 'SHOPKIMI_' + key, data }, '*')
    }
    set({ iframe: { send } })
  }
}))
