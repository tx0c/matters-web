import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import { ReactComponent as IconExternal } from '@/public/static/icons/24px/external.svg'
import { Icon, TableView, TextIcon, Translate } from '~/components'
import { GetCustomerPortalQuery } from '~/gql/graphql'

const GET_CUSTOMER_PORTAL = gql`
  query GetCustomerPortal {
    viewer {
      id
      wallet {
        customerPortal
      }
    }
  }
`

const ViewStripeCustomerPortal = () => {
  const { data } = useQuery<GetCustomerPortalQuery>(GET_CUSTOMER_PORTAL)
  const url = data?.viewer?.wallet.customerPortal

  if (!url) {
    return null
  }

  return (
    <TableView.Cell
      title={
        <Translate
          zh_hant="變更圍爐訂閱信用卡"
          zh_hans="变更围炉订阅信用卡"
          en="Payment Method of Circle Subscription"
        />
      }
      htmlHref={url}
      htmlTarget="_blank"
      right={
        <TextIcon icon={<Icon icon={IconExternal} color="grey" size="sm" />} />
      }
      role="link"
    />
  )
}

export default ViewStripeCustomerPortal
