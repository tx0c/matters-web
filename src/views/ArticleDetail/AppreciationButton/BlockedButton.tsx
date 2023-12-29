import { ButtonProps, toast, Translate } from '~/components'

import AppreciateButton from './AppreciateButton'

const BlockedButton = ({
  count,
  total,
  iconSize = 'mdS',
  textIconSpace = 'xtight',
  ...buttonProps
}: {
  count?: number
  total: number
  iconSize?: 'mdS' | 'md'
  textIconSpace?: 'xtight' | 'basexxtight'
} & ButtonProps) => (
  <AppreciateButton
    count={count}
    total={total}
    onClick={() => {
      toast.error({
        message: (
          <Translate
            zh_hant="因为作者设置，你無法讚賞此文章。"
            zh_hans="因为作者设置，你无法赞赏此文章。"
            en="Sorry, the author has disabled likes for this article.'"
          />
        ),
      })
    }}
    iconSize={iconSize}
    textIconSpace={textIconSpace}
    {...buttonProps}
  />
)

export default BlockedButton
