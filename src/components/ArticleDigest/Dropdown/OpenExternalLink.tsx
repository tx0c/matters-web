import { IconExternal16 } from '~/components'

import { toPath } from '~/common/utils'

import { ArticleDigestDropdownArticle } from './__generated__/ArticleDigestDropdownArticle'

const OpenExternalLink = ({
  article,
}: {
  article: ArticleDigestDropdownArticle
}) => {
  const path = toPath({
    page: 'articleDetail',
    article,
  })

  return (
    <a href={path.href} target="_blank">
      <IconExternal16 color="green" />
    </a>
  )
}

export default OpenExternalLink
