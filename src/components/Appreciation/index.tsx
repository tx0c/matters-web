import gql from 'graphql-tag'
import React, { useContext } from 'react'

import {
  ArticleDigestTitle,
  Card,
  IconClap16,
  LanguageContext,
  TextIcon,
  Translate,
  UserDigest,
} from '~/components'

import { toPath, translate } from '~/common/utils'

import styles from './styles.css'

import { DigestAppreciation } from './__generated__/DigestAppreciation'

interface AppreciationProps {
  type: 'received' | 'sent'
  appreciation: DigestAppreciation
}

const fragments = {
  appreciation: gql`
    fragment DigestAppreciation on Appreciation {
      amount
      purpose
      content
      sender {
        ...UserDigestMiniUser
      }
      recipient {
        ...UserDigestMiniUser
      }
      target {
        ...ArticleDigestTitleArticle
      }
    }
    ${UserDigest.Mini.fragments.user}
    ${ArticleDigestTitle.fragments.article}
  `,
}

const BaseAppreciation = ({ type, appreciation }: AppreciationProps) => {
  const { lang } = useContext(LanguageContext)

  const { amount, content, purpose, recipient, sender, target } = appreciation

  const showContent = purpose !== 'appreciate'
  const isSent = type === 'sent'
  const isReceived = type === 'received'

  const path = target
    ? toPath({ page: 'articleDetail', article: target })
    : null

  return (
    <Card {...path} spacing={['base', 'base']}>
      <section className="container">
        <section className="left">
          {showContent && content && (
            <section className="content">
              <p>{content}</p>
            </section>
          )}

          {!showContent && isReceived && sender && (
            <header className="sender">
              <UserDigest.Mini
                user={sender}
                avatarSize="xs"
                hasAvatar
                hasDisplayName
              />
              <span>
                &nbsp;
                <Translate zh_hant="讚賞了" zh_hans="赞赏了" en="appreciated" />
              </span>
            </header>
          )}

          {!showContent && target && (
            <section>
              <ArticleDigestTitle article={target} is="h2" />
            </section>
          )}

          {!showContent && isSent && recipient && (
            <footer>
              <UserDigest.Mini
                user={recipient}
                avatarSize="xs"
                hasAvatar
                hasDisplayName
                hasUserName
              />
            </footer>
          )}
        </section>

        <section className="right">
          <div
            className="num"
            aria-label={translate({
              zh_hant: `${amount} 次讚賞`,
              zh_hans: `${amount} 次赞赏`,
              en: `${amount} appreciations`,
              lang,
            })}
          >
            <TextIcon
              icon={<IconClap16 />}
              spacing="xtight"
              weight="md"
              color="green"
            >
              {amount}
            </TextIcon>
          </div>
        </section>

        <style jsx>{styles}</style>
      </section>
    </Card>
  )
}

/**
 * Memoizing
 */
type MemoizedAppreciationType = React.MemoExoticComponent<
  React.FC<AppreciationProps>
> & {
  fragments: typeof fragments
}

export const MemoizedAppreciation = React.memo(
  BaseAppreciation,
  () => true
) as MemoizedAppreciationType

MemoizedAppreciation.fragments = fragments

export const Appreciation = MemoizedAppreciation
