import { useQuery } from '@apollo/react-hooks'
import _random from 'lodash/random'
import _range from 'lodash/range'
import { useContext } from 'react'
import { FormattedMessage } from 'react-intl'
import { useAccount } from 'wagmi'

import {
  PAYMENT_CURRENCY as CURRENCY,
  SUPPORT_SUCCESS_ANIMATION,
} from '~/common/enums'
import { Dialog, IconCircleCheck40, Spinner, ViewerContext } from '~/components'
import {
  QueryUserByAddressQuery,
  UserDonationRecipientFragment,
} from '~/gql/graphql'

import PaymentInfo from '../../PaymentInfo'
import { QUERY_USER_BY_ADDRESS } from './gql'
import styles from './styles.module.css'

interface Props {
  amount: number
  currency: CURRENCY
  recipient: UserDonationRecipientFragment
  targetId: string
  callback?: () => void
  switchToBindWallet: () => void
}

const Complete: React.FC<Props> = ({
  amount,
  currency,
  callback,
  recipient,
  targetId,
  switchToBindWallet,
}) => {
  const viewer = useContext(ViewerContext)
  const { address } = useAccount()

  const { data, loading } = useQuery<QueryUserByAddressQuery>(
    QUERY_USER_BY_ADDRESS,
    {
      variables: { ethAddress: address },
    }
  )

  const gotIt = () => {
    window.dispatchEvent(
      new CustomEvent(SUPPORT_SUCCESS_ANIMATION, {
        detail: {
          currency,
        },
      })
    )

    if (callback) {
      callback()
    }
  }

  const isUsdt = currency === CURRENCY.USDT
  const isLikecoin = currency === CURRENCY.LIKE
  const isHKD = currency === CURRENCY.HKD

  if (loading) {
    return <Spinner />
  }
  const shouldBindWallet =
    viewer.info.ethAddress === null && data?.user === null

  return (
    <section className={styles.container}>
      <PaymentInfo
        amount={amount}
        currency={currency}
        recipient={recipient}
        showLikerID={isLikecoin}
        showEthAddress={isUsdt}
      >
        <>
          <IconCircleCheck40 size="xlM" color="green" />
          <p className={styles.hint}>
            {isHKD && (
              <FormattedMessage
                defaultMessage="Successfully delivered"
                id="5UglrB"
              />
            )}
            {isUsdt && (
              <FormattedMessage
                defaultMessage="Payment request has been sent"
                id="quRPwZ"
              />
            )}
          </p>
        </>
      </PaymentInfo>
      <Dialog.RoundedButton
        color="black"
        onClick={shouldBindWallet ? switchToBindWallet : gotIt}
        borderColor="greyLight"
        borderWidth="sm"
        textWeight="normal"
        borderActiveColor="grey"
        text={
          <FormattedMessage
            defaultMessage="Got it"
            id="f45YWK"
            description="src/components/Forms/PaymentForm/PayTo/Complete/index.tsx"
          />
        }
      />
    </section>
  )
}

export default Complete
