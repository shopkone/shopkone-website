import { useNav } from '@/hooks/use-nav'

export default function Design () {
  const nav = useNav()

  return (
    <div onClick={() => { nav('/design?section') }}>
      asd
    </div>
  )
}
