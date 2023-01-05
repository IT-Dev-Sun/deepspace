import React, { useState } from "react";

interface TooltipAltProps {
  label: string
  className?: string
  innerClassName?: string
  style?: React.CSSProperties
  children?: JSX.Element[] | JSX.Element
}

const TooltipAlt: React.FC<TooltipAltProps> = (props: TooltipAltProps) => {
  const [shown, setShown] = useState(false)

  const isPositionValid = (): boolean => {
    if (!props.className) return false
    return props.className.includes('relative') || props.className.includes('absolute')
  }

  return (
    <div className={isPositionValid() ? props.className : `relative ${props.className}`}
         style={props.style}>
      <div className='transition-all' style={{
        position: 'absolute',
        bottom: 45,
        zIndex: 10,
        background: '#650AAE',
        boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
        borderRadius: 5,
        width: 'max-content',
        padding: '3px 5px',
        left: '50%',
        transform: 'translate(-50%, 0)',
        opacity: shown ? '1' : '0',
        visibility: shown ? 'visible' : 'hidden'
      }}>
        {props.label}
      </div>
      <div onMouseEnter={() => setShown(true)}
           onMouseLeave={() => setShown(false)}
           className={props.innerClassName}>
        {props.children}
      </div>
    </div>
  )
}

export default TooltipAlt
