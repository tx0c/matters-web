import {
  Dialog,
  Translate,
  useDialogSwitch,
  useMutation,
  useRoute,
} from '~/components'
import UPDATE_TAG_SETTING from '~/components/GQL/mutations/updateTagSetting'

import { ADD_TOAST } from '~/common/enums'

import { UpdateTagSetting } from '~/components/GQL/mutations/__generated__/UpdateTagSetting'

interface Props {
  children: ({ open }: { open: () => void }) => React.ReactNode
}

const textZhHant =
  '當你認領標籤後，即刻成為該標籤的主理人。' +
  '你將可以為標籤設置封面，編輯描述，並添加作品至精選列表。' +
  '你主理的標籤可以用作文集、策展，也可以變成圈子、小組、討論區等，更多主理人玩法等你發掘！'

const textZhHans =
  '当你认领标签后，即刻成为该标签的主理人。' +
  '你将可以为标签设置封面，编辑描述，并添加作品至精选列表。' +
  '你主理的标签可以用作文集、策展，也可以变成圈子、小组、讨论区等，更多主理人玩法等你发掘！'

const textEn =
  'After adopting the tag, you become the maintainer of it.' +
  ' You can set the cover and description of the tag, and add works to selected feed. ' +
  ' You can use it for writing collection, curation, or subcommunity and group discussions, be creative and discover new usages!'

const BaseDialog = ({ children }: Props) => {
  const { show, open, close } = useDialogSwitch(true)

  const { getQuery } = useRoute()
  const id = getQuery('tagId')
  const [update, { loading }] = useMutation<UpdateTagSetting>(
    UPDATE_TAG_SETTING
  )

  return (
    <>
      {children({ open })}

      <Dialog size="sm" isOpen={show} onDismiss={close}>
        <Dialog.Header
          title={
            <Translate zh_hant="認領標籤" zh_hans="认领标签" en="adopt tag" />
          }
          close={close}
          closeTextId="cancel"
        />
        <Dialog.Message>
          <p>
            <Translate zh_hant={textZhHant} zh_hans={textZhHans} en={textEn} />
          </p>
        </Dialog.Message>
        <Dialog.Footer>
          <Dialog.Footer.Button
            textColor="white"
            bgColor="green"
            loading={loading}
            onClick={async () => {
              const result = await update({
                variables: { input: { id, type: 'adopt' } },
              })

              if (!result) {
                throw new Error('tag adoption failed')
              }

              window.dispatchEvent(
                new CustomEvent(ADD_TOAST, {
                  detail: {
                    color: 'green',
                    content: (
                      <Translate zh_hant="認領成功" zh_hans="认领成功" />
                    ),
                    duration: 2000,
                  },
                })
              )
            }}
          >
            <Translate
              zh_hant="即刻主理"
              zh_hans="即刻主理"
              en="Maintain at once"
            />
          </Dialog.Footer.Button>

          <Dialog.Footer.Button
            textColor="black"
            bgColor="grey-lighter"
            onClick={close}
          >
            <Translate
              zh_hant="考慮一下"
              zh_hans="考虑一下"
              en="I need to think it through"
            />
          </Dialog.Footer.Button>
        </Dialog.Footer>
      </Dialog>
    </>
  )
}

export const TagAdoptionDialog = (props: Props) => (
  <Dialog.Lazy mounted={<BaseDialog {...props} />}>
    {({ open }) => <>{props.children({ open })}</>}
  </Dialog.Lazy>
)
