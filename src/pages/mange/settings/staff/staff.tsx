import { useNavigate } from 'react-router-dom'
import { Button, Flex } from 'antd'
import SCard from '@/components/s-card'

import Page from '@/components/page'
import STable, { STableProps } from '@/components/s-table'

export default function Staff () {
  const nav = useNavigate()

  const columns: STableProps['columns'] = [
    { title: 'Name', code: 'name', name: 'name' },
    { title: 'Account of the invited staff', code: 'invited_staff', name: 'invited_staff' },
    { title: 'Status', code: 'status', name: 'status' },
    { title: 'Other ways of contact(Optional)', code: 'contact', name: 'contact' },
    { title: 'Action', code: 'id', name: 'id' }
  ]
  return (
    <Page title={'Staff'}>
      <SCard >
        <STable
          empty={{
            title: 'Invite staff to join the store',
            desc: 'Effortlessly add staff and assign roles to boost your work efficiency.',
            actions: (
              <Flex>
                <Button onClick={() => { nav('change') }} type={'primary'}>Add staff</Button>
              </Flex>
            )
          }}
          style={{ width: 'calc(100% + 32px)', marginLeft: -16 }}
          columns={columns}
          data={[]}
        />
      </SCard>
    </Page>
  )
}
