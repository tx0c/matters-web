import { DialogContent, DialogOverlay } from '@reach/dialog'
import classNames from 'classnames'
import { useEffect, useRef, useState } from 'react'
import { animated, useSpring } from 'react-spring'
import { useDrag } from 'react-use-gesture'

import { useOutsideClick, useResponsive } from '~/components'

import { KEYCODES } from '~/common/enums'

import Handle from './Handle'
import Overlay from './Overlay'
import styles from './styles.css'
import globalStyles from './styles.global.css'

export interface DialogOverlayProps {
  isOpen: boolean | undefined
  onDismiss: () => void
  onRest?: () => void
}

export type DialogProps = {
  size?: 'sm' | 'lg'
  fixedHeight?: boolean
} & DialogOverlayProps

const Container: React.FC<
  {
    style?: React.CSSProperties
    setDragGoal: (val: any) => void
  } & DialogProps
> = ({ size = 'lg', fixedHeight, onDismiss, children, style, setDragGoal }) => {
  const isSmallUp = useResponsive('sm-up')
  const node: React.RefObject<any> | null = useRef(null)

  const containerClass = classNames({
    container: true,
    'fixed-height': !!fixedHeight,
    'l-col-4 l-col-sm-6 l-offset-sm-1 l-col-md-5 l-offset-md-2 l-col-lg-6 l-offset-lg-3':
      size === 'lg',
    'l-col-4 l-col-sm-4 l-offset-sm-2 l-col-lg-4 l-offset-lg-4': size === 'sm',
  })

  const bind = useDrag(({ down, movement: [, my] }) => {
    if (!down && my > 30) {
      onDismiss()
    } else {
      setDragGoal({ top: down ? Math.max(my, -30) : 0 })
    }
  })

  useOutsideClick(node, onDismiss)

  return (
    <div
      ref={node}
      className={containerClass}
      style={style}
      onKeyDown={(event) => {
        if (event.keyCode === KEYCODES.escape) {
          onDismiss()
        }
      }}
    >
      {children}

      {!isSmallUp && <Handle {...bind()} close={onDismiss} />}

      <style jsx>{styles}</style>
    </div>
  )
}

const Dialog: React.FC<DialogProps> = (props) => {
  const { isOpen, onRest } = props
  const [mounted, setMounted] = useState(isOpen)
  const [fadeIn, setFadeIn] = useState(false)
  const isSmallUp = useResponsive('sm-up')

  // Drag
  const [{ top }, setDragGoal] = useSpring(() => ({
    top: 0,
  }))

  // Fade In/ Fade Out
  const { opacity, transform } = useSpring({
    opacity: fadeIn ? 1 : 0,
    transform: fadeIn ? 'translateY(0%)' : 'translateY(100%)',
    config: { tension: 270, friction: isSmallUp ? undefined : 30 },
    onRest: () => {
      if (!isOpen) {
        setMounted(false)
        setDragGoal({ top: 0 })
      }

      if (onRest) {
        onRest()
      }
    },
  })

  useEffect(() => {
    if (isOpen) {
      setMounted(true)
      setFadeIn(true)
    } else {
      setFadeIn(false)
    }
  })

  const AnimatedDialogOverlay = animated(DialogOverlay)
  const AnimatedContainer = animated(Container)
  const AnimatedOverlay = animated(Overlay)

  if (!mounted) {
    return null
  }

  return (
    <>
      <AnimatedDialogOverlay className="dialog">
        <AnimatedOverlay style={{ opacity }} />

        <DialogContent className="l-row full" aria-labelledby="dialog-title">
          <AnimatedContainer
            style={{
              transform: !isSmallUp && transform ? transform : undefined,
              opacity: isSmallUp ? opacity : undefined,
              top,
            }}
            setDragGoal={setDragGoal}
            {...props}
          />
        </DialogContent>
      </AnimatedDialogOverlay>

      <style jsx global>
        {globalStyles}
      </style>
    </>
  )
}

export default Dialog
