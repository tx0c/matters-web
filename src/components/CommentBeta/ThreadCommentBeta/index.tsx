import { useState } from 'react'

import { filterComments } from '~/common/utils'
import { CommentFormType, ViewMoreCommentButton } from '~/components'
import {
  ThreadCommentCommentBetaPrivateFragment,
  ThreadCommentCommentBetaPublicFragment,
} from '~/gql/graphql'

import Feed from '../Feed'
import { DescendantComments } from './DescendantComments'
import { fragments } from './gql'
import styles from './styles.module.css'

const COLLAPSE_COUNT = 3

interface ThreadCommentControls {
  type: CommentFormType
  defaultExpand?: boolean
  hasPin?: boolean
  hasLink?: boolean
  hasUpvote?: boolean
  hasDownvote?: boolean
  replySubmitCallback?: () => void
  disabled?: boolean
}

export type CommentType = ThreadCommentCommentBetaPublicFragment &
  Partial<ThreadCommentCommentBetaPrivateFragment>

type ThreadCommentProps = {
  comment: CommentType
} & ThreadCommentControls

export const ThreadCommentBeta = ({
  comment,
  type,
  defaultExpand,
  ...props
}: ThreadCommentProps) => {
  const { pageInfo } = comment.comments
  const descendants = filterComments(
    (comment.comments?.edges || []).map(({ node }) => node)
  ) as CommentType[]
  const [showViewMore, setShowViewMore] = useState(true)

  if (!pageInfo.hasNextPage) {
    return (
      <section className={styles.container}>
        <Feed comment={comment} type={type} hasReply hasUserName {...props} />

        {descendants.length > 0 && (
          <ul className={styles.descendants}>
            {descendants.map((descendantComment) => (
              <li key={descendantComment.id}>
                <Feed
                  comment={descendantComment}
                  type={type}
                  avatarSize="md"
                  hasReply
                  hasUserName
                  {...props}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    )
  }
  const subComments = descendants.slice(COLLAPSE_COUNT)

  return (
    <section className={styles.container}>
      <Feed comment={comment} type={type} hasReply hasUserName {...props} />

      <ul className={styles.descendants}>
        {descendants.slice(0, COLLAPSE_COUNT).map((descendantComment) => (
          <li key={descendantComment.id}>
            <Feed
              comment={descendantComment}
              type={type}
              avatarSize="md"
              hasReply
              hasUserName
              {...props}
            />
          </li>
        ))}
        {showViewMore && (
          <>
            {subComments.map((descendantComment) => (
              <li key={descendantComment.id}>
                <Feed
                  comment={descendantComment}
                  type={type}
                  avatarSize="md"
                  hasReply
                  hasUserName
                  {...props}
                />
              </li>
            ))}
            <ViewMoreCommentButton onClick={() => setShowViewMore(false)} />
          </>
        )}
        {!showViewMore && (
          <DescendantComments
            id={comment.id}
            endCurosr={pageInfo.endCursor || ''}
            comments={subComments}
            {...props}
          />
        )}
      </ul>
    </section>
  )
}

ThreadCommentBeta.fragments = fragments
