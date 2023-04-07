import { useEffect, useState } from 'react'
import { Waypoint } from 'react-waypoint'

import { analytics } from '~/common/utils'

export const BannerExposureTracker = ({
  id,
  location,
  // feedType,
  // contentType,
  title,
  link,
  lang,
  horizontal = false,
}: {
  id: string
  location: number | string
  // feedType: FeedType
  // contentType: ContentType | ActivityType
  title: string
  link: string
  lang: Language
  horizontal?: boolean
}) => {
  const [timerId, setTimerId] = useState<number>()
  const [recorded, setRecorded] = useState(false)

  // clean up when unmount
  useEffect(() => () => window.clearTimeout(timerId), [timerId])

  return (
    <Waypoint
      onEnter={() => {
        // start timing 500ms after scroll into view
        // only start timer if it has not been setup
        if (!recorded) {
          const timer = window.setTimeout(() => {
            // analytics
            analytics.trackEvent('banner_exposure', {
              // feedType,
              // contentType,
              id,
              location,
              title,
              link,
              lang,
              delay_msecs: window?.performance.now() ?? -1,
            })
            setRecorded(true)
          }, 500)
          setTimerId(timer)
        }
      }}
      // cancel timer on leave
      onLeave={() => window.clearTimeout(timerId)}
      horizontal={horizontal}
    />
  )
}
