import { api } from '@/api/api'
import { SectionSchema } from '@/api/design/schema-list'

interface DesignGetConfigRes {
  schema: SectionSchema[]
  data: Record<string, any>
}

export const DesignGetConfig = async () => {
  return await api<DesignGetConfigRes>('/design/get-config')
}
