import { useContext, useEffect } from 'react'

import {
  Avatar,
  Cover,
  Error,
  Expandable,
  FollowUserButton,
  LanguageContext,
  Layout,
  Spinner,
  Throw404,
  Tooltip,
  Translate,
  usePublicQuery,
  useRoute,
  ViewerContext,
} from '~/components'
import ShareButton from '~/components/Layout/Header/ShareButton'

import { numAbbr } from '~/common/utils'

import IMAGE_COVER from '@/public/static/images/profile-cover.png'

import {
  ArchitectBadge,
  CivicLikerBadge,
  GoldenMotorBadge,
  SeedBadge,
  TraveloggersBadge,
} from './Badges'
import CircleWidget from './CircleWidget'
import DropdownActions from './DropdownActions'
import { FollowersDialog } from './FollowersDialog'
import { FollowingDialog } from './FollowingDialog'
import { USER_PROFILE_PRIVATE, USER_PROFILE_PUBLIC } from './gql'
import styles from './styles.css'

// import { UserProfileUserPrivate_user_info_cryptoWallet_nfts } from './__generated__/UserProfileUserPrivate'
import { UserProfileUserPublic } from './__generated__/UserProfileUserPublic'

export const UserProfile = () => {
  const { getQuery } = useRoute()
  const viewer = useContext(ViewerContext)
  const { lang } = useContext(LanguageContext)

  // public data
  const userName = getQuery('name')
  const isMe = !userName || viewer.userName === userName
  const { data, loading, client } = usePublicQuery<UserProfileUserPublic>(
    USER_PROFILE_PUBLIC,
    {
      variables: { userName },
    }
  )
  const user = data?.user

  // fetch private data
  useEffect(() => {
    if (!viewer.isAuthed || !user) {
      return
    }

    client.query({
      query: USER_PROFILE_PRIVATE,
      fetchPolicy: 'network-only',
      variables: { userName },
    })
  }, [user?.id, viewer.id])

  /**
   * Render
   */
  const LayoutHeader = () => (
    <Layout.Header
      left={<Layout.Header.BackButton mode="black-solid" />}
      right={
        <>
          <span />
          {user && (
            <section className="buttons">
              <ShareButton />
              <DropdownActions user={user} isMe={isMe} />
              <style jsx>{styles}</style>
            </section>
          )}
        </>
      }
      mode="transparent-absolute"
    />
  )

  if (loading) {
    return (
      <>
        <LayoutHeader />
        <Spinner />
      </>
    )
  }

  if (!user) {
    return (
      <>
        <LayoutHeader />
        <Throw404 />
      </>
    )
  }

  if (user?.status?.state === 'archived') {
    return (
      <>
        <LayoutHeader />
        <Error
          statusCode={404}
          message={
            <Translate
              zh_hant="此帳戶因為違反社區約章而被註銷"
              zh_hans="此帐户因为违反社区约章而被注销"
              en="This account is archived because of violating community guidelines"
            />
          }
        />
      </>
    )
  }

  const badges = user.info.badges || []
  const circles = user.ownCircles || []
  const hasSeedBadge = badges.some((b) => b.type === 'seed')
  const hasArchitectBadge = badges.some((b) => b.type === 'architect')
  const hasGoldenMotorBadge = badges.some((b) => b.type === 'golden_motor')
  const hasTraveloggersBadge = !!user.info.cryptoWallet?.hasNFTs /*
    Array.isArray(user.info.cryptoWallet?.nfts) &&
    (
      user?.info.cryptoWallet
        ?.nfts as UserProfileUserPrivate_user_info_cryptoWallet_nfts[]
    ).length > 0 */

  const profileCover = user.info.profileCover || ''
  const userState = user.status?.state as string
  const isCivicLiker = user.liker.civicLiker
  const isUserArchived = userState === 'archived'
  const isUserBanned = userState === 'banned'
  const isUserInactive = isUserArchived || isUserBanned
  const logbookUrl = `${process.env.NEXT_PUBLIC_TRAVELOGGERS_URL}${
    lang === 'en' ? '/' : '/zh/'
  }owner/${user.info.cryptoWallet?.address}`

  /**
   * Inactive User
   */
  if (isUserInactive) {
    return (
      <>
        <LayoutHeader />

        <section className="user-profile">
          <Cover fallbackCover={IMAGE_COVER.src} />

          <header>
            <section className="avatar">
              <Avatar size="xxxl" />
            </section>
          </header>

          <section className="info">
            <section className="display-name">
              <h1 className="name">
                {isUserArchived && <Translate id="accountArchived" />}
                {isUserBanned && <Translate id="accountBanned" />}
              </h1>
            </section>
          </section>

          <style jsx>{styles}</style>
        </section>
      </>
    )
  }

  /**
   * Active or Onboarding User
   */
  return (
    <>
      <LayoutHeader />

      <section className="user-profile">
        <Cover cover={profileCover} fallbackCover={IMAGE_COVER.src} />

        <header>
          <section className="avatar">
            {hasTraveloggersBadge ? (
              <Tooltip
                content={
                  <Translate
                    zh_hant={`查看 ${user.displayName} 的航行日誌`}
                    zh_hans={`查看 ${user.displayName} 的航行日志`}
                    en={`View Logbooks owned by ${user.displayName}`}
                  />
                }
              >
                <a href={logbookUrl} target="_blank">
                  <Avatar size="xxxl" user={user} inProfile />
                </a>
              </Tooltip>
            ) : (
              <Avatar size="xxxl" user={user} inProfile />
            )}
          </section>

          {!isMe && <FollowUserButton user={user} size="lg" />}
        </header>

        <section className="info">
          <section className="display-name">
            <h1 className="name">{user.displayName}</h1>
            {hasTraveloggersBadge && <TraveloggersBadge />}
            {hasSeedBadge && <SeedBadge />}
            {hasGoldenMotorBadge && <GoldenMotorBadge />}
            {hasArchitectBadge && <ArchitectBadge />}
            {isCivicLiker && <CivicLikerBadge />}
          </section>

          <section className="username">
            <span className="name">@{user.userName}</span>
            {!isMe && <FollowUserButton.State user={user} />}
          </section>

          <Expandable>
            <p className="description">{user.info.description}</p>
          </Expandable>
        </section>

        <footer>
          <FollowersDialog user={user}>
            {({ openDialog: openFollowersDialog }) => (
              <button type="button" onClick={openFollowersDialog}>
                <span className="count">
                  {numAbbr(user.followers.totalCount)}
                </span>
                <Translate id="follower" />
              </button>
            )}
          </FollowersDialog>

          <FollowingDialog user={user}>
            {({ openDialog: openFollowingDialog }) => (
              <button type="button" onClick={openFollowingDialog}>
                <span className="count">
                  {numAbbr(user.following.users.totalCount)}
                </span>
                <Translate id="following" />
              </button>
            )}
          </FollowingDialog>
        </footer>

        <CircleWidget circles={circles} isMe={isMe} />

        <style jsx>{styles}</style>
      </section>
    </>
  )
}
