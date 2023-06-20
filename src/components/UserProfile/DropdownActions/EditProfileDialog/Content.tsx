import { useFormik } from 'formik'
import gql from 'graphql-tag'
import _pickBy from 'lodash/pickBy'
import React, { useContext } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import IMAGE_COVER from '@/public/static/images/profile-cover.png'
import { ADD_TOAST, ASSET_TYPE, ENTITY_TYPE } from '~/common/enums'
import { parseFormSubmitErrors, validateDisplayName } from '~/common/utils'
import {
  AvatarUploader,
  CoverUploader,
  Dialog,
  Form,
  LanguageContext,
  useMutation,
  ViewerContext,
} from '~/components'
import {
  EditProfileDialogUserPrivateFragment,
  EditProfileDialogUserPublicFragment,
  UpdateUserInfoProfileMutation,
} from '~/gql/graphql'

import NFTCollection from './NFTCollection'
import styles from './styles.module.css'

interface FormProps {
  user: EditProfileDialogUserPublicFragment &
    Partial<EditProfileDialogUserPrivateFragment>
  // user: DropdownActionsUserPublic & Partial<DropdownActionsUserPrivate>
  closeDialog: () => void
}

interface FormValues {
  avatar: string | null
  profileCover: string | null
  displayName: string
  description: string
}

type EditProfileDialogUserPrivateInfoCryptoWalletNft = NonNullable<
  NonNullable<
    EditProfileDialogUserPrivateFragment['info']['cryptoWallet']
  >['nfts']
>[0]

const UPDATE_USER_INFO = gql`
  mutation UpdateUserInfoProfile($input: UpdateUserInfoInput!) {
    updateUserInfo(input: $input) {
      id
      avatar
      displayName
      info {
        profileCover
        description
      }
    }
  }
`

/**
 * To identify `profileCover` is changed since it may be `null`
 */
const UNCHANGED_FIELD = 'UNCHANGED_FIELD'

