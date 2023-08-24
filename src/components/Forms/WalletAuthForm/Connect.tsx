import { useFormik } from 'formik'
import _pickBy from 'lodash/pickBy'
import { useContext, useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useAccount, useDisconnect, useSignMessage } from 'wagmi'

import {
  COOKIE_LANGUAGE,
  COOKIE_TOKEN_NAME,
  COOKIE_USER_GROUP,
} from '~/common/enums'
import {
  analytics,
  maskAddress,
  parseFormSubmitErrors,
  redirectToTarget,
  setCookies,
  WALLET_ERROR_MESSAGES,
  WalletType,
} from '~/common/utils'
import {
  AuthFeedType,
  AuthTabs,
  Dialog,
  IconLeft20,
  IconMetamask22,
  IconSpinner22,
  IconWalletConnect22,
  LanguageContext,
  Media,
  TextIcon,
  // toast,
  useMutation,
} from '~/components'
import {
  AuthResultType,
  GenerateSigningMessageMutation,
  WalletLoginMutation,
} from '~/gql/graphql'

import { GENERATE_SIGNING_MESSAGE, WALLET_LOGIN } from './gql'
import styles from './styles.module.css'

const isProd = process.env.NEXT_PUBLIC_RUNTIME_ENV === 'production'

interface FormProps {
  purpose: 'dialog' | 'page'
  walletType?: WalletType
  submitCallback?: (type?: AuthResultType) => void
  closeDialog?: () => void
  back?: () => void
  gotoSignInTab?: () => void
}

interface FormValues {
  address: string
}

const Connect: React.FC<FormProps> = ({
  purpose,
  walletType,
  submitCallback,
  closeDialog,
  back,
  gotoSignInTab,
}) => {
  const { lang } = useContext(LanguageContext)
  const [authTypeFeed] = useState<AuthFeedType>('wallet')

  const isMetamask = walletType === 'Metamask'
  const isWalletConnect = walletType === 'WalletConnect'

  const [generateSigningMessage] = useMutation<GenerateSigningMessageMutation>(
    GENERATE_SIGNING_MESSAGE,
    undefined,
    { showToast: false }
  )
  const [walletLogin] = useMutation<WalletLoginMutation>(
    WALLET_LOGIN,
    undefined,
    {
      showToast: false,
    }
  )

  const { disconnect } = useDisconnect()
  const { address: account } = useAccount()
  const { signMessageAsync } = useSignMessage()

  useEffect(() => {
    if (!account && back) {
      back()
    }

    setFieldValue('address', account || '')

    handleSubmit()
  }, [account])

  // disconnect before go back to previous step
  const onBack = () => {
    disconnect()

    if (back) {
      back()
    }
  }

  const onCloseDialog = () => {
    disconnect()
    if (closeDialog) {
      closeDialog()
    }
  }

  const { values, handleSubmit, setFieldValue } = useFormik<FormValues>({
    initialValues: {
      address: account || '',
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async ({ address }, { setFieldError, setSubmitting }) => {
      try {
        if (!address) {
          setFieldError('address', WALLET_ERROR_MESSAGES[lang].invalidAddress)
          setSubmitting(false)
          return
        }

        // get signing message
        const { data: signingMessageData } = await generateSigningMessage({
          variables: { input: { address } },
        })

        const signingMessage = signingMessageData?.generateSigningMessage
        if (!signingMessage) {
          setFieldError('address', WALLET_ERROR_MESSAGES[lang].unknown)
          onBack()
          setSubmitting(false)
          return
        }

        // let user sign the message
        let signature = ''
        try {
          signature = await signMessageAsync({
            message: signingMessage.signingMessage,
          })
        } catch (err) {
          setFieldError(
            'address',
            WALLET_ERROR_MESSAGES[lang].userRejectedSignMessage
          )
          onBack()
          setSubmitting(false)
          return
        }

        // confirm auth
        const { data: loginData } = await walletLogin({
          variables: {
            input: {
              ethAddress: address,
              nonce: signingMessage.nonce,
              signedMessage: signingMessage.signingMessage,
              signature,
            },
          },
        })

        const token = loginData?.walletLogin.token || ''
        const language = loginData?.walletLogin.user?.settings.language || ''
        const group = loginData?.walletLogin.user?.info.group || ''
        setCookies({
          [COOKIE_LANGUAGE]: language,
          [COOKIE_USER_GROUP]: group,
          ...(isProd ? {} : { [COOKIE_TOKEN_NAME]: token }),
        })

        analytics.identifyUser()

        if (loginData?.walletLogin.type === AuthResultType.Login) {
          redirectToTarget({
            fallback: 'current',
          })
        } else if (submitCallback) {
          submitCallback(loginData?.walletLogin.type)
        }
      } catch (error) {
        const [messages, codes] = parseFormSubmitErrors(error as any, lang)
        codes.forEach((c) => {
          if (c.includes('CODE_')) {
            setFieldError('code', messages[c])
          } else {
            setFieldError('address', messages[c])
          }
        })
      }

      setSubmitting(false)
    },
  })

  return (
    <>
      <Dialog.Header
        title={<>{isMetamask ? 'MetaMask' : 'Wallet Connect'}</>}
        hasSmUpTitle={false}
        leftBtn={
          back ? (
            <Dialog.TextButton
              text={<FormattedMessage defaultMessage="Back" />}
              onClick={onBack}
              color="greyDarker"
            />
          ) : null
        }
        closeDialog={onCloseDialog}
      />

      <Dialog.Content>
        <Media greaterThan="sm">
          <AuthTabs
            type={authTypeFeed}
            setType={(type) => {
              if (type === 'normal') {
                disconnect()
                if (gotoSignInTab) {
                  gotoSignInTab()
                }
              }
            }}
          />
        </Media>
        <section className={styles.walletInfo}>
          <span className={styles.icon}>
            {isMetamask && <IconMetamask22 size="mdM" />}
            {isWalletConnect && <IconWalletConnect22 size="mdM" />}
          </span>
          <span className={styles.address}>{maskAddress(values.address)}</span>
        </section>
        <section className={styles.loadingInfo}>
          <span>
            <IconSpinner22 color="grey" size="mdM" />
          </span>
          <span>
            <FormattedMessage
              defaultMessage="Please sign message in your wallet"
              description="src/components/Forms/WalletAuthForm/Connect.tsx"
            />
          </span>
        </section>
      </Dialog.Content>

      <Dialog.Footer
        smUpSpaceBetween
        smUpBtns={
          <>
            <Dialog.TextButton
              text={
                <TextIcon icon={<IconLeft20 size="mdS" />} spacing="xxxtight">
                  <FormattedMessage
                    defaultMessage="Switch wallet"
                    description="src/components/Forms/WalletAuthForm/Connect.tsx"
                  />
                </TextIcon>
              }
              color="greyDarker"
              onClick={onBack}
            />

            <Dialog.TextButton
              text={<FormattedMessage defaultMessage="Close" />}
              color="greyDarker"
              onClick={onCloseDialog}
            />
          </>
        }
      />
    </>
  )
}

export default Connect
