import dynamic from 'next/dynamic'
import { useContext, useEffect, useState } from 'react'

import { PAYMENT_CURRENCY as CURRENCY } from '~/common/enums'
import {
  AuthWalletFeed,
  Spacer,
  Spinner,
  useStep,
  ViewerContext,
} from '~/components'
import PaymentProcessingForm from '~/components/Forms/PaymentForm/Processing'
import { PayToMutation } from '~/gql/graphql'

import DonationTabs, { CurrencyType } from './Tabs'
import { BaseSupportAuthorProps, Step as SupportStep } from './types'

interface SetAmountCallbackValues {
  amount: number
  currency: CURRENCY
}

interface SetAmountOpenTabCallbackValues {
  window: Window
  transaction: PayToMutation['payTo']['transaction']
}

const DynamicPayToFormSetAmount = dynamic(
  () => import('~/components/Forms/PaymentForm/PayTo/SetAmount'),
  { loading: () => <Spinner /> }
)

const DynamicPayToFormConfirm = dynamic(
  () => import('~/components/Forms/PaymentForm/PayTo/Confirm'),
  { loading: () => <Spinner /> }
)

const DynamicPayToFormComplete = dynamic(
  () => import('~/components/Forms/PaymentForm/PayTo/Complete'),
  { loading: () => <Spinner /> }
)

const DynamicPaymentSetPasswordForm = dynamic(
  () => import('~/components/Forms/PaymentForm/SetPassword'),
  { loading: () => <Spinner /> }
)

const DynamicAddCreditForm = dynamic(
  () => import('~/components/Forms/PaymentForm/AddCredit'),
  { loading: () => <Spinner /> }
)

const DynamicSwitchNetworkForm = dynamic(
  () => import('~/components/Forms/PaymentForm/SwitchNetwork'),
  { loading: () => <Spinner /> }
)

export type SupportAuthorProps = BaseSupportAuthorProps & {
  updateSupportStep: (step: SupportStep) => void
  onClose: () => void
}

const SupportAuthor = (props: SupportAuthorProps) => {
  const { recipient, targetId, article, updateSupportStep, onClose } = props
  const viewer = useContext(ViewerContext)
  const [windowRef, setWindowRef] = useState<Window | undefined>(undefined)
  const [type, setType] = useState<CurrencyType>('credit')
  const { currStep, forward: _forward } = useStep<SupportStep>('setAmount')

  const forward = (step: SupportStep) => {
    _forward(step)
    updateSupportStep(step)
  }

  const [amount, setAmount] = useState<number>(0)
  const [currency, setCurrency] = useState<CURRENCY>(CURRENCY.HKD)

  const [payToTx, setPayToTx] =
    useState<Omit<PayToMutation['payTo']['transaction'], '__typename'>>()
  const [tabUrl, setTabUrl] = useState('')
  const [tx, setTx] = useState<PayToMutation['payTo']['transaction']>()

  const setAmountCallback = (values: SetAmountCallbackValues) => {
    setAmount(values.amount)
    setCurrency(values.currency)
    if (values.currency === CURRENCY.HKD) {
      forward(
        viewer.status?.hasPaymentPassword ? 'confirm' : 'setPaymentPassword'
      )
    } else {
      forward('confirm')
    }
  }

  const setAmountOpenTabCallback = (values: SetAmountOpenTabCallbackValues) => {
    setWindowRef(values.window)
    setPayToTx(values.transaction)
    forward('processing')
  }

  useEffect(() => {
    if (type === 'usdt') {
      forward('walletSelect')
    } else {
      forward('setAmount')
    }
  }, [type])

  const isSetAmount = currStep === 'setAmount'
  const isConfirm = currStep === 'confirm'
  const isProcessing = currStep === 'processing'
  const isComplete = currStep === 'complete'
  const isSetPaymentPassword = currStep === 'setPaymentPassword'
  const isTopup = currStep === 'topup'
  const isWalletSelect = currStep === 'walletSelect'
  const isNetworkSelect = currStep === 'networkSelect'
  const isApproveContract = currStep === 'approveContract'

  const showTabs = isSetAmount || isWalletSelect || isNetworkSelect

  return (
    <>
      {showTabs && (
        <DonationTabs
          type={type}
          setType={setType}
          recipient={props.recipient}
        />
      )}
      {isSetAmount && (
        <>
          <DynamicPayToFormSetAmount
            currency={CURRENCY.HKD}
            recipient={recipient}
            article={article}
            submitCallback={setAmountCallback}
            switchToAddCredit={() => {
              forward('topup')
            }}
            setTabUrl={setTabUrl}
            setTx={setTx}
            targetId={targetId}
          />
        </>
      )}
      {isConfirm && (
        <DynamicPayToFormConfirm
          article={article}
          amount={amount}
          currency={currency}
          recipient={recipient}
          switchToSetAmount={() => forward('setAmount')}
          submitCallback={() => forward('processing')}
          switchToResetPassword={() => forward('resetPassword')}
          targetId={targetId}
          openTabCallback={setAmountOpenTabCallback}
          tabUrl={tabUrl}
          tx={tx}
        />
      )}
      {isProcessing && (
        <PaymentProcessingForm
          amount={amount}
          currency={currency}
          recipient={recipient}
          closeDialog={() => {}}
          prevStep={() => {
            forward('confirm')
          }}
          nextStep={() => {
            forward('complete')
          }}
          txId={payToTx?.id || ''}
          windowRef={windowRef}
          article={article}
          targetId={targetId}
          switchToConfirm={() => forward('confirm')}
          switchToCurrencyChoice={() => {}}
        />
      )}
      {isComplete && (
        <DynamicPayToFormComplete
          callback={() => {
            onClose()
          }}
          recipient={recipient}
          amount={amount}
          currency={currency}
          targetId={targetId}
        />
      )}
      {isSetPaymentPassword && (
        <DynamicPaymentSetPasswordForm
          submitCallback={() => forward('confirm')}
          recipient={recipient}
          amount={amount}
          currency={currency}
          switchToSetAmount={() => forward('setAmount')}
        />
      )}

      {isTopup && (
        <DynamicAddCreditForm
          closeDialog={onClose}
          switchToSetAmount={() => forward('setAmount')}
        />
      )}
      {isWalletSelect && (
        <>
          <Spacer size="xxloose" />
          <AuthWalletFeed
            submitCallback={() => forward('networkSelect')}
            isInSupport
          />
        </>
      )}
      {isNetworkSelect && (
        <>
          <Spacer size="xxloose" />
          {/* <span>Network Select</span> */}
          <DynamicSwitchNetworkForm
            submitCallback={() => forward('approveContract')}
          />
        </>
      )}
      {isApproveContract && (
        <>
          <Spacer size="xxloose" />
          <span>Approve Contract</span>
        </>
      )}
    </>
  )
}

export default SupportAuthor