const EditProfileDialogContent: React.FC<FormProps> = ({
  user,
  closeDialog,
}) => {
  const [update] = useMutation<UpdateUserInfoProfileMutation>(
    UPDATE_USER_INFO,
    undefined,
    { showToast: false }
  )
  const { lang } = useContext(LanguageContext)
  const viewer = useContext(ViewerContext)
  const isAdmin = viewer.status?.role === 'admin'

  const formId = 'edit-profile-form'

  const intl = useIntl()
  const validateDescription = (value: string, lang: Language) => {
    if (!value) {
      return intl.formatMessage({
        defaultMessage: 'Required',
        description: '',
      })
    } else if (value.length > 200) {
      return intl.formatMessage(
        {
          defaultMessage: 'Over 200 words, current {numbers}',
          description:
            'src/components/UserProfile/DropdownActions/EditProfileDialog/Content.tsx',
        },
        {
          numbers: value.length,
        }
      )
    }
  }
  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    isSubmitting,
    setFieldValue,
  } = useFormik<FormValues>({
    initialValues: {
      avatar: UNCHANGED_FIELD,
      profileCover: UNCHANGED_FIELD,
      displayName: user.displayName || '',
      description: user.info.description || '',
    },
    validateOnBlur: false,
    validateOnChange: false,
    validate: ({ displayName, description }) =>
      _pickBy({
        displayName: validateDisplayName(displayName, lang, isAdmin),
        description: validateDescription(description, lang),
      }),
    onSubmit: async (
      { avatar, profileCover, displayName, description },
      { setSubmitting, setFieldError }
    ) => {
      try {
        await update({
          variables: {
            input: {
              ...(avatar !== UNCHANGED_FIELD ? { avatar } : {}),
              ...(profileCover !== UNCHANGED_FIELD ? { profileCover } : {}),
              displayName,
              description,
            },
          },
        })

        window.dispatchEvent(
          new CustomEvent(ADD_TOAST, {
            detail: {
              color: 'green',
              content: (
                <FormattedMessage
                  defaultMessage="Profile updated"
                  description="src/components/UserProfile/DropdownActions/EditProfileDialog/Content.tsx"
                />
              ),
            },
          })
        )

        setSubmitting(false)
        closeDialog()
      } catch (error) {
        setSubmitting(false)

        const [messages, codes] = parseFormSubmitErrors(error as any, lang)
        codes.forEach((code) => {
          if (code === 'DISPLAYNAME_INVALID') {
            setFieldError(
              'displayName',
              intl.formatMessage({
                defaultMessage:
                  'Must be between 2-20 characters long. Chinese characters, letters, numbers and underscores are allowed.',
                description: '',
              })
            )
          } else {
            setFieldError('description', messages[code])
          }
        })
      }
    },
  })

  const nfts = user.info.cryptoWallet
    ?.nfts as EditProfileDialogUserPrivateInfoCryptoWalletNft[]

  const InnerForm = (
    <Form id={formId} onSubmit={handleSubmit}>
      <section className={styles.coverField}>
        <CoverUploader
          assetType={ASSET_TYPE.profileCover}
          cover={user.info.profileCover}
          fallbackCover={IMAGE_COVER.src}
          entityType={ENTITY_TYPE.user}
          inEditor
          onUpload={(assetId) => setFieldValue('profileCover', assetId)}
        />

        <p className={styles.hint}>
          <FormattedMessage
            defaultMessage="Recommended size: 1600px x 900px"
            description=""
          />
        </p>
      </section>

      <section className={styles.avatarField}>
        <AvatarUploader
          user={user}
          onUpload={(assetId) => setFieldValue('avatar', assetId)}
          hasBorder
        />
      </section>

      {nfts && nfts.length > 0 && (
        <NFTCollection
          nfts={nfts}
          setField={(url: string) => setFieldValue('avatar', url)}
        />
      )}

      <section className={styles.container}>
        <Form.Input
          label={
            <FormattedMessage defaultMessage="Display Name" description="" />
          }
          type="text"
          name="displayName"
          required
          placeholder={intl.formatMessage({
            defaultMessage: 'Enter Display Name',
            description: '',
          })}
          hint={
            <FormattedMessage
              defaultMessage="Must be between 2-20 characters long. Chinese characters, letters, numbers and underscores are allowed."
              description=""
            />
          }
          value={values.displayName}
          error={touched.displayName && errors.displayName}
          onBlur={handleBlur}
          onChange={handleChange}
        />
      </section>

      <section className={styles.container}>
        <Form.Textarea
          label={
            <FormattedMessage defaultMessage="Description" description="" />
          }
          name="description"
          required
          placeholder={intl.formatMessage({
            defaultMessage: 'Enter Bio',
            description: '',
          })}
          hint={
            <FormattedMessage
              defaultMessage="Maximum 200 characters."
              description=""
            />
          }
          value={values.description}
          error={touched.description && errors.description}
          onBlur={handleBlur}
          onChange={handleChange}
        />
      </section>
    </Form>
  )

  const SubmitButton = () => (
    <Dialog.TextButton
      type="submit"
      form={formId}
      disabled={isSubmitting}
      text={<FormattedMessage defaultMessage="Save" description="" />}
      loading={isSubmitting}
    />
  )

  return (
    <>
      <Dialog.Header
        title="editUserProfile"
        closeDialog={closeDialog}
        rightBtn={<SubmitButton />}
        hasSmUpTitle={false}
      />

      <Dialog.Content>{InnerForm}</Dialog.Content>

      <Dialog.Footer
        smUpBtns={
          <>
            <Dialog.TextButton
              text="cancel"
              color="greyDarker"
              onClick={closeDialog}
            />
            <SubmitButton />
          </>
        }
      />
    </>
  )
}

export default EditProfileDialogContent
