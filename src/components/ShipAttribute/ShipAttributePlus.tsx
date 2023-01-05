import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import { useSelector } from 'react-redux'
import { SHIP_NUM_CORES } from '../../constants/deepspace'

const StyledShipAttribute = styled.div`
  p {
    font-family: Goldman;
    font-size: 12px;
    line-height: 12px;
    letter-spacing: 0em;
    text-align: left;
  }
  .value-container {
    margin-bottom: 3px;
  }
  .progress-bg {
    height: 13px;
    background: #012028;
    @media (max-height: 900px) {
      height: 11px;
    }
    @media (max-height: 800px) {
      height: 13px;
    }
  }

  .progress-value {
    height: 13px;
    background: #00adee;
    @media (max-height: 900px) {
      height: 10px;
    }
    @media (max-height: 800px) {
      height: 13px;
    }
  }

  .upgrade-value {
    color: white;
    margin-top: 2px;
    margin-left: 3px;
    position: absolute;
  }

  .plus-btn {
    width: 13px;
    height: 13px;
    border: solid 1px #00aeef;
    right: -20px;
    top: -2px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: larger;
    background: #000c10;
  }
  .minus-btn {
    width: 13px;
    height: 13px;
    border: solid 1px #00aeef;
    right: 24px;
    top: -2px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: larger;
    background: #000c10;
  }
  .relative.flex.justify-between.mt-2.value-container {
    margin-top: 10px;
    @media (max-height: 900px) {
      margin-top: 4px;
    }
    @media (max-height: 800px) {
      margin-top: 10px;
    }
  }
  .relative.flex.justify-between.mt-2.value-container p:first-child {
    font-size: 10px;
  }
  .progress {
    width: 87%;
  }
  .plus-with-value {
    position: absolute;
    right: 18px;
  }
  .absolute.plus-btn{
    top: 15px;
    right: -2px;
  }
  .absolute.minus-btn {
    right: -19px;
    top: 15px;
  }
  .w-full.progress-bg.position-relative {
    position: relative;
  }
  p.upgrade-value {
    right: -24px;
    top: -17px;
    font-size: 11px;
    color: #5de95d;
  }
`

const ShipAttributePlus = ({ title, value, range, onClick, showMinusBtn, onClickMinus, upgrade, }) => {

  const s = value;
  const d = range?.max;
  const width = 100 * s / d;

  const handleClick = () => {
    onClick();
  }

  const handleClickMinus = () => {
    onClickMinus();
  }

  return (
    <StyledShipAttribute className="flex flex-col mb-1">
      <div className="relative flex justify-between mt-2 value-container">
        <div className='flex'>
          <p>{title.toUpperCase()}</p>
        </div>
        {showMinusBtn && (
          <div className='absolute minus-btn' onClick={handleClickMinus}>
            <AiOutlineMinus />
          </div>
        )}
        <p className='plus-with-value'>{value} </p>
        {(title !== 'Luck') && (value !== 100 && value !== range?.max) && (
          <div className='absolute plus-btn' onClick={handleClick}>
            <AiOutlinePlus />
          </div>
        )}
      </div>

      <div className="progress">
        <div className="w-full progress-bg position-relative">
          <p className='upgrade-value'>{upgrade > 0 ? `+${upgrade}` : ''}</p>
          <div className="top-0 left-0 z-10 progress-value position-absolute" style={{ width: `${width}%` }}>
          </div>
        </div>
      </div>
    </StyledShipAttribute>
  )
}

export default ShipAttributePlus
