import { useQuery } from '@apollo/react-hooks'
import { useContext } from 'react'

import { mergeConnections } from '~/common/utils'
import {
  CircleInvitation,
  EmptyWarning,
  InfiniteScroll,
  List,
  QueryError,
  Spinner,
  Throw404,
  Translate,
  useRoute,
  ViewerContext,
} from '~/components'
import CIRCLE_ACCEPTED_INVITES from '~/components/GQL/queries/circleAcceptedInvites'
import { CircleAcceptedInvitesQuery } from '~/gql/graphql'

import styles from './styles.css'

/**
 * This component is for listing circle accepted invitations.
 *
 * Usage:
 *
 * ```
 *   <AcceptedInvites />
 * ```
 */
const AcceptedInvites = () => {
  const viewer = useContext(ViewerContext)
  const { getQuery } = useRoute()
  const name = getQuery('name')

  /**
   * Data Fetching
   */
  const { data, loading, error, fetchMore } =
    useQuery<CircleAcceptedInvitesQuery>(CIRCLE_ACCEPTED_INVITES, {
      variables: { name },
    })

  // pagination
  const connectionPath = 'circle.invites.accepted'
  const circle = data?.circle
  const { edges, pageInfo } = circle?.invites.accepted || {}
  const isOwner = circle?.owner.id === viewer.id

  // load next page
  const loadMore = async () => {
    await fetchMore({
      variables: { after: pageInfo?.endCursor },
      updateQuery: (previousResult, { fetchMoreResult }) =>
        mergeConnections({
          oldData: previousResult,
          newData: fetchMoreResult,
          path: connectionPath,
        }),
    })
  }

  /**
   * Render
   */
  if (loading) {
    return <Spinner />
  }

  if (error) {
    return <QueryError error={error} />
  }

  if (!circle || !isOwner || !pageInfo) {
    return <Throw404 />
  }

  if (!edges || edges.length <= 0) {
    return (
      <EmptyWarning
        description={
          <Translate
            zh_hant="還沒有任何用戶回覆你的邀請喔！"
            zh_hans="还没有任何用户回覆你的邀请喔！"
            en="friends have not accepted your inivtations."
          />
        }
      />
    )
  }

  return (
    <section className="container">
      <InfiniteScroll hasNextPage={pageInfo.hasNextPage} loadMore={loadMore}>
        <List hasBorder={false}>
          {(edges || []).map(({ node, cursor }, i) => (
            <List.Item key={cursor}>
              <CircleInvitation invitation={node} />
            </List.Item>
          ))}
        </List>
      </InfiniteScroll>

      <style jsx>{styles}</style>
    </section>
  )
}

export default AcceptedInvites
