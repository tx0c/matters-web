import dynamic from 'next/dynamic'
import { useState } from 'react'

import { Dialog, Spinner } from '~/components'
import { SearchSelectFormProps } from '~/components/Forms/SearchSelectForm'

type SearchSelectDialogProps = SearchSelectFormProps & {
  children: ({ open }: { open: () => void }) => React.ReactNode
}

const DynamicSearchSelectForm = dynamic(
  () => import('~/components/Forms/SearchSelectForm'),
  { loading: Spinner }
)

const BaseSearchSelectDialog = ({
  children,
  ...props
}: SearchSelectDialogProps) => {
  const [showDialog, setShowDialog] = useState(true)
  const open = () => {
    setShowDialog(true)
  }

  return (
    <>
      {children({ open })}

      <Dialog isOpen={showDialog} onDismiss={close} fixedHeight>
        <DynamicSearchSelectForm {...props} />
      </Dialog>
    </>
  )
}

export const SearchSelectDialog = (props: SearchSelectDialogProps) => (
  <Dialog.Lazy mounted={<BaseSearchSelectDialog {...props} />}>
    {({ open }) => <>{props.children({ open })}</>}
  </Dialog.Lazy>
)
