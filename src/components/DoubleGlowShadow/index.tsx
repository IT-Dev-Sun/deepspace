import { isMobile } from 'react-device-detect'
import { FC } from 'react'
import { classNames } from '../../functions'

const DoubleGlowShadow: FC<{ className?: string }> = ({ children, className }) => {
  if (isMobile) {
    return <div className="shadow-swap">{children}</div>
  }

  return (
    <div className={classNames(className, 'relative w-full max-w-2xl')}>
      <div className="relative filter drop-shadow">{children}</div>
    </div>
  )
}

export default DoubleGlowShadow
