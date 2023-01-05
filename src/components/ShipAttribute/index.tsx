import React from 'react'
import styled from 'styled-components'

interface ShipAttributeProps {
  title: string
  value: number
  range: any
}

const StyledShipAttribute = styled.div`
  p {
    font-family: Goldman;
    font-size: 10px;
    line-height: 12px;
    letter-spacing: 0em;
    text-align: left;
  }

  .progress-bg {
    background: rgba(46, 16, 75, 1);
  }

  .progress-value {
    background: rgba(127, 22, 211, 1);
  }
`

const ShipAttribute: React.FC<ShipAttributeProps> = ({ title, value, range }) => {
  const s = value;
  const d = range.max;
  const width = 100 * s / d;

  return (
    <StyledShipAttribute className="flex flex-col mb-1">
      <div className="flex justify-between mb-1">
        <p>{title}</p>
        <p>{value}</p>
      </div>

      <div className="progress">
        <div className="progress-bg position-relative w-full h-2">
          <div className="progress-value position-absolute left-0 top-0 h-2 z-10" style={{ width: `${width}%` }}></div>
        </div>
      </div>
    </StyledShipAttribute>
  )
}

export default ShipAttribute
