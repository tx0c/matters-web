import _get from 'lodash/get'

import { Icon } from '~/components/Icon'
import { TextIcon } from '~/components/TextIcon'

import { ANALYTICS_EVENTS, SHARE_TYPE } from '~/common/enums'
import { analytics, dom, objectToGetParams } from '~/common/utils'
import ICON_SHARE_DOUBAN from '~/static/icons/share-douban.svg?sprite'

const Douban = () => (
  <button
    type="button"
    onClick={() => {
      const url = window.location.href
      const text = window.document.title
      const description = dom
        .$('meta[name="description"]')
        .getAttribute('content')
      const shareUrl =
        'http://www.douban.com/share/service' +
        objectToGetParams({
          href: url,
          name: text,
          text: description
        })
      analytics.trackEvent(ANALYTICS_EVENTS.SHARE, {
        type: SHARE_TYPE.DOUBAN,
        url
      })
      return window.open(shareUrl)
    }}
  >
    <TextIcon
      icon={
        <Icon
          id={ICON_SHARE_DOUBAN.id}
          viewBox={ICON_SHARE_DOUBAN.viewBox}
          size="small"
        />
      }
      spacing="tight"
      text="豆瓣"
    />
  </button>
)

export default Douban
