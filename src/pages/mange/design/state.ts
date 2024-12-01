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
  }
}

interface DesignAction {
  setDevice: (device: DesignState['device']) => void
  setEditing: (editing: DesignState['editing']) => void
}

export const useDesignState = create<DesignState & DesignAction>((set, get, store) => ({
  device: 'desktop',
  setDevice: (device) => {
    set({ device })
  },
  setEditing: (editing) => {
    set({ editing })
  }
}))
