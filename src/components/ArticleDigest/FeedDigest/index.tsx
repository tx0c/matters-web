import gql from 'graphql-tag'

import { Card, Icon } from '~/components'
import { Translate } from '~/components/Language'
import { TextIcon } from '~/components/TextIcon'
import { UserDigest } from '~/components/UserDigest'

import { stripHtml, toPath } from '~/common/utils'

import DropdownActions from '../DropdownActions'
import FooterActions, { FooterActionsControls } from '../FooterActions'
import { TitleDigest } from '../TitleDigest'
import CreatedAt from './CreatedAt'
import InactiveState from './InactiveState'
import Live from './Live'
import styles from './styles.css'

import { FeedDigestArticle } from './__generated__/FeedDigestArticle'

export type FeedDigestControls = {
  onClick?: () => any

  inFollowFeed?: boolean
} & FooterActionsControls

type FeedDigestProps = {
  article: FeedDigestArticle
} & FeedDigestControls

const fragments = {
  article: gql`
    fragment FeedDigestArticle on Article {
      id
      title
      slug
      mediaHash
      articleState: state
      cover
      summary
      live
      author {
        id
        userName
        ...UserDigestMiniUser
      }
      ...CreatedAtArticle
      ...LiveArticle
      ...InactiveStateArticle
      ...TitleDigestArticle
      ...FooterActionsArticle
      ...DropdownActionsArticle
    }
    ${UserDigest.Mini.fragments.user}
    ${CreatedAt.fragments.article}
    ${Live.fragments.article}
    ${InactiveState.fragments.article}
    ${TitleDigest.fragments.article}
    ${FooterActions.fragments.article}
    ${DropdownActions.fragments.article}
  `
}

export const FeedDigest = ({
  article,

  inTagDetailLatest,
  inTagDetailSelected,
  inUserArticles,
  inFollowFeed,

  onClick
}: FeedDigestProps) => {
  const { author, summary, sticky } = article
  const isBanned = article.articleState === 'banned'
  const cover = !isBanned ? article.cover : null
  const cleanedSummary = isBanned ? '' : stripHtml(summary)
  const path = toPath({
    page: 'articleDetail',
    article
  })

  return (
    <Card {...path} onClick={onClick}>
      {inUserArticles && sticky && (
        <section className="sticky">
          <TextIcon
            icon={<Icon.PinMedium />}
            size="sm"
            color="grey"
            weight="md"
          >
            <Translate zh_hant="置頂作品" zh_hans="置顶作品" />
          </TextIcon>
        </section>
      )}

      <header>
        <section className="left">
          <UserDigest.Mini
            user={author}
            avatarSize="sm"
            hasAvatar
            hasDisplayName
          />
          {inFollowFeed && (
            <span className="published-article">
              <Translate zh_hant="發佈了作品" zh_hans="发布了作品" />
            </span>
          )}
        </section>

        <section className="right">
          <Live article={article} />
          <InactiveState article={article} />
          <CreatedAt article={article} />
        </section>
      </header>

      <section className="title">
        <TitleDigest article={article} textSize="xm" />
      </section>

      {cover && (
        <section
          className="cover"
          style={{
            backgroundImage: `url(${cover})`
          }}
        />
      )}

      <p className="description">{cleanedSummary}</p>

      <FooterActions
        article={article}
        inTagDetailLatest={inTagDetailLatest}
        inTagDetailSelected={inTagDetailSelected}
        inUserArticles={inUserArticles}
      />

      <style jsx>{styles}</style>
    </Card>
  )
}

FeedDigest.fragments = fragments
