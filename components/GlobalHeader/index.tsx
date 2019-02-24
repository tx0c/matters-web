import classNames from 'classnames'
import gql from 'graphql-tag'
import Router from 'next/router'
import React, { useEffect } from 'react'

import { analytics } from '~/common/utils'

import { Responsive, SearchBar } from '~/components'
import { ModalSwitch } from '~/components/ModalManager'
import LoginButton from './LoginButton'
import Logo from './Logo'
import MeDigest from './MeDigest'
import Nav from './Nav'
import NotificationButton from './NotificationButton'
import SearchButton from './SearchButton'
import SignUpButton from './SignUpButton'
import WriteButton from './WriteButton'

import { GlobalHeaderUser } from './__generated__/GlobalHeaderUser'
import styles from './styles.css'

// Track client-side page views
Router.onRouteChangeComplete = () => {
  analytics.trackPage()
}

const ModalLoginSwitch = () => (
  <ModalSwitch modalId="loginModal">
    {open => <LoginButton onClick={open} />}
  </ModalSwitch>
)

export const GlobalHeader = ({ user }: { user: GlobalHeaderUser }) => {
  useEffect(analytics.identifyUser)

  const isAuthed = true

  const rightClasses = classNames({
    right: true,
    me: isAuthed
  })

  return (
    <header>
      <div className="l-row">
        <div className="container">
          <section className="left">
            <Logo />
            <Nav />
          </section>

          <section className={rightClasses}>
            {isAuthed ? (
              <>
                <Responsive.MediumUp>
                  {(match: boolean) =>
                    match ? <SearchBar /> : <SearchButton />
                  }
                </Responsive.MediumUp>
                <NotificationButton />
                <MeDigest user={user} />
                <WriteButton />
              </>
            ) : (
              <>
                <ModalLoginSwitch />
                <SignUpButton />
              </>
            )}
          </section>
        </div>
      </div>

      <style jsx>{styles}</style>
    </header>
  )
}

GlobalHeader.fragments = {
  user: gql`
    fragment GlobalHeaderUser on User {
      ...MeDigestUser
    }
    ${MeDigest.fragments.user}
  `
}
