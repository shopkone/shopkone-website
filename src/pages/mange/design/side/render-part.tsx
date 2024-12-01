import { PartData } from '@/api/design/data-list'

export interface RenderPartProps {
  part?: PartData
}

export default function RenderPart (props: RenderPartProps) {
  const { part } = props
  if (!part) return null
  return (
    <div>
      <div>{part.name}</div>
      <div>
        {part?.order?.map(key => {
          const section = part.sections[key]

          if (!section) return null
          return (
            <div key={key}>
              <div>{section.type}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
