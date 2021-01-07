import classNames from 'classnames'
import React from 'react'

import { Card, CircleAvatar, CircleAvatarSize } from '~/components'
import { UserDigest } from '~/components/UserDigest'

import { toPath } from '~/common/utils'

import Footer, { FooterControls } from './Footer'
import { fragments } from './gql'
import styles from './styles.css'

import { DigestRichCirclePrivate } from './__generated__/DigestRichCirclePrivate'
import { DigestRichCirclePublic } from './__generated__/DigestRichCirclePublic'

export type CircleDigestRichControls = {
  onClick?: () => any
  hasOwner?: boolean
  hasFooter?: boolean
} & FooterControls

export type CircleDigestRichProps = {
  circle: DigestRichCirclePublic & Partial<DigestRichCirclePrivate>
  avatarSize?: CircleAvatarSize
} & CircleDigestRichControls

const Rich = ({
  circle,

  avatarSize = 'xxl',

  onClick,

  hasOwner = true,
  hasFooter,

  ...controls
}: CircleDigestRichProps) => {
  const { displayName, description, owner } = circle
  const path = toPath({
    page: 'circleDetail',
    circle,
  })

  const containerClasses = classNames({
    container: true,
  })

  return (
    <Card {...path} spacing={['base', 'base']} onClick={onClick}>
      <section className={containerClasses}>
        <section className="content">
          <CircleAvatar circle={circle} size={avatarSize} />

          <header>
            <h3>{displayName}</h3>

            {hasOwner && (
              <UserDigest.Mini
                user={owner}
                avatarSize="sm"
                textSize="sm"
                nameColor="grey-darker"
                hasAvatar
                hasDisplayName
              />
            )}
          </header>
        </section>

        {description && <p className="description">{description}</p>}

        {hasFooter && <Footer circle={circle} {...controls} />}

        <style jsx>{styles}</style>
      </section>
    </Card>
  )
}

/**
 * Memoizing
 */
type MemoizedRichType = React.MemoExoticComponent<
  React.FC<CircleDigestRichProps>
> & {
  fragments: typeof fragments
}

const MemoizedRich = React.memo(Rich, ({ circle: prevCircle }, { circle }) => {
  return prevCircle.id === circle.id && prevCircle.isMember === circle.isMember
}) as MemoizedRichType

MemoizedRich.fragments = fragments

export default MemoizedRich
