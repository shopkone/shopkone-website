import { Flex } from 'antd'

export default function NotFound () {
  return (
    <Flex align={'center'} justify={'center'} style={{ height: '100%' }}>
      <div>asd</div>
      <div>
        <div style={{ fontSize: 24, marginBottom: 24, fontWeight: 500 }}>There's no page at this address</div>
        <div style={{ fontSize: 14 }}>Check the URL and try again, or use the search bar to find what you need.</div>
      </div>
    </Flex>
  )
}
