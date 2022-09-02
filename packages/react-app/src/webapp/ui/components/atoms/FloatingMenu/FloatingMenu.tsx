import React, { FC, KeyboardEvent, useEffect, useRef, useState } from 'react'
import Card from '../Card/Card'
import './FloatingMenu.scss'

export type FloatingMenuProps = {
  menuContent: React.ReactElement[]
  hoverElement: React.ReactNode
  hover?: boolean
  className?: string
}

export const FloatingMenu: FC<FloatingMenuProps> = ({ menuContent, className, hover, hoverElement }) => {
  const [currentVisible, setCurrentVisible] = useState<Boolean | undefined>(false)
  const hoverElementRef = useRef<HTMLDivElement>(null)
  const [isOnHover, setIsOnHover] = useState<Boolean>(false)
  const switchMenu = (e: KeyboardEvent<HTMLDivElement>) => {
    ;['ArrowDown', 'ArrowUp'].includes(e.key) && expand()
    ;['Enter'].includes(e.key) && setCurrentVisible(!currentVisible)
  }
  const closeMenu = (e: KeyboardEvent<HTMLDivElement>) => {
    ;['Tab', 'Enter'].includes(e.key) && e.shiftKey && close()
  }
  const closeMenuUp = (e: KeyboardEvent<HTMLDivElement>) => {
    ;['ArrowUp'].includes(e.key) && close()
    ;['Tab'].includes(e.key) && e.shiftKey && close()
  }
  const closeMenuDown = (e: KeyboardEvent<HTMLDivElement>) => {
    ;['ArrowDown'].includes(e.key) && close()
    ;['Tab'].includes(e.key) && !e.shiftKey && close()
  }
  const oneElementActions = (e: KeyboardEvent<HTMLDivElement>) => {
    closeMenuUp(e)
    closeMenuDown(e)
  }

  const expand = () => {
    setCurrentVisible(true)
  }

  const close = () => {
    setCurrentVisible(false)
  }

  const updatedMenuContent = menuContent.map((element, i) => {
    if (menuContent.length === 1) {
      return (
        <div key={i} tabIndex={i + 1} onKeyDown={oneElementActions}>
          {element}
        </div>
      )
    } else if (i === 0) {
      return (
        <div key={i} tabIndex={i + 1} onKeyDown={closeMenuUp}>
          {element}
        </div>
      )
    } else if (menuContent.length - 1 === i) {
      return (
        <div key={i} tabIndex={i + 1} className="last element">
          {element}
        </div>
      )
    } else {
      return (
        <div key={i} tabIndex={i + 1}>
          {element}
        </div>
      )
    }
  })

  const handleBlur = (e: React.FocusEvent<HTMLDivElement, Element>) => {
    const currentTarget = e.currentTarget

    requestAnimationFrame(() => !currentTarget.contains(document.activeElement) && close())
  }

  useEffect(() => {
    hoverElementRef?.current?.setAttribute('inert', '')
  }, [hoverElementRef])

  useEffect(() => {
    const clickOutListener = () => {
      currentVisible && close()
    }
    window.addEventListener('click', clickOutListener)
    return () => window.removeEventListener('click', clickOutListener)
  }, [currentVisible])

  return (
    <div
      className={`floating-menu ${className}`}
      onClick={e => e.stopPropagation()}
      onBlur={e => handleBlur(e)}
      onFocus={expand}
      tabIndex={0}
    >
      <div
        className="hover-element"
        ref={hoverElementRef}
        onKeyUp={switchMenu}
        onKeyDown={closeMenu}
        onMouseEnter={() => hover && expand()}
        onMouseLeave={() => hover && close()}
      >
        {hoverElement}
      </div>
      <div
        className={`menu ${currentVisible || (hover && isOnHover) ? 'visible' : ''}`}
        style={{
          top: hoverElementRef.current?.clientHeight && `${hoverElementRef.current?.clientHeight}px`,
        }}
        onMouseEnter={() => hover && setIsOnHover(true)}
        onMouseLeave={() => hover && setIsOnHover(false)}
      >
        <Card className="content">{updatedMenuContent}</Card>
      </div>
    </div>
  )
}

FloatingMenu.defaultProps = {
  hover: false,
}
export default FloatingMenu
